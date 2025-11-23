'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import type { Resume } from '@/lib/models/resume';

interface ChatContextValue {
  chat: Chat<UIMessage>;
  resumeId: string | null;
  setResumeId: (id: string | null, recreateChat?: boolean) => void;
  chatId: string | null;
  setChatId: (id: string | null) => void;
  clearChat: () => void;
  onResumeUpdate?: (resume: Resume) => void;
  setOnResumeUpdate: (callback: ((resume: Resume) => void) | undefined) => void;
  useSpecialists: boolean;
  setUseSpecialists: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat(resumeId?: string | null, chatId?: string | null, useSpecialists?: boolean) {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        resumeId: resumeId || undefined,
        chatId: chatId || undefined,
        useSpecialists: useSpecialists || false,
      },
    }),
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [resumeId, setResumeIdState] = useState<string | null>(null);
  const [chatId, setChatIdState] = useState<string | null>(null);
  const [useSpecialists, setUseSpecialistsState] = useState<boolean>(false);
  const [onResumeUpdate, setOnResumeUpdateState] = useState<((resume: Resume) => void) | undefined>(undefined);
  const [chat, setChat] = useState(() => createChat());

  const setResumeId = useCallback((id: string | null, recreateChat: boolean = true) => {
    setResumeIdState(id);
    // Only recreate chat if explicitly requested (e.g., on initial mount)
    // This prevents clearing messages when resume is updated during conversation
    if (recreateChat) {
      setChat(createChat(id, chatId, useSpecialists));
    }
  }, [chatId, useSpecialists]);

  const setChatId = useCallback((id: string | null) => {
    setChatIdState(id);
    // Recreate chat with new chatId
    setChat(createChat(resumeId, id, useSpecialists));
  }, [resumeId, useSpecialists]);

  const setUseSpecialists = useCallback((value: boolean) => {
    setUseSpecialistsState(value);
    // Recreate chat with new specialist setting
    setChat(createChat(resumeId, chatId, value));
  }, [resumeId, chatId]);

  const setOnResumeUpdate = useCallback((callback: ((resume: Resume) => void) | undefined) => {
    setOnResumeUpdateState(() => callback);
  }, []);

  const clearChat = useCallback(() => {
    setResumeIdState(null);
    setChatIdState(null);
    setChat(createChat());
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      chat,
      resumeId,
      setResumeId,
      chatId,
      setChatId,
      clearChat,
      onResumeUpdate,
      setOnResumeUpdate,
      useSpecialists,
      setUseSpecialists,
    }),
    [chat, resumeId, setResumeId, chatId, setChatId, clearChat, onResumeUpdate, setOnResumeUpdate, useSpecialists, setUseSpecialists]
  );

  return (
    <ChatContext.Provider value={contextValue}>
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

