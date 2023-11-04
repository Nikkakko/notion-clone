'use client';
import * as React from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Icons } from '../icons';

import { User } from '@clerk/nextjs/server';
import { Folder, Note } from '@prisma/client';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { AddFolderDialog } from '../AddFolderDialog';
import { AddNewNoteDialog } from '../AddNewNoteDialog';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { deleteFolderAction } from '@/app/_actions/actions';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { ModeToggle } from '../mode-toggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SidebarProps {
  user: User | null;
  folders: Folder[];
  recentNotes: Note[];
}

export default function MobileSidebar({ folders, recentNotes }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const { user, isSignedIn } = useUser();

  const initials = `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`;
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='md:hidden'>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden'
          >
            <Icons.menu className='h-6 w-6' aria-hidden='true' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className='' side='left'>
          <SheetHeader className=''>
            <SheetTitle>
              <Link href='/'>
                <div className='flex space-x-2'>
                  <h1 className='text-lg font-bold font-mono'>
                    {siteConfig.sidebar.title}
                  </h1>
                  <Icons.pencil size={16} />
                </div>
              </Link>
            </SheetTitle>
            <Button variant='outline'>
              <Icons.search size={16} className='mr-2' />
              Search Notes
            </Button>
          </SheetHeader>
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
                            'flex items-center space-x-2 p-1 mt-1 hover:bg-primary-foreground rounded-md'
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
                          <Link
                            href={`/folder/${folder.id}`}
                            className='w-full'
                          >
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
          <SheetFooter className=''>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                {isSignedIn ? (
                  <UserButton afterSignOutUrl='/' />
                ) : (
                  <SignInButton />
                )}
                {isSignedIn && <p>{initials}</p>}
              </div>
              <ModeToggle />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
