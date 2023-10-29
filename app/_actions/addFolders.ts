'use server';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const addFoldersAction = async (folderName: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  //create new folder

  await db.folder.create({
    data: {
      name: folderName || 'New Folder',
      userId: user.id,
      type: 'FOLDER',
    },
  });

  //revalidate path
  revalidatePath('/');
};

export const addNoteAction = async (folderId: string, noteName: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!folderId) {
    return {
      error: 'Please select a folder',
    };
  }

  //create new folder

  await db.note.create({
    data: {
      title: noteName || 'New Note',
      userId: user.id,
      type: 'FOLDER',
      folderId: folderId,
      content: '',
    },
  });

  //revalidate path
  revalidatePath('/');
};

export const editNoteAction = async (noteId: string, content: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!noteId) {
    return {
      error: 'Please select a folder',
    };
  }

  //create new folder

  await db.note.update({
    where: {
      id: noteId,
    },
    data: {
      content: content,
    },
  });

  //revalidate path
  revalidatePath('/');
};
