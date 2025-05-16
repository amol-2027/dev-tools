
import React, { useState, useRef, useEffect } from 'react';
import { useNotes } from '@/context/NotesContext';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react';
import { Note } from '@/types';

const noteColors = [
  'bg-yellow-100 dark:bg-yellow-900/30',
  'bg-blue-100 dark:bg-blue-900/30',
  'bg-green-100 dark:bg-green-900/30',
  'bg-pink-100 dark:bg-pink-900/30',
  'bg-purple-100 dark:bg-purple-900/30',
];

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const StickyNote = ({ note, onUpdate, onDelete }: StickyNoteProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(note.position);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const noteRef = useRef<HTMLDivElement>(null);
  
  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.note-actions')) {
      return;
    }
    
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position.x;
    const startPosY = position.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: startPosX + (e.clientX - startX),
        y: startPosY + (e.clientY - startY),
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Update note position when drag ends
      onUpdate(note.id, { position });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Save content changes
  useEffect(() => {
    if (!isEditing) {
      onUpdate(note.id, { content });
    }
  }, [isEditing]);
  
  useEffect(() => {
    // Update position in state when note position changes externally
    setPosition(note.position);
  }, [note.position]);
  
  return (
    <Card
      ref={noteRef}
      className={`absolute w-64 shadow-lg ${note.color} transition-shadow ${isDragging ? 'shadow-xl z-10' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div 
        className="h-6 flex items-center justify-between px-2 border-b border-black/10"
        onMouseDown={handleMouseDown}
      >
        <GripVertical size={14} className="text-gray-500" />
        <div className="note-actions flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        {isEditing ? (
          <textarea
            className="w-full h-32 p-0 focus:outline-none bg-transparent resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <div 
            className="w-full h-full min-h-[100px] whitespace-pre-wrap break-words"
            onClick={() => setIsEditing(true)}
          >
            {content || "Click to add text"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function StickyNotes() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddNote = () => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      // Calculate a random position within the container
      const maxX = Math.max(containerRect.width - 300, 300);
      const maxY = Math.max(containerRect.height - 300, 300);
      
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);
      
      const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
      
      addNote("", randomColor, { x: randomX, y: randomY });
    }
  };

  return (
    <div className="animate-fade-in h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sticky Notes</h1>
        <Button onClick={handleAddNote}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>
      
      <div 
        ref={containerRef}
        className="relative h-[calc(100vh-200px)] overflow-auto border border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
      >
        {notes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        ))}
        
        {notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>No sticky notes yet</p>
              <p className="text-sm">Click 'Add Note' to create your first note.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
