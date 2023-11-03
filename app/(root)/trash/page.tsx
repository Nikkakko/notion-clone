import * as React from 'react';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import NotesList from '@/components/NotesList';
import { notFound } from 'next/navigation';

interface pageProps {}

async function TrashPage({}: pageProps) {
  const user = await currentUser();
  const trashedNotes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      isDeleted: true,
    },
  });

  if (!trashedNotes) {
    return notFound();
  }

  return (
    <div className='flex'>
      <NotesList
        notes={trashedNotes}
        folderName='Trash'
        emptyMessage='No notes in trash'
      />
    </div>
  );
}

export default TrashPage;
