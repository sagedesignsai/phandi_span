"use client";

import type { CoverLetter, CreateCoverLetterInput } from '@/lib/models/cover-letter';
import { coverLetterSchema } from '@/lib/models/cover-letter';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'phandi_cover_letters';

// Get all cover letters from localStorage
export function listCoverLetters(): CoverLetter[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const coverLetters = JSON.parse(stored) as CoverLetter[];
    return coverLetters.filter((cl) => {
      try {
        coverLetterSchema.parse(cl);
        return true;
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error('Error loading cover letters:', error);
    return [];
  }
}

// Get a single cover letter by ID
export function getCoverLetter(id: string): CoverLetter | null {
  if (typeof window === 'undefined') return null;

  const coverLetters = listCoverLetters();
  return coverLetters.find((cl) => cl.id === id) || null;
}

// Save a cover letter (create or update)
export function saveCoverLetter(coverLetter: CoverLetter): CoverLetter {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available');
  }

  try {
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

    const coverLetters = listCoverLetters();
    const existingIndex = coverLetters.findIndex((cl) => cl.id === validatedCoverLetter.id);
    
    if (existingIndex >= 0) {
      coverLetters[existingIndex] = validatedCoverLetter;
    } else {
      coverLetters.push(validatedCoverLetter);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(coverLetters));
    return validatedCoverLetter;
  } catch (error) {
    console.error('Error saving cover letter:', error);
    throw error;
  }
}

// Create a new cover letter with generated ID
export function createCoverLetter(data: CreateCoverLetterInput): CoverLetter {
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

  return saveCoverLetter(newCoverLetter);
}

// Delete a cover letter
export function deleteCoverLetter(id: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const coverLetters = listCoverLetters();
    const filtered = coverLetters.filter((cl) => cl.id !== id);
    
    if (filtered.length === coverLetters.length) {
      return false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    return false;
  }
}

// Duplicate a cover letter
export function duplicateCoverLetter(id: string): CoverLetter | null {
  const original = getCoverLetter(id);
  if (!original) return null;

  const duplicated: CoverLetter = {
    ...original,
    id: nanoid(),
    status: 'draft',
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      version: 1,
      wordCount: original.metadata.wordCount,
      characterCount: original.metadata.characterCount,
    },
  };

  return saveCoverLetter(duplicated);
}

// Get cover letters by resume ID
export function getCoverLettersByResumeId(resumeId: string): CoverLetter[] {
  return listCoverLetters().filter((cl) => cl.resumeId === resumeId);
}

// Get cover letters by job ID
export function getCoverLettersByJobId(jobId: string): CoverLetter[] {
  return listCoverLetters().filter((cl) => cl.jobId === jobId);
}
