import React, {useState, useContext, useEffect, useRef} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'
import {RichTextContext} from './rich-text-container.component.js'

const noop = () => {}

export function useImage({processImgElement = noop, fileBlobToUrl = defaultFileBlogToUrl}) {
  const {performCommandWithValue} = useDocumentExecCommand('insertImage')
  const richTextContext = useContext(RichTextContext)
  const fileInputRef = useRef(null)
  useNewHtmlHandler()
  useFileChooserInput()

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
      fileInputElement.addEventListener('input', () => {
        if (fileInputElement.files && fileInputElement.files.length > 0) {
          fileBlobToUrl(fileInputElement.files[0], imgUrl => {
            performCommandWithValue(imgUrl)
            const imgElement = document.querySelector(`img[src="${imgUrl}"]`)
            handleImageElement(imgElement)
          })
        }
      })
    }, [fileBlobToUrl, processImgElement])
  }
}

function defaultFileBlogToUrl(file, cbk) {
  cbk(URL.createObjectURL(file))
}
