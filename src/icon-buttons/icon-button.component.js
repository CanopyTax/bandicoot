import React from 'react'
import useAddButtonStyling from './use-add-button-styling.component'

export default function IconButton(props) {
  useAddButtonStyling()
  return (
    <button
      {...props}
      className={`bandicoot-button-styling ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}