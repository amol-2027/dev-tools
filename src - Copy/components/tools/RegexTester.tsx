
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface RegexMatch {
  start: number;
  end: number;
  value: string;
}

interface RegexFlag {
  flag: string;
  label: string;
  description: string;
}

const REGEX_FLAGS: RegexFlag[] = [
  { flag: 'g', label: 'Global', description: 'Find all matches rather than stopping after the first match' },
  { flag: 'i', label: 'Case Insensitive', description: 'Case insensitive matching' },
  { flag: 'm', label: 'Multiline', description: 'Treats beginning/end chars (^ and $) as working over multiple lines' },
  { flag: 's', label: 'Dot All', description: 'Allows . to match newline characters' },
  { flag: 'u', label: 'Unicode', description: 'Treat pattern as a sequence of Unicode code points' },
  { flag: 'y', label: 'Sticky', description: 'Matches only from the index indicated by lastIndex property' },
];

const EXAMPLE_PATTERNS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
  { name: 'Phone Number', pattern: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])' },
  { name: 'IP Address', pattern: '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flagsState, setFlagsState] = useState<Record<string, boolean>>({
    g: true, i: false, m: false, s: false, u: false, y: false
  });
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Update matches whenever pattern, testString, or flags change
  useEffect(() => {
    testRegex();
  }, [pattern, testString, flagsState]);

  const getActiveFlags = (): string => {
    return Object.entries(flagsState)
      .filter(([_, isActive]) => isActive)
      .map(([flag, _]) => flag)
      .join('');
  };

  const testRegex = () => {
    setErrorMessage(null);
    setMatches([]);
    
    if (!pattern || !testString) {
      return;
    }
    
    try {
      const flags = getActiveFlags();
      const regex = new RegExp(pattern, flags);
      const matchResults: RegexMatch[] = [];
      
      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matchResults.push({
            start: match.index,
            end: match.index + match[0].length,
            value: match[0]
          });
          
          // Prevent infinite loops for zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matchResults.push({
            start: match.index,
            end: match.index + match[0].length,
            value: match[0]
          });
        }
      }
      
      setMatches(matchResults);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const toggleFlag = (flag: string) => {
    setFlagsState(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  const useExample = (pattern: string) => {
    setPattern(pattern);
  };

  const renderHighlightedText = () => {
    if (!testString || matches.length === 0) {
      return <pre className="whitespace-pre-wrap overflow-auto">{testString}</pre>;
    }
    
    let lastIndex = 0;
    const parts = [];
    
    // Sort matches by start position
    const sortedMatches = [...matches].sort((a, b) => a.start - b.start);
    
    for (const match of sortedMatches) {
      // Add text before the match
      if (match.start > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {testString.substring(lastIndex, match.start)}
          </span>
        );
      }
      
      // Add highlighted match
      parts.push(
        <span 
          key={`match-${match.start}`} 
          className="bg-green-500/20 text-green-800 dark:text-green-300 px-0.5 rounded"
          title={`Match: "${match.value}"`}
        >
          {testString.substring(match.start, match.end)}
        </span>
      );
      
      lastIndex = match.end;
    }
    
    // Add remaining text after all matches
    if (lastIndex < testString.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {testString.substring(lastIndex)}
        </span>
      );
    }
    
    return <pre className="whitespace-pre-wrap overflow-auto">{parts}</pre>;
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Regex Tester</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4">
                <Label htmlFor="pattern">Regular Expression</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input 
                      id="pattern"
                      placeholder="Enter regex pattern here... (without / /)"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <Button 
                    onClick={testRegex} 
                    variant="secondary"
                  >
                    Test
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Don't include forward slashes or flags in the pattern
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {REGEX_FLAGS.map(({ flag, label, description }) => (
                  <div key={flag} className="flex items-center gap-1.5">
                    <Checkbox 
                      id={`flag-${flag}`}
                      checked={flagsState[flag]}
                      onCheckedChange={() => toggleFlag(flag)}
                    />
                    <Label 
                      htmlFor={`flag-${flag}`} 
                      className="text-sm cursor-pointer"
                      title={description}
                    >
                      {label} ({flag})
                    </Label>
                  </div>
                ))}
              </div>
              
              <Label htmlFor="test-string">Test String</Label>
              <Textarea 
                id="test-string"
                placeholder="Enter text to test the regex against..."
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="h-40"
              />
              
              {errorMessage && (
                <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Results</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Matches: {matches.length}</h4>
                  {matches.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const json = JSON.stringify(matches.map(m => m.value), null, 2);
                        navigator.clipboard.writeText(json);
                        toast({
                          title: "Copied to clipboard",
                          description: "Match results copied as JSON"
                        });
                      }}
                    >
                      Copy All
                    </Button>
                  )}
                </div>
                
                <Card className="bg-muted">
                  <CardContent className="p-4 max-h-[300px] overflow-y-auto">
                    {renderHighlightedText()}
                  </CardContent>
                </Card>
              </div>
              
              {matches.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Match Details</h4>
                  <div className="bg-muted rounded p-2 max-h-[200px] overflow-y-auto">
                    <ul className="space-y-2">
                      {matches.map((match, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-mono bg-primary/20 px-1 rounded mr-2">#{index + 1}</span>
                          <span className="font-mono">"{match.value}"</span>
                          <span className="text-muted-foreground ml-2">
                            (at position {match.start}-{match.end})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="examples">
            <TabsList className="w-full">
              <TabsTrigger value="examples" className="flex-1">Examples</TabsTrigger>
              <TabsTrigger value="cheatsheet" className="flex-1">Cheatsheet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="examples">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-3">Example Patterns</h3>
                  <div className="space-y-3">
                    {EXAMPLE_PATTERNS.map((example) => (
                      <div key={example.name}>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between text-left"
                          onClick={() => useExample(example.pattern)}
                        >
                          <span>{example.name}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cheatsheet">
              <Card>
                <CardContent className="p-4 h-[450px] overflow-y-auto">
                  <h3 className="text-lg font-medium mb-3">Regex Cheatsheet</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Character Classes</h4>
                      <ul className="text-sm space-y-1 mt-1">
                        <li><code className="bg-muted p-0.5 rounded">\d</code> - Any digit (0-9)</li>
                        <li><code className="bg-muted p-0.5 rounded">\w</code> - Any word character (a-z, A-Z, 0-9, _)</li>
                        <li><code className="bg-muted p-0.5 rounded">\s</code> - Any whitespace character</li>
                        <li><code className="bg-muted p-0.5 rounded">.</code> - Any character except newline</li>
                        <li><code className="bg-muted p-0.5 rounded">\D</code> - Any non-digit</li>
                        <li><code className="bg-muted p-0.5 rounded">\W</code> - Any non-word character</li>
                        <li><code className="bg-muted p-0.5 rounded">\S</code> - Any non-whitespace character</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Anchors</h4>
                      <ul className="text-sm space-y-1 mt-1">
                        <li><code className="bg-muted p-0.5 rounded">^</code> - Start of string</li>
                        <li><code className="bg-muted p-0.5 rounded">$</code> - End of string</li>
                        <li><code className="bg-muted p-0.5 rounded">\b</code> - Word boundary</li>
                        <li><code className="bg-muted p-0.5 rounded">\B</code> - Not word boundary</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Quantifiers</h4>
                      <ul className="text-sm space-y-1 mt-1">
                        <li><code className="bg-muted p-0.5 rounded">*</code> - 0 or more</li>
                        <li><code className="bg-muted p-0.5 rounded">+</code> - 1 or more</li>
                        <li><code className="bg-muted p-0.5 rounded">?</code> - 0 or 1</li>
                        <li><code className="bg-muted p-0.5 rounded">{"{n}"}</code> - Exactly n times</li>
                        <li><code className="bg-muted p-0.5 rounded">{"{n,}"}</code> - At least n times</li>
                        <li><code className="bg-muted p-0.5 rounded">{"{n,m}"}</code> - Between n and m times</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Groups & Ranges</h4>
                      <ul className="text-sm space-y-1 mt-1">
                        <li><code className="bg-muted p-0.5 rounded">[abc]</code> - Any of a, b, or c</li>
                        <li><code className="bg-muted p-0.5 rounded">[^abc]</code> - Not a, b, or c</li>
                        <li><code className="bg-muted p-0.5 rounded">[a-z]</code> - Any character a through z</li>
                        <li><code className="bg-muted p-0.5 rounded">(x)</code> - Capturing group</li>
                        <li><code className="bg-muted p-0.5 rounded">(?:x)</code> - Non-capturing group</li>
                        <li><code className="bg-muted p-0.5 rounded">x|y</code> - x or y</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
