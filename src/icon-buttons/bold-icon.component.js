import React from 'react'

BoldIcon.defaultProps = {
  style: {},
  width: 24,
  className: '',
  height: 24,
}

export default function BoldIcon(props) {
  return (
    <svg
      width={props.width}
      height={props.height}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox='0 0 317.41 317.41'
    >
    <path d="M281.4 158.7c21.7-15.1 36-40.3 36-68.7 0-46.2-37.6-83.7-83.7-83.7h-40H115 45 0v30h45v245H0v30h45 70 78.7 40c46.2 0 83.8-37.6 83.8-83.7C317.4 199 303.2 173.9 281.4 158.7zM193.7 36.2c29.6 0 53.8 24.1 53.8 53.8s-24.1 53.8-53.7 53.8H115v-107.5H193.7zM115 173.7h78.7c29.6 0 53.8 24.1 53.8 53.8s-24.1 53.8-53.7 53.8H115V173.7z"/>
  </svg>
  )
}