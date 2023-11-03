import * as React from 'react';
import db from '@/lib/db';
import NotesList from '@/components/NotesList';
import { currentUser } from '@clerk/nextjs';

interface pageProps {}

async function FavoritesPage({}: pageProps) {
  const user = await currentUser();
  const favoriteNotes = await db.note.findMany({
    where: {
      userId: user?.id as string,
      isFavorite: true,
    },
  });

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

export default FavoritesPage;
