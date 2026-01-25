import type { BlockResume } from '@/lib/models/resume';
import { blockResumeSchema } from '@/lib/models/resume';
import { nanoid } from 'nanoid';

/**
 * Server-side resume storage
 * This is a temporary in-memory store for server-side tool execution
 * The actual persistence happens on the client side via the tool results
 */

// In-memory store for server-side operations
const serverResumeStore = new Map<string, BlockResume>();

/**
 * Get a resume from server-side store
 * Falls back to creating a placeholder if not found
 */
export function getResumeServer(id: string | null): BlockResume | null {
  if (!id) return null;
  return serverResumeStore.get(id) || null;
}

/**
 * Save a resume to server-side store (in-memory only)
 * The actual persistence happens on the client
 */
export function saveResumeServer(resume: BlockResume): BlockResume {
  // Validate resume
  const validatedResume = blockResumeSchema.parse(resume);
  
  // Update metadata
  const now = new Date().toISOString();
  validatedResume.metadata = {
    ...validatedResume.metadata,
    updatedAt: now,
    lastEdited: now,
    version: (validatedResume.metadata?.version || 0) + 1,
  };

  // Store in memory
  serverResumeStore.set(validatedResume.id, validatedResume);
  return validatedResume;
}

/**
 * Create a new resume (server-side, in-memory)
 * The actual persistence happens on the client
 */
export function createResumeServer(title: string): BlockResume {
  const now = new Date().toISOString();
  const newResume: BlockResume = {
    id: nanoid(),
    title,
    blocks: [],
    template: 'default',
    metadata: {
      createdAt: now,
      updatedAt: now,
      lastEdited: now,
      version: 1,
    },
  };

  return saveResumeServer(newResume);
}

/**
 * Load a resume into server-side store
 * This is called when we have a resumeId from the client
 */
export function loadResumeToServer(resume: Resume): void {
  serverResumeStore.set(resume.id, resume);
}

