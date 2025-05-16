
import React, { useState } from 'react';
import { usePomodoro } from '@/context/PomodoroContext';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  PlayCircle,
  PauseCircle,
  RotateCcw,
  SkipForward,
  Settings,
} from 'lucide-react';

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SettingsForm = ({ onClose }: { onClose: () => void }) => {
  const { settings, updateSettings } = usePomodoro();
  const [formValues, setFormValues] = useState({
    workDuration: settings.workDuration,
    breakDuration: settings.breakDuration,
    longBreakDuration: settings.longBreakDuration,
    sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formValues);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="workDuration" className="block text-sm font-medium mb-1">
          Work Duration (minutes)
        </label>
        <Input
          type="number"
          id="workDuration"
          name="workDuration"
          min="1"
          max="60"
          value={formValues.workDuration}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="breakDuration" className="block text-sm font-medium mb-1">
          Break Duration (minutes)
        </label>
        <Input
          type="number"
          id="breakDuration"
          name="breakDuration"
          min="1"
          max="30"
          value={formValues.breakDuration}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="longBreakDuration" className="block text-sm font-medium mb-1">
          Long Break Duration (minutes)
        </label>
        <Input
          type="number"
          id="longBreakDuration"
          name="longBreakDuration"
          min="1"
          max="60"
          value={formValues.longBreakDuration}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="sessionsBeforeLongBreak" className="block text-sm font-medium mb-1">
          Sessions Before Long Break
        </label>
        <Input
          type="number"
          id="sessionsBeforeLongBreak"
          name="sessionsBeforeLongBreak"
          min="1"
          max="10"
          value={formValues.sessionsBeforeLongBreak}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
};

export default function PomodoroTimer() {
  const { 
    status, 
    timeRemaining, 
    isActive, 
    start, 
    pause, 
    reset, 
    skip, 
    sessionCount, 
    totalSessionsCompleted,
  } = usePomodoro();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Calculate progress percentage for timer display
  const getMaxTime = () => {
    switch (status) {
      case 'work':
        return usePomodoro().settings.workDuration * 60;
      case 'break':
        return usePomodoro().settings.breakDuration * 60;
      case 'longBreak':
        return usePomodoro().settings.longBreakDuration * 60;
      default:
        return usePomodoro().settings.workDuration * 60;
    }
  };
  
  const progress = timeRemaining / getMaxTime() * 100;
  
  // Get background color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'work':
        return 'bg-primary/10';
      case 'break':
        return 'bg-green-500/10';
      case 'longBreak':
        return 'bg-blue-500/10';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const statusText = {
    idle: 'Ready',
    work: 'Work',
    break: 'Short Break',
    longBreak: 'Long Break',
  };

  const timerSize = 300; // Size of the timer circle
  const strokeWidth = 12; // Thickness of the timer circle
  const radius = (timerSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pomodoro Timer</h1>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <SettingsForm onClose={() => setIsSettingsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center">
          <Card className={`${getStatusColor()} w-full max-w-md`}>
            <CardHeader className="pb-4 text-center">
              <CardTitle>
                {statusText[status]} Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative inline-flex items-center justify-center">
                <svg
                  width={timerSize}
                  height={timerSize}
                  viewBox={`0 0 ${timerSize} ${timerSize}`}
                  className="transform -rotate-90"
                >
                  {/* Background circle */}
                  <circle
                    cx={timerSize / 2}
                    cy={timerSize / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  
                  {/* Progress circle */}
                  <circle
                    cx={timerSize / 2}
                    cy={timerSize / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={
                      status === 'work' ? 'text-primary' :
                      status === 'break' ? 'text-green-500' :
                      'text-blue-500'
                    }
                  />
                </svg>
                
                {/* Timer text in center of circle */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold">
                    {formatTime(timeRemaining)}
                  </span>
                  <span className="text-xl text-muted-foreground capitalize">
                    {statusText[status]}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8 mb-2">
                {!isActive ? (
                  <Button onClick={start} size="lg" className="rounded-full h-12 w-12 p-0">
                    <PlayCircle className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button onClick={pause} size="lg" className="rounded-full h-12 w-12 p-0">
                    <PauseCircle className="h-6 w-6" />
                  </Button>
                )}
                <Button onClick={reset} variant="outline" size="lg" className="rounded-full h-12 w-12 p-0">
                  <RotateCcw className="h-6 w-6" />
                </Button>
                <Button onClick={skip} variant="outline" size="lg" className="rounded-full h-12 w-12 p-0">
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Session #</span>
                  <span className="text-2xl font-semibold">{sessionCount + 1}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">{status}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-2xl font-semibold">{totalSessionsCompleted}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pomodoro Technique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Work for 25 minutes (one "pomodoro")</li>
                  <li>Take a short 5-minute break</li>
                  <li>After 4 pomodoros, take a longer 15-30 minute break</li>
                  <li>Repeat the cycle</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
