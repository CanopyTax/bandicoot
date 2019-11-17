import React from 'react'
import styles from './icon-button.css'

export default function IconButton(props) {
  return (
    <button
      {...props}
      className={`icon-button ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}