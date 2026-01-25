import { z } from 'zod';

// Block-based Resume Schema (replaces traditional resume structure)
export const blockResumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  blocks: z.array(z.any()), // Will be typed as Block[] in usage
  template: z.string().default('default'),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    lastEdited: z.string(),
    version: z.number().default(1),
  }),
});

export type BlockResume = z.infer<typeof blockResumeSchema>;
export type Resume = BlockResume;

