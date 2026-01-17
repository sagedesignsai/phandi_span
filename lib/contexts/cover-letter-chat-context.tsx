'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import type { CoverLetter } from '@/lib/models/cover-letter';

interface CoverLetterChatContextValue {
  chat: Chat<UIMessage>;
  coverLetterId: string | null;
  setCoverLetterId: (id: string | null, recreateChat?: boolean) => void;
  chatId: string | null;
  setChatId: (id: string | null) => void;
  clearChat: () => void;
  onCoverLetterUpdate?: (coverLetter: CoverLetter) => void;
  setOnCoverLetterUpdate: (callback: ((coverLetter: CoverLetter) => void) | undefined) => void;
}

const CoverLetterChatContext = createContext<CoverLetterChatContextValue | undefined>(undefined);

function createChat(coverLetterId?: string | null, chatId?: string | null) {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/cover-letter-chat',
      body: {
        coverLetterId: coverLetterId || undefined,
        chatId: chatId || undefined,
      },
    }),
  });
}

export function CoverLetterChatProvider({ children }: { children: ReactNode }) {
  const [coverLetterId, setCoverLetterIdState] = useState<string | null>(null);
  const [chatId, setChatIdState] = useState<string | null>(null);
  const [onCoverLetterUpdate, setOnCoverLetterUpdateState] = useState<
    ((coverLetter: CoverLetter) => void) | undefined
  >(undefined);
  const [chat, setChat] = useState(() => createChat());

  const setCoverLetterId = useCallback(
    (id: string | null, recreateChat: boolean = true) => {
      setCoverLetterIdState(id);
      if (recreateChat) {
        setChat(createChat(id, chatId));
      }
    },
    [chatId]
  );

  const setChatId = useCallback(
    (id: string | null) => {
      setChatIdState(id);
      setChat(createChat(coverLetterId, id));
    },
    [coverLetterId]
  );

  const setOnCoverLetterUpdate = useCallback(
    (callback: ((coverLetter: CoverLetter) => void) | undefined) => {
      setOnCoverLetterUpdateState(() => callback);
    },
    []
  );

  const clearChat = useCallback(() => {
    setCoverLetterIdState(null);
    setChatIdState(null);
    setChat(createChat());
  }, []);

  const contextValue = React.useMemo(
    () => ({
      chat,
      coverLetterId,
      setCoverLetterId,
      chatId,
      setChatId,
      clearChat,
      onCoverLetterUpdate,
      setOnCoverLetterUpdate,
    }),
    [
      chat,
      coverLetterId,
      setCoverLetterId,
      chatId,
      setChatId,
      clearChat,
      onCoverLetterUpdate,
      setOnCoverLetterUpdate,
    ]
  );

  return (
    <CoverLetterChatContext.Provider value={contextValue}>
      {children}
    </CoverLetterChatContext.Provider>
  );
}

export function useCoverLetterChatContext() {
  const context = useContext(CoverLetterChatContext);
  if (!context) {
    throw new Error('useCoverLetterChatContext must be used within a CoverLetterChatProvider');
  }
  return context;
}
