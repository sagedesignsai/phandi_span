"use client";

import React, { Fragment, useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { useCoverLetterChatContext } from '@/lib/contexts/cover-letter-chat-context';
import {
  Conversation,
  ConversationContent,
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
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { CopyIcon, RefreshCcwIcon, SparklesIcon } from 'lucide-react';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import type { ToolUIPart } from 'ai';
import { Loader } from '@/components/ai-elements/loader';
import { cn } from '@/lib/utils';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { getCoverLetter, saveCoverLetter } from '@/lib/storage/cover-letter-store';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface CoverLetterChatProps {
  coverLetterId?: string;
  className?: string;
  onCoverLetterUpdate?: (coverLetter: CoverLetter) => void;
}

export function CoverLetterChat({
  coverLetterId,
  className,
  onCoverLetterUpdate,
}: CoverLetterChatProps) {
  const { chat, coverLetterId: contextCoverLetterId, setCoverLetterId, setOnCoverLetterUpdate } =
    useCoverLetterChatContext();
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, regenerate, stop } = useChat({ chat });

  const initialCoverLetterIdRef = React.useRef<string | undefined>(coverLetterId);
  const onCoverLetterUpdateRef = React.useRef(onCoverLetterUpdate);
  onCoverLetterUpdateRef.current = onCoverLetterUpdate;

  // Set cover letter context
  useEffect(() => {
    if (coverLetterId) {
      const shouldRecreate = initialCoverLetterIdRef.current !== coverLetterId;
      setCoverLetterId(coverLetterId, shouldRecreate);
      initialCoverLetterIdRef.current = coverLetterId;
      
      const coverLetter = getCoverLetter(coverLetterId);
      if (coverLetter && onCoverLetterUpdateRef.current) {
        onCoverLetterUpdateRef.current(coverLetter);
      }
    } else {
      if (initialCoverLetterIdRef.current) {
        setCoverLetterId(null, true);
        initialCoverLetterIdRef.current = undefined;
      }
    }
  }, [coverLetterId, setCoverLetterId]);

  // Set update callback
  useEffect(() => {
    if (onCoverLetterUpdateRef.current) {
      setOnCoverLetterUpdate((updatedCoverLetter: CoverLetter) => {
        onCoverLetterUpdateRef.current?.(updatedCoverLetter);
      });
    }
    return () => {
      setOnCoverLetterUpdate(undefined);
    };
  }, [setOnCoverLetterUpdate]);

  // Handle tool results
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    for (const part of lastMessage.parts) {
      if (part.type.startsWith('tool-') && 'output' in part && part.output) {
        const result = part.output as {
          coverLetter?: CoverLetter;
          success?: boolean;
        };

        if (result.coverLetter && result.success !== false) {
          saveCoverLetter(result.coverLetter);
          if (onCoverLetterUpdateRef.current) {
            onCoverLetterUpdateRef.current(result.coverLetter);
          }
        }
      }
    }
  }, [messages]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) return;

    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          coverLetterId: contextCoverLetterId || coverLetterId || undefined,
        },
      }
    );
    setInput('');
  };

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
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
                    {coverLetterId ? 'Improve Your Cover Letter' : 'Create Your Cover Letter'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {coverLetterId
                      ? "Ask me to improve specific sections, adjust the tone, or make it more compelling."
                      : "I'll help you create a personalized cover letter. Tell me about the job you're applying for!"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {status === 'error' && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      An error occurred. Please try again or rephrase your request.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  {messages.map((message) => {
                    const isLastMessage = message.id === messages[messages.length - 1]?.id;
                    const isStreaming = status === 'streaming' && isLastMessage;

                    return (
                      <div key={message.id} className="space-y-3">
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

                            default:
                              if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
                                const toolPart = part as ToolUIPart & {
                                  toolName?: string;
                                  type: string;
                                };
                                const toolName = toolPart.toolName || toolPart.type.replace('tool-', '');

                                return (
                                  <Tool
                                    key={`${message.id}-${partIndex}`}
                                    defaultOpen={
                                      toolPart.state === 'output-error' ||
                                      toolPart.state === 'output-available'
                                    }
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
                    coverLetterId
                      ? "How can I improve this cover letter?"
                      : "Tell me about the job you're applying for..."
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
