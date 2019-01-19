import React, {useContext} from 'react'
import ReactDOM from 'react-dom'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

let tempId = 0

export function useContentEditableFalse() {
  const {performCommandWithValue} = useDocumentExecCommand('insertHTML')
  const richTextContext = useContext(RichTextContext)

  return {
    insertContentEditableFalseElement(reactElement) {
      if (!React.isValidElement(reactElement)) {
        throw Error(`insertContentEditableFalseElement requires a valid react element`)
      }

      if (reactElement.type === React.Fragment) {
        throw Error(`insertContentEditableFalseElement does not (yet) support fragments`)
      }

      const tempEl = document.createElement('div')
      const id = "rte-merge-tag-temp-id-" + tempId++
      ReactDOM.render(React.cloneElement(reactElement, {id}), tempEl, () => {
        const htmlToInsert = tempEl.innerHTML
        performCommandWithValue(htmlToInsert)
        const mergeTagElement = document.getElementById(id)
        delete mergeTagElement.id
        mergeTagElement.contentEditable = false
        mergeTagElement.addEventListener('click', () => selectRangeAfterNode(mergeTagElement))

        // if we are inserting this at the start of the rich text content editable container, we need to make sure a
        // cursor still appears and works when you select the beginning of the rich text container. This is done with
        // an empty span that *is* contentEditable
        if (!mergeTagElement.previousSibling && mergeTagElement.parentElement === richTextContext.getContentEditableElement()) {
          const editableElementBefore = document.createElement('span')
          mergeTagElement.parentElement.insertBefore(editableElementBefore, mergeTagElement)
        }

        // if we are inserting this at the end of the rich text content editable container, we need to make sure a
        // cursor still appears and works when you select the end of the rich text container. This is done with
        // an empty span that *is* contentEditable
        if (!mergeTagElement.nextSibling && mergeTagElement.parentElement === richTextContext.getContentEditableElement()) {
          const editableElementAfter = document.createElement('span')
          mergeTagElement.insertAdjacentElement('afterend', editableElementAfter)
        }

        selectRangeAfterNode(mergeTagElement)
      })
    }
  }
}

function selectRangeAfterNode(node) {
  const range = document.createRange()
  range.setStartAfter(node)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}
