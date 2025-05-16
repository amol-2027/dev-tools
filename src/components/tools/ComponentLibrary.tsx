
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ComponentLibrary() {
  const [progress, setProgress] = useState<number>(45);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Component Library</h1>
      
      <Tabs defaultValue="interactive">
        <TabsList className="mb-6">
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[600px] rounded-md">
          <div className="p-1">
            <TabsContent value="interactive">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>Interactive button components</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Variants</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sizes</Label>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm">Small</Button>
                        <Button>Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon"><span>+</span></Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>States</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button>Active</Button>
                        <Button disabled>Disabled</Button>
                        <Button className="animate-pulse">Loading...</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tabs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tabs</CardTitle>
                    <CardDescription>Switch between different views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="tab1" className="w-full">
                      <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="p-4">
                        Tab 1 content
                      </TabsContent>
                      <TabsContent value="tab2" className="p-4">
                        Tab 2 content
                      </TabsContent>
                      <TabsContent value="tab3" className="p-4">
                        Tab 3 content
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                {/* Accordion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Accordion</CardTitle>
                    <CardDescription>Vertically collapsing content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Section 1</AccordionTrigger>
                        <AccordionContent>
                          Content for section 1. This content can be expanded or collapsed.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Section 2</AccordionTrigger>
                        <AccordionContent>
                          Content for section 2. Click the header to toggle visibility.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Section 3</AccordionTrigger>
                        <AccordionContent>
                          Content for section 3. Accordions are great for FAQs.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="display">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cards */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cards</CardTitle>
                    <CardDescription>Versatile container components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Cards can be used to group related content and actions.
                      They provide a flexible container for displaying various types of content.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
                
                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle>Badges</CardTitle>
                    <CardDescription>Small status indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Variants</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Usage Examples</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge>New</Badge>
                        <Badge variant="secondary">Updated</Badge>
                        <Badge variant="destructive">Error</Badge>
                        <Badge variant="outline">Archived</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Separator */}
                <Card>
                  <CardHeader>
                    <CardTitle>Separators</CardTitle>
                    <CardDescription>Create divisions between content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Horizontal separator</p>
                    <Separator />
                    <p>With content</p>
                    <div className="flex items-center">
                      <span className="w-full h-[1px] bg-border"></span>
                      <span className="px-2 text-muted-foreground text-sm">OR</span>
                      <span className="w-full h-[1px] bg-border"></span>
                    </div>
                    
                    <div className="flex items-start gap-4 h-20">
                      <div>Left</div>
                      <Separator orientation="vertical" />
                      <div>Right</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="layout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Grid Example */}
                <Card>
                  <CardHeader>
                    <CardTitle>Grid Layout</CardTitle>
                    <CardDescription>Responsive grid system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {Array(8)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="bg-muted h-8 rounded-md flex items-center justify-center text-xs">
                            {i + 1}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Flex Example */}
                <Card>
                  <CardHeader>
                    <CardTitle>Flex Layout</CardTitle>
                    <CardDescription>Flexible box layouts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label>Row (default)</Label>
                    <div className="flex gap-2 mb-4">
                      <div className="bg-muted h-8 w-12 rounded-md flex items-center justify-center text-xs">1</div>
                      <div className="bg-muted h-8 w-12 rounded-md flex items-center justify-center text-xs">2</div>
                      <div className="bg-muted h-8 w-12 rounded-md flex items-center justify-center text-xs">3</div>
                    </div>
                    
                    <Label>Column</Label>
                    <div className="flex flex-col gap-2">
                      <div className="bg-muted h-8 rounded-md flex items-center justify-center text-xs">1</div>
                      <div className="bg-muted h-8 rounded-md flex items-center justify-center text-xs">2</div>
                      <div className="bg-muted h-8 rounded-md flex items-center justify-center text-xs">3</div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Scroll Area */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scroll Area</CardTitle>
                    <CardDescription>Custom scrollable content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div>
                        <p className="mb-4">This is a scrollable area with custom scrollbars.</p>
                        {Array(10)
                          .fill(0)
                          .map((_, i) => (
                            <p key={i} className="mb-4">
                              Scroll item {i + 1}. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="forms">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Text Inputs</CardTitle>
                    <CardDescription>Different types of text inputs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-input">Default Input</Label>
                      <Input id="default-input" placeholder="Enter text..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="disabled-input">Disabled Input</Label>
                      <Input id="disabled-input" placeholder="Disabled input" disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="textarea">Textarea</Label>
                      <Textarea id="textarea" placeholder="Enter multiple lines of text..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="with-icon">With Icon</Label>
                      <div className="relative">
                        <Input id="with-icon" placeholder="Search..." />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Selection Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle>Selection Controls</CardTitle>
                    <CardDescription>Various input selection types</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Checkbox</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="checkbox-1" />
                          <Label htmlFor="checkbox-1">Option 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="checkbox-2" checked />
                          <Label htmlFor="checkbox-2">Option 2 (checked)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="checkbox-3" disabled />
                          <Label htmlFor="checkbox-3" className="text-muted-foreground">Option 3 (disabled)</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Radio Group</Label>
                      <RadioGroup defaultValue="option-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-1" id="radio-1" />
                          <Label htmlFor="radio-1">Option 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-2" id="radio-2" />
                          <Label htmlFor="radio-2">Option 2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-3" id="radio-3" disabled />
                          <Label htmlFor="radio-3" className="text-muted-foreground">Option 3 (disabled)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Switch</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="switch-1" />
                        <Label htmlFor="switch-1">Toggle feature</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Select</Label>
                      <Select defaultValue="apple">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="grape">Grape</SelectItem>
                          <SelectItem value="pear">Pear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Slider</Label>
                      <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Form Example */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Form Example</CardTitle>
                    <CardDescription>Complete form with multiple fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" placeholder="Doe" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Type your message here..." className="h-32" />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">I agree to the terms and conditions</Label>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Submit</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Alert */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                    <CardDescription>Informational messages for users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTitle>Information</AlertTitle>
                      <AlertDescription>
                        This is an informational alert for something that needs attention.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Something went wrong. Please try again later.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md">
                      <h4 className="font-medium">Success</h4>
                      <p className="text-sm">
                        Your changes have been saved successfully.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-md">
                      <h4 className="font-medium">Warning</h4>
                      <p className="text-sm">
                        This action cannot be undone. Please proceed carefully.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>Indicators for ongoing operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Default Progress</Label>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Indeterminate Progress</Label>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="animate-indeterminate-progress h-full w-1/3 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Progress Controls</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setProgress(Math.max(0, progress - 10))}
                          disabled={progress <= 0}
                        >
                          -10%
                        </Button>
                        <Button
                          onClick={() => setProgress(Math.min(100, progress + 10))}
                          disabled={progress >= 100}
                        >
                          +10%
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setProgress(0)}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Loading States */}
                <Card>
                  <CardHeader>
                    <CardTitle>Loading States</CardTitle>
                    <CardDescription>Indicators for loading states</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Spinner</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm">Loading...</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Button Loading State</Label>
                      <Button disabled className="w-32">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Loading
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Skeleton</Label>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse"></div>
                        <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse"></div>
                        <div className="h-4 w-2/3 rounded-md bg-muted animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tooltips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tooltips & Overlays</CardTitle>
                    <CardDescription>Informational elements that appear on hover</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Simple Tooltip</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" className="group relative">
                            Hover me
                            <span className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                              Tooltip
                            </span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Badge with Tooltip</Label>
                        <div className="flex items-center gap-2">
                          <div className="relative group">
                            <Badge variant="secondary">12 New</Badge>
                            <span className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded whitespace-nowrap">
                              12 unread notifications
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
