import { Note } from '@prisma/client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import useDebounce from './hooks/use-debonuce';
import { Button } from './ui/button';
import { filterNotesAction } from '@/app/_actions/actions';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Icons } from './icons';
import { Skeleton } from './ui/skeleton';

interface SearchBoxProps {}

const SearchBox: React.FC<SearchBoxProps> = ({}) => {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [data, setData] = React.useState<Note[] | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null);
      return;
    }

    let mounted = true;
    function fetchData() {
      startTransition(async () => {
        const data = await filterNotesAction(debouncedQuery);
        if (mounted) {
          setData(data as any);
        }
      });
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <>
      <Button variant='outline' onClick={() => setIsOpen(true)}>
        <Icons.search className='h-4 w-4 ' aria-hidden='true' />
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder='Search Notes...'
          value={query}
          onValueChange={setQuery}
        />

        <CommandList>
          {isPending ? (
            <div className='space-y-1 overflow-hidden px-1 py-2'>
              <Skeleton className='h-4 w-10 rounded' />
              <Skeleton className='h-8  rounded-sm' />
              <Skeleton className='h-8  rounded-sm' />
            </div>
          ) : (
            //unique command Group

            <>
              {data?.map(note => {
                {
                  return (
                    <CommandItem
                      value={note.title}
                      onSelect={() =>
                        handleSelect(() =>
                          router.push(
                            `/folder/${note.folderId}?note=${note.id}`
                          )
                        )
                      }
                    >
                      <div className='flex items-center space-x-2'>
                        <span>{note.title}</span>
                      </div>
                    </CommandItem>
                  );
                }
              })}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBox;
