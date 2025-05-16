
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function JsonViewer() {
  const [jsonInput, setJsonInput] = useState<string>('{\n  "name": "John Doe",\n  "age": 30,\n  "isActive": true,\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "postalCode": "10001"\n  },\n  "skills": ["JavaScript", "React", "Node.js"]\n}');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatJson = (minify: boolean = false) => {
    try {
      // Parse the JSON string
      const jsonObj = JSON.parse(jsonInput);
      
      // Format it back to a string
      const formatted = minify 
        ? JSON.stringify(jsonObj)
        : JSON.stringify(jsonObj, null, 2);
        
      setJsonOutput(formatted);
      setError(null);
      
      toast({
        title: minify ? "JSON Minified" : "JSON Beautified",
        description: "Successfully processed JSON",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Invalid JSON",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    const textToCopy = jsonOutput || jsonInput;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "JSON has been copied to clipboard",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy JSON to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonInput);
      toast({
        title: "Valid JSON",
        description: "Your JSON is valid",
        variant: "default",
      });
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Invalid JSON",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">JSON Viewer/Editor</h1>
      
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="viewer">Viewer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="Paste your JSON here..."
              />
              
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={() => formatJson(false)}>Beautify</Button>
                <Button onClick={() => formatJson(true)}>Minify</Button>
                <Button variant="outline" onClick={validateJson}>Validate</Button>
                <Button variant="outline" onClick={copyToClipboard}>Copy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="viewer">
          <Card>
            <CardContent className="pt-6">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto min-h-[300px] font-mono text-sm">
                {jsonOutput || jsonInput}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
