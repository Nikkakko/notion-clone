'use client';
import { Note } from '@prisma/client';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, dateFormat } from '@/lib/utils';
import Link from 'next/link';
import qs from 'query-string';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ScrollArea } from './ui/scroll-area';
import { addNoteToRecentAction } from '@/app/_actions/actions';

interface NotesListProps {
  notes: Note[];
  folderName: string;
}

const NotesList: React.FC<NotesListProps> = ({ notes, folderName }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteIdParams = searchParams.get('note') as string;
  const [isPending, startTransition] = React.useTransition();

  const noteQuery = (noteId: string) => {
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query: {
          note: noteId,
        },
      },

      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  };

  return (
    <ScrollArea className=' h-full rounded-md border '>
      <div className='flex flex-col  bg-slate-900 p-7 h-full min-h-screen max-h-screen'>
        <h1>{folderName}</h1>
        {!notes.length && (
          <p className='text-gray-500 mt-4'>No notes in this folder</p>
        )}
        <div className='flex flex-col space-y-4 mt-4'>
          {notes.map(note => (
            <Card
              key={note.id}
              onClick={() => {
                startTransition(async () => {
                  await addNoteToRecentAction(note.id);
                  noteQuery(note.id);
                });
              }}
              className={cn(
                'cursor-pointer',
                note.id === noteIdParams && 'bg-slate-800'
              )}
            >
              <CardContent>
                <CardHeader className='items-start pl-0'>
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>

                <EditorComp content={note.content} />
              </CardContent>
              <CardFooter>
                <p className='text-sm text-gray-500'>
                  {dateFormat(note.createdAt)}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

const EditorComp = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit.configure({})],
    content: content,
  });

  return (
    <CardDescription>{editor?.getText().slice(0, 20) + '...'}</CardDescription>
  );
};

export default NotesList;
