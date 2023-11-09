'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from './icons';
import { addFoldersAction } from '@/app/_actions/actions';

export function DeleteNoteDialog({ id }: { id: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleDeleteNote = () => {
    startTransition(async () => {
      await addFoldersAction(id);
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className='p-0 justify-end hover:bg-inherit h-fit w-fit'
          variant='ghost'
          size='icon'
        >
          <Icons.trash className='w-4 h-4 cursor-pointer z-50 hover:text-red-300' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px md]'>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this note?</DialogTitle>
          <DialogDescription>
            You will not be able to recover this note once it is deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type='button'
            variant='destructive'
            className='mr-4'
            onClick={() => handleDeleteNote()}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
