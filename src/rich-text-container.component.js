import React, {useRef, useEffect, useCallback} from 'react'

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

  contextValue.addSelectionChangedListener = useCallback((listener) => {
    selectionChangedListenersRef.current.push(listener)
  }, [])
  contextValue.removeSelectionChangedListener = useCallback((listener) => {
    selectionChangedListenersRef.current = selectionChangedListenersRef.current.filter(l => l !== listener)
  }, [])
  contextValue.fireSelectionChanged = useCallback(() => {
    selectionChangedListenersRef.current.forEach(listener => listener())
  }, [])
  contextValue.addBlurListener = useCallback((listener) => {
    blurListenersRef.current.push(listener)
  }, [])
  contextValue.removeBlurListener = useCallback((listener) => {
    blurListenersRef.current = blurListenersRef.current.filter(l => l !== listener)
  }, [])
  contextValue.fireBlur = useCallback(() => {
    blurListenersRef.current.forEach(listener => listener())
  }, [])
  contextValue.addNewHTMLListener = useCallback((listener) => {
    newHTMLListenersRef.current.push(listener)
  }, [])
  contextValue.removeNewHTMLListener = useCallback((listener) => {
    newHTMLListenersRef.current = newHTMLListenersRef.current.filter(l => l !== listener)
  }, [])
  contextValue.fireNewHTML = useCallback(() => {
    newHTMLListenersRef.current.forEach(l => l())
  }, [])
  contextValue.numSerializers = useCallback(() => {
    return serializers.current.length
  }, [])
  contextValue.addSerializer = useCallback(serializer => {
    serializers.current.push(serializer)
  }, [])
  contextValue.removeSerializer = useCallback(serializer => {
    serializers.current = serializers.current.filter(s => s !== serializer)
  }, [])
  contextValue.serialize = useCallback(dom => {
    serializers.current.forEach(serializer => serializer(dom))
    return dom.innerHTML
  }, [])

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
