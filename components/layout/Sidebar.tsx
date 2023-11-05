'use client';
import { siteConfig } from '@/config/site';
import { cn, getUserEmail } from '@/lib/utils';
import { User } from '@clerk/nextjs/server';
import * as React from 'react';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import {
  addFoldersAction,
  addNoteAction,
  deleteFolderAction,
} from '@/app/_actions/actions';
import { useUser, SignInButton, useClerk } from '@clerk/nextjs';
import { Folder, Note, NoteType } from '@prisma/client';
import Link from 'next/link';
import {
  usePathname,
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { UserButton } from '@clerk/clerk-react';
import { useToast } from '../ui/use-toast';
import { AddFolderDialog } from '../AddFolderDialog';
import { AddNewNoteDialog } from '../AddNewNoteDialog';
import { ModeToggle } from '../mode-toggle';
import SearchBox from '../SearchBox';
import qs from 'query-string';

interface SidebarProps {
  user: User | null;
  folders: Folder[];
  recentNotes: Note[];
}

const Sidebar: React.FC<SidebarProps> = ({ folders, recentNotes }) => {
  const [isPending, startTransition] = React.useTransition();
  const { user, isSignedIn } = useUser();
  const initials = `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`;
  const { id } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const noteParamId = searchParams.get('note');

  const noteQuery = (noteId: string) => {
    const url = qs.stringifyUrl(
      {
        url: '/',
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
    <aside className='hidden p-7 w-72 md:flex flex-col justify-between'>
      <div>
        <div className='flex items-center justify-between'>
          <Link href='/'>
            <div className='flex space-x-2'>
              <h1 className='text-xl font-bold font-mono'>
                {siteConfig.sidebar.title}
              </h1>
              <Icons.pencil size={18} />
            </div>
          </Link>
          <SearchBox />
        </div>

        <div className='flex flex-col space-y-7 mt-7'>
          <AddNewNoteDialog id={id as string} />

          {siteConfig.sidebar.links.map(link => (
            <div key={link.title} className='w-full'>
              <div className='flex flex-col items-start '>
                <div className='flex items-center justify-between w-full mb-2'>
                  <h2 className='text-sm font-bold'>{link.title}</h2>

                  {link.title === 'Folders' && <AddFolderDialog />}
                </div>

                {/* RECENTS */}
                {link.type === 'RECENT' &&
                  recentNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => noteQuery(note.id)}
                      className={cn(
                        'w-full flex items-center  hover:bg-primary-foreground rounded-md cursor-pointer space-x-2 p-1 mt-1',
                        note.id === noteParamId &&
                          pathname !== `/folder/${note.folderId}` &&
                          'bg-primary-foreground rounded-md hover:bg-primary-foreground'
                      )}
                    >
                      <Icons.document className='w-4 h-4 ' />
                      <h3 className='text-sm font-medium'>{note.title}</h3>
                    </div>
                  ))}

                {/* FOLDERS */}
                {folders.map(
                  folder =>
                    folder.type === link.type && (
                      <div
                        className='flex items-center  w-full justify-between'
                        key={folder.id}
                      >
                        <Link href={`/folder/${folder.id}`} className='w-full'>
                          <div
                            className={cn(
                              'flex items-center space-x-2 p-1 mt-1',
                              id === folder.id &&
                                'bg-primary-foreground rounded-md',
                              id !== folder.id &&
                                'hover:bg-primary-foreground rounded-md'
                            )}
                          >
                            <Icons.folder size={18} />
                            <h3 className='text-sm font-medium'>
                              {folder.name}
                            </h3>
                          </div>
                        </Link>
                        <Icons.trash
                          className='w-4 h-4 ml-2
                          hover:text-primary-foreground
                          cursor-pointer
                          
                          
                        '
                          onClick={() => {
                            startTransition(async () => {
                              await deleteFolderAction(folder.id);
                              router.push(`/folder/${folders[0].id}`);
                            });
                          }}
                        />
                      </div>
                    )
                )}
              </div>

              {/* SUBLINKS  */}
              <div className='flex flex-col space-y-2'>
                {link.sublinks?.map(sublink => (
                  <Link key={sublink.title} href={sublink.href}>
                    <div
                      className={cn(
                        'flex items-center space-x-2  p-1',
                        pathname === sublink.href &&
                          'bg-primary-foreground rounded-md',
                        pathname !== sublink.href &&
                          'hover:bg-primary-foreground rounded-md'
                      )}
                    >
                      <sublink.icon size={18} />
                      <h3 className='text-sm font-medium'>{sublink.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          {isSignedIn ? <UserButton afterSignOutUrl='/' /> : <SignInButton />}
          {isSignedIn && <p>{initials}</p>}
        </div>
        <ModeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
