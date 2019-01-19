export function getInsertedElement(tagName) {
  const range = window.getSelection().getRangeAt(0)

  const nodesToTraverse = [range.startContainer]
  if (range.startContainer !== range.endContainer) {
    nodesToTraverse.push(range.endContainer)
  }

  for (let i = 0; i < nodesToTraverse.length; i++) {
    const node = nodesToTraverse[i]
    if (foundOurElement(node.parentElement)) {
      return node.parentElement
    } else {
      const resultNode = recurseDownward(node)
      if (resultNode) {
        return resultNode
      }
    }
  }

  throw Error(`Could not find a dom element with tagName '${tagName}' that has just been inserted into the Rich Text Editor`)

  function recurseDownward(node) {
    if (foundOurElement(node)) {
      return node
    } else if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i]
        const resultNode = recurseDownward(childNode)
        if (resultNode) {
          return resultNode
        }
      }
    }

    return null
  }

  function foundOurElement(node) {
    return node.nodeType === 1 && node.tagName === tagName
  }
}
