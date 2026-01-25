'use client'

import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageActions, MessageAction } from '@/components/ai-elements/message';
import { MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { CopyIcon, RefreshCcwIcon, SparklesIcon, FileTextIcon } from 'lucide-react';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import type { ToolUIPart } from 'ai';
import { Loader } from '@/components/ai-elements/loader';
import { RealtimeResumeViewer } from '@/components/resume/realtime-viewer';
import { cn } from '@/lib/utils';
import { setCurrentResumeContext } from '@/lib/ai/tools-with-artifacts';
import { getResume, saveResume } from '@/lib/storage/resume-store';
import type { Resume } from '@/lib/models/resume';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSharedChatContext } from '@/lib/ai/resume/chat-context';

interface ResumeChatProps {
  resumeId?: string;
  className?: string;
  onResumeUpdate?: (resume: Resume) => void;
  showPreview?: boolean;
}

/**
 * Enhanced Resume Chat Component
 * Follows AI SDK best practices with improved UI/UX
 */
export function ResumeChat({ resumeId, className, onResumeUpdate, showPreview = true }: ResumeChatProps) {
  const { chat, resumeId: contextResumeId, setResumeId, setOnResumeUpdate } = useSharedChatContext();
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, regenerate, stop } = useChat({ chat });

  // Track initial resumeId to avoid unnecessary chat recreation
  const initialResumeIdRef = React.useRef<string | undefined>(resumeId);

  // Store onResumeUpdate in ref to avoid dependency issues
  const onResumeUpdateRef = React.useRef(onResumeUpdate);
  onResumeUpdateRef.current = onResumeUpdate;

  // Set resume context when component mounts or resumeId prop changes
  useEffect(() => {
    if (resumeId) {
      const shouldRecreate = initialResumeIdRef.current !== resumeId;
      setResumeId(resumeId);
      initialResumeIdRef.current = resumeId;
      setCurrentResumeContext(resumeId);
      const resume = getResume(resumeId);
      if (resume && onResumeUpdateRef.current) {
        onResumeUpdateRef.current(resume);
      }
    } else {
      if (initialResumeIdRef.current) {
        setResumeId(null);
        initialResumeIdRef.current = undefined;
      }
      setCurrentResumeContext(null);
    }
  }, [resumeId, setResumeId]); // Removed onResumeUpdate from deps

  // Set resume update callback - use ref to avoid dependency issues
  useEffect(() => {
    if (onResumeUpdateRef.current) {
      setOnResumeUpdate((updatedResume: Resume) => {
        onResumeUpdateRef.current?.(updatedResume);
      });
    }
    return () => {
      setOnResumeUpdate(undefined);
    };
  }, [setOnResumeUpdate]); // Removed onResumeUpdate from deps

  // Handle tool results and save resumes
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    // Check for tool parts with resume updates
    for (const part of lastMessage.parts) {
      if (part.type.startsWith('tool-') && 'output' in part && part.output) {
        const result = part.output as { resume?: Resume; resumeId?: string; success?: boolean; message?: string };

        // If tool returned a resume, save it
        if (result.resume && result.success !== false) {
          saveResume(result.resume);

          // Only update resumeId if it's a new resume (not updating existing one)
          if (result.resumeId && !contextResumeId && !resumeId) {
            setResumeId(result.resumeId);
          }

          if (onResumeUpdateRef.current) {
            onResumeUpdateRef.current(result.resume);
          }
        }

        // If tool returned a resumeId but no resume object, load it
        if (result.resumeId && !result.resume && !contextResumeId && !resumeId) {
          const newResume = getResume(result.resumeId);
          if (newResume) {
            setResumeId(result.resumeId);
            if (onResumeUpdateRef.current) {
              onResumeUpdateRef.current(newResume);
            }
          }
        }
      }
    }
  }, [messages, resumeId, contextResumeId, setResumeId]); // Removed onResumeUpdate from deps

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          resumeId: contextResumeId || resumeId || undefined,
        },
      }
    );
    setInput('');
  };

  // Get sources count for current message
  const getSourcesCount = (message: typeof messages[0]) => {
    return message.parts.filter((part) => part.type === 'source-url' || part.type === 'source-document').length;
  };

  // Check if message has sources
  const hasSources = (message: typeof messages[0]) => {
    return getSourcesCount(message) > 0;
  };

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Real-time Resume Preview - Optional */}
      {showPreview && (
        <div className="border-b border-border p-4 bg-muted/30 overflow-y-auto max-h-96 shrink-0">
          <RealtimeResumeViewer onResumeUpdate={onResumeUpdate} />
        </div>
      )}

      {/* Chat Interface */}
      <div className="flex flex-1 flex-col min-h-0">
        <Conversation className="flex-1">
          <ConversationContent className="px-4 py-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6 px-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                  <div className="relative p-6 rounded-full bg-primary/5 border border-primary/20">
                    <SparklesIcon className="size-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-semibold text-foreground">
                    {resumeId ? 'Ready to Enhance Your Resume' : 'Start Building Your Resume'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {resumeId
                      ? "Tell me what you'd like to add or change, and I'll help you update it."
                      : "I'll help you create a professional resume. Tell me about yourself - your name, experience, education, or skills!"}
                  </p>
                </div>
                {!resumeId && (
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground mt-4">
                    <p className="font-medium mb-2">💡 Try saying:</p>
                    <div className="flex flex-col gap-2 items-center">
                      <div className="px-4 py-2 bg-muted rounded-lg text-left max-w-sm">
                        "My name is [Your Name], I'm a [Your Title]"
                      </div>
                      <div className="px-4 py-2 bg-muted rounded-lg text-left max-w-sm">
                        "Add my experience at [Company]"
                      </div>
                      <div className="px-4 py-2 bg-muted rounded-lg text-left max-w-sm">
                        "I have a [Degree] from [University]"
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Error Alert */}
                {status === 'error' && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      An error occurred. Please try again or rephrase your request.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Messages */}
                <div className="space-y-6">
                  {messages.map((message) => {
                    const messageSources = hasSources(message);
                    const isLastMessage = message.id === messages[messages.length - 1]?.id;
                    const isStreaming = status === 'streaming' && isLastMessage;

                    return (
                      <div key={message.id} className="space-y-3">
                        {/* Sources - Show at top of assistant messages */}
                        {message.role === 'assistant' && messageSources && (
                          <Sources>
                            <SourcesTrigger count={getSourcesCount(message)} />
                            <SourcesContent>
                              {message.parts
                                .filter((part) => part.type === 'source-url' || part.type === 'source-document')
                                .map((part, i) => {
                                  if (part.type === 'source-url') {
                                    return (
                                      <Source
                                        key={`${message.id}-source-${i}`}
                                        href={(part as any).url}
                                        title={(part as any).title || (part as any).url}
                                      />
                                    );
                                  }
                                  if (part.type === 'source-document') {
                                    return (
                                      <Source
                                        key={`${message.id}-source-${i}`}
                                        href={(part as any).url || (part as any).href}
                                        title={(part as any).title || 'Document'}
                                      />
                                    );
                                  }
                                  return null;
                                })}
                            </SourcesContent>
                          </Sources>
                        )}

                        {/* Message Parts */}
                        {message.parts.map((part, partIndex) => {
                          const isLastPart = partIndex === message.parts.length - 1;
                          const isPartStreaming = isStreaming && isLastPart && isLastMessage;

                          switch (part.type) {
                            case 'text':
                              const textContent = (part as any).text || '';
                              return (
                                <Fragment key={`${message.id}-${partIndex}`}>
                                  <Message from={message.role}>
                                    <MessageContent>
                                      <MessageResponse>{textContent}</MessageResponse>
                                    </MessageContent>
                                  </Message>
                                  {message.role === 'assistant' && isLastPart && (
                                    <MessageActions className="mt-2">
                                      <MessageAction
                                        onClick={() => regenerate()}
                                        label="Regenerate"
                                        tooltip="Regenerate response"
                                      >
                                        <RefreshCcwIcon className="size-3" />
                                      </MessageAction>
                                      <MessageAction
                                        onClick={() => navigator.clipboard.writeText(textContent)}
                                        label="Copy"
                                        tooltip="Copy to clipboard"
                                      >
                                        <CopyIcon className="size-3" />
                                      </MessageAction>
                                    </MessageActions>
                                  )}
                                </Fragment>
                              );

                            case 'reasoning':
                              return (
                                <Reasoning
                                  key={`${message.id}-${partIndex}`}
                                  className="w-full"
                                  isStreaming={isPartStreaming}
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>{(part as any).text}</ReasoningContent>
                                </Reasoning>
                              );

                            case 'source-url':
                            case 'source-document':
                              // Already handled above
                              return null;

                            default:
                              // Handle tool parts
                              if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
                                const toolPart = part as ToolUIPart & {
                                  toolName?: string;
                                  type: string;
                                };
                                const toolName = toolPart.toolName || toolPart.type.replace('tool-', '');

                                return (
                                  <Tool
                                    key={`${message.id}-${partIndex}`}
                                    defaultOpen={toolPart.state === 'output-error' || toolPart.state === 'output-available'}
                                  >
                                    <ToolHeader
                                      type={toolPart.type as any}
                                      state={toolPart.state}
                                      title={toolName}
                                    />
                                    <ToolContent>
                                      {toolPart.input !== undefined && (
                                        <ToolInput input={toolPart.input} />
                                      )}
                                      {(toolPart.output !== undefined || toolPart.errorText) && (
                                        <ToolOutput
                                          output={toolPart.output}
                                          errorText={toolPart.errorText}
                                        />
                                      )}
                                    </ToolContent>
                                  </Tool>
                                );
                              }
                              return null;
                          }
                        })}
                      </div>
                    );
                  })}

                  {/* Loading Indicator */}
                  {status === 'submitted' && (
                    <div className="flex justify-center py-4">
                      <Loader />
                    </div>
                  )}
                </div>
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4">
            <PromptInput onSubmit={handleSubmit} className="space-y-3" globalDrop multiple>
              <PromptInputBody>
                <PromptInputAttachments>
                  {(attachment) => <PromptInputAttachment data={attachment} />}
                </PromptInputAttachments>
                <PromptInputTextarea
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  placeholder={
                    resumeId
                      ? "What would you like to add or change in your resume?"
                      : "Tell me about yourself - your name, experience, education, or skills..."
                  }
                  className="min-h-[44px] max-h-32 resize-none"
                  disabled={status === 'streaming' || status === 'submitted'}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={!input.trim() && status !== 'streaming'}
                  status={status}
                  onClick={status === 'streaming' ? stop : undefined}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
