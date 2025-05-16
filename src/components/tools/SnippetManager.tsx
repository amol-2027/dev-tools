
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusCircle, Copy, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  starred: boolean;
}

const LANGUAGES = [
  'javascript', 'typescript', 'html', 'css', 'python', 
  'java', 'csharp', 'php', 'go', 'rust', 'shell', 'sql'
];

// Load snippets from localStorage or use default snippets
const getInitialSnippets = (): Snippet[] => {
  const savedSnippets = localStorage.getItem('code-snippets');
  if (savedSnippets) {
    return JSON.parse(savedSnippets);
  }
  
  return [
    {
      id: '1',
      title: 'React useState Hook',
      code: 'const [state, setState] = useState(initialValue);',
      language: 'javascript',
      tags: ['react', 'hooks'],
      starred: true
    },
    {
      id: '2',
      title: 'CSS Flexbox Center',
      code: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
      language: 'css',
      tags: ['layout', 'centering'],
      starred: false
    },
  ];
};

export default function SnippetManager() {
  const [snippets, setSnippets] = useState<Snippet[]>(getInitialSnippets());
  const [searchText, setSearchText] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  
  // Create/edit snippet fields
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Save snippets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('code-snippets', JSON.stringify(snippets));
  }, [snippets]);
  
  const resetForm = () => {
    setTitle('');
    setCode('');
    setLanguage('javascript');
    setTags('');
    setEditingId(null);
  };
  
  const handleSaveSnippet = () => {
    if (!title || !code) {
      toast({
        title: "Missing fields",
        description: "Title and code are required",
        variant: "destructive",
      });
      return;
    }
    
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    if (editingId) {
      // Update existing snippet
      setSnippets(snippets.map(snippet => 
        snippet.id === editingId 
          ? { ...snippet, title, code, language, tags: tagsArray }
          : snippet
      ));
      toast({
        title: "Snippet updated",
        description: `"${title}" has been updated`,
      });
    } else {
      // Add new snippet
      const newSnippet: Snippet = {
        id: Date.now().toString(),
        title,
        code,
        language,
        tags: tagsArray,
        starred: false
      };
      
      setSnippets([...snippets, newSnippet]);
      toast({
        title: "Snippet created",
        description: `"${title}" has been added`,
      });
    }
    
    resetForm();
  };
  
  const editSnippet = (snippet: Snippet) => {
    setTitle(snippet.title);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setTags(snippet.tags.join(', '));
    setEditingId(snippet.id);
  };
  
  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id));
    toast({
      title: "Snippet deleted",
      description: "The snippet has been removed",
    });
    if (editingId === id) {
      resetForm();
    }
  };
  
  const toggleStar = (id: string) => {
    setSnippets(snippets.map(snippet => 
      snippet.id === id 
        ? { ...snippet, starred: !snippet.starred }
        : snippet
    ));
  };
  
  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: `"${title}" has been copied`,
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };
  
  // Filter and sort snippets
  const filteredSnippets = snippets
    .filter(snippet => {
      // Apply language filter if selected
      if (filterLanguage && snippet.language !== filterLanguage) {
        return false;
      }
      
      // Apply search text filter
      const searchLower = searchText.toLowerCase();
      return (
        searchText === '' ||
        snippet.title.toLowerCase().includes(searchLower) ||
        snippet.code.toLowerCase().includes(searchLower) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      // Sort starred items first
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      
      // Then sort by title
      return a.title.localeCompare(b.title);
    });
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Snippet Manager</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Snippet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Snippet title"
                />
              </div>
              
              <div>
                <Label htmlFor="code">Code</Label>
                <Textarea 
                  id="code" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste code here"
                  className="font-mono min-h-32"
                />
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  value={tags} 
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, hooks, etc."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSnippet} className="w-full">
                {editingId ? 'Update Snippet' : 'Add Snippet'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center border rounded-md p-2">
                <SearchIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input 
                  value={searchText} 
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search snippets..." 
                  className="border-0 p-0 focus-visible:ring-0"
                />
              </div>
              
              <div>
                <Label htmlFor="language-filter">Language</Label>
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All languages</SelectItem>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - snippet list */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            {filteredSnippets.length} {filteredSnippets.length === 1 ? 'Snippet' : 'Snippets'} Found
          </h2>
          
          {filteredSnippets.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <p>No snippets found. Create your first snippet!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSnippets.map(snippet => (
                <Card key={snippet.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{snippet.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleStar(snippet.id)}
                        >
                          <Star 
                            className={`h-4 w-4 ${snippet.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                          />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => copyToClipboard(snippet.code, snippet.title)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary">{snippet.language}</Badge>
                      {snippet.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm font-mono">
                      {snippet.code}
                    </pre>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => editSnippet(snippet)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => deleteSnippet(snippet.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
