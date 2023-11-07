import NoteDetails from '@/components/NoteDetails';
import { Button } from '@/components/ui/button';
import { SignInButton, currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import db from '@/lib/db';

interface HomeProps {
  searchParams: {
    note: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const user = await currentUser();

  if (!searchParams?.note || !user) {
    return (
      <div
        className='flex items-center justify-center 
      h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)]
      
      '
      >
        {user ? (
          <div>
            <h1 className='md:mt-8 text-5xl font-bold text-center max-w-md'>
              Your Ideas,
              <br />
              Documents and Notes in one place
            </h1>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-bold text-center max-w-md'>
              Your Ideas,
              <br />
              Documents and Notes in one place
            </h1>

            <p className='mt-4 text-center text-muted-foreground'>
              <span className='font-bold text-muted-foreground'>Nowted</span> is
              a simple and
              <br />
              easy to use note taking app.
            </p>

            <div className='mt-8'>
              <Button className='' asChild variant='outline'>
                <SignInButton />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  const note = await db.note.findUnique({
    where: {
      // userId: user?.id as string,
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
    <div className='flex-1'>
      <NoteDetails note={note} folderName={folderName?.name as string} />
    </div>
  );
}
