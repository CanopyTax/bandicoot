import React, {useContext, useEffect} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

const noop = () => {}
const defaultOptions = {processSerializedElement: noop, fontFamily: null}

export function useTextAsImage({processSerializedElement = noop, fontFamily = null} = defaultOptions) {
  const {performCommandWithValue} = useDocumentExecCommand('insertImage')
  const richTextContext = useContext(RichTextContext)
  useNewHtmlHandler()
  useSerializer()

  return {
    insertTextAsImage(text) {
      richTextContext.selectRangeFromBeforeBlur({usePreviousRange: true})
      const url = textToUrl(text, getSelectedElement(), fontFamily)
      performCommandWithValue(url)
      const imgElement = document.querySelector(`img[src="${url}"]:not([data-text-as-image])`)
      processImgElement(imgElement, text)
    }
  }

  function useNewHtmlHandler() {
    useEffect(() => {
      richTextContext.addNewHTMLListener(newHtml)
      return () => richTextContext.removeNewHTMLListener(newHtml)

      function newHtml() {
        const spanEls = richTextContext.getContentEditableElement().querySelectorAll('span[data-text-as-image]')
        for (let i = 0; i < spanEls.length; i++) {
          const spanEl = spanEls[i]
          const url = textToUrl(spanEl.dataset.textAsImage, spanEl.previousElementSibling || spanEl.nextElementSibling || spanEl.parentElement, fontFamily)
          const imgEl = document.createElement('img')
          imgEl.src = url
          processImgElement(imgEl, spanEl.dataset.textAsImage)
          spanEl.parentNode.replaceChild(imgEl, spanEl)
        }
      }
    }, [])
  }

  function useSerializer() {
    useEffect(() => {
      richTextContext.addSerializer(htmlSerializer)
      return () => richTextContext.removeSerializer(htmlSerializer)

      function htmlSerializer(dom) {
        const textAsImage = dom.querySelectorAll('img[data-text-as-image]')

        for (let i = 0; i < textAsImage.length; i++) {
          const imgEl = textAsImage[i]
          const spanEl = document.createElement('span')
          spanEl.dataset.textAsImage = imgEl.dataset.textAsImage
          processSerializedElement(spanEl, spanEl.dataset.textAsImage)
          imgEl.parentNode.replaceChild(spanEl, imgEl)
        }
      }
    }, [])
  }
}

function textToUrl(text, referenceEl, fontFamily) {
  const computedStyle = window.getComputedStyle(referenceEl)
  const currentFontSize = Number(computedStyle.fontSize.replace('px', ''))
  const currentLineHeight = Number(computedStyle.lineHeight.replace('px', ''))
  const currentFontFamily = fontFamily || computedStyle.fontFamily
  const font = `bold ${currentFontSize}px ${currentFontFamily}`

  const testDiv = document.createElement('div')
  testDiv.style.font = font
  testDiv.style.position = 'absolute'
  testDiv.style.visibility = 'hidden'
  testDiv.style.whiteSpace = 'nowrap'
  testDiv.textContent = text
  document.body.appendChild(testDiv)

  const canvas = document.createElement('canvas')
  canvas.width = testDiv.clientWidth + 1
  canvas.height = currentLineHeight
  const c = canvas.getContext('2d')
  c.font = font
  c.fillStyle = '#00bf4b'
  c.textBaseline = 'bottom'
  c.fillText(text, 0, currentLineHeight - 3)

  document.body.removeChild(testDiv)

  return c.canvas.toDataURL()
}

function processImgElement(imgElement, text) {
  imgElement.style.verticalAlign = 'bottom'
  imgElement.dataset.textAsImage = text

  imgElement.addEventListener('click', evt => {
    const rect = imgElement.getBoundingClientRect()
    const middlePoint = rect.left + rect.width / 2
    const range = document.createRange()
    if (evt.x < middlePoint) {
      range.setStartBefore(imgElement)
    } else {
      range.setStartAfter(imgElement)
    }
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  })
}

function getSelectedElement() {
  let result = getSelection().getRangeAt(0).commonAncestorContainer
  return result.nodeType === 1 ? result : result.parentElement
}
