
// Task Types
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  progress: number; // 0-100
  dueDate: Date | null;
  createdAt: Date;
  tags: string[];
}

// Note Types
export interface Note {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  createdAt: Date;
}

// Pomodoro Types
export interface PomodoroSettings {
  workDuration: number; // minutes
  breakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsBeforeLongBreak: number;
}

export type PomodoroStatus = 'idle' | 'work' | 'break' | 'longBreak';

// Markdown Types
export interface MarkdownDocument {
  id: string;
  title: string;
  content: string;
  lastEdited: Date;
  wordCount: number;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description: string;
  tags: string[];
}

// Snippet Types
export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
}

// API Tester Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequest {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body: string;
  createdAt: Date;
}

// Error Log Types
export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface ErrorLog {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: Date;
  source: string;
  stack?: string;
}

// Dev Mode Types
export interface DevModeSettings {
  showGrid: boolean;
  showPerformanceMetrics: boolean;
  showDebugInfo: boolean;
}
