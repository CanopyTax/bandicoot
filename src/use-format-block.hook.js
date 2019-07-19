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
  while (!['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nodeToBeRemoved.tagName) && index < 5) {
    nodeToBeRemoved = nodeToBeRemoved.parentNode
    index ++
  }
  if (index === 4) { // no header found, contradicting line 9 qcv check, hopefully never happens
    performCommandWithValue('div')
  }
  while (nodeToBeRemoved.firstChild) {
    nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild, nodeToBeRemoved);
  }
  nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
}