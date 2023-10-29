import {
  JetBrains_Mono as FontMono,
  Inter as FontSans,
  Kaushan_Script as FontScript,
} from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});
