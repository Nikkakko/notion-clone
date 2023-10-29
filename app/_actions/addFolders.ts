'use server';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const addFoldersAction = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  //create new folder

  await db.folder.create({
    data: {
      name: 'New Folder',
      userId: user.id,
      type: 'FOLDER',
    },
  });

  //revalidate path
  revalidatePath('/');
};

export const addNoteAction = async (folderId: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!folderId) {
    alert('Please select a folder first!');
  }

  //create new folder

  await db.note.create({
    data: {
      title: 'New Note',
      userId: user.id,
      type: 'FOLDER',
      folderId: folderId,
      content: '',
    },
  });

  //revalidate path
  revalidatePath('/');
};
