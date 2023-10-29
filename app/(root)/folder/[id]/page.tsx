import * as React from 'react';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import NotesList from '@/components/NotesList';

interface FolderPageProps {
  params: {
    id: string;
  };
}

async function FolderPage({ params }: FolderPageProps) {
  const user = await currentUser();
  const notes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      folderId: params.id,
    },
  });

  console.log(notes);

  return (
    <div className='flex'>
      <h1>Folder {params.id}</h1>
      <NotesList notes={notes} />
    </div>
  );
}

export default FolderPage;
