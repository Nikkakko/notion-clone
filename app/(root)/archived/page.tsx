import { currentUser } from '@clerk/nextjs';
import * as React from 'react';
import db from '@/lib/db';
import NotesList from '@/components/NotesList';

interface pageProps {}

async function ArchivedPage({}: pageProps) {
  const user = await currentUser();
  const archivedNotes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      isArchived: true,
    },
  });
  return (
    <div className='flex'>
      <NotesList
        notes={archivedNotes}
        folderName='Archived'
        emptyMessage='You have no archived notes'
      />
    </div>
  );
}

export default ArchivedPage;
