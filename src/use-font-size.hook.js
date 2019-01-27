import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {useContext, useState, useEffect} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

export function useFontSize({defaultFontSize = '14px', fontSizes}) {
  if (fontSizes.length > 7) {
    throw Error(`Browsers only support up to 7 font sizes with document.execCommand('fontSize', null, size)`)
  }
  const [fontSize, setFontSize] = useState(defaultFontSize)
  const {performCommandWithValue} = useDocumentExecCommand('fontSize')
  const richTextContext = useContext(RichTextContext)
  const currentlySelectedFontSize = useCurrentlySelectedFontSize()
  useSizeOverrides()

  return {
    currentlySelectedFontSize,
    setSize(fontSize) {
      const integerSize = fontSizes.findIndex(size => size === fontSize) + 1
      if (integerSize <= 0) {
        throw Error(`Cannot set font size since '${fontSize}' was not passed in the fontSizes array`)
      }
      performCommandWithValue(integerSize)
      setFontSize(fontSize)
    },
  }

  function useCurrentlySelectedFontSize() {
    useEffect(() => {
      richTextContext.addSelectionChangedListener(selectionChanged)
      return () => richTextContext.removeSelectionChangedListener(selectionChanged)

      function selectionChanged() {
        const selection = window.getSelection()
        let selectionNode = selection.getRangeAt(0).startContainer
        if (selectionNode.nodeType !== 1) {
          // we've got a text node or comment node or other type of node that's not an element
          selectionNode = selectionNode.parentElement
        }
        const stringFontSize = window.getComputedStyle(selectionNode).fontSize
        const newSize = stringFontSize
        if (newSize !== fontSize) {
          setFontSize(newSize)
        }
      }
    }, [fontSize, setFontSize])

    return fontSize
  }

  function useSizeOverrides() {
    useEffect(() => {
      const cssString = fontSizes.reduce((acc, style, index) => {
        return `${acc} font[size="${index + 1}"] {font-size: ${style}}`
      }, '')

      const styleEl = document.createElement('style')
      styleEl.textContent = cssString
      document.head.appendChild(styleEl)

      return () => document.head.removeChild(styleEl)
    }, [fontSizes])

    useEffect(() => {
      richTextContext.addSerializer(serializer)
      return () => richTextContext.removeSerializer(serializer)

      function serializer(dom) {
        const fontEls = dom.querySelectorAll('font')
        for (let i = 0; i < fontEls.length; i++) {
          const fontEl = fontEls[i]
          const integerSize = Number(fontEl.getAttribute('size'))
          if (integerSize > fontSizes.length) {
            throw Error(`Cannot find fontSize for integer size '${integerSize}'`)
          }
          const size = fontSizes[integerSize - 1]
          fontEl.removeAttribute('size')
          fontEl.style.fontSize = size
          fontEl.dataset.integerSize = integerSize
        }
      }
    }, [fontSizes])

    useEffect(() => {
      richTextContext.addNewHTMLListener(newHtml)
      return () => richTextContext.removeNewHTMLListener(newHtml)

      function newHtml() {
        const fontEls = richTextContext.getContentEditableElement().querySelectorAll('font')
        for (let i = 0; i < fontEls.length; i++) {
          const fontEl = fontEls[i]
          const cssFontSize = fontEl.style.fontSize
          const integerSize = fontSizes.findIndex(size => size === cssFontSize) + 1
          if (integerSize > 0) {
            fontEl.style.fontSize = ''
            fontEl.setAttribute('size', integerSize)
          }
        }
      }
    }, [fontSizes])
  }
}
