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
import { Folder, Note, NoteType } from '@prisma/client';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { UserButton } from '@clerk/clerk-react';
import { useToast } from '../ui/use-toast';
import { AddFolderDialog } from '../AddFolderDialog';
import { AddNewNoteDialog } from '../AddNewNoteDialog';

interface SidebarProps {
  user: User | null;
  folders: Folder[];
  recentNotes: Note[];
}

const Sidebar: React.FC<SidebarProps> = ({ folders, recentNotes }) => {
  const [isPending, startTransition] = React.useTransition();
  // const initials = `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`;
  // const email = getUserEmail(user);
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className='min-h-full bg-gray-700 p-7 w-72'>
      <div className='flex items-center justify-between'>
        <Link href='/'>
          <div className='flex space-x-2'>
            <h1 className='text-xl font-bold font-mono'>
              {siteConfig.sidebar.title}
            </h1>
            <Icons.pencil size={18} />
          </div>
        </Link>
        <Icons.search size={18} />
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
                  <Link
                    key={note.id}
                    href={`/folder/${note.folderId}?note=${note.id}`}
                    className='w-full'
                  >
                    <div
                      className={cn(
                        'flex items-center space-x-2   p-1 ',
                        id === note.id && 'bg-gray-600 rounded-md '
                      )}
                    >
                      <Icons.document className='w-4 h-4 ' />
                      <h3 className='text-sm font-medium'>{note.title}</h3>
                    </div>
                  </Link>
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
                            'flex items-center space-x-2 p-1 ',
                            id === folder.id && 'bg-gray-600 rounded-md '
                          )}
                        >
                          <Icons.folder size={18} />
                          <h3 className='text-sm font-medium'>{folder.name}</h3>
                        </div>
                      </Link>
                      <Icons.trash
                        className='w-4 h-4 ml-2
                          hover:text-red-300
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
                  <div className='flex items-center space-x-2 mt-2'>
                    <sublink.icon size={18} />
                    <h3 className='text-sm font-medium'>{sublink.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <UserButton />
    </div>
  );
};

export default Sidebar;
