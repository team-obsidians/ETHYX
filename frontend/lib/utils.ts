// c:\Obsidian\Ethyx\frontend\lib\utils.ts
// Shared utility functions for ETHYX AI frontend
// Dependencies: clsx, tailwind-merge

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with proper conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
