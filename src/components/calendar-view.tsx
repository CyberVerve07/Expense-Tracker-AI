
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Cake, PartyPopper, Sun, Snowflake, Flag, Mountain, Palette, HeartHandshake, PersonStanding, Target, Sparkles, Gift, Moon, IceCream, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import calendarData from '@/lib/calendar-data.json';
import { cn } from '@/lib/utils';
import DailyScheduleForm from './daily-schedule-form';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { DailySchedule } from '@/lib/types';
import { startOfMonth, endOfMonth, format, isSameDay, isBefore, startOfDay } from 'date-fns';


type Event = {
  date: string;
  name: string;
  type: 'holiday' | 'event';
  icon: string;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getSeason = (month: number) => {
    if (month >= 2 && month <= 3) return 'spring'; // Mar, Apr
    if (month >= 4 && month <= 6) return 'summer'; // May, Jun, Jul
    if (month >= 7 && month <= 8) return 'monsoon'; // Aug, Sep
    if (month >= 9 && month <= 10) return 'autumn'; // Oct, Nov
    return 'winter'; // Dec, Jan, Feb
}

const UmbrellaIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-umbrella", className)}>
        <path d="M22 12a10.06 10.06 1 0 0-20 0Z"/>
        <path d="M12 12v8a2 2 0 0 0 4 0"/>
        <path d="M12 2v1"/>
    </svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-leaf", className)}>
        <path d="M22 22L2 22"></path><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.24879 20.9427 6.75487 19.2319 4.93181"></path><path d="M22 2L12 12"></path>
    </svg>
);


const seasonThemes = {
    winter: 'from-blue-400 to-sky-500 dark:from-blue-900/80 dark:to-sky-800/80',
    spring: 'from-green-400 to-yellow-400 dark:from-green-900/80 dark:to-yellow-800/80',
    summer: 'from-yellow-400 to-orange-500 dark:from-yellow-800/80 dark:to-orange-900/80',
    autumn: 'from-orange-500 to-red-500 dark:from-orange-900/80 dark:to-red-800/80',
    monsoon: 'from-indigo-500 to-slate-600 dark:from-indigo-800/80 dark:to-slate-700/80',
}

const seasonIcons = {
    winter: <Snowflake className="h-5 w-5 text-sky-500" />,
    spring: <PartyPopper className="h-5 w-5 text-green-500" />,
    summer: <Sun className="h-5 w-5 text-orange-500" />,
    autumn: <LeafIcon className="h-5 w-5 text-orange-600" />,
    monsoon: <UmbrellaIcon className="h-5 w-5 text-blue-500" />
}

const EventIcon = ({ icon, className }: { icon: string, className?: string }) => {
    switch (icon) {
        case 'PartyPopper': return <PartyPopper className={className} />;
        case 'Cake': return <Cake className={className} />;
        case 'Flag': return <Flag className={className} />;
        case 'Mountain': return <Mountain className={className} />;
        case 'Palette': return <Palette className={className} />;
        case 'HeartHandshake': return <HeartHandshake className={className} />;
        case 'PersonStanding': return <PersonStanding className={className} />;
        case 'Target': return <Target className={className} />;
        case 'Sparkles': return <Sparkles className={className} />;
        case 'Gift': return <Gift className={className} />;
        case 'Sun': return <Sun className={className} />;
        case 'Snowflake': return <Snowflake className={className} />;
        case 'Moon': return <Moon className={className} />;
        case 'IceCream': return <IceCream className={className} />;
        case 'Umbrella': return <UmbrellaIcon className={className} />;
        default: return null;
    }
}

