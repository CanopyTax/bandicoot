import React from 'react'
import { useDocumentExecCommand } from '../use-document-exec-command.hook'
import { useDocumentQueryCommandState } from '../use-document-query-command-state.hook'
import IconButton from './icon-button.component'
import BoldIcon from './bold-icon.component'

export function BoldButton(props) {
  const { performCommand } = useDocumentExecCommand('bold')
  const { isActive } = useDocumentQueryCommandState('bold')

  return (
    <IconButton
      onClick={performCommand}
      isActive={isActive}
    >
      <BoldIcon {...props}/>
    </IconButton>
  )
}