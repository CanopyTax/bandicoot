declare module "bandicoot" {
  export const RichTextContainer: React.FC<RichTextContainerProps>;
  export const RichTextEditor: React.FC<RichTextEditorProps>;
  export const RichTextContext: React.Context<RichTextContextValue>;
  export function useDocumentExecCommand(commandName: string): ControlDocumentExecCommand;
  export function useFormatBlock(): ControlFormatBlock;
  export function useDocumentQueryCommandState(commandName: string, activeValueMatch?: string): ControlDocumentQueryCommandState;
  export function useFontSize(FontSizeOptions): ControlFontSize;
  export function useImage(options?: ImageOptions): ControlImage;
  export function useLink(options?: LinkOptions): ControlLink;
  export function useContentEditableFalse(options?: ContentEditableFalseOptions): ControlContentEditableFalse;
  export function useTextAsImage(options?: TextAsImageOptions): ControlTextAsImage;
  export function useElementDeletionDetection(domElement: HTMLElement, cbk: (domElement: HTMLElement) => any): any;

  type RichTextContainerProps = {
    children: JSX.Element | JSX.Element[];
  }

  type RichTextEditorProps = {
    initialHTML?: any;
    save?(): any;
    sanitizeHTML?(html: string): string;
    pasteFn?(paste: string): string;
    unchangedInterval?: number;
    className?: string;
    style?: object;
    placeholder?: string;
    placeholderColor?: string;
  }

  type RichTextContextValue = {
    addSelectionChangedListener(listener: RichTextContextListener): void;
    removeSelectionChangedListener(listener: RichTextContextListener): void;
    fireSelectionChanged(): void;
    selectRangeFromBeforeBlur(options?: SelectRangeBeforeBlurOptions): void;
    getRangeBeforeBlur(): Range;
    addBlurListener(listener: RichTextContextListener): void;
    removeBlurListener(listener: RichTextContextListener): void;
    fireBlur(): void;
    addNewHTMLListener(listener: RichTextContextListener): void;
    removeNewHTMLListener(listener: RichTextContextListener): void;
    fireNewHTML(): void;
    isFocused(): boolean;
    getContentEditableElement(): HTMLElement;
    numSerializers(): number;
    addSerializer(serializer: RichTextContextSerializer): void;
    removeSerializer(serializer: RichTextContextSerializer): void;
    serialize(HTMLElement): string;
    sanitizeHTML(string): string;
  }

  type SelectRangeBeforeBlurOptions = {
    usePreviousRange?: boolean;
  }

  type RichTextContextListener = {
    (): any;
  }

  type RichTextContextSerializer = {
    (HTMLElement): any;
  }

  type ControlDocumentExecCommand = {
    performCommand(evt?: any): void;
    performCommandWithValue(value: any): void;
  }

  type ControlFormatBlock = {
    formatBlock(value: string): void;
  }

  type ControlDocumentQueryCommandState = {
    isActive: boolean;
    activeValue: string;
  }

  type FontSizeOptions = {
    defaultFontSize: string;
    fontSizes: string[];
  }

  type ControlFontSize = {
    currentlySelectedFontSize: string;
    setSize(fontSize: string): void;
  }

  type ImageOptions = {
    processImgElement?(HTMLElement): void;
    fileBlobToUrl?(fileBlob: any, imgUrlHandler): void;
  }

  function imgUrlHandler(imgUrl: string): void;

  type ControlImage = {
    chooseFile(evt?: any): void;
    removeImage(imgElement: HTMLElement): void;
  }

  type LinkOptions = {
    processAnchorElement?(anchorElement: HTMLElement): void;
  }

  type ControlLink = {
    getTextFromBeforeBlur(): string | null;
    selectEntireLink(anchorElement: HTMLElement): void;
    unlink(): void;
    insertLink(url: string, displayedText: string): void;
  }

  type ContentEditableFalseOptions = {
    processContentEditableFalseElement?(HTMLElement): void;
  }

  type ControlContentEditableFalse = {
    insertContentEditableFalseElement(innerHTML: string): void;
  }

  type TextAsImageOptions = {
    processSerializedElement?(spanEl: HTMLElement, textInImage: string): void;
    fontFamily?: string;
  }

  type ControlTextAsImage = {
    insertTextAsImage(text: string): void;
  }
}