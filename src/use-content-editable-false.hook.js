import React, {useContext, useEffect} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

let tempId = 0
const noop = () => {}
const defaultOptions = {processContentEditableFalseElement: noop}

export function useContentEditableFalse({processContentEditableFalseElement = noop} = defaultOptions) {
  const {performCommandWithValue} = useDocumentExecCommand('insertHTML')
  const richTextContext = useContext(RichTextContext)

  return {
    insertContentEditableFalseElement(innerHTML) {
      const id = "rte-ce-false-temp-id-" + tempId++
      const htmlToInsert = `<span id="${id}">${richTextContext.sanitizeHTML(innerHTML, 'insertContentEditableFalseHTML')}</span>`
      performCommandWithValue(htmlToInsert)
      const contentEditableFalseElement = document.getElementById(id)
      handleContentEditableFalseElement(contentEditableFalseElement)
    }
  }

  function useNewHtmlHandler() {
    useEffect(() => {
      richTextContext.addNewHTMLListener(newHtml)
      return () => richTextContext.removeNewHTMLListener(newHtml)

      function newHtml() {
        const contentEditableFalseElements = richTextContext.getContentEditableElement().querySelectorAll('[contenteditable="false"]')
        contentEditableFalseElements.forEach(handleContentEditableFalseElement)
      }
    }, [])
  }

  function handleContentEditableFalseElement(contentEditableFalseElement) {
    contentEditableFalseElement.removeAttribute('id')
    contentEditableFalseElement.contentEditable = false
    contentEditableFalseElement.addEventListener('click', () => selectRangeAfterNode(contentEditableFalseElement))

    // if we are inserting this at the start of the rich text content editable container, we need to make sure a
    // cursor still appears and works when you select the beginning of the rich text container. This is done with
    // an empty span that *is* contentEditable
    if (!contentEditableFalseElement.previousSibling && contentEditableFalseElement.parentElement === richTextContext.getContentEditableElement()) {
      const editableElementBefore = document.createElement('span')
      contentEditableFalseElement.parentElement.insertBefore(editableElementBefore, contentEditableFalseElement)
    }

    // if we are inserting this at the end of the rich text content editable container, we need to make sure a
    // cursor still appears and works when you select the end of the rich text container. This is done with
    // an empty span that *is* contentEditable
    if (!contentEditableFalseElement.nextSibling && contentEditableFalseElement.parentElement === richTextContext.getContentEditableElement()) {
      const editableElementAfter = document.createElement('span')
      contentEditableFalseElement.insertAdjacentElement('afterend', editableElementAfter)
    }

    selectRangeAfterNode(contentEditableFalseElement)

    processContentEditableFalseElement(contentEditableFalseElement)
  }
}

function selectRangeAfterNode(node) {
  const range = document.createRange()
  range.setStartAfter(node)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}
