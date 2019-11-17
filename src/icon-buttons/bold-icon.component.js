import React from 'react'

BoldIcon.defaultProps = {
  style: {},
  width: 24,
  className: '',
  height: 24,
  viewBox: '0 0 317.41 317.41',
}

export default function BoldIcon(props) {
  return (
    <svg
      width={props.width}
      height={props.height}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={props.viewBox}
    >
    <path d="M281.439,158.705c21.727-15.146,35.971-40.316,35.971-68.75c0-46.18-37.57-83.75-83.75-83.75h-40H115H45H0v30h45v245H0v30 h45h70h78.66h40c46.18,0,83.75-37.57,83.75-83.75C317.41,199.021,303.166,173.851,281.439,158.705z M193.66,36.205 c29.638,0,53.75,24.112,53.75,53.75s-24.112,53.75-53.75,53.75H115v-107.5H193.66z M115,173.705h78.66 c29.638,0,53.75,24.112,53.75,53.75s-24.112,53.75-53.75,53.75H115V173.705z"/>
  </svg>
  )
}