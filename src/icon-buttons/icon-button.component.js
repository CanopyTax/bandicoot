import React from 'react'
import style from './icon-button.css'

export default function IconButton(props) {
  return (
    <button
      {...props}
      className={`
        ${style.bandicootButton}
        ${props.isActive ? 'active-control-button' : ''}
        ${props.className || ''}
      `}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}