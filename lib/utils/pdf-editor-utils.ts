/**
 * PDF Editor Utilities
 * Helper functions for PDF editing operations
 */

/**
 * Simple debounce implementation
 */
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T;
}

/**
 * Debounce function for auto-save
 */
export function createAutoSave<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 1000
): T {
  return debounce(fn, delay) as T;
}

/**
 * Check if two resume objects are equal
 */
export function areResumesEqual(resume1: any, resume2: any): boolean {
  return JSON.stringify(resume1) === JSON.stringify(resume2);
}

/**
 * Create a deep copy of a resume
 */
export function cloneResume<T>(resume: T): T {
  return JSON.parse(JSON.stringify(resume));
}

