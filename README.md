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
The bandicoot library exports two components, both of which must be rendered in order for rich text editing.

```js
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
```js
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
    />
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
