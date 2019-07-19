import {useDocumentExecCommand} from './use-document-exec-command.hook'

export function useFormatBlock() {
  const {performCommandWithValue} = useDocumentExecCommand('formatBlock')

  return {
    formatBlock(value) {
      if (value === document.queryCommandValue('formatBlock')) {
        if (!!window.chrome && isInHTMLList() && document.queryCommandValue('formatBlock').includes('h')) {
          removeHeader()
        }
        else {
          performCommandWithValue('div')
        }
      } else {
        performCommandWithValue(value)
      }
    },
  }
}

function isInHTMLList() {
  return document.queryCommandState('insertOrderedList') || document.queryCommandState('insertUnorderedList')
}

function removeHeader() {
  let nodeToBeRemoved = window.getSelection().getRangeAt(0).commonAncestorContainer
  let index = 0
  while (nodeToBeRemoved.tagName !== 'H1' && index < 5) {
    nodeToBeRemoved = nodeToBeRemoved.parentNode
    index ++
  }
  if (index === 4) {
    throw new Error(`The element does not appear to be wrapped by a header`)
  }
  while (nodeToBeRemoved.firstChild) {
    nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild, nodeToBeRemoved);
  }
  nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
}