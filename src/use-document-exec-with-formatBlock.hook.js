import {useContext} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

export function useDocumentExecWithFormatBlock(commandName) {
  const richTextContext = useContext(RichTextContext)

  return {
    performCommandWithFormatBlock(value) {
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

