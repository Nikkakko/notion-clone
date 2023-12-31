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
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import qs from 'query-string';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ScrollArea } from './ui/scroll-area';
import {
  addNoteToRecentAction,
  deleteNoteAction,
  moveNoteToTrashAction,
  restoreNoteAction,
} from '@/app/_actions/actions';
import { Icons } from './icons';
import { DeleteNoteDialog } from './DeleteNoteDialog';
import { useToast } from './ui/use-toast';

interface NotesListProps {
  notes: Note[];
  folderName: string;
  emptyMessage?: string;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  folderName,
  emptyMessage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const noteIdParams = searchParams.get('note') as string;
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

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

  const resetNoteQuery = () => {
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query: {
          note: null,
        },
      },

      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  };

  // className='flex flex-col bg-primary-foreground p-7 h-full min-h-screen'

  return (
    <ScrollArea className='h-full rounded-md border '>
      <div className='flex md:flex-col md:h-screen  bg-primary-foreground p-2 overflow-x-auto w-screen md:w-full '>
        <h1 className='hidden md:block'>{folderName}</h1>
        {!notes.length && (
          <p className='text-muted-foreground md:mt-4'>
            {emptyMessage || 'No notes in this folder'}
          </p>
        )}
        <div className='flex flex-row space-x-2 md:space-x-0 md:flex-col md:space-y-4 md:mt-4'>
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
                'cursor-pointer hover:bg-background/5 p-2 md:p-4 ',
                note.id === noteIdParams && 'bg-background/5'
              )}
            >
              <CardHeader className='p-0'>
                <CardTitle className='text-sm'>{note.title}</CardTitle>
              </CardHeader>
              <CardContent className='p-0 mt-2 hidden md:block'>
                <EditorComp content={note.content} />
              </CardContent>
              <CardFooter className='p-0 mt-2 flex-col items-start '>
                <p className='text-sm text-muted-foreground hidden md:block'>
                  {formatDate(note.createdAt)}
                </p>

                <div className='flex items-center space-x-1 md:mt-1 w-full'>
                  {pathname === '/trash' && (
                    <div className='flex items-center gap-2 justify-between w-full'>
                      <Icons.undo
                        className='w-4 h-4 cursor-pointer z-50 hover:text-blue-300'
                        onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                          e.stopPropagation();
                          startTransition(async () => {
                            await restoreNoteAction(note.id);
                            resetNoteQuery();
                          });
                        }}
                      />
                      <DeleteNoteDialog id={note.id} />
                    </div>
                  )}
                </div>
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
