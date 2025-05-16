
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface TimeZone {
  name: string;
  offset: string;
  value: string;
}

const TIME_ZONES: TimeZone[] = [
  { name: 'UTC (Coordinated Universal Time)', offset: 'UTC+0:00', value: 'UTC' },
  { name: 'Pacific Time (US & Canada)', offset: 'UTC-8:00 / UTC-7:00', value: 'America/Los_Angeles' },
  { name: 'Mountain Time (US & Canada)', offset: 'UTC-7:00 / UTC-6:00', value: 'America/Denver' },
  { name: 'Central Time (US & Canada)', offset: 'UTC-6:00 / UTC-5:00', value: 'America/Chicago' },
  { name: 'Eastern Time (US & Canada)', offset: 'UTC-5:00 / UTC-4:00', value: 'America/New_York' },
  { name: 'London (United Kingdom)', offset: 'UTC+0:00 / UTC+1:00', value: 'Europe/London' },
  { name: 'Berlin (Germany)', offset: 'UTC+1:00 / UTC+2:00', value: 'Europe/Berlin' },
  { name: 'Mumbai (India)', offset: 'UTC+5:30', value: 'Asia/Kolkata' },
  { name: 'Tokyo (Japan)', offset: 'UTC+9:00', value: 'Asia/Tokyo' },
  { name: 'Sydney (Australia)', offset: 'UTC+10:00 / UTC+11:00', value: 'Australia/Sydney' },
];

export default function TimeZoneConverter() {
  const [fromZone, setFromZone] = useState<string>('UTC');
  const [toZone, setToZone] = useState<string>('America/New_York');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Detect user's timezone and set it as fromZone
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTimeZone) {
        // Find if it exists in our list
        const foundZone = TIME_ZONES.find(tz => tz.value === userTimeZone);
        if (foundZone) {
          setFromZone(foundZone.value);
        }
      }
    } catch (error) {
      console.error('Error detecting timezone:', error);
    }

    return () => clearInterval(interval);
  }, []);

  const formatTimeForZone = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleCopyTime = (timeZone: string) => {
    const formattedTime = formatTimeForZone(currentTime, timeZone);
    navigator.clipboard.writeText(formattedTime).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Time has been copied to clipboard",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy time to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Time Zone Converter</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={fromZone} onValueChange={setFromZone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.name} ({tz.offset})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-4">
              <p className="text-lg font-medium">Current Time:</p>
              <p className="text-2xl mt-2">{formatTimeForZone(currentTime, fromZone)}</p>
              <button 
                onClick={() => handleCopyTime(fromZone)}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Copy to clipboard
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={toZone} onValueChange={setToZone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.name} ({tz.offset})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-4">
              <p className="text-lg font-medium">Converted Time:</p>
              <p className="text-2xl mt-2">{formatTimeForZone(currentTime, toZone)}</p>
              <button 
                onClick={() => handleCopyTime(toZone)}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Copy to clipboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
