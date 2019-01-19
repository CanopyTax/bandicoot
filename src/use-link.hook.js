import {useContext} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

export function useLink() {
  const richTextContext = useContext(RichTextContext)
  const {performCommand} = useDocumentExecCommand('unlink')
  const {performCommandWithValue} = useDocumentExecCommand('insertHTML')

  return {
    getTextFromBeforeBlur,
    selectEntireLink,
    unlink: performCommand,
    insertLink,
  }

  function getTextFromBeforeBlur() {
    const range = richTextContext.getRangeFromBeforeClick()
    if (range) {
      return range.toString()
    } else {
      return null
    }
  }

  function selectEntireLink(anchorElement) {
    const range = document.createRange()
    range.selectNodeContents(anchorElement)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  function insertLink(link, displayedText) {
    performCommandWithValue(`<a href="${link}">${displayedText}</a>`)
    let anchorElement = window.getSelection().getRangeAt(0).commonAncestorContainer
    while (anchorElement && anchorElement.tagName !== 'A') {
      anchorElement = anchorElement.parentElement
    }
    return anchorElement
  }
}
