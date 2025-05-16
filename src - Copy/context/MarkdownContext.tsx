
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MarkdownDocument } from '@/types';

interface MarkdownContextType {
  documents: MarkdownDocument[];
  activeDocument: MarkdownDocument | null;
  createDocument: (title: string) => void;
  selectDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<MarkdownDocument>) => void;
  deleteDocument: (id: string) => void;
  getWordCount: (text: string) => number;
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);

export const MarkdownProvider = ({ children }: { children: React.ReactNode }) => {
  const [documents, setDocuments] = useState<MarkdownDocument[]>(() => {
    const savedDocs = localStorage.getItem('markdownDocs');
    if (savedDocs) {
      try {
        const parsedDocs = JSON.parse(savedDocs);
        // Convert string dates back to Date objects
        return parsedDocs.map((doc: any) => ({
          ...doc,
          lastEdited: new Date(doc.lastEdited),
        }));
      } catch (error) {
        console.error('Failed to parse markdown documents from localStorage', error);
        return [];
      }
    }
    return [];
  });

  const [activeDocId, setActiveDocId] = useState<string | null>(() => {
    const savedActiveId = localStorage.getItem('activeMarkdownDocId');
    return savedActiveId || null;
  });

  const activeDocument = activeDocId 
    ? documents.find(doc => doc.id === activeDocId) || null 
    : documents.length > 0 ? documents[0] : null;

  useEffect(() => {
    // Convert Date objects to strings for storage
    const docsForStorage = documents.map(doc => ({
      ...doc,
      lastEdited: doc.lastEdited.toISOString(),
    }));
    localStorage.setItem('markdownDocs', JSON.stringify(docsForStorage));
  }, [documents]);

  useEffect(() => {
    if (activeDocId) {
      localStorage.setItem('activeMarkdownDocId', activeDocId);
    } else {
      localStorage.removeItem('activeMarkdownDocId');
    }
  }, [activeDocId]);

  const createDocument = (title: string) => {
    const newDoc: MarkdownDocument = {
      id: crypto.randomUUID(),
      title,
      content: '',
      lastEdited: new Date(),
      wordCount: 0,
    };
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
  };

  const selectDocument = (id: string) => {
    setActiveDocId(id);
  };

  const updateDocument = (id: string, updates: Partial<MarkdownDocument>) => {
    setDocuments(prev => 
      prev.map(doc => {
        if (doc.id === id) {
          const updated = { 
            ...doc, 
            ...updates, 
            lastEdited: new Date(),
          };
          
          // Update word count if content changed
          if (updates.content !== undefined) {
            updated.wordCount = getWordCount(updates.content);
          }
          
          return updated;
        }
        return doc;
      })
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    
    // If the active document is deleted, select another one
    if (activeDocId === id) {
      const remainingDocs = documents.filter(doc => doc.id !== id);
      setActiveDocId(remainingDocs.length > 0 ? remainingDocs[0].id : null);
    }
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <MarkdownContext.Provider value={{ 
      documents, 
      activeDocument, 
      createDocument, 
      selectDocument, 
      updateDocument, 
      deleteDocument,
      getWordCount,
    }}>
      {children}
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = (): MarkdownContextType => {
  const context = useContext(MarkdownContext);
  if (context === undefined) {
    throw new Error('useMarkdown must be used within a MarkdownProvider');
  }
  return context;
};
