
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
}

export default function MindMap() {
  const [rootNode, setRootNode] = useState<MindMapNode>({
    id: 'root',
    text: 'Main Concept',
    children: [],
  });
  const { toast } = useToast();

  const handleNodeTextChange = (nodeId: string, newText: string, parentNodes: MindMapNode[] = [rootNode]) => {
    for (let i = 0; i < parentNodes.length; i++) {
      const node = parentNodes[i];
      
      if (node.id === nodeId) {
        // Update this node's text
        node.text = newText;
        // Create a new root to trigger re-render
        setRootNode({ ...rootNode });
        return true;
      }
      
      // Check children recursively
      if (node.children.length > 0) {
        const found = handleNodeTextChange(nodeId, newText, node.children);
        if (found) return true;
      }
    }
    
    return false;
  };

  const addChildNode = (parentId: string, parentNodes: MindMapNode[] = [rootNode]) => {
    for (let i = 0; i < parentNodes.length; i++) {
      const node = parentNodes[i];
      
      if (node.id === parentId) {
        // Add a child to this node
        const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        node.children.push({
          id: newId,
          text: 'New Node',
          children: [],
        });
        // Create a new root to trigger re-render
        setRootNode({ ...rootNode });
        return true;
      }
      
      // Check children recursively
      if (node.children.length > 0) {
        const found = addChildNode(parentId, node.children);
        if (found) return true;
      }
    }
    
    return false;
  };

  const deleteNode = (nodeId: string, parentNodes: MindMapNode[] = [rootNode]) => {
    for (let i = 0; i < parentNodes.length; i++) {
      const node = parentNodes[i];
      
      // Check if any child of this node matches nodeId
      const childIndex = node.children.findIndex(child => child.id === nodeId);
      
      if (childIndex !== -1) {
        // Remove the child
        node.children.splice(childIndex, 1);
        // Create a new root to trigger re-render
        setRootNode({ ...rootNode });
        return true;
      }
      
      // Check node's children recursively
      if (node.children.length > 0) {
        const found = deleteNode(nodeId, node.children);
        if (found) return true;
      }
    }
    
    return false;
  };

  const exportMindMap = () => {
    const jsonString = JSON.stringify(rootNode, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'mindmap.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Mind Map Exported",
      description: "Your mind map has been exported as JSON",
    });
  };

  const renderNode = (node: MindMapNode, level: number = 0) => {
    const margins = ['ml-0', 'ml-6', 'ml-12', 'ml-16', 'ml-20', 'ml-24', 'ml-28', 'ml-32'];
    const marginClass = margins[level] || margins[margins.length - 1];
    const isRoot = node.id === 'root';
    
    return (
      <div key={node.id} className={`mb-3 ${marginClass}`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${isRoot ? 'bg-primary/20 min-w-40' : 'bg-muted min-w-32'}`}>
            <Input 
              value={node.text}
              onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
              className="border-none bg-transparent p-0 h-auto focus-visible:ring-0"
            />
          </div>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => addChildNode(node.id)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          
          {!isRoot && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-destructive"
              onClick={() => deleteNode(node.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mind Map Builder</h1>
        <Button variant="outline" onClick={exportMindMap}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="min-h-[500px]">
            {renderNode(rootNode)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
