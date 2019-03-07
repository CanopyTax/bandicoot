import {useContext, useEffect} from 'react'
import {RichTextContext} from './rich-text-container.component'

export function useElementDeletionDetection(domElement, cbk) {
  const richTextContext = useContext(RichTextContext)

  useEffect(() => {
    if (domElement) {
      richTextContext.addSelectionChangedListener(checkElementConnected)
      return () => richTextContext.removeSelectionChangedListener(checkElementConnected)

      function checkElementConnected() {
        if (!domElement.isConnected && !domElement._bandicoot_delete_callback_called) {
          domElement._bandicoot_delete_callback_called = true
          cbk(domElement)
        }
      }
    }
  }, [domElement, cbk])
}
