import { SignInButton, currentUser } from '@clerk/nextjs';
import Image from 'next/image';

export default async function Home() {
  const user = await currentUser();

  return (
    <div className='flex items-center justify-center min-h-screen'>
      {user ? <p>heelo</p> : <SignInButton />}
    </div>
  );
}
