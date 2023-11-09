'use client';
import * as React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Icons } from './icons';
import {
  addNoteToFavoritesAction,
  archiveNoteAction,
  moveNoteToTrashAction,
  restoreNoteAction,
} from '@/app/_actions/actions';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import qs from 'query-string';

interface VerticalMenuProps {
  noteId: string | undefined;
  isFavorite: boolean | undefined | null;
  isArchived: boolean | undefined | null;
  isDeleted: boolean | undefined | null;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({
  noteId,
  isArchived,
  isFavorite,
  isDeleted,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const resetNoteQuery = () => {
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query: {
          note: null,
        },
      },

      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  };

  const handleTrash = () => {
    if (isDeleted) {
      startTransition(async () => {
        await restoreNoteAction(noteId!);

        toast({
          title: `Note restored`,
        });
      });
    } else {
      startTransition(async () => {
        await moveNoteToTrashAction(noteId!);
        resetNoteQuery();
        toast({
          title: `Note moved to trash`,
        });
      });
    }
  };

  return (
    <Menubar className='w-fit '>
      <MenubarMenu>
        <MenubarTrigger className=''>
          <Icons.verticalMenu className='w-4 h-4' />
        </MenubarTrigger>

        <MenubarContent className='' side='bottom'>
          <MenubarItem
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await addNoteToFavoritesAction(noteId!);
                toast({
                  title: `Note ${
                    isFavorite ? 'removed from' : 'added to'
                  } favorites
                  `,
                });
              });
            }}
            className='flex items-center  gap-2'
          >
            <Icons.star
              className={cn('w-4 h-4', {
                'text-yellow-500 fill-yellow-500': isFavorite,
              })}
            />
            {isFavorite ? 'Favorite' : 'Add to favorite'}
          </MenubarItem>

          <MenubarItem
            disabled={isPending}
            className='flex items-center  gap-2'
            onClick={() => {
              startTransition(async () => {
                await archiveNoteAction(noteId!);
                toast({
                  title: `Note ${
                    isArchived ? 'removed from' : 'added to'
                  } archive
                  `,
                });
              });
            }}
          >
            <Icons.archive className='w-4 h-4' />
            {isArchived ? 'Archived' : 'Add to archive'}
          </MenubarItem>

          <MenubarItem
            disabled={isPending}
            className='flex items-center  gap-2 '
            onClick={handleTrash}
          >
            <Icons.trash className='w-4 h-4' />
            {isDeleted ? 'Undo' : 'Move to trash'}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default VerticalMenu;
