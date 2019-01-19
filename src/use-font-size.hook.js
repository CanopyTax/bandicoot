import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {getInsertedElement} from './get-inserted-element.util.js'
import {useContext, useState, useEffect} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

const zeroWidthHtmlSpace = '&#x200b;'

export function useFontSize(defaultFontSize) {
  const {performCommandWithValue} = useDocumentExecCommand('fontSize')
  const richTextContext = useContext(RichTextContext)
  const [fontSize, setFontSize] = useState(defaultFontSize)

  useEffect(() => {
    if (richTextContext.isFocused()) {
      const selection = window.getSelection()
      let selectionNode = selection.getRangeAt(0).endContainer
      if (selectionNode.nodeType !== 1) {
        // we've got a text node or comment node or other type of node that's not an element
        selectionNode = selectionNode.parentElement
      }
      const stringFontSize = window.getComputedStyle(selectionNode).fontSize
      const newSize = Number(stringFontSize.slice(0, stringFontSize.length - 2))
      if (newSize !== fontSize) {
        setFontSize(newSize)
      }
    }
  })

  return {
    currentlySelectedFontSize: fontSize,

    setSize(fontSize) {
      const rangeBefore = window.getSelection().getRangeAt(0)
      const selectingExistingText = rangeBefore.startOffset !== rangeBefore.endOffset || rangeBefore.startContainer !== rangeBefore.endContainer

      if (selectingExistingText) {
        performCommandWithValue("1")
        const fontElement = getInsertedElement('FONT')
        fontElement.style.fontSize = fontSize
        fontElement.removeAttribute('size')
      } else {
        const htmlString = `<font style="font-size: ${fontSize}">${zeroWidthHtmlSpace}</font>`
        document.execCommand('insertHTML', null, htmlString)
      }
    },
  }
}
