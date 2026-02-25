
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
        <path d="M22 12a10.06 10.06 1 0 0-20 0Z" />
        <path d="M12 12v8a2 2 0 0 0 4 0" />
        <path d="M12 2v1" />
    </svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-leaf", className)}>
        <path d="M22 22L2 22"></path><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.24879 20.9427 6.75487 19.2319 4.93181"></path><path d="M22 2L12 12"></path>
    </svg>
);


const seasonThemes = {
    winter: 'from-blue-400/20 to-sky-500/20 dark:from-blue-900/30 dark:to-sky-800/30',
    spring: 'from-green-400/20 to-yellow-400/20 dark:from-green-900/30 dark:to-yellow-800/30',
    summer: 'from-yellow-400/20 to-orange-500/20 dark:from-yellow-800/30 dark:to-orange-900/30',
    autumn: 'from-orange-500/20 to-red-500/20 dark:from-orange-900/30 dark:to-red-800/30',
    monsoon: 'from-indigo-500/20 to-slate-600/20 dark:from-indigo-800/30 dark:to-slate-700/30',
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

            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/40">
                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
                    <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-background/80" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-background/50" onClick={() => handleSeasonSound(season)}>
                            {seasonIcons[season]}
                        </Button>
                        <CardTitle className="text-2xl md:text-4xl font-headline tracking-tight">
                            {monthNames[currentMonth]} {currentYear}
                        </CardTitle>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-background/80" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Badge variant={season === 'summer' || season === 'spring' ? 'default' : 'secondary'} className="capitalize text-sm px-4 py-1.5 rounded-full shadow-sm">{season}</Badge>
            </CardHeader>
            <CardContent className="pt-6">
                <TooltipProvider delayDuration={100}>
                    <div className="grid grid-cols-7 gap-2 md:gap-3 lg:gap-4 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className={cn("text-center text-xs md:text-sm font-semibold tracking-wider uppercase text-muted-foreground", day === 'Sun' && 'text-destructive/80')}>{day}</div>
                        ))}
                        {emptyDays.map((_, index) => <div key={`empty-${index}`} />)}
                        {days.map(day => {
                            const dayDate = new Date(currentYear, currentMonth, day);
                            const dayOfWeek = dayDate.getDay();
                            const dayEvents = eventsForMonth.filter(e => new Date(e.date).getDate() === day);
                            const isToday = isSameDay(dayDate, today);

                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const isDayLogged = loggedDays.has(formatDateToId(dayDate));

                            const isDiwali = dayEvents.some(e => e.name.toLowerCase().includes('diwali'));

                            const dayClassName = cn(
                                'group border border-border/60 rounded-xl p-2 md:p-3 min-h-[100px] md:min-h-[140px] flex flex-col relative transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm',
                                isWeekend ? 'bg-muted/20' : 'bg-background/60 backdrop-blur-[2px]',
                                isDiwali && 'ring-2 ring-orange-400/50',
                                isDayLogged && 'border-green-500/30 bg-green-500/5',
                                isToday && 'border-primary ring-1 ring-primary bg-primary/5',
                            );

                            return (
                                <div key={day} onClick={() => handleDayClick(dayDate)} className={dayClassName}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            'flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full text-sm md:text-base font-medium',
                                            isToday ? 'bg-primary text-primary-foreground font-bold shadow-md' : (dayOfWeek === 0 ? 'text-destructive font-semibold' : 'text-foreground font-semibold'),
                                            isDayLogged && !isToday && 'text-green-600 dark:text-green-400'
                                        )}>{day}</span>
                                        {isDayLogged && (
                                            <div className="text-green-500 opacity-80" title="Day Logged">
                                                <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow overflow-y-auto mt-1 space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-muted">
                                        {dayEvents.map(event => (
                                            <Tooltip key={event.name}>
                                                <TooltipTrigger className="w-full">
                                                    <div className={cn(
                                                        "flex items-center gap-1.5 px-2 py-1 md:py-1.5 rounded-lg text-left text-[10px] md:text-xs font-medium transition-colors border",
                                                        event.type === 'holiday'
                                                            ? 'bg-red-50/80 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50'
                                                            : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border/50'
                                                    )}>
                                                        <EventIcon icon={event.icon} className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0 opacity-80" />
                                                        <span className="truncate">{event.name}</span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p className="font-semibold text-sm">{event.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Daily Schedule: {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</DialogTitle>
                                <DialogDescription>
                                    Plan your day. {!user && "Log in to save your changes."}
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
