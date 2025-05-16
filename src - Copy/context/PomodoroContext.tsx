
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PomodoroSettings, PomodoroStatus } from '@/types';

interface PomodoroContextType {
  status: PomodoroStatus;
  timeRemaining: number; // in seconds
  settings: PomodoroSettings;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  isActive: boolean;
  sessionCount: number;
  totalSessionsCompleted: number;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  // Get settings from localStorage or use defaults
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Failed to parse pomodoro settings', error);
      }
    }
    return {
      workDuration: 25, // 25 minutes
      breakDuration: 5, // 5 minutes
      longBreakDuration: 15, // 15 minutes
      sessionsBeforeLongBreak: 4,
    };
  });

  const [status, setStatus] = useState<PomodoroStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(settings.workDuration * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState<number>(() => {
    const saved = localStorage.getItem('totalPomodoroSessions');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Save total sessions to localStorage
  useEffect(() => {
    localStorage.setItem('totalPomodoroSessions', totalSessionsCompleted.toString());
  }, [totalSessionsCompleted]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      // Time is up
      if (status === 'work') {
        // Work session completed
        const newSessionCount = sessionCount + 1;
        setSessionCount(newSessionCount);
        setTotalSessionsCompleted(prev => prev + 1);
        
        // Check if it's time for a long break
        if (newSessionCount % settings.sessionsBeforeLongBreak === 0) {
          setStatus('longBreak');
          setTimeRemaining(settings.longBreakDuration * 60);
        } else {
          setStatus('break');
          setTimeRemaining(settings.breakDuration * 60);
        }
        
        // Send notification
        if (Notification.permission === 'granted') {
          new Notification('Pomodoro Timer', {
            body: 'Work session completed! Time for a break.',
            icon: '/favicon.ico'
          });
        }
      } else if (status === 'break' || status === 'longBreak') {
        // Break completed
        setStatus('work');
        setTimeRemaining(settings.workDuration * 60);
        
        // Send notification
        if (Notification.permission === 'granted') {
          new Notification('Pomodoro Timer', {
            body: 'Break time is over. Back to work!',
            icon: '/favicon.ico'
          });
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, status, settings, sessionCount]);

  const start = () => {
    // Request notification permission if not granted
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    if (status === 'idle') {
      setStatus('work');
      setTimeRemaining(settings.workDuration * 60);
    }
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setStatus('idle');
    setTimeRemaining(settings.workDuration * 60);
    setSessionCount(0);
  };

  const skip = () => {
    if (status === 'work') {
      // Skip to break
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      
      if (newSessionCount % settings.sessionsBeforeLongBreak === 0) {
        setStatus('longBreak');
        setTimeRemaining(settings.longBreakDuration * 60);
      } else {
        setStatus('break');
        setTimeRemaining(settings.breakDuration * 60);
      }
    } else {
      // Skip to work
      setStatus('work');
      setTimeRemaining(settings.workDuration * 60);
    }
  };

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Update current timer if idle
    if (status === 'idle') {
      setTimeRemaining((newSettings.workDuration || settings.workDuration) * 60);
    }
  };

  return (
    <PomodoroContext.Provider value={{ 
      status, 
      timeRemaining, 
      settings,
      updateSettings,
      start,
      pause,
      reset,
      skip,
      isActive,
      sessionCount,
      totalSessionsCompleted
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};
