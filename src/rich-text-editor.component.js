import React, {useState, useEffect, useRef, useContext, forwardRef} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

const noop = () => {}
let globalBandicootId = 0

export const RichTextEditor = forwardRef((props, editorRef) => {
  const divRef = useRef(null)
  const selectionRangeBeforeBlurRef = useRef(null)
  const {isFocused, setFocused} = useSynchronousFocusState()
  const richTextContext = useContext(RichTextContext)
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
      },
      getHTML: serialize
    }
  }

  function interceptPaste (event) {
    // https://developer.mozilla.org/en-US/docs/Web/Events/paste
    event.preventDefault()
    event.stopPropagation()
    let paste = (window.clipboardData || event.clipboardData).getData('text/html')
    let newPaste = props.pasteFn(paste)
    const selection = window.getSelection()
    if (!selection.rangeCount) return false
    const pasteToDOMNode = document.createRange().createContextualFragment(newPaste)
    const range = selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(pasteToDOMNode)
  }

  useEffect(() => {
    if (props.pasteFn) {
      divRef.current.addEventListener('paste', interceptPaste)
      return () => divRef.current.removeEventListener('paste', interceptPaste)
    }
  }, [props.pasteFn])

  function emptyEditor() {
    // do it with selection and execCommand so it can be undone with Ctrl Z
    const range = document.createRange()
    range.selectNodeContents(divRef.current)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('removeFormat')
    document.execCommand('delete')
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  })

  useEffect(() => {
    if (props.save && props.unchangedInterval && divRef.current && isFocused()) {
      const mutationConfig = {attributes: true, childList: true, subtree: true, characterData: true}
      let timeout
      const observer = new MutationObserver(() => {
        clearTimeout(timeout)
        timeout = setTimeout(save, props.unchangedInterval)
      })
      observer.observe(divRef.current, mutationConfig)
      return () => {
        observer.disconnect()
        clearTimeout(timeout)
      }
    }
  }, [props.unchangedInterval, props.save, divRef.current, isFocused()])

  useEffect(() => {
    // Clicking on bandicoot richtext buttons triggers a blur event that will setFocus to false we want to delay the
    // save event that is triggered by blur events. 100ms is arbitrary. Whenever react rerenders the rich-text-editor
    // due to focused state changing we need to either clear the blurTimeout to prevent a save action from firing 
    // (in the case of a quick refocus triggered by the rich text buttons) or fire a save event after waiting 100ms
    if (isFocused() === false) {
      const timeout = setTimeout(() => {
        richTextContext.fireBlur()
        save()
      }, 100)
      return () => {
        clearTimeout(timeout)
      }
    } 
  }, [isFocused()])

  useEffect(() => {
    richTextContext.selectRangeFromBeforeBlur = (options = {usePreviousRange: false}) => {
      if (divRef.current && document.activeElement !== divRef.current && !divRef.current.contains(document.activeElement)) {
        if (options.usePreviousRange && selectionRangeBeforeBlurRef.current) {
          const selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(selectionRangeBeforeBlurRef.current)
        } else {
          divRef.current.focus()
        }
        setFocused(true)
        // We are calling handleSelectionChange manually because calling divRef.current.focus() programatically does not trigger
        // a focus event like it normally would if a user did it. And we need the bandicoot hooks to know that the selection has changed,
        // which is done by calling fireSelectionChanged (which is what handleSelectionChange does).
        //
        // And we're using setTimeout because if we don't wait a tick of the event loop, the browser will tell us the old
        // command state from before we focused.
        setTimeout(handleSelectionChange)
      }
    }

    richTextContext.getRangeFromBeforeBlur = () => {
      return selectionRangeBeforeBlurRef.current
    }

    richTextContext.isFocused = isFocused

    richTextContext.getContentEditableElement = () => divRef.current
  })

  useEffect(() => {
    if (props.initialHTML) {
      divRef.current.innerHTML = props.initialHTML
    }
  }, [])

  useEffect(() => {
    if (props.placeholder) {
      const styleElement = document.createElement('style')
      styleElement.textContent = `.bandicoot-id-${bandicootId.current}:empty:not(:focus):before { content: attr(data-placeholder); color: ${props.placeholderColor}; }`
      document.head.appendChild(styleElement)

      return () => styleElement.parentNode.removeChild(styleElement)
    }
  },[props.placeholder, props.placeholderColor, bandicootId.current])

  return (
    <div
      contentEditable
      onBlur={() => setFocused(false)}
      onFocus={onFocus}
      ref={divRef}
      className={props.className + " bandicoot-id-" + bandicootId.current}
      style={{wordBreak: 'break-all'}}
      data-placeholder={props.placeholder}
    />
  )

  function onFocus() {
    setFocused(true)
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      selectionRangeBeforeBlurRef.current = selection.getRangeAt(0)
    }
  }

  function handleSelectionChange(evt) {
    if (isFocused()) {
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

// This hook allows you to change the focused value synchronously instead of queuing it
// up with a set state. This is necessary since the selectionchange listener depends on
// the blur and focus listeners to update the state synchronously (before the selectionchange
// listener is fired)
function useSynchronousFocusState() {
  const focusedRef = useRef(null)
  // To be able to trigger a re-render when the ref value changes synchronously
  const [bool, setBool] = useState(false)

  return {isFocused, setFocused}

  function isFocused() {
    return focusedRef.current
  }

  function setFocused(val) {
    focusedRef.current = val
    setBool(!bool)
  }
}

RichTextEditor.defaultProps = {
  className: '',
  initialHTML: '',
  save: noop,
  placeholder: '',
  placeholderColor: '#CFCFCF',
  pasteFn: null
}
