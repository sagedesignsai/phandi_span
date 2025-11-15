import { type UIMessage, validateUIMessages, convertToModelMessages, streamText } from 'ai';
import { chatModel } from '@/lib/ai/provider';
import { resumeToolsWithArtifacts, setCurrentResumeContext } from '@/lib/ai/tools-with-artifacts';
import { getResumeCreationPrompt, getResumeEditingPrompt } from '@/lib/ai/prompts';
import { loadResumeToServer } from '@/lib/storage/resume-store-server';
import type { Resume } from '@/lib/models/resume';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      messages,
      resumeId,
      chatId,
      userId,
      useSpecialists = false,
      resume, // Optional: pass resume data for editing
    }: {
      messages: UIMessage[];
      resumeId?: string;
      chatId?: string;
      userId?: string;
      useSpecialists?: boolean;
      resume?: Resume; // Resume data passed from client for editing
    } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    // Validate and normalize messages
    const validatedMessages = await validateUIMessages({ messages });

    // Set resume context for tools
    setCurrentResumeContext(resumeId || null);

    // If we have resume data from the client, load it into server-side store
    // This allows tools to work with existing resume data when editing
    if (resume && resume.id) {
      loadResumeToServer(resume);
    }

    // Get system prompt based on whether we're editing or creating
    const systemPrompt = resumeId && resume
      ? getResumeEditingPrompt(resume)
      : getResumeCreationPrompt();

    // Stream response using streamText with tools
    const result = streamText({
      model: chatModel,
      messages: convertToModelMessages(validatedMessages),
      system: systemPrompt,
      tools: resumeToolsWithArtifacts,
      maxSteps: 10, // Max tool calls
      onStepFinish: (step) => {
        // Log step completion for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('[Step Finish]', {
            step: step.stepType,
            toolCalls: step.toolCalls?.length || 0,
          });
        }
      },
    });

    // Return UI message stream response
    return result.toUIMessageStreamResponse();
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

