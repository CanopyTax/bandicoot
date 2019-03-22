import React, {useRef, useEffect} from 'react'

export function RichTextContainer(props) {
  const contextValueRef = useRef(Object.assign({}, defaultContextValue))
  const contextValue = contextValueRef.current

  const selectionChangedListenersRef = useRef([])
  const blurListenersRef = useRef([])
  const newHTMLListenersRef = useRef([])
  const serializers = useRef([])

  useEffect(() => {
    const contentEditableElement = contextValue.getContentEditableElement();

    if (contentEditableElement && contentEditableElement.innerHTML) {
      contextValue.fireNewHTML();
    }
  }, [contextValue])

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
  contextValue.addNewHTMLListener = listener => {
    newHTMLListenersRef.current.push(listener)
  }
  contextValue.removeNewHTMLListener = listener => {
    newHTMLListenersRef.current = newHTMLListenersRef.current.filter(l => l !== listener)
  }
  contextValue.fireNewHTML = () => {
    newHTMLListenersRef.current.forEach(l => l())
  }
  contextValue.numSerializers = () => serializers.current.length
  contextValue.addSerializer = serializer => {
    serializers.current.push(serializer)
  }
  contextValue.removeSerializer = serializer => {
    serializers.current = serializers.current.filter(s => s !== serializer)
  }
  contextValue.serialize = dom => {
    serializers.current.forEach(serializer => serializer(dom))
    return dom.innerHTML
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
  selectRangeFromBeforeBlur: noop,
  getRangeBeforeBlur: noop,
  addBlurListener: noop,
  removeBlurListener: noop,
  fireBlur: noop,
  addNewHTMLListener: noop,
  removeNewHTMLListener: noop,
  fireNewHTML: noop,
  isFocused: noop,
  getContentEditableElement: noop,
  numSerializers: () => 0,
  addSerializer: noop,
  removeSerializer: noop,
  serialize: noop,
  sanitizeHTML: noop,
}

export const RichTextContext = React.createContext(defaultContextValue)
