import { currentUser } from '@clerk/nextjs';
import * as React from 'react';
import db from '@/lib/db';
import NotesList from '@/components/NotesList';
import NoteDetails from '@/components/NoteDetails';

interface pageProps {
  searchParams: {
    note: string;
  };
}

async function ArchivedPage({ searchParams }: pageProps) {
  const user = await currentUser();
  const archivedNotes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      isArchived: true,
    },
  });

  if (!searchParams?.note) {
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

  const note = await db.note.findUnique({
    where: {
      id: searchParams?.note,
    },
  });

  const folderName = await db.folder.findUnique({
    where: {
      id: note?.folderId,
    },

    select: {
      name: true,
    },
  });

  return (
    <div className='flex flex-col md:flex-row'>
      <NotesList
        notes={archivedNotes}
        folderName='Archived'
        emptyMessage='You have no archived notes'
      />

      <div className='flex-1'>
        <NoteDetails note={note} folderName={folderName?.name as string} />
      </div>
    </div>
  );
}

export default ArchivedPage;
