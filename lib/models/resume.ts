import { z } from 'zod';
import { careerProfileContextSchema } from './career-profile';

// Personal Information Schema
export const personalInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  portfolio: z.string().url().optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

// Experience Schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

// Education Schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.array(z.string()).optional(),
});

export type Education = z.infer<typeof educationSchema>;

// Skill Schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
});

export type Skill = z.infer<typeof skillSchema>;

// Project Schema
export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).optional(),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Resume Section Types
export const sectionTypeSchema = z.enum([
  'experience',
  'education',
  'skills',
  'projects',
  'summary',
  'certifications',
  'languages',
  'custom',
]);

export type SectionType = z.infer<typeof sectionTypeSchema>;

// Resume Section Schema
export const resumeSectionSchema = z.object({
  id: z.string(),
  type: sectionTypeSchema,
  title: z.string(),
  items: z.array(z.any()), // Can be Experience[], Education[], Skill[], Project[], etc.
  order: z.number().default(0),
});

export type ResumeSection = z.infer<typeof resumeSectionSchema>;

// Resume Metadata Schema
export const resumeMetadataSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  lastEdited: z.string(),
  version: z.number().default(1),
});

export type ResumeMetadata = z.infer<typeof resumeMetadataSchema>;

// Resume Schema
export const resumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  personalInfo: personalInfoSchema,
  sections: z.array(resumeSectionSchema),
  template: z.string().default('default'),
  metadata: resumeMetadataSchema,
  careerProfile: careerProfileContextSchema.optional(), // Career context for AI tools
});

export type Resume = z.infer<typeof resumeSchema>;

// Template Schema
export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  preview: z.string().optional(), // URL or base64 image
  category: z.string().optional(),
});

export type Template = z.infer<typeof templateSchema>;

