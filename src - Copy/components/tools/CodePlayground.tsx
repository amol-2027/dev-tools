
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function CodePlayground() {
  const [code, setCode] = useState<string>('// Write your code here\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const { toast } = useToast();

  const runCode = () => {
    try {
      setOutput(''); // Clear previous output
      
      if (language === 'javascript') {
        // For JavaScript, we can use eval but in a safer context
        const originalConsoleLog = console.log;
        let outputBuffer = '';
        
        // Override console.log to capture output
        console.log = (...args) => {
          outputBuffer += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
          originalConsoleLog(...args);
        };
        
        // Execute the code
        const executeFunction = new Function(code);
        executeFunction();
        
        // Restore console.log
        console.log = originalConsoleLog;
        
        setOutput(outputBuffer || 'Code executed successfully, no output.');
        toast({
          title: "Code executed",
          description: "Your code has run successfully",
        });
      } else {
        setOutput(`Language '${language}' execution is simulated for demonstration.\n\nOutput would appear here when running ${language} code.`);
        toast({
          title: "Simulated execution",
          description: `${language} execution is simulated in this demo`,
        });
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
      toast({
        title: "Error executing code",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Code Playground</h1>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="python">Python (Simulated)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={runCode}>Run Code</Button>
        </div>
        
        <Tabs defaultValue="code" className="w-full">
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code">
            <Card>
              <CardContent className="pt-6">
                <Textarea 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  className="min-h-[400px] font-mono"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="output">
            <Card>
              <CardContent className="pt-6">
                <pre className="min-h-[400px] bg-muted p-4 rounded-md overflow-auto font-mono">
                  {output}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
