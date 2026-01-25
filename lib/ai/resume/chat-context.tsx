'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import type { Resume } from '@/lib/models/resume';

interface ChatContextValue {
  chat: Chat<UIMessage>;
  resumeId: string | null;
  setResumeId: (id: string | null) => void;
  clearChat: () => void;
  onResumeUpdate?: (resume: Resume) => void;
  setOnResumeUpdate: (callback: ((resume: Resume) => void) | undefined) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat(resumeId?: string | null) {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/resume/chat',
      body: {
        resumeId: resumeId || undefined,
      },
    }),
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [resumeId, setResumeIdState] = useState<string | null>(null);
  const [chat, setChat] = useState(() => createChat());
  // Store the actual callback function in state
  const [updateHandler, setUpdateHandler] = useState<((resume: Resume) => void) | undefined>();

  const setResumeId = useCallback((id: string | null) => {
    setResumeIdState(id);
    setChat(createChat(id));
  }, []);

  const clearChat = useCallback(() => {
    setResumeIdState(null);
    setChat(createChat());
  }, []);

  // Stable trigger function that calls the current handler
  const onResumeUpdate = useCallback((resume: Resume) => {
    updateHandler?.(resume);
  }, [updateHandler]);

  // Safe setter that avoids React's functional update pitfall when storing functions
  const setOnResumeUpdate = useCallback((handler: ((resume: Resume) => void) | undefined) => {
    setUpdateHandler(() => handler);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chat,
        resumeId,
        setResumeId,
        clearChat,
        onResumeUpdate,
        setOnResumeUpdate,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useSharedChatContext must be used within a ChatProvider');
  }
  return context;
}

