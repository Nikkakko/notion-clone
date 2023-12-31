import Sidebar from '@/components/layout/Sidebar';
import { currentUser } from '@clerk/nextjs';
import * as React from 'react';
import db from '@/lib/db';
import MobileSidebar from '@/components/layout/mobile-nav';
import NoteDetails from '@/components/NoteDetails';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = async ({ children }) => {
  const user = await currentUser();

  const folders = await db.folder.findMany({
    where: {
      userId: user?.id as string,
    },
  });

  const recentNotes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      type: 'RECENT',
      isDeleted: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 3,
  });

  return (
    <div className='relative flex flex-col md:flex-row min-h-screen '>
      {user && (
        <Sidebar user={null} folders={folders} recentNotes={recentNotes} />
      )}
      <MobileSidebar user={null} folders={folders} recentNotes={recentNotes} />
      <main className='flex-1'>{children}</main>
    </div>
  );
};

export default RootLayout;
