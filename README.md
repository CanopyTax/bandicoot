# bandicoot
A React rich text editor.

## Installation
```sh
npm install --save bandicoot
```

Or
```
yarn add bandicoot
```

## Basics
The bandicoot library exports two components, both of which must be rendered for rich text editing.

```jsx
import {RichTextContainer, RichTextEditor} from 'bandicoot'

function MyComponent() {
  return (
    <RichTextContainer>
      <RichTextEditor />
    </RichTextContainer>
  )
}
```

This will give you a [contentEditable div](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable) that is ready for rich text editing.
At this point, the user can control the rich text via keyboard shortcut keys (such as Ctrl + B for bold), but there won't be any "control buttons" that allow them to click
on a button in order to modify the styling of the text. Additionally, the user will be able to paste text and html into the editor.

Let's add a "control button" for bolding the rich text:
```jsx
import {RichTextContainer, RichTextEditor, useDocumentExecCommand, useDocumentQueryCommandState} from 'bandicoot'

function MyComponent() {
  return (
    <RichTextContainer>
      <Bold />
      <RichTextEditor />
    </RichTextContainer>
  )
}

function Bold() {
  const {performCommand} = useDocumentExecCommand('bold')
  const {isActive} = useDocumentQueryCommandState('bold')

  return (
    <button
      onClick={performCommand}
      className={isActive ? 'active-control-button' : ''}
    >
      Bold
    </button>
  )
}
```

Now we have a bold button that, when clicked, will toggle the highlighted text to either be bolded or not bolded. Additionally, when the
user selects a bolded part of the editor, the bold button will have an extra css class on it to indicate this to the user. Notice that
bandicoot did not render the button itself, but just provided a `performCommand` function and an `isActive` boolean for us to
use on a button that we render on our own. This allows us to position and style the Bold button however we'd like to, without having
to worry about the DOM interactions for bolding/unbolding.

This way of using [React hooks](https://reactjs.org/docs/hooks-intro.html) is the pattern that bandicoot uses whenever you need to implement a new
"control button". Italics, underlining, font size, links, and images can all be achieved by importing a bandicoot hook and using the hook inside of
your component.

All of bandicoot's hooks are optional to use and can be composed to create a wide variety of rich text features. The hooks are meant to hide the ugly
DOM stuff from you so that you can focus on the features of your rich text editor instead.

## Available Hooks
### useDocumentExecCommand
It turns out that browsers support many rich text editing basics with a one-liner: [`document.execCommand(commandName)`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand).
The `useDocumentExecCommand` hook provides the logic for doing so in a way that you don't have to worry about managing the [selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection).

To see a list of rich text features you can implement with this, check out [this MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands).

Basic usage:

```jsx
function Bold() {
  const {performCommand} = useDocumentExecCommand('bold') // Or 'italic', underline, or many other commands.

  return (
    <button onClick={performCommand}>
      Bold
    </button>
  )
}

function FontFamily() {
  const {performCommandWithValue} = useDocumentExecCommand('fontName')

  return (
    <button onClick={toggleFont}>
      Change font
    </button>
  )

  function toggleFont() {
    performCommandWithValue('Arial') // Changes the font family for the currently selected text to Arial
  }
}
```

API:

`useDocumentExecCommand(commandName)`

Arguments:
- `commandName` (required): The [document command](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands) that want to call.

Return value:

An object with the following properties:
- `performCommand`: a function that calls document.execCommand for you. You should call this when you want to change the selected text.
- `performCommandWithValue`: a function that calls document.execCommand with a [value](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Parameters).

### useDocumentQueryCommandState
Browsers support detecting if the currently selected text is bolded, underlined, italicized, and much more with a one liner: [`document.queryCommandState(commandName)`](https://developer.mozilla.org/en-US/docs/Web/API/Document/queryCommandState).
Additionally, you can detect what the current value is (e.g., font family is "Arial") with `document.queryCommandValue(commandName)`.

The `useDocumentQueryCommandState` hook provides the logic for doing so without having to deal with the DOM or [selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection).

To see a list of rich text features that you can use this with, check out [this MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands)

Basic usage:
```jsx
function Bold() {
  // isActive is a boolean that indicates if the currently selected text is bold.
  const {isActive} = useDocumentQueryCommandState('bold')

  return (
    <button className={isActive ? 'control-button-active' : ''}>
      Bold
    </button>
  )
}

function FontFamily() {
  // isActive is a boolean that indicates if the currently selected text has a font family. Since that is
  const {activeValue} = useDocumentQueryCommandState('fontFamily')

  return (
    <div>The currently selected text is using font family {activeValue}</div>
  )
}
```

API:

`useDocumentQueryCommandState(commandName)`

Arguments:
- `commandName` (required): The [document command](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands) that want to check the status of.

Return value:

An object with the following properties:
- `isActive`: A boolean that indicates whether the currently selected text is active for the specified "command". This is done with [`document.queryCommandState(commandName)`](https://developer.mozilla.org/en-US/docs/Web/API/Document/queryCommandState).
- `activeValue`: A string that tells you what the active value is for the specified "command". For example, this can tell you the font family of the currently selected text.
