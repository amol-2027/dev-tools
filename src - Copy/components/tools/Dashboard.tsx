
import React from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { useTasks } from '@/context/TaskContext';
import { usePomodoro } from '@/context/PomodoroContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ListTodo,
  Clock,
  StickyNote,
  FileText,
  Calendar,
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
  Flag,
  CheckSquare,
} from 'lucide-react';

const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  action,
  bgClass = "bg-primary/5 hover:bg-primary/10",
  fullWidth = false
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  action: () => void;
  bgClass?: string;
  fullWidth?: boolean;
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${bgClass} hover:scale-[1.01] ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}
      onClick={action}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="p-2 rounded-full bg-background">
            {icon}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  bgClass = "bg-primary/10",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgClass?: string;
}) => {
  return (
    <Card className={bgClass}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="p-2 rounded-full bg-background/50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { setActiveTool } = useNavigation();
  const { tasks, highPriorityCount, pendingCount, completedCount } = useTasks();
  const { totalSessionsCompleted } = usePomodoro();

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Developer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Tasks Pending"
          value={pendingCount}
          icon={<ListTodo className="h-8 w-8 text-primary" />}
          bgClass="bg-primary/10"
        />
        <StatCard
          title="High Priority"
          value={highPriorityCount}
          icon={<Flag className="h-8 w-8 text-red-500" />}
          bgClass="bg-red-500/10"
        />
        <StatCard
          title="Completed Tasks"
          value={completedCount}
          icon={<CheckSquare className="h-8 w-8 text-green-500" />}
          bgClass="bg-green-500/10"
        />
        <StatCard
          title="Focus Sessions"
          value={totalSessionsCompleted}
          icon={<Clock className="h-8 w-8 text-blue-500" />}
          bgClass="bg-blue-500/10"
        />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Core Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FeatureCard
          title="Task List"
          description="Manage tasks with priority levels, progress tracking, and due dates."
          icon={<ListTodo className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('tasks')}
        />
        <FeatureCard
          title="Pomodoro Timer"
          description="Stay focused with customizable work/break sessions."
          icon={<Clock className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('pomodoro')}
        />
        <FeatureCard
          title="Sticky Notes"
          description="Create draggable note tiles with support for markdown."
          icon={<StickyNote className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('notes')}
        />
        <FeatureCard
          title="Markdown Editor"
          description="Write and preview markdown with auto-save and export."
          icon={<FileText className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('markdown')}
        />
        <FeatureCard
          title="Weekly Calendar"
          description="Schedule and manage events with color coding and filtering."
          icon={<Calendar className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('calendar')}
        />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Developer Utilities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FeatureCard
          title="Time Zone Converter"
          description="Convert times between different time zones easily."
          icon={<Globe className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('timezone')}
          bgClass="bg-secondary hover:bg-secondary/80"
        />
        <FeatureCard
          title="JSON Viewer/Editor"
          description="Visualize, edit, and validate JSON data."
          icon={<Code className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('json')}
          bgClass="bg-secondary hover:bg-secondary/80"
        />
        <FeatureCard
          title="Mind Map Builder"
          description="Create visual maps of ideas and concepts."
          icon={<Network className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('mindmap')}
          bgClass="bg-secondary hover:bg-secondary/80"
        />
        <FeatureCard
          title="Snippet Manager"
          description="Store and organize code snippets by language or tag."
          icon={<Scissors className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('snippets')}
          bgClass="bg-secondary hover:bg-secondary/80"
        />
        <FeatureCard
          title="Regex Tester"
          description="Test and debug regular expressions with live feedback."
          icon={<FileCode className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('regex')}
          bgClass="bg-secondary hover:bg-secondary/80"
        />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Advanced Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FeatureCard
          title="Code Playground"
          description="Test HTML/CSS/JS code with live preview."
          icon={<PlayCircle className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('playground')}
          bgClass="bg-accent/20 hover:bg-accent/30"
        />
        <FeatureCard
          title="API Tester"
          description="Send and test API requests with formatted responses."
          icon={<Globe className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('api')}
          bgClass="bg-accent/20 hover:bg-accent/30"
        />
        <FeatureCard
          title="Git Command Helper"
          description="Visual interface for common git commands with explanations."
          icon={<GitBranch className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('git')}
          bgClass="bg-accent/20 hover:bg-accent/30"
        />
        <FeatureCard
          title="Clipboard Manager"
          description="Track and reuse copied text and code snippets."
          icon={<Clipboard className="h-6 w-6 text-primary" />}
          action={() => setActiveTool('clipboard')}
          bgClass="bg-accent/20 hover:bg-accent/30"
        />
      </div>
    </div>
  );
}
