import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes do Tailwind e resolve conflitos de forma eficiente.
 * @param {any[]} inputs
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isIframe = typeof window !== "undefined" && window.self !== window.top;