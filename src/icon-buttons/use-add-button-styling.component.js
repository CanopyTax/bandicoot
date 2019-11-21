import React, {useEffect, useState} from 'react'

export default function useAddButtonStyling (props) {
  useEffect(() => {
    let styleElement = document.getElementById('bandicoot-button-styling')
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.setAttribute('id', 'bandicoot-button-styling')
      styleElement.textContent = `
        .bandicoot-button-styling { color: pink; }
      `
      document.head.appendChild(styleElement)
      return () => styleElement.parentNode.removeChild(styleElement)
    }
  }, [])
}