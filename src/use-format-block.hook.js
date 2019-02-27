import {useDocumentExecCommand} from './use-document-exec-command.hook'

export function useFormatBlock() {
  const {performCommandWithValue} = useDocumentExecCommand('formatBlock')

  return {
    formatBlock(value) {
      if (value === document.queryCommandValue('formatBlock')) {
        performCommandWithValue('div')
      } else {
        performCommandWithValue(value)
      }
    },
  }
}