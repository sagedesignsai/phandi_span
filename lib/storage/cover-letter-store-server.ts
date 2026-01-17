import type { CoverLetter, CreateCoverLetterInput } from '@/lib/models/cover-letter';
import { coverLetterSchema } from '@/lib/models/cover-letter';
import { nanoid } from 'nanoid';

// In-memory store for server-side operations
const serverCoverLetterStore = new Map<string, CoverLetter>();

// Get a cover letter from server-side store
export function getCoverLetterServer(id: string | null): CoverLetter | null {
  if (!id) return null;
  return serverCoverLetterStore.get(id) || null;
}

// Save a cover letter to server-side store (in-memory only)
export function saveCoverLetterServer(coverLetter: CoverLetter): CoverLetter {
  const validatedCoverLetter = coverLetterSchema.parse(coverLetter);
  
  const now = new Date().toISOString();
  const wordCount = validatedCoverLetter.content.trim().split(/\s+/).length;
  const characterCount = validatedCoverLetter.content.length;
  
  validatedCoverLetter.metadata = {
    ...validatedCoverLetter.metadata,
    updatedAt: now,
    lastEdited: now,
    version: (validatedCoverLetter.metadata?.version || 0) + 1,
    wordCount,
    characterCount,
  };

  serverCoverLetterStore.set(validatedCoverLetter.id, validatedCoverLetter);
  return validatedCoverLetter;
}

// Create a new cover letter (server-side, in-memory)
export function createCoverLetterServer(data: CreateCoverLetterInput): CoverLetter {
  const now = new Date().toISOString();
  const newCoverLetter: CoverLetter = {
    id: nanoid(),
    userId: data.userId,
    jobId: data.jobId,
    resumeId: data.resumeId,
    content: data.content || '',
    template: data.template || 'professional',
    status: 'draft',
    jobTitle: data.jobTitle,
    companyName: data.companyName,
    recipientName: data.recipientName,
    metadata: {
      createdAt: now,
      updatedAt: now,
      lastEdited: now,
      version: 1,
      wordCount: 0,
      characterCount: 0,
    },
  };

  return saveCoverLetterServer(newCoverLetter);
}

// Load a cover letter into server-side store
export function loadCoverLetterToServer(coverLetter: CoverLetter): void {
  serverCoverLetterStore.set(coverLetter.id, coverLetter);
}
