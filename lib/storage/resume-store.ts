"use client";

import type { Resume } from '@/lib/models/resume';
import { resumeSchema } from '@/lib/models/resume';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'phandi_resumes';

// Get all resumes from localStorage
export function listResumes(): Resume[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const resumes = JSON.parse(stored) as Resume[];
    // Validate each resume against schema
    return resumes.filter((resume) => {
      try {
        resumeSchema.parse(resume);
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
export function getResume(id: string): Resume | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const resumes = listResumes();
  return resumes.find((r) => r.id === id) || null;
}

// Save a resume (create or update)
export function saveResume(resume: Resume): Resume {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available');
  }

  try {
    // Validate resume
    const validatedResume = resumeSchema.parse(resume);
    
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
export function createResume(data: Omit<Resume, 'id' | 'metadata'>): Resume {
  const now = new Date().toISOString();
  const newResume: Resume = {
    ...data,
    id: nanoid(),
    metadata: {
      createdAt: now,
      updatedAt: now,
      lastEdited: now,
      version: 1,
    },
  };

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
export function duplicateResume(id: string): Resume | null {
  const original = getResume(id);
  if (!original) return null;

  const duplicated: Resume = {
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

