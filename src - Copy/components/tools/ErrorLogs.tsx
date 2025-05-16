
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Bug, Copy, Download, Trash } from 'lucide-react';

// Types for log entries
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: string;
  source?: string;
  stack?: string;
}

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Demo log data
const generateDemoLogs = (): LogEntry[] => {
  return [
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 120000),
      level: 'error',
      message: 'Uncaught TypeError: Cannot read property "length" of undefined',
      source: 'main.js:45',
      stack: `TypeError: Cannot read property "length" of undefined
    at getUserData (main.js:45:23)
    at processUserInfo (main.js:72:12)
    at async loadUserProfile (profile.js:10:5)`,
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 240000),
      level: 'warn',
      message: 'API rate limit approaching (80%)',
      source: 'api-service.js:132',
      details: 'Current usage: 80/100 requests per minute',
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 360000),
      level: 'error',
      message: 'Failed to load resource',
      source: 'image-loader.js:23',
      details: 'Status code: 404, URL: https://example.com/images/missing-image.png',
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 420000),
      level: 'info',
      message: 'Application initialized successfully',
      source: 'app.js:12',
      details: 'Startup time: 856ms',
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 600000),
      level: 'warn',
      message: 'Deprecated function usage detected',
      source: 'utils.js:87',
      details: 'Function "calculateLegacyTotal" is deprecated and will be removed in the next version',
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 720000),
      level: 'error',
      message: 'Connection timeout',
      source: 'network.js:54',
      details: 'Failed to connect to API endpoint after 30000ms',
      stack: `TimeoutError: Request timed out
    at NetworkManager.handleTimeout (network.js:54:18)
    at Timeout.callback (network.js:102:10)`,
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 900000),
      level: 'info',
      message: 'User authentication successful',
      source: 'auth.js:76',
    },
    {
      id: generateId(),
      timestamp: new Date(Date.now() - 1800000),
      level: 'warn',
      message: 'Local storage space is running low',
      source: 'storage-manager.js:42',
      details: 'Current usage: 4.8MB/5MB',
    },
  ];
};

