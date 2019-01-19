import React, {useRef, useEffect} from 'react'

export function RichTextContainer(props) {
  const contextValueRef = useRef(Object.assign({}, defaultContextValue))
  const contextValue = contextValueRef.current

  const selectionChangedListenersRef = useRef([])
  const blurListenersRef = useRef([])

  contextValue.addSelectionChangedListener = listener => {
    selectionChangedListenersRef.current.push(listener)
  }
  contextValue.removeSelectionChangedListener = listener => {
    selectionChangedListenersRef.current = selectionChangedListenersRef.current.filter(l => l !== listener)
  }
  contextValue.fireSelectionChanged = () => {
    selectionChangedListenersRef.current.forEach(listener => listener())
  }
  contextValue.addBlurListener = listener => {
    blurListenersRef.current.push(listener)
  }
  contextValue.removeBlurListener = listener => {
    blurListenersRef.current = blurListenersRef.current.filter(l => l !== listener)
  }
  contextValue.fireBlur = () => {
    blurListenersRef.current.forEach(listener => listener())
  }

  return (
    <RichTextContext.Provider value={contextValue}>
      {props.children}
    </RichTextContext.Provider>
  )
}

const noop = () => {}

const defaultContextValue = {
  addSelectionChangedListener: noop,
  removeSelectionChangedListener: noop,
  fireSelectionChanged: noop,
  selectRangeFromBeforeClick: noop,
  getRangeBeforeClick: noop,
  addBlurListener: noop,
  removeBlurListener: noop,
  fireBlur: noop,
  isFocused: noop,
  getContentEditableElement: noop,
}

export const RichTextContext = React.createContext(defaultContextValue)
