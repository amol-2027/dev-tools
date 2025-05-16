
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task } from '@/types';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completedCount: number;
  pendingCount: number;
  highPriorityCount: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        }));
      } catch (error) {
        console.error('Failed to parse tasks from localStorage', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Convert Date objects to strings for storage
    const tasksForStorage = tasks.map(task => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    }));
    localStorage.setItem('tasks', JSON.stringify(tasksForStorage));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Derived state
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const highPriorityCount = tasks.filter(task => task.priority === 'high' && !task.completed).length;

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask,
      completedCount,
      pendingCount,
      highPriorityCount
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
