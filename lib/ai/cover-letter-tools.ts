import { tool } from 'ai';
import { z } from 'zod';
import { getResume } from '@/lib/storage/resume-store';
import { getJob, getCoverLetter, createCoverLetter } from '@/lib/supabase/jobs-client';
import type { Resume } from '@/lib/models/resume';

/**
 * AI SDK Tools for cover letter operations
 */
export const coverLetterTools = {
  /**
   * Get job details
   */
  getJobDetails: tool({
    description: 'Get details about a job posting by job ID',
    inputSchema: z.object({
      jobId: z.string().uuid().describe('The UUID of the job'),
    }),
    execute: async ({ jobId }) => {
      try {
        const job = await getJob(jobId);
        if (!job) {
          return {
            success: false,
            error: `Job with ID ${jobId} not found`,
          };
        }

        return {
          success: true,
          job: {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            requirements: job.requirements,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch job details',
        };
      }
    },
  }),

  /**
   * Get resume context
   */
  getResumeContext: tool({
    description: 'Get resume data from localStorage by resume ID',
    inputSchema: z.object({
      resumeId: z.string().describe('The ID of the resume'),
    }),
    execute: async ({ resumeId }) => {
      try {
        const resume = getResume(resumeId);
        if (!resume) {
          return {
            success: false,
            error: `Resume with ID ${resumeId} not found`,
          };
        }

        return {
          success: true,
          resume: {
            id: resume.id,
            title: resume.title,
            personalInfo: resume.personalInfo,
            sections: resume.sections.map((s) => ({
              type: s.type,
              title: s.title,
              itemCount: s.items.length,
            })),
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch resume',
        };
      }
    },
  }),

  /**
   * Generate cover letter
   */
  generateCoverLetter: tool({
    description: 'Generate a personalized cover letter for a job application',
    inputSchema: z.object({
      jobId: z.string().uuid().describe('The UUID of the job'),
      resumeId: z.string().describe('The ID of the resume'),
      template: z
        .enum(['professional', 'creative', 'concise'])
        .optional()
        .describe('Cover letter template style'),
    }),
    execute: async ({ jobId, resumeId, template = 'professional' }) => {
      try {
        // Get job and resume
        const job = await getJob(jobId);
        const resume = getResume(resumeId);

        if (!job) {
          return {
            success: false,
            error: `Job with ID ${jobId} not found`,
          };
        }

        if (!resume) {
          return {
            success: false,
            error: `Resume with ID ${resumeId} not found`,
          };
        }

        // This will be called by the AI agent to actually generate the content
        // For now, return a placeholder that the agent will fill
        return {
          success: true,
          message: 'Cover letter generation initiated. The AI will generate the content.',
          jobId,
          resumeId,
          template,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to initiate cover letter generation',
        };
      }
    },
  }),

  /**
   * Save cover letter
   */
  saveCoverLetter: tool({
    description: 'Save a generated cover letter to the database',
    inputSchema: z.object({
      userId: z.string().uuid().describe('The UUID of the user'),
      jobId: z.string().uuid().describe('The UUID of the job'),
      resumeId: z.string().describe('The ID of the resume'),
      content: z.string().min(100).describe('The cover letter content'),
      template: z.string().optional().describe('The template used'),
    }),
    execute: async ({ userId, jobId, resumeId, content, template = 'professional' }) => {
      try {
        const coverLetter = await createCoverLetter({
          user_id: userId,
          job_id: jobId,
          resume_id: resumeId,
          content,
          template,
        });

        return {
          success: true,
          coverLetterId: coverLetter.id,
          message: 'Cover letter saved successfully',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to save cover letter',
        };
      }
    },
  }),
};

