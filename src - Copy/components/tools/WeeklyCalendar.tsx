
import React, { useState, useEffect } from 'react';
import { add, format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent } from '@/types';

export default function WeeklyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        return parsedEvents.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
      } catch (error) {
        console.error('Failed to parse calendar events', error);
        return [];
      }
    }
    return [];
  });
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    color: '#3b82f6',
    tags: [],
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  // Save events to localStorage
  useEffect(() => {
    const eventsForStorage = events.map(event => ({
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    }));
    localStorage.setItem('calendarEvents', JSON.stringify(eventsForStorage));
  }, [events]);

  // Calculate days of current week
  useEffect(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days);
  }, [currentDate]);

  const handlePrevWeek = () => {
    setCurrentDate(prev => add(prev, { weeks: -1 }));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => add(prev, { weeks: 1 }));
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) {
      toast({
        title: 'Error',
        description: 'Please provide a title and select a date',
        variant: 'destructive',
      });
      return;
    }

    const start = new Date(selectedDate);
    start.setHours(9, 0, 0, 0); // Default to 9:00 AM

    const end = new Date(selectedDate);
    end.setHours(10, 0, 0, 0); // Default to 10:00 AM

    const createdEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newEvent.title,
      description: newEvent.description || '',
      color: newEvent.color || '#3b82f6',
      start,
      end,
      tags: newEvent.tags || [],
    };

    setEvents(prev => [...prev, createdEvent]);
    setNewEvent({
      title: '',
      description: '',
      color: '#3b82f6',
      tags: [],
    });
    setSelectedDate(null);
    setIsDialogOpen(false);

    toast({
      title: 'Event added',
      description: createdEvent.title,
    });
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.start, day));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Weekly Calendar</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newEvent.title || ''}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEvent.description || ''}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Event description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  onChange={e => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={newEvent.color || '#3b82f6'}
                  onChange={e => setNewEvent({ ...newEvent, color: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newEvent.tags?.join(',') || ''}
                  onChange={e => setNewEvent({ 
                    ...newEvent, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                  })}
                  placeholder="work, meeting, important"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleAddEvent}>Add Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>
              {format(weekDays[0] || new Date(), 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 bg-secondary">
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className="p-2 text-center font-medium border-b border-r last:border-r-0"
              >
                <div className="text-sm uppercase">{format(day, 'EEE')}</div>
                <div className={`
                  w-10 h-10 rounded-full mx-auto flex items-center justify-center
                  ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : ''}
                `}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 h-[calc(100vh-400px)] min-h-[500px]">
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className="border-r last:border-r-0 p-2 overflow-y-auto"
              >
                {getEventsForDay(day).map(event => (
                  <div
                    key={event.id}
                    className="mb-2 p-2 rounded text-white text-sm"
                    style={{ backgroundColor: event.color }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </div>
                    {event.description && (
                      <div className="text-xs mt-1 opacity-90">{event.description}</div>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-1 border border-dashed border-gray-300 text-muted-foreground"
                  onClick={() => {
                    setSelectedDate(day);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="text-xs">Add</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
