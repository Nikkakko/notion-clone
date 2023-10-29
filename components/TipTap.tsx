'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorBar from './EditorBar';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (size: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
    };
  }
}

const Tiptap = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      Link.configure({
        openOnClick: false,
        validate: url => {
          if (!url.startsWith('http')) {
            return false;
          }

          return true;
        },
      }),
      TextStyle.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            fontSize: {
              default: null,
              parseHTML: element => element.style.fontSize.replace('px', ''),
              renderHTML: attributes => {
                if (!attributes['fontSize']) {
                  return {};
                }
                return {
                  style: `font-size: ${attributes['fontSize']}px`,
                };
              },
            },
          };
        },

        addCommands() {
          return {
            ...this.parent?.(),
            setFontSize:
              (fontSize: string) =>
              ({ commands }) => {
                return commands.setMark(this.name, { fontSize: fontSize });
              },
            unsetFontSize:
              () =>
              ({ chain }) => {
                return chain()
                  .setMark(this.name, { fontSize: null })
                  .removeEmptyTextStyle()
                  .run();
              },
          };
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-96 w-full  resize-none',
      },
    },

    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className='flex flex-col justify-stretch gap-y-2 '>
      <EditorBar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
