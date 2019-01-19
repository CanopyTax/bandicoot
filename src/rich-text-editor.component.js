import React, {useState, useEffect, useRef, useContext} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

export function RichTextEditor(props, editorRef) {
  const divRef = useRef(null)
  const selectionRangeBeforeBlurRef = useRef(null)
  const isFocusedRef = useRef(false)
  const richTextContext = useContext(RichTextContext)

  useEffect(() => {
    if (props.initialValue) {
      divRef.current.innerHTML = props.initialValue
    }
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  })

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
    richTextContext.fireBlur()
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
}

RichTextEditor.defaultProps = {
  className: '',
}
