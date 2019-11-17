import React from 'react'

export default function IconButton(props) {
  return (
    <div
      className={props.className}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  )
}