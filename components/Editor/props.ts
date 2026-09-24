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
      // Image upload is not supported; swallow pasted files.
      event.preventDefault()
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
      // Image upload is not supported; swallow dropped files.
      event.preventDefault()
      return true
    }
    return false
  }
}
