import React, {useState, useEffect, useRef, useContext, forwardRef} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

const noop = () => {}
let globalBandicootId = 0

export const RichTextEditor = forwardRef((props, editorRef) => {
  const divRef = useRef(null)
  const selectionRangeBeforeBlurRef = useRef(null)
  const isFocusedRef = useRef(false)
  const richTextContext = useContext(RichTextContext)
  const unchangedTimeout = useRef(null)
  const bandicootId = useRef(globalBandicootId++)
  const [lastSavedHTML, setLastSavedHTML] = useState(props.initialHTML)

  if (editorRef) {
    editorRef.current = {
      setHTML(html) {
        emptyEditor()
        divRef.current.innerHTML = html
        divRef.current.focus()
        richTextContext.fireNewHTML()
      },
      resetEditor() {
        editorRef.current.setHTML('')
      }
    }
  }

  function emptyEditor() {
    // do it with selection and execCommand so it can be undone with Ctrl Z
    const range = document.createRange()
    range.selectNodeContents(divRef.current)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('delete')
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  })

  useEffect(() => {
    if (props.save && props.unchangedInterval && divRef.current && isFocusedRef.current) {
      setTimeout(save, props.unchangedInterval)
      const mutationConfig = {attributes: true, childList: true, subtree: true, characterData: true}
      const observer = new MutationObserver(() => {
        clearTimeout(unchangedTimeout.current)
        unchangedTimeout.current = setTimeout(save, props.unchangedInterval)
      })
      observer.observe(divRef.current, mutationConfig)
      return () => {
        observer.disconnect()
        clearTimeout(unchangedTimeout.current)
      }
    }
  }, [props.unchangedInterval, props.save, divRef.current, isFocusedRef.current])

  useEffect(() => {
    richTextContext.selectRangeFromBeforeBlur = () => {
      if (divRef.current && document.activeElement !== divRef.current && !divRef.current.contains(document.activeElement)) {
        if (selectionRangeBeforeBlurRef.current) {
          const currentSelection = window.getSelection()
          currentSelection.removeAllRanges()
          currentSelection.addRange(selectionRangeBeforeBlurRef.current)
        } else {
          divRef.current.focus()
        }
      }
    }

    richTextContext.getRangeFromBeforeBlur = () => {
      return selectionRangeBeforeBlurRef.current
    }

    richTextContext.isFocused = () => isFocusedRef.current

    richTextContext.getContentEditableElement = () => divRef.current
  }, [isFocusedRef.current])

  useEffect(() => {
    if (props.initialHTML) {
      divRef.current.innerHTML = props.initialHTML
      richTextContext.fireNewHTML()
    }
  }, [])

  useEffect(() => {
    if (props.placeholder) {
      const styleElement = document.createElement('style')
      styleElement.textContent = `.bandicoot-id-${bandicootId.current}:empty:not(:focus):before { content: attr(data-placeholder); color: ${props.placeholderColor}; }`
      document.head.appendChild(styleElement)

      return () => styleElement.parentNode.removeChild(styleElement)
    }
  },[props.placeholder, bandicootId.current])

  return (
    <div
      contentEditable
      onBlur={onBlur}
      onFocus={onFocus}
      ref={divRef}
      className={props.className + " bandicoot-id-" + bandicootId.current}
      data-placeholder={props.placeholder}
    />
  )

  function onBlur() {
    isFocusedRef.current = false
    setTimeout(() => {
      if (!isFocusedRef.current) {
        richTextContext.fireBlur()
        save()
      }
    }, 100)
  }

  function onFocus() {
    isFocusedRef.current = true
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      selectionRangeBeforeBlurRef.current = selection.getRangeAt(0)
    }
  }

  function handleSelectionChange(evt) {
    if (isFocusedRef.current) {
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        selectionRangeBeforeBlurRef.current = window.getSelection().getRangeAt(0)
      }

      richTextContext.fireSelectionChanged()
    }
  }

  function save() {
    const html = serialize()
    if (html !== lastSavedHTML) {
      setLastSavedHTML(html)
      props.save(html)
    }
  }

  function serialize() {
    let html = divRef.current.innerHTML
    if (richTextContext.numSerializers() > 0) {
      const dom = new DOMParser().parseFromString(html, 'text/html')
      html = richTextContext.serialize(dom.body)
    }

    return html
  }
})

RichTextEditor.defaultProps = {
  className: '',
  initialHTML: '',
  save: noop,
  placeholder: '',
  placeholderColor: '#CFCFCF'
}