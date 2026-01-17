import { ToolLoopAgent, stepCountIs } from 'ai';
import { z } from 'zod';
import { chatModel } from './provider';
import { coverLetterTools } from './cover-letter-tools';
import {
  getCoverLetterCreationPrompt,
  getCoverLetterEditingPrompt,
  getTemplatePrompt,
} from './cover-letter-prompts';
import type { CoverLetter, CoverLetterTemplate } from '@/lib/models/cover-letter';

/**
 * Cover Letter Agent Call Options
 */
const coverLetterCallOptionsSchema = z.object({
  coverLetterId: z.string().optional(),
  jobId: z.string().uuid().optional(),
  resumeId: z.string().optional(),
  template: z.enum(['professional', 'creative', 'concise', 'technical']).default('professional'),
  mode: z.enum(['create', 'edit']).default('create'),
});

type CoverLetterCallOptions = z.infer<typeof coverLetterCallOptionsSchema>;

/**
 * Create Cover Letter Agent using ToolLoopAgent
 */
export function createCoverLetterAgent(coverLetter?: CoverLetter) {
  const isEditMode = !!coverLetter;

  return new ToolLoopAgent({
    name: isEditMode ? 'Cover Letter Editor' : 'Cover Letter Writer',
    model: chatModel,
    instructions: (context) => {
      const options = context as CoverLetterCallOptions;
      
      let baseInstructions = isEditMode && coverLetter
        ? getCoverLetterEditingPrompt(coverLetter)
        : getCoverLetterCreationPrompt();

      // Add template-specific instructions
      if (options?.template) {
        baseInstructions += '\n\n' + getTemplatePrompt(options.template);
      }

      // Add context information
      if (options?.coverLetterId) {
        baseInstructions += `\n\nCover Letter ID: ${options.coverLetterId}`;
      }
      if (options?.jobId) {
        baseInstructions += `\nJob ID: ${options.jobId}`;
      }
      if (options?.resumeId) {
        baseInstructions += `\nResume ID: ${options.resumeId}`;
      }

      // Add workflow guidance
      if (!isEditMode) {
        baseInstructions += `\n\nWORKFLOW:
1. Use getJobDetails to fetch job information
2. Use getResumeContext to get resume data
3. Use extractKeywords to identify important terms
4. Generate personalized cover letter matching template style
5. Use validateStructure to check format
6. Use checkLength to ensure appropriate length
7. Use saveCoverLetter to save the final version

Be thorough and create a compelling, personalized cover letter.`;
      }

      return baseInstructions;
    },
    tools: coverLetterTools,
    stopWhen: stepCountIs(15),
    callOptionsSchema: coverLetterCallOptionsSchema,
    prepareCall: ({ options, ...settings }) => ({
      ...settings,
      // Can add dynamic model selection or other settings here
    }),
  });
}

/**
 * Export type for UI integration
 */
export type CoverLetterAgent = ReturnType<typeof createCoverLetterAgent>;

