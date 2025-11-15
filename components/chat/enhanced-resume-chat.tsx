"use client";

import { useChat } from '@ai-sdk/react';
import { useSharedChatContext } from '@/lib/ai/chat-context';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputHeader,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
} from '@/components/ai-elements/prompt-input';
import { Tool } from '@/components/ai-elements/tool';
import { Reasoning } from '@/components/ai-elements/reasoning';
import { Sources } from '@/components/ai-elements/sources';
import { Loader } from '@/components/ai-elements/loader';
import { RealtimeResumeViewer } from '@/components/resume/realtime-viewer';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { setCurrentResumeContext } from '@/lib/ai/tools-with-artifacts';
import { getResume, saveResume } from '@/lib/storage/resume-store';
import type { Resume } from '@/lib/models/resume';

interface EnhancedResumeChatProps {
  resumeId?: string;
  className?: string;
  onResumeUpdate?: (resume: Resume) => void;
}

/**
 * Enhanced Resume Chat Component
 * Uses shared chat context and artifacts for real-time updates
 */
export function EnhancedResumeChat({
  resumeId,
  className,
  onResumeUpdate,
}: EnhancedResumeChatProps) {
  const { chat, setResumeId, setOnResumeUpdate } = useSharedChatContext();
  const { messages, input, handleInputChange, handleSubmit, isLoading, status } = useChat({
    chat,
  });

  // Set resume context when component mounts or resumeId changes
  useEffect(() => {
    if (resumeId) {
      setResumeId(resumeId);
      setCurrentResumeContext(resumeId);
      const resume = getResume(resumeId);
      if (resume && onResumeUpdate) {
        onResumeUpdate(resume);
      }
    } else {
      setResumeId(null);
      setCurrentResumeContext(null);
    }
  }, [resumeId, setResumeId, onResumeUpdate]);

  // Set resume update callback
  useEffect(() => {
    if (onResumeUpdate) {
      setOnResumeUpdate(onResumeUpdate);
    }
    return () => {
      setOnResumeUpdate(undefined);
    };
  }, [onResumeUpdate, setOnResumeUpdate]);

  // Handle tool results and save resumes
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.toolInvocations) {
      for (const toolInvocation of lastMessage.toolInvocations) {
        if (toolInvocation.state === 'result' && toolInvocation.result) {
          const result = toolInvocation.result as { resume?: Resume; resumeId?: string };

          // If tool returned a resume, save it
          if (result.resume) {
            saveResume(result.resume);
            if (onResumeUpdate) {
              onResumeUpdate(result.resume);
            }
          }

          // If tool returned a resumeId, load and save it
          if (result.resumeId && !resumeId) {
            const newResume = getResume(result.resumeId);
            if (newResume && onResumeUpdate) {
              onResumeUpdate(newResume);
            }
          }
        }
      }
    }
  }, [messages, resumeId, onResumeUpdate]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Real-time Resume Preview */}
      <div className="border-b border-border p-4 bg-muted/30 overflow-y-auto max-h-96">
        <RealtimeResumeViewer onResumeUpdate={onResumeUpdate} />
      </div>

      {/* Chat Interface */}
      <div className="flex flex-1 flex-col min-h-0">
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Start creating your resume"
                description="Tell me about yourself and I'll help you build a professional resume."
              />
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.parts.map((part, index) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <MessageResponse key={index}>
                              {part.text}
                            </MessageResponse>
                          );
                        case 'reasoning':
                          return (
                            <Reasoning key={index}>
                              {part.content}
                            </Reasoning>
                          );
                        case 'tool-call':
                          return (
                            <Tool
                              key={index}
                              type={part.toolName}
                              state="input-available"
                              input={part.args}
                            />
                          );
                        case 'tool-result':
                          return (
                            <Tool
                              key={index}
                              type={part.toolName}
                              state="output-available"
                              output={part.result}
                            />
                          );
                        case 'source':
                          return (
                            <Sources key={index}>
                              {part.items}
                            </Sources>
                          );
                        default:
                          return null;
                      }
                    })}
                    {message.toolInvocations?.map((toolInvocation, idx) => (
                      <Tool
                        key={idx}
                        type={toolInvocation.toolName}
                        state={toolInvocation.state}
                        input={toolInvocation.args}
                        output={toolInvocation.result}
                        errorText={toolInvocation.error?.message}
                      />
                    ))}
                  </MessageContent>
                </Message>
              ))
            )}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
        </Conversation>

        {/* Input */}
        <div className="border-t border-border p-4">
          <PromptInput
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            className="relative"
          >
            <PromptInputHeader>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionMenuItem onSelect={() => alert('File upload coming soon')}>
                      Upload Documents
                    </PromptInputActionMenuItem>
                    <PromptInputActionMenuItem onSelect={() => alert('Template selection coming soon')}>
                      Use Template
                    </PromptInputActionMenuItem>
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
              </PromptInputTools>
            </PromptInputHeader>
            <PromptInputTextarea
              placeholder="Tell me about your experience, education, or skills..."
              disabled={isLoading}
            />
            <PromptInputFooter>
              <div className="flex items-center gap-2">
                {status === 'streaming' && <Loader />}
                <PromptInputSubmit
                  status={status}
                  disabled={isLoading || !input.trim()}
                />
              </div>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

