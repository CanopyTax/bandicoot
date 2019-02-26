import {useState, useContext, useEffect} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

export function useDocumentExecCommand(commandName) {
  const richTextContext = useContext(RichTextContext)

  return {
    performCommand(evt) {
      richTextContext.selectRangeFromBeforeBlur()
      document.execCommand(commandName)
    },
    performCommandWithValue(value) {
      richTextContext.selectRangeFromBeforeBlur()
      const showDefaultUI = null
      if (value === document.queryCommandValue(commandName)) {
        document.execCommand(commandName, showDefaultUI, 'div')
      } else {
        document.execCommand(commandName, showDefaultUI, value)
      }
    },
  }
}

