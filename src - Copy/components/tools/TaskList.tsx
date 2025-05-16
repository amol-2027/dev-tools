
import React, { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Task, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  ListTodo, 
  ChevronDown, 
  ChevronUp, 
  X, 
  CheckSquare, 
  Square, 
  Flag, 
  Trash2,
  Plus
} from 'lucide-react';

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    high: "bg-red-500 text-white",
    medium: "bg-yellow-500 text-white",
    low: "bg-green-500 text-white",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
      <div 
        className="bg-primary rounded-full h-2" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
  const { updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  
  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
    toast({
      title: task.completed ? "Task marked as incomplete" : "Task completed!",
      description: task.title,
    });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast({
      title: "Task deleted",
      description: task.title,
    });
  };

  const handleProgressChange = (value: number) => {
    updateTask(task.id, { 
      progress: value,
      completed: value === 100
    });
  };

  return (
    <Card className={`mb-3 p-4 transition-opacity ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-2 flex-1">
          <button 
            className="mt-1 text-gray-400 hover:text-primary"
            onClick={handleToggleComplete}
          >
            {task.completed ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} />
              {task.dueDate && (
                <span className="text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(task.dueDate, 'MMM d, yyyy')}
                </span>
              )}
              {task.tags?.map(tag => (
                <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-10">
          {task.progress}%
        </span>
        <div className="flex-1">
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="10" 
            value={task.progress} 
            onChange={(e) => handleProgressChange(parseInt(e.target.value, 10))}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </Card>
  );
};

const AddTaskForm = ({ onClose }: { onClose: () => void }) => {
  const { addTask } = useTasks();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title is required",
        variant: "destructive"
      });
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
      progress: 0,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    addTask(newTask);
    toast({
      title: "Task added",
      description: newTask.title,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1">
          Priority
        </label>
        <Select
          value={priority}
          onValueChange={(value) => setPriority(value as Priority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
          Due Date
        </label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags (comma separated)
        </label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, personal, urgent"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  );
};

export default function TaskList() {
  const { tasks, completedCount, pendingCount, highPriorityCount } = useTasks();
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'createdAt'>('priority');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => showCompleted || !task.completed);
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Task List</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <AddTaskForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-semibold">{tasks.length}</p>
            </div>
            <ListTodo className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 bg-green-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold">{completedCount}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-red-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-semibold">{highPriorityCount}</p>
            </div>
            <Flag className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </Button>
        </div>

        <div className="flex items-center">
          <span className="text-sm mr-2">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(value: string) => setSortBy(value as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedTasks.length > 0 ? (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-muted-foreground">No tasks yet</h3>
          <p className="text-muted-foreground">
            {tasks.length > 0 
              ? "All tasks are completed! Add more tasks to stay productive." 
              : "Add your first task to get started!"}
          </p>
        </div>
      )}
    </div>
  );
}
