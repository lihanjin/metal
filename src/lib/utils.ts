import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function openWhatsApp() {
  const url = 'https://wa.me/85269497914'
  window.open(url, '_blank')
}