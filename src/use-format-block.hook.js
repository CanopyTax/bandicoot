import {useDocumentExecCommand} from './use-document-exec-command.hook'

export function useFormatBlock() {
  const {performCommandWithValue} = useDocumentExecCommand('formatBlock')

  return {
    formatBlock(value) {
      if (value === document.queryCommandValue('formatBlock')) {
        if (!!window.chrome && isInHTMLList()) {
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
  let containerNode = window.getSelection().getRangeAt(0).commonAncestorContainer
  let index = 0
  let isList = false
  while(isList == false && index < 2) {
    if (containerNode.nodeType === Node.ELEMENT_NODE && containerNode.tagName === 'LI') {
      return true
    }
    containerNode = containerNode.parentNode
    index++
  }
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