import * as React from 'react';
import db from '@/lib/db';
import NotesList from '@/components/NotesList';
import { currentUser } from '@clerk/nextjs';
import NoteDetails from '@/components/NoteDetails';

interface pageProps {
  searchParams: {
    note: string;
  };
}

async function FavoritesPage({ searchParams }: pageProps) {
  const user = await currentUser();
  const favoriteNotes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      isFavorite: true,
    },
  });

  if (!searchParams?.note) {
    return (
      <div className='flex'>
        <NotesList
          notes={favoriteNotes}
          folderName='Favorites'
          emptyMessage='You have no favorite notes'
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
    <div className='flex'>
      <NotesList
        notes={favoriteNotes}
        folderName='Favorites'
        emptyMessage='You have no favorite notes'
      />
      <div className='flex-1'>
        <NoteDetails note={note} folderName={folderName?.name as string} />
      </div>
    </div>
  );
}

export default FavoritesPage;
