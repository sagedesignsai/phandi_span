import { tool } from 'ai';
import { z } from 'zod';
import { getResume } from '@/lib/storage/resume-store';
import { getCoverLetterServer, saveCoverLetterServer } from '@/lib/storage/cover-letter-store-server';
import { getJob } from '@/lib/supabase/jobs-client';

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
    description: 'Save a generated cover letter',
    inputSchema: z.object({
      coverLetterId: z.string().describe('The ID of the cover letter'),
      content: z.string().min(100).describe('The cover letter content'),
      status: z.enum(['draft', 'generated', 'edited', 'finalized']).optional(),
    }),
    execute: async ({ coverLetterId, content, status }) => {
      try {
        const coverLetter = getCoverLetterServer(coverLetterId);
        if (!coverLetter) {
          return {
            success: false,
            error: `Cover letter with ID ${coverLetterId} not found`,
          };
        }

        coverLetter.content = content;
        if (status) {
          coverLetter.status = status;
        }

        const updated = saveCoverLetterServer(coverLetter);

        return {
          success: true,
          coverLetter: updated,
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

  /**
   * Analyze tone match between job and cover letter
   */
  analyzeToneMatch: tool({
    description: 'Analyze if cover letter tone matches job posting tone',
    inputSchema: z.object({
      jobId: z.string().uuid().describe('The UUID of the job'),
      coverLetterId: z.string().describe('The ID of the cover letter'),
    }),
    execute: async ({ jobId, coverLetterId }) => {
      try {
        const job = await getJob(jobId);
        const coverLetter = getCoverLetterServer(coverLetterId);

        if (!job || !coverLetter) {
          return {
            success: false,
            error: 'Job or cover letter not found',
          };
        }

        // Return data for AI to analyze
        return {
          success: true,
          jobDescription: job.description,
          coverLetterContent: coverLetter.content,
          message: 'Analyze the tone of both texts and provide a match score (0-10) with specific feedback',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to analyze tone',
        };
      }
    },
  }),

  /**
   * Extract keywords from job description
   */
  extractKeywords: tool({
    description: 'Extract important keywords from job description',
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
          jobDescription: job.description,
          requirements: job.requirements,
          message: 'Extract key skills, qualifications, and important terms from this job posting',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to extract keywords',
        };
      }
    },
  }),

  /**
   * Check cover letter length
   */
  checkLength: tool({
    description: 'Check if cover letter length is appropriate (250-400 words)',
    inputSchema: z.object({
      coverLetterId: z.string().describe('The ID of the cover letter'),
    }),
    execute: async ({ coverLetterId }) => {
      try {
        const coverLetter = getCoverLetterServer(coverLetterId);
        if (!coverLetter) {
          return {
            success: false,
            error: `Cover letter with ID ${coverLetterId} not found`,
          };
        }

        const wordCount = coverLetter.metadata.wordCount || 0;
        const isAppropriate = wordCount >= 250 && wordCount <= 400;

        return {
          success: true,
          wordCount,
          characterCount: coverLetter.metadata.characterCount || 0,
          isAppropriate,
          feedback: isAppropriate
            ? 'Length is appropriate'
            : wordCount < 250
            ? `Too short (${wordCount} words). Add more detail about relevant experience.`
            : `Too long (${wordCount} words). Remove less relevant information.`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to check length',
        };
      }
    },
  }),

  /**
   * Validate cover letter structure
   */
  validateStructure: tool({
    description: 'Validate cover letter has proper structure (opening, body, closing)',
    inputSchema: z.object({
      coverLetterId: z.string().describe('The ID of the cover letter'),
    }),
    execute: async ({ coverLetterId }) => {
      try {
        const coverLetter = getCoverLetterServer(coverLetterId);
        if (!coverLetter) {
          return {
            success: false,
            error: `Cover letter with ID ${coverLetterId} not found`,
          };
        }

        const paragraphs = coverLetter.content.split('\n\n').filter(p => p.trim());
        const hasProperLength = paragraphs.length >= 3 && paragraphs.length <= 5;

        return {
          success: true,
          paragraphCount: paragraphs.length,
          hasProperLength,
          content: coverLetter.content,
          message: 'Analyze if this cover letter has: 1) Clear opening paragraph, 2) Body paragraph(s) with relevant experience, 3) Strong closing paragraph',
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to validate structure',
        };
      }
    },
  }),

  /**
   * Suggest improvements
   */
  suggestImprovements: tool({
    description: 'Suggest specific improvements for the cover letter',
    inputSchema: z.object({
      coverLetterId: z.string().describe('The ID of the cover letter'),
      focusArea: z.enum(['opening', 'body', 'closing', 'tone', 'overall']).optional(),
    }),
    execute: async ({ coverLetterId, focusArea }) => {
      try {
        const coverLetter = getCoverLetterServer(coverLetterId);
        if (!coverLetter) {
          return {
            success: false,
            error: `Cover letter with ID ${coverLetterId} not found`,
          };
        }

        return {
          success: true,
          content: coverLetter.content,
          template: coverLetter.template,
          wordCount: coverLetter.metadata.wordCount,
          focusArea: focusArea || 'overall',
          message: `Provide specific, actionable improvements for the ${focusArea || 'overall'} cover letter. Include examples of what to change.`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to suggest improvements',
        };
      }
    },
  }),
};

