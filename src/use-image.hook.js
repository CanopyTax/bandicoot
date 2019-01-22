import React, {useState} from 'react'
import {useDocumentExecCommand} from './use-document-exec-command.hook.js'

const noop = () => {}

export function useImage({processImgElement = noop, fileBlobToUrl = defaultFileBlogToUrl}) {
  const {performCommandWithValue} = useDocumentExecCommand('insertImage')

  return {
    chooseFile() {
      const fileInputElement = document.createElement('input')
      fileInputElement.type = 'file'
      fileInputElement.accept = '.jpg, .png, image/*'
      fileInputElement.multiple = false
      fileInputElement.addEventListener('input', () => {
        if (fileInputElement.files && fileInputElement.files.length > 0) {
          fileBlobToUrl(fileInputElement.files[0], imgUrl => {
            performCommandWithValue(imgUrl)
            const imgElement = document.querySelector(`img[src="${imgUrl}"]`)
            imgElement.style.cursor = 'pointer'
            processImgElement(imgElement)
          })
        }
      })
      fileInputElement.click()
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
}

function defaultFileBlogToUrl(file, cbk) {
  cbk(URL.createObjectURL(file))
}
