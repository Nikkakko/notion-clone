import { User } from '@clerk/nextjs/server';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserEmail(user: User | null | undefined) {
  const email =
    user?.emailAddresses?.find(e => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? '';

  return email;
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}
