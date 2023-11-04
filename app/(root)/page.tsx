import { Button } from '@/components/ui/button';
import { SignInButton, currentUser } from '@clerk/nextjs';
import Image from 'next/image';

export default async function Home() {
  const user = await currentUser();

  return (
    <div className='flex items-center justify-center min-h-screen'>
      {user ? (
        <div>
          <h1 className='mt-8 text-5xl font-bold text-center max-w-md'>
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
            <span className='font-bold text-muted-foreground'>Nowted</span> is a
            simple and
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
