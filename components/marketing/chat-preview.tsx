"use client";

import React from 'react';
import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatPreviewProps {
  className?: string;
}

/**
 * Non-interactive preview of the chat interface
 * Shows a sample conversation to showcase the AI chat feature
 */
export function ChatPreview({ className }: ChatPreviewProps) {
  const sampleMessages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: "Hi! I'm Phandi, your AI resume assistant. I'll help you create a professional resume. What's your name, and what type of position are you looking for?",
    },
    {
      id: '2',
      role: 'user' as const,
      content: "My name is Sarah Chen, and I'm looking for a Software Engineer position.",
    },
    {
      id: '3',
      role: 'assistant' as const,
      content: "Great to meet you, Sarah! Let's build an impressive resume for your Software Engineer role. What's your email address?",
    },
    {
      id: '4',
      role: 'user' as const,
      content: 'sarah.chen@email.com',
    },
    {
      id: '5',
      role: 'assistant' as const,
      content: "Perfect! I've added your contact information. Now, tell me about your most recent job. What was your job title?",
    },
  ];

  return (
    <div className={cn('flex flex-col h-full bg-background border rounded-lg overflow-hidden', className)}>
      {/* Chat Interface */}
      <div className="flex flex-1 flex-col min-h-0">
        <Conversation className="flex-1">
          <ConversationContent className="px-4 py-6 space-y-6">
            {sampleMessages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <MessageResponse>{message.content}</MessageResponse>
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
        </Conversation>

        {/* Input - Disabled */}
        <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 opacity-60">
          <div className="p-4">
            <PromptInput className="space-y-3 pointer-events-none">
              <PromptInputBody>
                <PromptInputTextarea
                  value=""
                  placeholder="Tell me about yourself - your name, experience, education, or skills..."
                  className="min-h-[44px] max-h-32 resize-none"
                  disabled
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputSubmit disabled status="ready" />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}

