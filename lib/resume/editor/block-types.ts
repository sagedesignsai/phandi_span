import { z } from 'zod';

/**
 * Block Type Definitions
 * Each block represents an editable element in the resume
 */

export const blockTypeSchema = z.enum([
  'header',
  'section',
  'experience',
  'education',
  'skill',
  'project',
  'summary',
  'divider',
  'custom',
]);

export type BlockType = z.infer<typeof blockTypeSchema>;

/**
 * Block Style Schema
 */
export const blockStyleSchema = z.object({
  template: z.string().optional(),
  fontSize: z.number().optional(),
  fontWeight: z.string().optional(),
  color: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).optional(),
  marginTop: z.number().optional(),
  marginBottom: z.number().optional(),
});

export type BlockStyle = z.infer<typeof blockStyleSchema>;

/**
 * Base Block Schema
 */
export const baseBlockSchema = z.object({
  id: z.string(),
  type: blockTypeSchema,
  order: z.number(),
  data: z.record(z.unknown()),
  style: blockStyleSchema.optional(),
});

export type BaseBlock = z.infer<typeof baseBlockSchema>;

/**
 * Header Block Data
 */
export const headerBlockDataSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional(),
  portfolio: z.string().optional(),
});

export type HeaderBlockData = z.infer<typeof headerBlockDataSchema>;

/**
 * Section Block Data
 */
export const sectionBlockDataSchema = z.object({
  title: z.string(),
  sectionType: z.enum(['experience', 'education', 'skills', 'projects', 'summary', 'certifications', 'languages', 'custom']),
});

export type SectionBlockData = z.infer<typeof sectionBlockDataSchema>;

/**
 * Experience Block Data
 */
export const experienceBlockDataSchema = z.object({
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

export type ExperienceBlockData = z.infer<typeof experienceBlockDataSchema>;

/**
 * Education Block Data
 */
export const educationBlockDataSchema = z.object({
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

export type EducationBlockData = z.infer<typeof educationBlockDataSchema>;

/**
 * Skill Block Data
 */
export const skillBlockDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
});

export type SkillBlockData = z.infer<typeof skillBlockDataSchema>;

/**
 * Project Block Data
 */
export const projectBlockDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).optional(),
  url: z.string().optional(),
  github: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ProjectBlockData = z.infer<typeof projectBlockDataSchema>;

/**
 * Summary Block Data
 */
export const summaryBlockDataSchema = z.object({
  content: z.string(),
});

export type SummaryBlockData = z.infer<typeof summaryBlockDataSchema>;

/**
 * Custom Block Data
 */
export const customBlockDataSchema = z.record(z.unknown());

export type CustomBlockData = z.infer<typeof customBlockDataSchema>;

/**
 * Complete Block Schema with type-specific data
 */
export const blockSchema = baseBlockSchema.extend({
  data: z.union([
    headerBlockDataSchema,
    sectionBlockDataSchema,
    experienceBlockDataSchema,
    educationBlockDataSchema,
    skillBlockDataSchema,
    projectBlockDataSchema,
    summaryBlockDataSchema,
    customBlockDataSchema,
  ]),
});

export type Block = z.infer<typeof blockSchema>;

/**
 * Block Operations
 */
export interface BlockOperations {
  addBlock: (type: BlockType, data: unknown, order?: number) => Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blockIds: string[]) => void;
  duplicateBlock: (id: string) => Block;
}



