import {useState, useContext, useEffect} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

export function useDocumentExecCommand(commandName) {
  const richTextContext = useContext(RichTextContext)

  return {
    performCommand(evt) {
      richTextContext.selectRangeFromBeforeClick()
      document.execCommand(commandName)
    },
    performCommandWithValue(value) {
      richTextContext.selectRangeFromBeforeClick()
      const showDefaultUI = null
      document.execCommand(commandName, showDefaultUI, value)
    },
  }
}

