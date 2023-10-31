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
      isFavorite: false,
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

  await db.note.update({
    where: {
      id: noteId,
    },
    data: {
      content: content,
    },
  });

  //revalidate path
  revalidatePath(`/folder`);
};

export const addNoteToRecentAction = async (noteId: string) => {
  const user = await currentUser();
  console.log(noteId);

  if (!user) {
    return;
  }

  if (!noteId) {
    return {
      error: 'Please select a folder',
    };
  }

  await db.note.update({
    where: {
      id: noteId,
      userId: user.id,
    },
    data: {
      type: 'RECENT',
    },
  });

  //revalidate path
  revalidatePath(`/`);
};

export const deleteFolderAction = async (folderId: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!folderId) {
    return {
      error: 'Please select a folder',
    };
  }

  await db.folder.delete({
    where: {
      id: folderId,
    },
  });

  //revalidate path
  revalidatePath(`/`);
};

export const moveNoteToTrashAction = async (noteId: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!noteId) {
    return {
      error: 'Please select a folder',
    };
  }

  await db.note.update({
    where: {
      id: noteId,
    },
    data: {
      type: 'TRASH',
    },
  });

  //revalidate path
  revalidatePath(`/`);
};

export const deleteNoteAction = async (noteId: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!noteId) {
    return {
      error: 'Please select a folder',
    };
  }

  await db.note.delete({
    where: {
      id: noteId,
    },
  });

  //revalidate path
  revalidatePath(`/`);
};

export const addNoteToFavoritesAction = async (noteId: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!noteId) {
    return {
      error: 'Please select a folder',
    };
  }

  const note = await db.note.findUnique({
    where: {
      id: noteId,
    },
  });

  if (!note) {
    return {
      error: 'Note not found',
    };
  }

  await db.note.update({
    where: {
      id: noteId,
    },
    data: {
      isFavorite: !note.isFavorite,
    },
  });

  //revalidate path
  revalidatePath(`/`);
};

export const archiveNoteAction = async (noteId: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  if (!noteId) {
    return {
      error: 'Please select a folder',
    };
  }

  await db.note.update({
    where: {
      id: noteId,
      userId: user.id,
    },
    data: {
      type: 'ARCHIVE',
    },
  });

  //revalidate path
  revalidatePath(`/`);
};
