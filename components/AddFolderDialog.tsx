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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from './icons';
import { addFoldersAction } from '@/app/_actions/actions';

export function AddFolderDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [isPending, startTransition] = React.useTransition();

  const handleAddFolder = (folderName: string) => {
    startTransition(async () => {
      await addFoldersAction(folderName);
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className='p-0 justify-end hover:bg-inherit h-fit'
          variant='ghost'
          size='icon'
        >
          <Icons.folderAdd className='' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add a new folder</DialogTitle>
          <DialogDescription>
            Folders are a great way to organize your notes
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              id='name'
              className='col-span-3'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='My new folder'
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            className='mr-4'
            onClick={() => handleAddFolder(name)}
            disabled={isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
