'use client';
import { Editor } from '@tiptap/react';
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Underline,
  Heading2,
  Link,
} from 'lucide-react';
import { Toggle } from './ui/toggle';

interface EditorBarProps {
  editor: Editor | null;
}

const EditorBar: React.FC<EditorBarProps> = ({ editor }) => {
  const [isPending, startTransition] = React.useTransition();
  const [fontSizes, setFontSizes] = React.useState([
    '12',
    '14',
    '16',
    '18',
    '20',
    '24',
  ]);

  if (!editor) return null;
  return (
    <div className='mt-12 border border-input bg-transparent rounded-md w-full max-w-sm'>
      <div className='flex items-center  space-x-2 flex-wrap w-full'>
        <Toggle
          size='sm'
          pressed={editor.isActive('heading')}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className='h-4 w-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className='h-4 w-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className='h-4 w-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className='h-4 w-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className='h-4 w-4' />
        </Toggle>

        <Toggle
          size='sm'
          pressed={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className='h-4 w-4' />
        </Toggle>

        <Toggle
          size='sm'
          className='px-0 md:px-2.5'
          pressed={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className='h-4 w-4 p0' />
        </Toggle>

        <Select
          onValueChange={value => {
            editor.chain().focus().setFontSize(value.toString()).run();
          }}
        >
          <SelectTrigger className='w-fit border-none m-0 p-[10px]'>
            <SelectValue defaultValue={'12'} placeholder='12' />
          </SelectTrigger>
          <SelectContent className=''>
            <SelectGroup>
              {fontSizes.map(size => (
                <SelectItem key={size} value={size} disabled={isPending}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EditorBar;
