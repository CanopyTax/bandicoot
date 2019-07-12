import React, {useState, useContext, useEffect, useRef} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

const noop = () => {}
const defaultOpts = {processImgElement: noop, fileBlobToUrl: defaultFileBlobToUrl}

export function useImage({processImgElement = noop, fileBlobToUrl = defaultFileBlobToUrl} = defaultOpts) {
  const {performCommandWithValue} = useDocumentExecCommand('insertImage')
  const richTextContext = useContext(RichTextContext)
  const fileInputRef = useRef(null)
  const dataUrls = React.useRef({})
  useNewHtmlHandler()
  useFileChooserInput()
  useSerializer()

  return {
    chooseFile(evt) {
      fileInputRef.current.click()
    },

    removeImage(imgElement) {
      const range = document.createRange()
      range.selectNode(imgElement)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand('delete')
    },
  }

  function handleImageElement(imgElement) {
    imgElement.style.cursor = 'pointer'
    processImgElement(imgElement)
  }

  function useNewHtmlHandler() {
    useEffect(() => {
      richTextContext.addNewHTMLListener(newHtml)
      return () => richTextContext.removeNewHTMLListener(newHtml)

      function newHtml() {
        const imgElements = richTextContext.getContentEditableElement().querySelectorAll('img:not([data-text-as-image])')
        imgElements.forEach(handleImageElement)
      }
    }, [processImgElement])
  }

  function useFileChooserInput() {
    useEffect(() => {
      fileInputRef.current = document.createElement('input')
      const fileInputElement = fileInputRef.current
      fileInputElement.type = 'file'
      fileInputElement.accept = '.jpg, .png, image/*'
      fileInputElement.multiple = false
      fileInputElement.addEventListener('change', () => {
        if (fileInputElement.files && fileInputElement.files.length > 0) {
          fileBlobToUrl(fileInputElement.files[0], imgUrl => {
            performCommandWithValue(imgUrl)
            const imgElement = document.querySelector(`img[src="${imgUrl}"]`)
            if (imgElement.src && imgElement.src.startsWith('blob:')) {
              const reader = new FileReader()
              reader.addEventListener('load', () => {
                dataUrls.current[imgElement.src] = reader.result
              })
              reader.readAsDataURL(fileInputElement.files[0])
            }
            handleImageElement(imgElement)
          })
        }
      })
    }, [fileBlobToUrl, processImgElement])
  }

  function useSerializer() {
    useEffect(() => {
      richTextContext.addSerializer(serializer)
      return () => richTextContext.removeSerializer(serializer)
    })
  }

  function serializer(dom) {
    dom.querySelectorAll('img').forEach(imgEl => {
      if (dataUrls.current[imgEl.src]) {
        imgEl.src = dataUrls.current[imgEl.src]
      }
    })
  }
}

function defaultFileBlobToUrl(file, cbk) {
  cbk(URL.createObjectURL(file))
}