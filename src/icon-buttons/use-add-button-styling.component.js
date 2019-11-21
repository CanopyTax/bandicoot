import React, {useEffect, useState} from 'react'

export default function useAddButtonStyling (props) {
  useEffect(() => {
    let styleElement = document.getElementById('bandicoot-button-styling')
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.setAttribute('id', 'bandicoot-button-styling')
      styleElement.textContent = css
      document.head.appendChild(styleElement)
      return () => styleElement.parentNode.removeChild(styleElement)
    }
  }, [])
}

const css = `
  .bandicoot-button-styling {
    background-color: transparent;
    border: none;
    border-radius: 4px;
  }
  .bandicoot-button-styling:hover {
    transition: background-color .25s ease-in-out;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .bandicoot-button-styling svg {
    fill: currentColor;
  }
`