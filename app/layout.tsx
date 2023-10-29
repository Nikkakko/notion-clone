import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { fontMono, fontSans } from '@/lib/fonts';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nowted',
  description: 'Nowted built with Next.js',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        href: '/logo-light.svg',
        url: '/logo-light.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        href: '/logo-dark.svg',
        url: '/logo-dark.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning={true}>
        <body
          className={cn(
            'min-h-screen bg-background  font-sans antialiased',
            fontSans.variable,
            fontMono.variable
          )}
        >
          <Providers
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
