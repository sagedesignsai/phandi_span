import { type UIMessage, validateUIMessages } from 'ai';
import { createResumeAgent, createResumeAgents } from '@/lib/ai/resume-agent';
import { setCurrentResumeContext } from '@/lib/ai/tools-with-artifacts';
import { loadResumeToServer } from '@/lib/storage/resume-store-server';
import { getInitialGreeting } from '@/lib/ai/prompts';
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

    // Create the appropriate agent
    const agent = useSpecialists
      ? createResumeAgents().orchestrator
      : createResumeAgent(resumeId || null);

    // Get the latest user message (agent handles conversation history via memory)
    const latestMessage = validatedMessages[validatedMessages.length - 1];

    // Ensure chatId is available for memory persistence
    const memoryContext: Record<string, unknown> = {
      resumeId: resumeId || null,
      ...(userId && { userId }),
      ...(chatId && { chatId }), // Critical for memory to persist conversation history
    };

    // Use agent's toUIMessageStream method for proper agentic behavior
    // Per AI SDK Tools Agents docs: agent automatically loads conversation history from memory
    return agent.toUIMessageStream({
      message: latestMessage,
      context: memoryContext,
      maxRounds: useSpecialists ? 3 : 1, // Allow handoffs in specialist mode
      maxSteps: 15, // Maximum tool calls per agent round
      onEvent: (event) => {
        // Log agent events for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('[Agent Event]', {
            type: event.type,
            ...(event.type === 'agent-handoff' && {
              from: event.from,
              to: event.to,
            }),
            ...(event.type === 'agent-start' && {
              agent: event.agent,
              round: event.round,
            }),
          });
        }
      },
      onFinish: async ({ messages: finalMessages }) => {
        // Log completion for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('[Chat Completed]', {
            messageCount: finalMessages.length,
            resumeId,
            chatId,
          });
        }
      },
      sendReasoning: true, // Show agent's thinking process
      sendSources: false,
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

