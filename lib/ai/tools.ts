import { tool } from 'ai';
import { z } from 'zod';
import type { BlockResume } from '@/lib/models/resume';
import type { Block, HeaderBlockData, ExperienceBlockData, EducationBlockData, SkillBlockData } from '@/lib/resume/editor/block-types';
import { createBlockResume, createDefaultBlock } from '@/lib/resume/editor/block-serialization';
import {
  getResume,
  saveResume,
  createResume,
} from '@/lib/storage/resume-store';

// Context to store current resume being worked on
let currentResumeId: string | null = null;

/**
 * Set the current resume context
 */
export function setCurrentResumeContext(resumeId: string | null) {
  currentResumeId = resumeId;
}

/**
 * Get the current resume context
 */
function getCurrentResume(): BlockResume | null {
  if (!currentResumeId) return null;
  return getResume(currentResumeId);
}

/**
 * AI SDK Tools for resume operations (block-based)
 */
export const resumeTools = {
  /**
   * Initialize a new resume
   */
  initializeResume: tool({
    description: 'Initialize a new resume with basic information',
    inputSchema: z.object({
      name: z.string(),
      title: z.string().optional(),
    }),
    execute: async ({ name, title }) => {
      try {
        const newResume = createResume(title || `${name}'s Resume`);
        
        // Update header block
        const headerBlock = newResume.blocks.find(b => b.type === 'header') as Block;
        if (headerBlock) {
          const headerData = headerBlock.data as HeaderBlockData;
          headerData.name = name;
          headerData.title = title || '';
        }

        const saved = saveResume(newResume);
        currentResumeId = saved.id;
        
        return {
          success: true,
          resumeId: saved.id,
          message: `Created resume: ${saved.title}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create resume',
        };
      }
    },
  }),

  /**
   * Add experience
   */
  addExperience: tool({
    description: 'Add work experience to the resume',
    inputSchema: z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context' };
      }

      try {
        const expBlock = createDefaultBlock('experience', resume.blocks.length);
        const expData = expBlock.data as ExperienceBlockData;
        
        Object.assign(expData, {
          ...data,
          id: expData.id,
        });

        resume.blocks.push(expBlock);
        const updated = saveResume(resume);
        
        return {
          success: true,
          message: `Added experience: ${data.position} at ${data.company}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to add experience',
        };
      }
    },
  }),

  /**
   * Get resume context
   */
  getResumeContext: tool({
    description: 'Get current resume state',
    inputSchema: z.object({}),
    execute: async () => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context' };
      }

      return {
        success: true,
        resume: {
          id: resume.id,
          title: resume.title,
          blockCount: resume.blocks.length,
        },
      };
    },
  }),
};
