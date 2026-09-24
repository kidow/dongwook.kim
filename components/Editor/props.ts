import type { EditorProps } from '@tiptap/pm/view'

export const TiptapEditorProps: EditorProps = {
  attributes: {
    role: 'textbox',
    'aria-multiline': 'true',
    'aria-label': 'Memo',
    class:
      'prose prose-invert prose-zinc min-h-52 max-w-full focus:outline-none'
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
        const slashCommand = document.querySelector('#slash-command')
        if (slashCommand) {
          return true
        }
      }
    }
  },
  handlePaste: (_view, event) => {
    if (
      event.clipboardData &&
      event.clipboardData.files &&
      event.clipboardData.files[0]
    ) {
      event.preventDefault()
      const file = event.clipboardData.files[0]
      console.log('file', file)
      //   startImageUpload(file, _view, _view.state.selection.from)
      return true
    }
    return false
  },
  handleDrop: (_view, event, _slice, moved) => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      console.log('file', file)
      //   startImageUpload(
      //     file,
      //     _view,
      //     _view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos - 1
      //   )
      return true
    }
    return false
  }
}
