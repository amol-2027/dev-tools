
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
}

export default function ApiTester() {
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState<string>('GET');
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState<string>('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const { toast } = useToast();

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    setResponseTime(null);

    try {
      const startTime = performance.now();
      
      const requestOptions: RequestInit = {
        method,
        headers: JSON.parse(headers),
        ...(method !== 'GET' && method !== 'HEAD' ? { body: body } : {})
      };

      const response = await fetch(url, requestOptions);
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      
      // Extract headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // Parse response based on content type
      let data;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('text/')) {
        data = await response.text();
      } else {
        data = `[Binary data: ${contentType}]`;
      }
      
      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data
      });
      
      toast({
        title: `${response.status} ${response.statusText}`,
        description: "Request completed successfully",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      
      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        data: (error as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Tester</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="HEAD">HEAD</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    placeholder="Enter request URL" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow"
                  />
                  
                  <Button onClick={sendRequest} disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                  </Button>
                </div>
                
                <Tabs defaultValue="headers">
                  <TabsList>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body" disabled={method === 'GET' || method === 'HEAD'}>Body</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="headers">
                    <Textarea 
                      placeholder="Request headers in JSON format"
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      className="min-h-[200px] font-mono"
                    />
                  </TabsContent>
                  
                  <TabsContent value="body">
                    <Textarea 
                      placeholder="Request body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="min-h-[200px] font-mono"
                      disabled={method === 'GET' || method === 'HEAD'}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Response</h2>
              
              {responseTime !== null && (
                <div className="mb-4 text-sm">
                  Time: <span className="font-medium">{responseTime.toFixed(2)}ms</span>
                </div>
              )}
              
              {response && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      response.status >= 200 && response.status < 300 ? 'bg-green-500' : 
                      response.status >= 400 ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="font-medium">{response.status} {response.statusText}</span>
                  </div>
                  
                  <Tabs defaultValue="body">
                    <TabsList>
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="body">
                      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                        {typeof response.data === 'object' 
                          ? JSON.stringify(response.data, null, 2) 
                          : response.data}
                      </pre>
                    </TabsContent>
                    
                    <TabsContent value="headers">
                      <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] font-mono text-sm">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <div key={key} className="mb-1">
                            <span className="text-primary">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {!response && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  Send a request to see the response here
                </div>
              )}
              
              {loading && (
                <div className="text-center py-12 text-muted-foreground">
                  Loading...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
