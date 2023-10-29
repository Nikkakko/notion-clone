import Sidebar from '@/components/layout/Sidebar';
import { currentUser } from '@clerk/nextjs';
import * as React from 'react';
import db from '@/lib/db';

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

  return (
    <div className='relative flex min-h-screen'>
      <Sidebar user={user} folders={folders} />
      <main className='flex-1'>{children}</main>
    </div>
  );
};

export default RootLayout;
