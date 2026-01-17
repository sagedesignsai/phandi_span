"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface HeaderConfig {
  title?: string | ReactNode;
  description?: string;
  actions?: ReactNode;
  showSidebarTrigger?: boolean;
  className?: string;
}

interface HeaderContextType {
  config: HeaderConfig;
  updateConfig: (newConfig: Partial<HeaderConfig>) => void;
  resetConfig: (defaultConfig?: HeaderConfig) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({
  children,
  initialConfig = {},
}: {
  children: ReactNode;
  initialConfig?: HeaderConfig;
}) {
  const [config, setConfig] = useState<HeaderConfig>(initialConfig);

  const updateConfig = useCallback((newConfig: Partial<HeaderConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  }, []);

  const resetConfig = useCallback((defaultConfig?: HeaderConfig) => {
    setConfig(defaultConfig || initialConfig);
  }, [initialConfig]);

  return (
    <HeaderContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

/**
 * Hook to access and modify header configuration
 * Use this in any page or component to configure the header dynamically
 *
 * @example
 * const { config, updateConfig } = useHeader();
 *
 * useEffect(() => {
 *   updateConfig({
 *     title: "My Page",
 *     description: "Page description",
 *     actions: <Button>Action</Button>,
 *   });
 * }, []);
 */
export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error(
      "useHeader must be used within a HeaderProvider. Make sure your layout wraps the page content with <HeaderProvider>"
    );
  }
  return context;
}

// Alias for convenience
export const useHeaderContext = useHeader;
