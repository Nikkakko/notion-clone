import * as React from 'react';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import NotesList from '@/components/NotesList';
import NoteDetails from '@/components/NoteDetails';
import EmptyNote from '@/components/EmptyNote';

interface FolderPageProps {
  params: {
    id: string;
  };
  searchParams: {
    note: string;
  };
}

async function FolderPage({ params, searchParams }: FolderPageProps) {
  const user = await currentUser();

  const notes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      folderId: params?.id,
      isDeleted: false,
    },
  });

  const folderName = await db.folder.findUnique({
    where: {
      id: params?.id,
    },

    select: {
      name: true,
    },
  });

  if (!searchParams?.note) {
    return (
      <div className='flex'>
        <NotesList notes={notes} folderName={folderName?.name as string} />
        <div className='flex-1'>
          <EmptyNote />
        </div>
      </div>
    );
  }
  const note = await db.note.findUnique({
    where: {
      id: searchParams?.note,
    },
  });

  return (
    <div className='flex'>
      <NotesList notes={notes} folderName={folderName?.name as string} />
      {note ? (
        <NoteDetails note={note} folderName={folderName?.name as string} />
      ) : null}
    </div>
  );
}

export default FolderPage;
