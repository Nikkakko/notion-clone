import { Icons } from '@/components/icons';

export const siteConfig = {
  //sidebar
  sidebar: {
    title: 'Nowted',
    icon: Icons.pencil,

    links: [
      {
        title: 'Recents',
        type: 'RECENT',
      },
      {
        title: 'Folders',
        type: 'FOLDER',
        icon: Icons.folderAdd,
      },

      {
        title: 'More',
        sublinks: [
          {
            title: 'Favorites',
            icon: Icons.star,
            href: '/favorites',
          },
          {
            title: 'Trash',
            icon: Icons.trash,
            href: '/trash',
          },
          {
            title: 'Archived Notes',
            icon: Icons.archive,
            href: '/archived',
          },
        ],
      },
    ],
  },
};
