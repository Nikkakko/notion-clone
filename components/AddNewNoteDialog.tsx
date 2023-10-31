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
import { addFoldersAction, addNoteAction } from '@/app/_actions/actions';
import { useToast } from './ui/use-toast';

export function AddNewNoteDialog({ id }: { id: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const handleAddNote = () => {
    startTransition(async () => {
      try {
        const note = await addNoteAction(id, name);
        toast({
          title: 'Note added successfully',
          description: 'Your note has been added to the folder',
        });

        if (note?.error) {
          toast({
            title: `${note.error}`,
            description: 'Your note has not been added to the folder',
          });
        }

        setIsOpen(false);
        setName('');
      } catch (error) {
        toast({
          title: `${error}`,
          description: 'Your note has not been added to the folder',
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className='w-full bg-gray-500'
          variant='ghost'
          disabled={isPending}
        >
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add a new note</DialogTitle>
          <DialogDescription>
            Notes are a great way to organize your notes
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
              placeholder='My new note'
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            className='mr-4'
            onClick={handleAddNote}
            disabled={isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
