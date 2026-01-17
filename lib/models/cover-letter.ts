import { z } from 'zod';

// Cover Letter Template Types
export const coverLetterTemplateSchema = z.enum([
  'professional',
  'creative',
  'concise',
  'technical',
]);

export type CoverLetterTemplate = z.infer<typeof coverLetterTemplateSchema>;

// Cover Letter Status
export const coverLetterStatusSchema = z.enum([
  'draft',
  'generated',
  'edited',
  'finalized',
]);

export type CoverLetterStatus = z.infer<typeof coverLetterStatusSchema>;

// Cover Letter Metadata
export const coverLetterMetadataSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  lastEdited: z.string(),
  version: z.number().default(1),
  wordCount: z.number().optional(),
  characterCount: z.number().optional(),
});

export type CoverLetterMetadata = z.infer<typeof coverLetterMetadataSchema>;

// Extended Cover Letter Schema
export const coverLetterSchema = z.object({
  id: z.string(),
  userId: z.string().uuid().optional(),
  jobId: z.string().uuid().optional(),
  resumeId: z.string(),
  content: z.string().min(1),
  template: coverLetterTemplateSchema.default('professional'),
  status: coverLetterStatusSchema.default('draft'),
  metadata: coverLetterMetadataSchema,
  // Optional fields for job context
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  recipientName: z.string().optional(),
});

export type CoverLetter = z.infer<typeof coverLetterSchema>;

// Create Cover Letter Input
export const createCoverLetterInputSchema = z.object({
  userId: z.string().uuid().optional(),
  jobId: z.string().uuid().optional(),
  resumeId: z.string(),
  content: z.string().optional().default(''),
  template: coverLetterTemplateSchema.optional().default('professional'),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  recipientName: z.string().optional(),
});

export type CreateCoverLetterInput = z.infer<typeof createCoverLetterInputSchema>;
