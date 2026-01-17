import { Agent } from '@ai-sdk-tools/agents';
import { InMemoryProvider } from '@ai-sdk-tools/memory/in-memory';
import { chatModel } from './provider';
import { coverLetterTools } from './cover-letter-tools';

/**
 * Cover Letter Agent Context
 */
export interface CoverLetterAgentContext extends Record<string, unknown> {
  userId?: string;
  jobId?: string;
  resumeId?: string;
  template?: string;
}

/**
 * Get system prompt for cover letter generation
 */
function getCoverLetterPrompt(): string {
  return `You are an expert cover letter writer specializing in creating personalized, compelling cover letters that help job seekers stand out.

YOUR MISSION:
Create professional, tailored cover letters that:
1. Highlight the candidate's relevant experience and skills
2. Demonstrate understanding of the job requirements
3. Show enthusiasm and cultural fit
4. Are concise yet impactful (typically 3-4 paragraphs)
5. Match the tone and style of the job posting

COVER LETTER STRUCTURE:
1. Opening (1 paragraph):
   - Express interest in the position
   - Mention where you found the job posting
   - Briefly state why you're a strong candidate

2. Body (1-2 paragraphs):
   - Connect your experience to job requirements
   - Highlight 2-3 key achievements or skills
   - Show how you can contribute to the company
   - Use specific examples from the resume

3. Closing (1 paragraph):
   - Reiterate interest
   - Express enthusiasm for the opportunity
   - Professional sign-off

WRITING GUIDELINES:
- Be specific: Reference actual skills, experiences, and achievements from the resume
- Be authentic: Write in a professional but genuine voice
- Be concise: Aim for 250-400 words
- Be relevant: Focus on what matters most for THIS specific job
- Avoid clichés: Use original, impactful language
- Match tone: If job posting is formal, be formal; if casual, be slightly more relaxed

TEMPLATE STYLES:
- Professional: Traditional, formal tone suitable for corporate roles
- Creative: More engaging, storytelling approach for creative industries
- Concise: Brief, direct, and to-the-point for busy recruiters

PROCESS:
1. Use getJobDetails to understand the job requirements
2. Use getResumeContext to understand the candidate's background
3. Analyze the match between job and resume
4. Generate a personalized cover letter
5. Use saveCoverLetter to store it

Remember: A great cover letter tells a story about why THIS person is perfect for THIS job. Make it compelling!`;
}

/**
 * Create Cover Letter Agent
 */
export function createCoverLetterAgent(
  userId?: string,
  jobId?: string,
  resumeId?: string,
  template: string = 'professional'
): Agent<CoverLetterAgentContext> {
  return new Agent<CoverLetterAgentContext>({
    name: 'Cover Letter Writer',
    model: chatModel,
    instructions: (context) => {
      let baseInstructions = getCoverLetterPrompt();

      if (context?.userId) {
        baseInstructions += `\n\nUser ID: ${context.userId}`;
      }
      if (context?.jobId) {
        baseInstructions += `\n\nJob ID: ${context.jobId}`;
      }
      if (context?.resumeId) {
        baseInstructions += `\n\nResume ID: ${context.resumeId}`;
      }
      if (context?.template) {
        baseInstructions += `\n\nTemplate Style: ${context.template}`;
      }

      baseInstructions += `\n\nWORKFLOW:
1. First, use getJobDetails to fetch the job information
2. Then, use getResumeContext to get the resume data
3. Analyze the job requirements and match them with the candidate's experience
4. Generate a compelling, personalized cover letter
5. Use saveCoverLetter to save the generated cover letter

Be thorough in your analysis and create a cover letter that truly connects the candidate's experience to the job requirements.`;

      return baseInstructions;
    },
    tools: coverLetterTools,
    maxTurns: 10,
    memory: {
      provider: new InMemoryProvider(),
      workingMemory: {
        enabled: true,
        scope: 'chat',
      },
      history: {
        enabled: true,
        limit: 15,
      },
    },
    onEvent: (event) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Cover Letter Agent Event]', {
          type: event.type,
        });
      }
    },
  });
}

