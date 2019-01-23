import {useContext, useEffect} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

let tempId = 0
const noop = () => {}

export function useLink({processAnchorElement = noop}) {
  const richTextContext = useContext(RichTextContext)
  const {performCommand} = useDocumentExecCommand('unlink')
  const {performCommandWithValue} = useDocumentExecCommand('insertHTML')

  useEffect(() => {
    richTextContext.addNewHTMLListener(newHtml)
    return () => richTextContext.removeNewHTMLListener(newHtml)

    function newHtml() {
      const anchorElements = richTextContext.getContentEditableElement().querySelectorAll('a')
      anchorElements.forEach(processAnchorElement)
    }
  }, [processAnchorElement])

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
    const id = `rte-link-temp-id-${tempId++}`
    performCommandWithValue(`<a href="${link}" id="${id}">${displayedText}</a>`)
    const anchorElement = document.getElementById(id)
    anchorElement.removeAttribute('id')
    processAnchorElement(anchorElement)
  }
}