export default function ErrorLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const savedLogs = localStorage.getItem('errorLogs');
    return savedLogs ? JSON.parse(savedLogs).map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    })) : generateDemoLogs();
  });
  const [activeTab, setActiveTab] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const { toast } = useToast();

  // Save logs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('errorLogs', JSON.stringify(logs));
  }, [logs]);

  // Intercept console methods when capturing
  useEffect(() => {
    if (!isCapturing) return;
    
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    console.log = (...args) => {
      originalConsoleLog(...args);
      addLog('info', args.map(arg => String(arg)).join(' '));
    };
    
    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLog('warn', args.map(arg => String(arg)).join(' '));
    };
    
    console.error = (...args) => {
      originalConsoleError(...args);
      addLog('error', args.map(arg => String(arg)).join(' '));
    };
    
    // Intercept window errors
    const handleWindowError = (event: ErrorEvent) => {
      addLog('error', event.message, {
        source: `${event.filename}:${event.lineno}:${event.colno}`,
        stack: event.error?.stack
      });
    };
    
    // Intercept promise rejection errors
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      addLog('error', `Unhandled Promise Rejection: ${event.reason}`, {
        stack: event.reason?.stack
      });
    };
    
    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);
    
    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, [isCapturing]);

  // Add a new log entry
  const addLog = (level: 'info' | 'warn' | 'error', message: string, extra?: { source?: string; details?: string; stack?: string }) => {
    const newLog: LogEntry = {
      id: generateId(),
      timestamp: new Date(),
      level,
      message,
      ...extra
    };
    
    setLogs(prev => [newLog, ...prev]);
  };

  // Clear all logs
  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      setLogs([]);
      setSelectedLog(null);
      toast({
        title: "Logs cleared",
        description: "All log entries have been removed",
      });
    }
  };

  // Copy log to clipboard
  const copyLogToClipboard = (log: LogEntry) => {
    const logText = `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message}${
      log.source ? `\nSource: ${log.source}` : ''
    }${log.details ? `\nDetails: ${log.details}` : ''}${
      log.stack ? `\nStack Trace:\n${log.stack}` : ''
    }`;
    
    navigator.clipboard.writeText(logText);
    toast({
      title: "Copied to clipboard",
      description: "Log details copied to clipboard",
    });
  };

  // Export logs to file
  const exportLogs = () => {
    const logText = logs
      .map(log => `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message}${
        log.source ? `\nSource: ${log.source}` : ''
      }${log.details ? `\nDetails: ${log.details}` : ''}${
        log.stack ? `\nStack Trace:\n${log.stack}` : ''
      }\n`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `error-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs exported",
      description: "Log data has been exported as a text file",
    });
  };

  // Toggle log capture
  const toggleCapture = () => {
    setIsCapturing(prev => !prev);
    toast({
      title: isCapturing ? "Capture stopped" : "Capture started",
      description: isCapturing 
        ? "Console log capturing has been stopped" 
        : "Now capturing console logs and errors",
    });
  };

  // Generate test error
  const generateTestError = () => {
    try {
      // @ts-ignore - Intentional error for testing
      const obj = null;
      obj.nonExistentMethod();
    } catch (error) {
      console.error('Test error generated:', error);
      toast({
        title: "Test error generated",
        description: "A test error has been logged",
      });
    }
  };

  // Filter logs based on activeTab and searchQuery
  const filteredLogs = logs.filter(log => {
    const matchesLevel = activeTab === 'all' || log.level === activeTab;
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Error Log Console</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={toggleCapture}
                    variant={isCapturing ? "destructive" : "default"}
                  >
                    {isCapturing ? "Stop Capturing" : "Start Capturing"}
                  </Button>
                  
                  <Button variant="outline" onClick={generateTestError}>
                    <Bug size={16} className="mr-2" />
                    Generate Test Error
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={exportLogs} disabled={logs.length === 0}>
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                  
                  <Button variant="outline" onClick={clearLogs} disabled={logs.length === 0}>
                    <Trash size={16} className="mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                
                <Select 
                  value={activeTab} 
                  onValueChange={(value) => setActiveTab(value as any)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warnings</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                {filteredLogs.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {filteredLogs.map((log) => (
                        <div
                          key={log.id}
                          className={`p-3 rounded-md border cursor-pointer transition-colors ${
                            selectedLog?.id === log.id ? 'bg-muted' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  log.level === 'error' ? 'destructive' : 
                                  log.level === 'warn' ? 'default' : 'secondary'
                                }
                              >
                                {log.level.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {log.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyLogToClipboard(log);
                              }}
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                          
                          <p className="mt-1 font-medium text-sm">{log.message}</p>
                          
                          {log.source && (
                            <p className="mt-1 text-xs text-muted-foreground">{log.source}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    {logs.length === 0 
                      ? "No logs captured yet. Start capturing or generate a test error."
                      : `No logs match your filters: ${activeTab !== 'all' ? activeTab + ' level' : ''} ${searchQuery ? `containing "${searchQuery}"` : ''}`
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Log Details</h2>
              
              {selectedLog ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge
                        variant={
                          selectedLog.level === 'error' ? 'destructive' : 
                          selectedLog.level === 'warn' ? 'default' : 'secondary'
                        }
                        className="mb-2"
                      >
                        {selectedLog.level.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {selectedLog.timestamp.toLocaleString()}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyLogToClipboard(selectedLog)}
                    >
                      <Copy size={14} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Message</h3>
                    <p className="text-sm bg-muted p-2 rounded">{selectedLog.message}</p>
                  </div>
                  
                  {selectedLog.source && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Source</h3>
                      <p className="text-sm bg-muted p-2 rounded font-mono">{selectedLog.source}</p>
                    </div>
                  )}
                  
                  {selectedLog.details && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Details</h3>
                      <p className="text-sm bg-muted p-2 rounded">{selectedLog.details}</p>
                    </div>
                  )}
                  
                  {selectedLog.stack && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Stack Trace</h3>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto font-mono">
                        {selectedLog.stack}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                  <AlertTriangle size={32} className="mb-2 opacity-40" />
                  <p>Select a log entry to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Log Statistics</h2>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/50 p-4 rounded-md text-center">
                <p className="text-2xl font-bold">{logs.filter(log => log.level === 'info').length}</p>
                <p className="text-sm text-muted-foreground">Info</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-md text-center">
                <p className="text-2xl font-bold">{logs.filter(log => log.level === 'warn').length}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-md text-center">
                <p className="text-2xl font-bold">{logs.filter(log => log.level === 'error').length}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>
            
            <Tabs defaultValue="errors" className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="errors">Common Errors</TabsTrigger>
                <TabsTrigger value="tips">Debug Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="errors" className="mt-2">
                <ScrollArea className="h-[180px]">
                  <div className="space-y-2">
                    <div className="p-2 bg-muted rounded-md">
                      <p className="font-medium text-sm">TypeError: undefined is not an object</p>
                      <p className="text-xs text-muted-foreground">
                        Accessing properties on undefined or null
                      </p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="font-medium text-sm">ReferenceError: X is not defined</p>
                      <p className="text-xs text-muted-foreground">
                        Using a variable that hasn't been declared
                      </p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="font-medium text-sm">SyntaxError: Unexpected token</p>
                      <p className="text-xs text-muted-foreground">
                        Invalid JavaScript syntax
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="tips" className="mt-2">
                <ScrollArea className="h-[180px]">
                  <div className="space-y-2">
                    <div className="p-2 bg-muted rounded-md">
                      <p className="font-medium text-sm">Use console.table()</p>
                      <p className="text-xs text-muted-foreground">
                        For arrays and objects to see data in a formatted table
                      </p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="font-medium text-sm">console.trace()</p>
                      <p className="text-xs text-muted-foreground">
                        Shows the call stack leading to that point in code
                      </p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="font-medium text-sm">debugger statement</p>
                      <p className="text-xs text-muted-foreground">
                        Add "debugger;" in your code to create breakpoints
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
