import * as React from 'react';
import { Icons } from './icons';
import Balancer from 'react-wrap-balancer';

interface EmptyNoteProps {}

const EmptyNote: React.FC<EmptyNoteProps> = ({}) => {
  return (
    <div
      className='flex flex-col space-y-2 items-center justify-center 
    h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)] 
      '
    >
      <Icons.document className='w-28 h-28' />
      <p className='text-2xl font-semibold text-center'>
        Select a note to view
      </p>

      <p className='text-muted-foreground truncate max-w-md text-center '>
        <Balancer>
          Choose a note from the list on the left to view its contents, or
          create a new note to add to your collection
        </Balancer>
      </p>
    </div>
  );
};

export default EmptyNote;
