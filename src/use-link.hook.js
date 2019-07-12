import {useContext, useEffect} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

let tempId = 0
const noop = () => {}
const defaultOptions = {processAnchorElement: noop}

export function useLink({processAnchorElement = noop} = defaultOptions) {
  const richTextContext = useContext(RichTextContext)
  const {performCommand} = useDocumentExecCommand('unlink')
  const {performCommandWithValue} = useDocumentExecCommand('insertHTML')
  useNewHtmlHandler()

  return {
    getTextFromBeforeBlur,
    selectEntireLink,
    unlink,
    insertLink,
  }

  function getTextFromBeforeBlur() {
    const range = richTextContext.getRangeFromBeforeBlur()
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
    richTextContext.selectRangeFromBeforeBlur({usePreviousRange: true})
    const id = `rte-link-temp-id-${tempId++}`
    performCommandWithValue(`<a href="${link}" id="${id}" target="_blank" rel="noopener noreferrer">${displayedText}</a>`)
    const anchorElement = document.getElementById(id)
    anchorElement.removeAttribute('id')
    processAnchorElement(anchorElement)
  }

  function useNewHtmlHandler() {
    useEffect(() => {
      richTextContext.addNewHTMLListener(newHtml)
      return () => richTextContext.removeNewHTMLListener(newHtml)

      function newHtml() {
        const anchorElements = richTextContext.getContentEditableElement().querySelectorAll('a')
        anchorElements.forEach(processAnchorElement)
      }
    }, [processAnchorElement])
  }

  function unlink() {
    performCommand()
    if (
      window.navigator.userAgent.includes('Edge/14') ||
      window.navigator.userAgent.includes('Edge/15') ||
      window.navigator.userAgent.includes('Edge/16') ||
      window.navigator.userAgent.includes('Edge/17')
    ) {
      // Older versions of Edge remove the <a> when you unlink, but keep the text blue and underlined so it looks like a link.
      // Ideally we'd be super smart about working around this, but for now I'm just removing all rich text formatting from the
      // text that used to be a link when you've got an older version of Edge.
      document.execCommand('removeFormat')
    }
  }
}
