import { createAgentUIStreamResponse } from 'ai';
import { autonomousResumeAgent } from '@/lib/ai/resume/agent';
import { setToolsResumeContext } from '@/lib/ai/resume/tools';
import { loadResumeToServer } from '@/lib/storage/resume-store-server';
import type { Resume } from '@/lib/models/resume';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      messages,
      resumeId,
      userId,
      jobDescription,
      targetRole,
      resume,
    }: {
      messages: any[];
      resumeId?: string;
      userId?: string;
      jobDescription?: string;
      targetRole?: string;
      resume?: Resume;
    } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    setToolsResumeContext(resumeId || null);

    if (resume?.id) {
      loadResumeToServer(resume);
    }

    return createAgentUIStreamResponse({
      agent: autonomousResumeAgent,
      uiMessages: messages,
      options: {
        resumeId,
        userId,
        jobDescription,
        targetRole,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

