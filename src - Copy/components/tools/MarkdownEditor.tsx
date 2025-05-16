
import React, { useState } from 'react';
import { useMarkdown } from '@/context/MarkdownContext';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Save,
  Trash2,
  Download,
  FileText,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// A simple markdown parser
const parseMarkdown = (markdown: string) => {
  // Headers
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold and italic
  html = html
    .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/gim, '<em>$1</em>')
    .replace(/\_\_([^_]+)\_\_/gim, '<strong>$1</strong>')
    .replace(/\_([^_]+)\_/gim, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');
  
  // Lists
  html = html.replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>\n</ul>');
  html = html.replace(/^\s*\n- (.*)/gim, '<ul>\n<li>$1</li>\n</ul>');
  html = html.replace(/^\s*\n\d+\. (.*)/gim, '<ol>\n<li>$1</li>\n</ol>');
  
  // Remove duplicate list tags
  html = html
    .replace(/<\/ul>\s*<ul>/gim, '')
    .replace(/<\/ol>\s*<ol>/gim, '');
  
  // Code blocks
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Line breaks
  html = html.replace(/\n/gim, '<br>');
  
  return html;
};

export default function MarkdownEditor() {
  const { 
    documents, 
    activeDocument, 
    createDocument, 
    selectDocument, 
    updateDocument, 
    deleteDocument, 
    getWordCount 
  } = useMarkdown();
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const { toast } = useToast();

  const handleCreateDocument = () => {
    if (newDocumentTitle.trim()) {
      createDocument(newDocumentTitle.trim());
      setNewDocumentTitle('');
      toast({
        title: 'Document created',
        description: `Created "${newDocumentTitle.trim()}"`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Document title cannot be empty',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateContent = (content: string) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { content });
    }
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    toast({
      title: 'Document deleted',
      variant: 'default',
    });
  };

  const handleDownload = () => {
    if (!activeDocument) return;
    
    const blob = new Blob([activeDocument.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDocument.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'File downloaded',
      description: `${activeDocument.title}.md`,
    });
  };

  return (
    <div className={`animate-fade-in ${fullscreen ? 'fixed inset-0 z-50 bg-background p-6' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Markdown Editor</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Input
              placeholder="New document title"
              value={newDocumentTitle}
              onChange={e => setNewDocumentTitle(e.target.value)}
              className="w-40 sm:w-60"
            />
            <Button onClick={handleCreateDocument} className="ml-2">
              <Plus className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">New</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`md:col-span-1 ${fullscreen ? 'hidden' : ''}`}>
          <Card>
            <div className="p-4 border-b">
              <h2 className="font-medium">Documents</h2>
            </div>
            <CardContent className="p-0">
              <ul className="divide-y">
                {documents.length > 0 ? (
                  documents.map(doc => (
                    <li 
                      key={doc.id} 
                      className={`
                        p-3 flex justify-between items-center cursor-pointer
                        ${activeDocument?.id === doc.id ? 'bg-secondary' : 'hover:bg-secondary/50'}
                      `}
                      onClick={() => selectDocument(doc.id)}
                    >
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(doc.lastEdited, 'MMM d, yyyy')} · {doc.wordCount} words
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))
                ) : (
                  <li className="p-6 text-center text-muted-foreground">
                    <FileText className="mx-auto h-8 w-8 mb-2" />
                    <p>No documents yet</p>
                    <p className="text-sm">Create your first document to get started.</p>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className={`${fullscreen ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
          {activeDocument ? (
            <>
              <Card>
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-medium">Editor</h2>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setFullscreen(!fullscreen)}
                    >
                      {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  <textarea
                    value={activeDocument.content}
                    onChange={e => handleUpdateContent(e.target.value)}
                    className="w-full h-[500px] p-4 font-mono text-sm resize-none focus:outline-none bg-transparent border-none"
                    placeholder="Start writing markdown here..."
                  />
                </CardContent>
              </Card>
              
              <Card>
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-medium">Preview</h2>
                  <span className="text-xs text-muted-foreground">
                    {activeDocument.wordCount} words
                  </span>
                </div>
                <CardContent 
                  className="prose dark:prose-invert max-w-none p-4 h-[500px] overflow-auto" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(activeDocument.content) }}
                />
              </Card>
            </>
          ) : (
            <Card className="md:col-span-2">
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No document selected</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new document or select an existing one to start editing.
                </p>
                <div className="flex items-center justify-center">
                  <Input
                    placeholder="Document title"
                    value={newDocumentTitle}
                    onChange={e => setNewDocumentTitle(e.target.value)}
                    className="w-60 mr-2"
                  />
                  <Button onClick={handleCreateDocument}>
                    <Plus className="mr-2 h-4 w-4" /> Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