function formatDateToId(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-01'));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { user, firestore, isUserLoading } = useFirebase();
  
  const scheduleId = selectedDate ? formatDateToId(selectedDate) : null;
  const scheduleRef = useMemoFirebase(() => {
      if (!user || !scheduleId || !firestore) return null;
      return doc(firestore, 'users', user.uid, 'schedules', scheduleId);
  }, [user, scheduleId, firestore]);

  const { data: scheduleData } = useDoc<DailySchedule>(scheduleRef);

  const monthSchedulesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return query(
        collection(firestore, 'users', user.uid, 'schedules'),
        where('date', '>=', start.toISOString()),
        where('date', '<=', end.toISOString())
    );
  }, [user, firestore, currentDate]);

  const { data: monthSchedules } = useCollection<DailySchedule>(monthSchedulesQuery);

  const loggedDays = useMemo(() => {
    if (!monthSchedules) return new Set();
    return new Set(monthSchedules.map(s => format(new Date(s.date), 'yyyy-MM-dd')));
  }, [monthSchedules]);


  useEffect(() => {
    if (audioSrc && audioRef.current) {
        audioRef.current.play();
    }
  }, [audioSrc]);

  const handleSeasonSound = async (season: string) => {
    try {
        const { media } = await textToSpeech(season);
        setAudioSrc(media);
    } catch (error) {
        console.error("Error generating speech:", error);
    }
  };

  const handleDayClick = (dayDate: Date) => {
    const today = startOfDay(new Date());
    
    // For demonstration in 2024, we treat all of 2026 as clickable.
    // In a real scenario, you might want to prevent clicking future/past dates.
    const isPastDay = isBefore(dayDate, today) && !isSameDay(dayDate, today);

    // Make all days clickable for demonstration, but you could re-add restrictions here.
    // if (isPastDay) {
    //     return; // Do nothing for past days if you want to restrict it
    // }
    
    // The form can now be opened by any user. The form itself will handle
    // the logic of whether the user can save data or not.
    setSelectedDate(dayDate);
    setIsDialogOpen(true);
  }

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const season = getSeason(currentMonth);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const eventsForMonth = calendarData.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  const today = startOfDay(new Date());

  return (
    <Card className={cn('mt-8 shadow-lg w-full transition-all duration-500 bg-gradient-to-br overflow-hidden relative', seasonThemes[season])}>
      {season === 'winter' && <div className="snow" />}
      {season === 'spring' && <div className="spring-petals" />}
      {season === 'summer' && <div className="summer-heatwave" />}
      {season === 'monsoon' && <div className="monsoon-umbrellas" />}
      {season === 'autumn' && <div className="autumn-leaves" />}
      
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleSeasonSound(season)}>
                    {seasonIcons[season]}
                </Button>
                <CardTitle className="text-2xl md:text-3xl font-headline">
                    {monthNames[currentMonth]} {currentYear}
                </CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <Badge variant={season === 'summer' || season === 'spring' ? 'default' : 'secondary'} className="capitalize text-sm">{season}</Badge>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={cn("text-center font-bold text-foreground/80", day === 'Sun' && 'text-red-500')}>{day}</div>
                ))}
                {emptyDays.map((_, index) => <div key={`empty-${index}`} />)}
                {days.map(day => {
                    const dayDate = new Date(currentYear, currentMonth, day);
                    const dayOfWeek = dayDate.getDay();
                    const dayEvents = eventsForMonth.filter(e => new Date(e.date).getDate() === day);
                    const isToday = isSameDay(dayDate, today);
                    const isPastDay = isBefore(dayDate, today) && !isToday;

                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const isDayLogged = loggedDays.has(formatDateToId(dayDate));
                    
                    const isDiwali = dayEvents.some(e => e.name.toLowerCase().includes('diwali'));

                    const dayClassName = cn(
                        'border rounded-lg p-2 h-40 flex flex-col relative transition-all duration-300 bg-background/50 cursor-pointer hover:bg-primary/10 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30',
                        isWeekend && 'bg-muted/50',
                        isDiwali && 'animate-glow',
                        isDayLogged && 'border-green-500 bg-green-500/10',
                        isToday && 'animate-glow',
                        // isPastDay && 'opacity-50 bg-background/20 cursor-not-allowed', // Removed for demo purposes
                    );

                    return (
                        <div key={day} onClick={() => handleDayClick(dayDate)} className={dayClassName}>
                            <span className={cn('font-bold text-2xl', dayOfWeek === 0 && 'text-red-500')}>{day}</span>
                            <div className="flex-grow overflow-y-auto text-xs mt-1 space-y-1">
                                {dayEvents.map(event => (
                                    <Tooltip key={event.name}>
                                        <TooltipTrigger className="w-full">
                                            <div className={`flex items-center gap-1.5 p-1.5 rounded-md text-left font-semibold ${event.type === 'holiday' ? 'bg-accent/30 text-accent-foreground' : 'bg-secondary'}`}>
                                                <EventIcon icon={event.icon} className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{event.name}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{event.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                            {isDayLogged && (
                                <div className="absolute bottom-1 right-1 flex items-center gap-1 text-green-600 font-semibold text-xs bg-white/80 dark:bg-black/80 px-2 py-1 rounded-full">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Day Logged</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Daily Schedule: {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</DialogTitle>
                        <DialogDescription>
                            Plan your day. { !user && "Log in to save your changes."}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedDate && <DailyScheduleForm date={selectedDate} scheduleData={scheduleData} onClose={() => setIsDialogOpen(false)} />}
                </DialogContent>
            </Dialog>

        </TooltipProvider>
      </CardContent>
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}
    </Card>
  );
}
