import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserMode } from '../types';

interface ModeContextType {
  userMode: UserMode;
  toggleMode: () => void;
  isPremium: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
}

export function ModeProvider({ children }: ModeProviderProps) {
  // Only render in development mode
  const isDevelopment = import.meta.env.DEV;
  
  const [userMode, setUserMode] = useState<UserMode>(() => {
    // Load from localStorage or default to 'free'
    const stored = localStorage.getItem('userMode');
    return (stored as UserMode) || 'free';
  });

  // Persist mode changes to localStorage
  useEffect(() => {
    localStorage.setItem('userMode', userMode);
  }, [userMode]);

  const toggleMode = () => {
    setUserMode(prev => prev === 'free' ? 'premium' : 'free');
  };

  const isPremium = userMode === 'premium';

  const contextValue: ModeContextType = {
    userMode,
    toggleMode,
    isPremium,
  };

  // In production, just render children without the mode context
  if (!isDevelopment) {
    return <>{children}</>;
  }

  return (
    <ModeContext.Provider value={contextValue}>
      {children}
    </ModeContext.Provider>
  );
}

export function useModeContext(): ModeContextType {
  const context = useContext(ModeContext);
  
  // In production, return default values
  if (!import.meta.env.DEV) {
    return {
      userMode: 'free',
      toggleMode: () => {},
      isPremium: false,
    };
  }
  
  if (context === undefined) {
    throw new Error('useModeContext must be used within a ModeProvider');
  }
  
  return context;
}