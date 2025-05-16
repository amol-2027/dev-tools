
import React, { createContext, useContext, useState } from 'react';

// Define the tools available in our application
export type ToolName = 
  | 'tasks' 
  | 'pomodoro' 
  | 'notes' 
  | 'markdown' 
  | 'calendar' 
  | 'timezone' 
  | 'json' 
  | 'mindmap'
  | 'snippets'
  | 'regex'
  | 'playground'
  | 'api'
  | 'git'
  | 'cheatsheet'
  | 'clipboard'
  | 'colors'
  | 'components'
  | 'logs'
  | 'dashboard';

interface NavigationContextType {
  activeTool: ToolName;
  setActiveTool: (tool: ToolName) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTool, setActiveTool] = useState<ToolName>('dashboard');

  return (
    <NavigationContext.Provider value={{ activeTool, setActiveTool }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
