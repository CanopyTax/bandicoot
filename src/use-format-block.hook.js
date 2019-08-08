import {useDocumentExecCommand} from './use-document-exec-command.hook'

const HEADER_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
export function useFormatBlock() {
  const {performCommandWithValue} = useDocumentExecCommand('formatBlock')

  return {
    formatBlock(value) {
      const blockElValue = document.queryCommandValue('formatBlock')
      if (value === blockElValue || bothAreHeaderTags(value, blockElValue)) {
        if (!!window.chrome && isInHTMLList() && blockElValue.includes('h')) {
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
  while (!HEADER_TAGS.includes(nodeToBeRemoved.tagName) && index < 5) {
    nodeToBeRemoved = nodeToBeRemoved.parentNode
    index ++
  }
  if (index === 4) { // no header found, contradicting line 9 qcv check, hopefully never happens
    throw new Error(`The element does not appear to be wrapped by a header`)
  }
  // TODO: replaceNode(nodeToBeRemoved)
  while (nodeToBeRemoved.firstChild) {
    nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild, nodeToBeRemoved);
  }
  nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
}

function bothAreHeaderTags (value, elValue) {
  return HEADER_TAGS.includes(value.toUpperCase()) && HEADER_TAGS.includes(elValue.toUpperCase())
}