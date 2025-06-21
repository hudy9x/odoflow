import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(prefixName = '') {
  return `rand-${prefixName ? `${prefixName}-` : ''}${Math.random().toString(36).substr(2, 9)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any

export function debounce<T extends AnyFunction>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const delay = async function (time = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, time)

  })
}