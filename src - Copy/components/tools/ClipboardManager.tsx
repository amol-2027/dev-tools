
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash, Plus, Search, X } from 'lucide-react';

// Type for clipboard items
interface ClipboardItem {
  id: string;
  text: string;
  category: string;
  createdAt: Date;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default categories
const DEFAULT_CATEGORIES = ['General', 'Code', 'Links'];

export default function ClipboardManager() {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>(() => {
    const savedItems = localStorage.getItem('clipboardItems');
    return savedItems 
      ? JSON.parse(savedItems).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }))
      : [];
  });
  const [newItem, setNewItem] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('clipboardCategories');
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newCategory, setNewCategory] = useState<string>('');
  const { toast } = useToast();

  // Save clipboard items to localStorage when they change
  useEffect(() => {
    localStorage.setItem('clipboardItems', JSON.stringify(clipboardItems));
  }, [clipboardItems]);

  // Save categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('clipboardCategories', JSON.stringify(categories));
  }, [categories]);

  const addClipboardItem = (category: string = 'General') => {
    if (!newItem.trim()) {
      toast({
        title: "Empty item",
        description: "Please enter some text to save to clipboard",
        variant: "destructive",
      });
      return;
    }

    const newClipboardItem: ClipboardItem = {
      id: generateId(),
      text: newItem,
      category,
      createdAt: new Date(),
    };

    setClipboardItems(prev => [newClipboardItem, ...prev]);
    setNewItem('');
    
    toast({
      title: "Item added",
      description: "New item added to clipboard history",
    });
  };

  const removeClipboardItem = (id: string) => {
    setClipboardItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item removed from clipboard history",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text copied to clipboard",
    });
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all clipboard items?')) {
      setClipboardItems([]);
      toast({
        title: "All items cleared",
        description: "All clipboard items have been removed",
      });
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    if (categories.includes(newCategory)) {
      toast({
        title: "Category exists",
        description: "This category already exists",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(prev => [...prev, newCategory]);
    setNewCategory('');
    
    toast({
      title: "Category added",
      description: `New category "${newCategory}" created`,
    });
  };

  const removeCategory = (category: string) => {
    // Cannot remove default categories
    if (DEFAULT_CATEGORIES.includes(category)) {
      toast({
        title: "Cannot remove",
        description: "Default categories cannot be removed",
        variant: "destructive",
      });
      return;
    }
    
    // Move items from this category to General
    setClipboardItems(prev => 
      prev.map(item => 
        item.category === category 
          ? { ...item, category: 'General' } 
          : item
      )
    );
    
    // Remove the category
    setCategories(prev => prev.filter(c => c !== category));
    
    // If active category is being removed, switch to 'all'
    if (activeCategory === category) {
      setActiveCategory('all');
    }
    
    toast({
      title: "Category removed",
      description: `Category "${category}" has been removed`,
    });
  };

  // Filter items based on active category and search query
  const filteredItems = clipboardItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Clipboard Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input 
                  placeholder="Add new clipboard item..." 
                  value={newItem} 
                  onChange={(e) => setNewItem(e.target.value)}
                  className="flex-1"
                />
                <Tabs defaultValue="General">
                  <TabsList>
                    {categories.slice(0, 3).map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {categories.map((category) => (
                    <TabsContent key={category} value={category}>
                      <Button onClick={() => addClipboardItem(category)}>
                        <Plus size={16} className="mr-1" />
                        Add to {category}
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search size={16} />
                  <Input 
                    placeholder="Search clipboard items..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                
                <Button variant="destructive" size="sm" onClick={clearAll} disabled={clipboardItems.length === 0}>
                  <Trash size={16} className="mr-1" />
                  Clear All
                </Button>
              </div>
              
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={activeCategory}>
                  {filteredItems.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {filteredItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-start justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                                {item.category}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                              {item.text}
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyToClipboard(item.text)}
                            >
                              <Copy size={16} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeClipboardItem(item.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchQuery 
                        ? `No items found for "${searchQuery}"` 
                        : activeCategory === 'all' 
                          ? "No clipboard items saved yet" 
                          : `No items in the ${activeCategory} category`
                      }
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Categories</h2>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="New category name..." 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addCategory} disabled={!newCategory.trim()}>
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <div 
                    key={category}
                    className="flex items-center justify-between p-2 rounded-md border"
                  >
                    <span>{category}</span>
                    {!DEFAULT_CATEGORIES.includes(category) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeCategory(category)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Statistics</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Total items:</span>
                  <span className="font-medium">{clipboardItems.length}</span>
                </div>
                {categories.map(category => {
                  const count = clipboardItems.filter(item => item.category === category).length;
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span>{category}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
