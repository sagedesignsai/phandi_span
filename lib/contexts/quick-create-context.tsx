'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

interface QuickCreateContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  onActionClick: ((action: string) => void) | null;
  setOnActionClick: (callback: ((action: string) => void) | null) => void;
}

const QuickCreateContext = createContext<QuickCreateContextType | undefined>(undefined);

export function QuickCreateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [onActionClick, setOnActionClick] = useState<((action: string) => void) | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <QuickCreateContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        onActionClick,
        setOnActionClick
      }}
    >
      {children}
    </QuickCreateContext.Provider>
  );
}

export function useQuickCreate() {
  const context = useContext(QuickCreateContext);
  if (context === undefined) {
    throw new Error('useQuickCreate must be used within a QuickCreateProvider');
  }
  return context;
}