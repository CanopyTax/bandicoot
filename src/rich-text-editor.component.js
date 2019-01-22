import React, {useState, useEffect, useRef, useContext, forwardRef} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

export const RichTextEditor = forwardRef((props, editorRef) => {
  const divRef = useRef(null)
  const selectionRangeBeforeBlurRef = useRef(null)
  const isFocusedRef = useRef(false)
  const richTextContext = useContext(RichTextContext)
  const unchangedTimeout = useRef(null)
  const [lastSavedHTML, setLastSavedHTML] = useState(props.initialHTML)

  if (editorRef) {
    editorRef.current = {
      getHTML() {
        return divRef.current.innerHTML
      },
      setHTML(html) {
        divRef.current.innerHTML = html
        divRef.current.focus()
        richTextContext.fireNewHTML()
      },
    }
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
    richTextContext.selectRangeFromBeforeClick = () => {
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

    richTextContext.getRangeFromBeforeClick = () => {
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

  return (
    <div
      contentEditable
      onBlur={onBlur}
      onFocus={onFocus}
      ref={divRef}
      className={props.className}
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
    const html = divRef.current.innerHTML
    if (html !== lastSavedHTML) {
      setLastSavedHTML(html)
      props.save(html)
    }
  }
})

RichTextEditor.defaultProps = {
  className: '',
  onBlur: () => {},
  initialHTML: '',
}
