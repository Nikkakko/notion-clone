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

  const handleMoveToTrash = async (
    e: React.MouseEvent<SVGSVGElement>,
    id: string
  ) => {
    startTransition(async () => {
      e.stopPropagation();
      await moveNoteToTrashAction(id);
      resetNoteQuery();
    });
    toast({
      title: 'Note moved to trash',
      description: 'Note has been moved to trash',
    });
  };

  return (
    <ScrollArea className=' h-full rounded-md border '>
      <div className='flex flex-col  bg-slate-900 p-7 h-full min-h-screen max-h-screen'>
        <h1>{folderName}</h1>
        {!notes.length && (
          <p className='text-gray-500 mt-4'>
            {emptyMessage || 'No notes in this folder'}
          </p>
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
              <CardFooter className='justify-between '>
                <p className='text-sm text-gray-500'>
                  {dateFormat(note.createdAt)}
                </p>

                <div className='flex items-center space-x-1'>
                  {pathname === '/trash' && (
                    <div className='flex items-center gap-2'>
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

                  {pathname !== '/trash' && (
                    <Icons.trash
                      className='w-4 h-4 cursor-pointer z-50 hover:text-red-300'
                      onClick={(e: React.MouseEvent<SVGSVGElement>) =>
                        handleMoveToTrash(e, note.id)
                      }
                    />
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
