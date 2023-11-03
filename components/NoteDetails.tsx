'use client';
import { Note } from '@prisma/client';
import * as React from 'react';
import { Icons } from './icons';
import { cn, formatDate } from '@/lib/utils';
import EditorBar from './EditorBar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  addNoteToFavoritesAction,
  editNoteAction,
} from '@/app/_actions/actions';
import Tiptap from './TipTap';

interface NoteDetailsProps {
  note: Note | null;
  folderName: string;
}

const NoteDetails: React.FC<NoteDetailsProps> = ({ note, folderName }) => {
  const [isPending, startTransition] = React.useTransition();
  const [content, setContent] = React.useState('');

  console.log(content, 'content');

  // React.useEffect(() => {
  //   setContent(note?.content || '');
  // }, [note]);

  return (
    <div className='p-12 flex flex-1 flex-col'>
      <h1 className='text-3xl'>{note?.title}</h1>
      <div className='flex flex-col space-y-2 mt-4'>
        <div className='flex items-center space-x-2'>
          <Icons.calendar size={18} />
          <p>{formatDate(note?.createdAt!)}</p>
        </div>

        <div className='flex items-center space-x-2'>
          <Icons.folder size={18} />
          <p>{folderName}</p>
        </div>

        <div className='flex items-center space-x-2'>
          <Icons.star
            size={18}
            className={cn('cursor-pointer', {
              'text-yellow-500 fill-yellow-500': note?.isFavorite,
            })}
            onClick={() => {
              startTransition(async () => {
                await addNoteToFavoritesAction(note?.id!);
              });
            }}
          />
          <p>{note?.isFavorite ? 'Favorite' : 'Add to favorite'}</p>
        </div>
      </div>

      <div className='mt-4'>
        {/* <Textarea
          className='h-96 w-full  resize-none'
          value={content}
          onChange={e => setContent(e.target.value)}
        /> */}
        <Tiptap content={note?.content as string} onChange={setContent} />
      </div>

      <Button
        className='mt-4 w-24'
        variant='default'
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
