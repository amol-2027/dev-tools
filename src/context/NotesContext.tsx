
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Note } from '@/types';

interface NotesContextType {
  notes: Note[];
  addNote: (content: string, color: string, position: { x: number; y: number }) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert string dates back to Date objects
        return parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        }));
      } catch (error) {
        console.error('Failed to parse notes from localStorage', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Convert Date objects to strings for storage
    const notesForStorage = notes.map(note => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    }));
    localStorage.setItem('notes', JSON.stringify(notesForStorage));
  }, [notes]);

  const addNote = (content: string, color: string, position: { x: number; y: number }) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content,
      color,
      position,
      createdAt: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <NotesContext.Provider value={{ 
      notes, 
      addNote, 
      updateNote, 
      deleteNote,
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
