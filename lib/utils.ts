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

export function dateFormat(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}
