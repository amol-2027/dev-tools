import React, { useState } from 'react';
import { useNavigation, type ToolName } from '@/context/NavigationContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  ListTodo, 
  Calendar, 
  StickyNote, 
  FileText, 
  Globe, 
  Code, 
  Network, 
  Scissors, 
  FileCode,
  PlayCircle,
  GitBranch,
  Clipboard,
  Palette,
  Component,
  AlertTriangle,
  Settings,
  Sun,
  Moon,
  LayoutDashboard,
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  name: string;
  toolName: ToolName;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, name, toolName, isActive = false, isCollapsed = false, onClick }: SidebarItemProps) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all-colors",
          isActive 
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <span className="text-lg">{icon}</span>
        {!isCollapsed && <span className="text-sm font-medium">{name}</span>}
      </button>
    </li>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

const SidebarSection = ({ title, children, isCollapsed = false }: SidebarSectionProps) => {
  return (
    <div className="mb-6">
      {!isCollapsed && (
        <h3 className="px-3 mb-2 text-xs uppercase tracking-wider text-sidebar-foreground/60">
          {title}
        </h3>
      )}
      <ul className="space-y-1">
        {children}
      </ul>
    </div>
  );
};

export default function Sidebar() {
  const { activeTool, setActiveTool } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Define navigation items
  const toolItems: Array<{ name: string; icon: React.ReactNode; toolName: ToolName }> = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, toolName: 'dashboard' },
    { name: 'Tasks', icon: <ListTodo size={20} />, toolName: 'tasks' },
    { name: 'Pomodoro', icon: <Clock size={20} />, toolName: 'pomodoro' },
    { name: 'Sticky Notes', icon: <StickyNote size={20} />, toolName: 'notes' },
    { name: 'Markdown', icon: <FileText size={20} />, toolName: 'markdown' },
    { name: 'Calendar', icon: <Calendar size={20} />, toolName: 'calendar' },
  ];

  const utilityItems: Array<{ name: string; icon: React.ReactNode; toolName: ToolName }> = [
    { name: 'Time Zones', icon: <Globe size={20} />, toolName: 'timezone' },
    { name: 'JSON Viewer', icon: <Code size={20} />, toolName: 'json' },
    { name: 'Mind Map', icon: <Network size={20} />, toolName: 'mindmap' },
    { name: 'Snippets', icon: <Scissors size={20} />, toolName: 'snippets' },
    { name: 'Regex Tester', icon: <FileCode size={20} />, toolName: 'regex' },
  ];

  const devItems: Array<{ name: string; icon: React.ReactNode; toolName: ToolName }> = [
    { name: 'Playground', icon: <PlayCircle size={20} />, toolName: 'playground' },
    { name: 'API Tester', icon: <Globe size={20} />, toolName: 'api' },
    { name: 'Git Helper', icon: <GitBranch size={20} />, toolName: 'git' },
    { name: 'Cheat Sheets', icon: <FileText size={20} />, toolName: 'cheatsheet' },
    { name: 'Clipboard', icon: <Clipboard size={20} />, toolName: 'clipboard' },
    { name: 'Color Palettes', icon: <Palette size={20} />, toolName: 'colors' },
    { name: 'Components', icon: <Component size={20} />, toolName: 'components' },
    { name: 'Error Logs', icon: <AlertTriangle size={20} />, toolName: 'logs' },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar transition-all duration-300 border-r border-sidebar-border flex flex-col",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
        {!isCollapsed && (
          <h1 className="font-bold text-lg text-sidebar-foreground">
            DevPro
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        <SidebarSection title="Main Tools" isCollapsed={isCollapsed}>
          {toolItems.map((item) => (
            <SidebarItem
              key={item.toolName}
              icon={item.icon}
              name={item.name}
              toolName={item.toolName}
              isActive={activeTool === item.toolName}
              isCollapsed={isCollapsed}
              onClick={() => setActiveTool(item.toolName)}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Utilities" isCollapsed={isCollapsed}>
          {utilityItems.map((item) => (
            <SidebarItem
              key={item.toolName}
              icon={item.icon}
              name={item.name}
              toolName={item.toolName}
              isActive={activeTool === item.toolName}
              isCollapsed={isCollapsed}
              onClick={() => setActiveTool(item.toolName)}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Developer Tools" isCollapsed={isCollapsed}>
          {devItems.map((item) => (
            <SidebarItem
              key={item.toolName}
              icon={item.icon}
              name={item.name}
              toolName={item.toolName}
              isActive={activeTool === item.toolName}
              isCollapsed={isCollapsed}
              onClick={() => setActiveTool(item.toolName)}
            />
          ))}
        </SidebarSection>
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {theme === 'dark' ? (
            <>
              {!isCollapsed && <span>Light Mode</span>}
              <Sun size={20} />
            </>
          ) : (
            <>
              {!isCollapsed && <span>Dark Mode</span>}
              <Moon size={20} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
