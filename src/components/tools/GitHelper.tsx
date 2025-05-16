
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GitBranch, Terminal, Copy } from 'lucide-react';

// Common git commands organized by category
const gitCommands = {
  basics: [
    { name: 'Init Repository', command: 'git init', description: 'Initialize a new Git repository' },
    { name: 'Clone Repository', command: 'git clone <repository-url>', description: 'Clone a repository into a new directory' },
    { name: 'Add Files', command: 'git add <file-name>', description: 'Add file contents to the index' },
    { name: 'Add All Files', command: 'git add .', description: 'Add all changes to the index' },
    { name: 'Commit Changes', command: 'git commit -m "<message>"', description: 'Record changes to the repository' },
    { name: 'Push Changes', command: 'git push origin <branch-name>', description: 'Update remote refs along with associated objects' },
    { name: 'Pull Changes', command: 'git pull', description: 'Fetch from and integrate with another repository or branch' },
    { name: 'Status', command: 'git status', description: 'Show the working tree status' }
  ],
  branches: [
    { name: 'List Branches', command: 'git branch', description: 'List, create, or delete branches' },
    { name: 'Create Branch', command: 'git branch <branch-name>', description: 'Create a new branch' },
    { name: 'Switch Branch', command: 'git checkout <branch-name>', description: 'Switch branches' },
    { name: 'Create & Switch', command: 'git checkout -b <branch-name>', description: 'Create a new branch and switch to it' },
    { name: 'Delete Branch', command: 'git branch -d <branch-name>', description: 'Delete a branch' },
    { name: 'Merge Branch', command: 'git merge <branch-name>', description: 'Join two or more development histories together' }
  ],
  remote: [
    { name: 'Show Remotes', command: 'git remote -v', description: 'Show remote repositories' },
    { name: 'Add Remote', command: 'git remote add <name> <url>', description: 'Add a remote named <name> for the repository at <url>' },
    { name: 'Remove Remote', command: 'git remote remove <name>', description: 'Remove the remote named <name>' },
    { name: 'Fetch Remote', command: 'git fetch <remote-name>', description: 'Download objects and refs from another repository' }
  ],
  history: [
    { name: 'View Log', command: 'git log', description: 'Show commit logs' },
    { name: 'View Log Graph', command: 'git log --graph --oneline --decorate', description: 'Show commit logs with a graph' },
    { name: 'View Specific File History', command: 'git log -- <file-path>', description: 'Show commits that affected file' },
    { name: 'Show Changes', command: 'git show <commit-hash>', description: 'Show various types of objects' }
  ],
  advanced: [
    { name: 'Stash Changes', command: 'git stash', description: 'Stash the changes in a dirty working directory' },
    { name: 'Apply Stash', command: 'git stash apply', description: 'Apply stashed changes' },
    { name: 'Create Tag', command: 'git tag <tag-name>', description: 'Create a tag' },
    { name: 'Rebase Branch', command: 'git rebase <branch-name>', description: 'Reapply commits on top of another base' },
    { name: 'Reset to Commit', command: 'git reset --hard <commit-hash>', description: 'Reset current HEAD to the specified state' },
    { name: 'Clean Untracked Files', command: 'git clean -fd', description: 'Remove untracked files from the working tree' }
  ]
};

export default function GitHelper() {
  const [category, setCategory] = useState<keyof typeof gitCommands>('basics');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customCommand, setCustomCommand] = useState<string>('');
  const { toast } = useToast();

  // Filter commands based on search query
  const filteredCommands = searchQuery 
    ? Object.values(gitCommands).flat().filter(cmd => 
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : gitCommands[category];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Git command copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Git Command Helper</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <Input 
                  placeholder="Search for git commands..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {!searchQuery && (
                <Tabs value={category} onValueChange={(value) => setCategory(value as keyof typeof gitCommands)}>
                  <TabsList className="w-full grid grid-cols-5">
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="branches">Branches</TabsTrigger>
                    <TabsTrigger value="remote">Remote</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <div className="mt-6 space-y-3">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, index) => (
                    <div 
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{cmd.name}</h3>
                        <p className="text-sm text-muted-foreground">{cmd.description}</p>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded font-mono mt-1">
                          {cmd.command}
                        </code>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="mt-2 sm:mt-0 sm:ml-2"
                        onClick={() => copyToClipboard(cmd.command)}
                      >
                        <Copy size={16} className="mr-1" />
                        Copy
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No git commands found for '{searchQuery}'
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Custom Command</h2>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Enter a custom git command..."
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  className="min-h-[100px] font-mono"
                />
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCustomCommand('')}
                  >
                    Clear
                  </Button>
                  <Button 
                    onClick={() => customCommand && copyToClipboard(customCommand)}
                    disabled={!customCommand}
                  >
                    <Copy size={16} className="mr-1" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Quick References</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border p-2 rounded-md">
                    <GitBranch size={16} className="text-primary" />
                    <span className="text-sm">Default branch: <code className="font-mono">main</code> or <code className="font-mono">master</code></span>
                  </div>
                  <div className="flex items-center gap-2 border p-2 rounded-md">
                    <Terminal size={16} className="text-primary" />
                    <span className="text-sm">Use <code className="font-mono">git --help</code> for more info</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
