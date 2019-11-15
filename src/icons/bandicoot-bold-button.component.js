import React from 'react'
import { useDocumentExecCommand } from '../use-document-exec-command.hook'
import { useDocumentQueryCommandState } from '../use-document-query-command-state.hook'

export function BoldButton(props) {
  const { performCommand } = useDocumentExecCommand('bold')
  const { isActive } = useDocumentQueryCommandState('bold')

  return (
    <button
      onClick={performCommand}
      className={isActive ? 'active-control-button' : ''}
    >
      <img src='./bold.svg' />
    </button>
  )
}