'use client';
import { Note } from '@prisma/client';
import * as React from 'react';
import { Icons } from './icons';
import { dateFormat } from '@/lib/utils';
import EditorBar from './EditorBar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { editNoteAction } from '@/app/_actions/addFolders';
import Tiptap from './TipTap';

interface NoteDetailsProps {
  note: Note | null;
  folderName: string;
}

const NoteDetails: React.FC<NoteDetailsProps> = ({ note, folderName }) => {
  const [isPending, startTransition] = React.useTransition();
  const [content, setContent] = React.useState(note?.content || '');

  return (
    <div className='p-12 flex flex-1 flex-col'>
      <h1 className='text-3xl'>{note?.title}</h1>
      <div className='flex flex-col space-y-2 mt-4'>
        <div className='flex items-center space-x-2'>
          <Icons.calendar size={18} />
          <p>{dateFormat(note?.createdAt!)}</p>
        </div>

        <div className='flex items-center space-x-2'>
          <Icons.folder size={18} />
          <p>{folderName}</p>
        </div>
      </div>

      <div className='mt-4'>
        {/* <Textarea
          className='h-96 w-full  resize-none'
          value={content}
          onChange={e => setContent(e.target.value)}
        /> */}
        <Tiptap content={content} onChange={setContent} />
      </div>

      <Button
        className='mt-4'
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await editNoteAction(note?.id!, content as string);
          });
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default NoteDetails;
