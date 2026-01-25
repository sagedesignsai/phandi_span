"use client";

import type { BlockResume } from '@/lib/models/resume';
import { blockResumeSchema } from '@/lib/models/resume';
import { nanoid } from 'nanoid';
import { createBlockResume } from '@/lib/resume/editor/block-serialization';

const STORAGE_KEY = 'phandi_resumes';

// Get all resumes from localStorage
export function listResumes(): BlockResume[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const resumes = JSON.parse(stored) as BlockResume[];
    // Validate each resume against schema
    return resumes.filter((resume) => {
      try {
        blockResumeSchema.parse(resume);
        return true;
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error('Error loading resumes from localStorage:', error);
    return [];
  }
}

// Get a single resume by ID
export function getResume(id: string): BlockResume | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const resumes = listResumes();
  return resumes.find((r) => r.id === id) || null;
}

// Save a resume (create or update)
export function saveResume(resume: BlockResume): BlockResume {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available');
  }

  try {
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

    const resumes = listResumes();
    const existingIndex = resumes.findIndex((r) => r.id === validatedResume.id);
    
    if (existingIndex >= 0) {
      // Update existing resume
      resumes[existingIndex] = validatedResume;
    } else {
      // Add new resume
      resumes.push(validatedResume);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    return validatedResume;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
}

// Create a new resume with generated ID
export function createResume(title: string = 'New Resume'): BlockResume {
  const newResume = createBlockResume(title);
  return saveResume(newResume);
}

// Delete a resume
export function deleteResume(id: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const resumes = listResumes();
    const filtered = resumes.filter((r) => r.id !== id);
    
    if (filtered.length === resumes.length) {
      return false; // Resume not found
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

// Duplicate a resume
export function duplicateResume(id: string): BlockResume | null {
  const original = getResume(id);
  if (!original) return null;

  const duplicated: BlockResume = {
    ...original,
    id: nanoid(),
    title: `${original.title} (Copy)`,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      version: 1,
    },
  };

  return saveResume(duplicated);
}

