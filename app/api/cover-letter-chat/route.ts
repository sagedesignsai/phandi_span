import { type UIMessage, validateUIMessages } from 'ai';
import { createCoverLetterAgent } from '@/lib/ai/cover-letter-agent';
import { getCoverLetterServer, loadCoverLetterToServer } from '@/lib/storage/cover-letter-store-server';
import type { CoverLetter } from '@/lib/models/cover-letter';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      messages,
      coverLetterId,
      chatId,
      coverLetter: coverLetterData,
    }: {
      messages: UIMessage[];
      coverLetterId?: string;
      chatId?: string;
      coverLetter?: CoverLetter;
    } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    // Validate messages
    const validatedMessages = await validateUIMessages({ messages });

    // Load cover letter into server-side store if provided
    if (coverLetterData && coverLetterData.id) {
      loadCoverLetterToServer(coverLetterData);
    }

    // Get cover letter from server store
    const coverLetter = coverLetterId ? getCoverLetterServer(coverLetterId) : undefined;

    // Create agent
    const agent = createCoverLetterAgent(coverLetter);

    // Get latest message
    const latestMessage = validatedMessages[validatedMessages.length - 1];

    // Prepare context
    const memoryContext: Record<string, unknown> = {
      coverLetterId: coverLetterId || null,
      ...(chatId && { chatId }),
    };

    // Use agent's toUIMessageStream
    return agent.toUIMessageStream({
      message: latestMessage,
      context: memoryContext,
      maxRounds: 1,
      maxSteps: 15,
      onEvent: (event) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Cover Letter Agent Event]', {
            type: event.type,
          });
        }
      },
      onFinish: async ({ messages: finalMessages }) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Cover Letter Chat Completed]', {
            messageCount: finalMessages.length,
            coverLetterId,
            chatId,
          });
        }
      },
      sendReasoning: true,
      sendSources: false,
    });
  } catch (error) {
    console.error('Cover Letter Chat API error:', error);
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
