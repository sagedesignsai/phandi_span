"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatPanelContextType {
  showChatPanel: boolean;
  setShowChatPanel: (show: boolean) => void;
}

const ChatPanelContext = createContext<ChatPanelContextType | undefined>(undefined);

export function ChatPanelProvider({ children }: { children: ReactNode }) {
  const [showChatPanel, setShowChatPanel] = useState(false);

  return (
    <ChatPanelContext.Provider value={{ showChatPanel, setShowChatPanel }}>
      {children}
    </ChatPanelContext.Provider>
  );
}

export function useChatPanel() {
  const context = useContext(ChatPanelContext);
  if (context === undefined) {
    throw new Error('useChatPanel must be used within a ChatPanelProvider');
  }
  return context;
}
