
import React from 'react';
import { useNavigation } from '@/context/NavigationContext';
import Dashboard from '@/components/tools/Dashboard';
import TaskList from '@/components/tools/TaskList';
import PomodoroTimer from '@/components/tools/PomodoroTimer';
import StickyNotes from '@/components/tools/StickyNotes';
import MarkdownEditor from '@/components/tools/MarkdownEditor';
import WeeklyCalendar from '@/components/tools/WeeklyCalendar';
import TimeZoneConverter from '@/components/tools/TimeZoneConverter';
import JsonViewer from '@/components/tools/JsonViewer';
import MindMap from '@/components/tools/MindMap';
import SnippetManager from '@/components/tools/SnippetManager';
import RegexTester from '@/components/tools/RegexTester';
import CodePlayground from '@/components/tools/CodePlayground';
import ApiTester from '@/components/tools/ApiTester';
import GitHelper from '@/components/tools/GitHelper';
import CheatSheet from '@/components/tools/CheatSheet';
import ClipboardManager from '@/components/tools/ClipboardManager';
import ColorPalette from '@/components/tools/ColorPalette';
import ComponentLibrary from '@/components/tools/ComponentLibrary';
import ErrorLogs from '@/components/tools/ErrorLogs';
import { cn } from '@/lib/utils';

export default function MainContent() {
  const { activeTool } = useNavigation();

  console.log('Current active tool:', activeTool);

  return (
    <main className="flex-1 h-screen overflow-auto bg-background">
      <div className="container mx-auto p-6 animate-fade-in">
        <div className={cn(activeTool !== 'dashboard' && "max-w-6xl mx-auto")}>
          {/* Main Tools */}
          {activeTool === 'dashboard' && <Dashboard />}
          {activeTool === 'tasks' && <TaskList />}
          {activeTool === 'pomodoro' && <PomodoroTimer />}
          {activeTool === 'notes' && <StickyNotes />}
          {activeTool === 'markdown' && <MarkdownEditor />}
          {activeTool === 'calendar' && <WeeklyCalendar />}
          
          {/* Utilities */}
          {activeTool === 'timezone' && <TimeZoneConverter />}
          {activeTool === 'json' && <JsonViewer />}
          {activeTool === 'mindmap' && <MindMap />}
          {activeTool === 'snippets' && <SnippetManager />}
          {activeTool === 'regex' && <RegexTester />}
          
          {/* Dev Tools (now implemented) */}
          {activeTool === 'playground' && <CodePlayground />}
          {activeTool === 'api' && <ApiTester />}
          {activeTool === 'git' && <GitHelper />}
          {activeTool === 'cheatsheet' && <CheatSheet />}
          {activeTool === 'clipboard' && <ClipboardManager />}
          {activeTool === 'colors' && <ColorPalette />}
          {activeTool === 'components' && <ComponentLibrary />}
          {activeTool === 'logs' && <ErrorLogs />}
        </div>
      </div>
    </main>
  );
}
