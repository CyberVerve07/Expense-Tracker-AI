"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Cake,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Gift,
  HeartHandshake,
  Mountain,
  Moon,
  Palette,
  PartyPopper,
  PersonStanding,
  Snowflake,
  Sparkles,
  Sun,
  Target,
  Zap
} from "lucide-react";
import { format, isSameDay, startOfDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import calendarData from "@/lib/calendar-data.json";
import DailyScheduleForm from "./daily-schedule-form";
import { textToSpeech } from "@/ai/flows/tts-flow";
import type { DailySchedule } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

type EventType = "holiday" | "event";
type EventCategory = "Gazetted" | "Restricted" | "Festival" | "Observance" | "Season";
type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";

type CalendarEvent = {
  date: string;
  name: string;
  type: EventType;
  icon: string;
  category: EventCategory;
  description: string;
};

const events = calendarData.events as CalendarEvent[];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const seasonThemes: Record<Season, string> = {
  winter: "bg-blue-900/10 border-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]",
  spring: "bg-emerald-900/10 border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]",
  summer: "bg-orange-900/10 border-orange-500/20 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]",
  monsoon: "bg-indigo-900/10 border-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]",
  autumn: "bg-rose-900/10 border-rose-500/20 shadow-[0_0_50px_-12px_rgba(244,63,94,0.3)]",
};

const categoryBadgeStyles: Record<EventCategory, string> = {
  Gazetted: "bg-rose-500/20 text-rose-400 border-rose-500/40 neon-glow-purple",
  Restricted: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  Festival: "bg-purple-500/20 text-purple-400 border-purple-500/40 neon-glow-cyan",
  Observance: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  Season: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
};

const seasonLabels: Record<Season, string> = {
  winter: "Cool Equilibrium",
  spring: "Vital Bloom",
  summer: "Solar Peak",
  monsoon: "Hydraulic Cycle",
  autumn: "Festive Harvest",
};

const seasonSummaries: Record<Season, string> = {
  winter: "Deep focus and strategic alignment as the year begins in quiet power.",
  spring: "A cycle of rebirth. Cultural energy peaks with vibrant festivals.",
  summer: "Mid-year optimization and spiritual grounding in the golden glow.",
  monsoon: "Reflective hydration for the spirit amidst national celebrations.",
  autumn: "The ultimate festive stretch from Navratri to the light of Diwali.",
};

const getSeason = (month: number): Season => {
  if (month >= 2 && month <= 3) return "spring";
  if (month >= 4 && month <= 6) return "summer";
  if (month >= 7 && month <= 8) return "monsoon";
  if (month >= 9 && month <= 10) return "autumn";
  return "winter";
};

const EventIcon = ({ icon, className }: { icon: string; className?: string }) => {
  switch (icon) {
    case "PartyPopper": return <PartyPopper className={className} />;
    case "Cake": return <Cake className={className} />;
    case "Flag": return <Flag className={className} />;
    case "Mountain": return <Mountain className={className} />;
    case "Palette": return <Palette className={className} />;
    case "HeartHandshake": return <HeartHandshake className={className} />;
    case "PersonStanding": return <PersonStanding className={className} />;
    case "Target": return <Target className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Gift": return <Gift className={className} />;
    case "Sun": return <Sun className={className} />;
    case "Snowflake": return <Snowflake className={className} />;
    case "Moon": return <Moon className={className} />;
    default: return <CalendarDays className={className} />;
  }
};

function formatDateToId(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date("2026-01-01"));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const season = getSeason(currentMonth);
  const today = startOfDay(new Date());

  const eventsForMonth = useMemo(() =>
      events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;
      }).sort((a, b) => a.date.localeCompare(b.date)),
    [currentMonth, currentYear]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of eventsForMonth) {
      const items = map.get(event.date) ?? [];
      items.push(event);
      map.set(event.date, items);
    }
    return map;
  }, [eventsForMonth]);

  const categoryCounts = useMemo(() => {
    return eventsForMonth.reduce<Record<EventCategory, number>>(
      (acc, event) => {
        acc[event.category] += 1;
        return acc;
      },
      { Gazetted: 0, Restricted: 0, Festival: 0, Observance: 0, Season: 0 }
    );
  }, [eventsForMonth]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateId = formatDateToId(selectedDate);
    return eventsByDate.get(dateId) ?? [];
  }, [selectedDate, eventsByDate]);

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [audioSrc]);

  const handleSeasonSound = async () => {
    try {
      const { media } = await textToSpeech(season);
      setAudioSrc(media);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  return (
    <div className="space-y-12">
      {/* Cinematic Header */}
      <section className={cn(
        "relative overflow-hidden rounded-[48px] border p-8 md:p-12 glass-card transition-all duration-1000",
        seasonThemes[season]
      )}>
        {/* Animated Background Elements */}
        {season === "winter" && <div className="snow opacity-40" />}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <CalendarDays className="h-64 w-64" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="rounded-full bg-white/10 px-6 py-1.5 text-xs font-bold tracking-[0.2em] uppercase border-white/10 backdrop-blur-xl">
                  Temporal Grid 2026
                </Badge>
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm font-outfit font-medium text-white/60 uppercase tracking-widest">
                  {seasonLabels[season]}
                </span>
              </div>
              <div className="space-y-4">
                <h2 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-white">
                  {monthNames[currentMonth]}
                </h2>
                <p className="max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed font-outfit">
                  {seasonSummaries[season]} <span className="text-white/40">Mapped with India Gazetted holidays and local festival cycles.</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black/20 p-2 rounded-full border border-white/5 backdrop-blur-3xl">
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full hover:bg-white/10" onClick={handlePrevMonth}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="ghost" className="rounded-full px-6 h-14 font-outfit font-bold group" onClick={handleSeasonSound}>
                <Sparkles className="mr-3 h-5 w-5 text-cyan-400 group-hover:animate-spin" />
                Season Audio
              </Button>
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full hover:bg-white/10" onClick={handleNextMonth}>
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(categoryCounts).map(([key, count]) => (
              <div key={key} className="rounded-3xl border border-white/5 bg-white/5 p-6 group hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-4">{key}</p>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-outfit font-black text-white">{count}</span>
                  <div className={cn("h-2 w-2 rounded-full", categoryBadgeStyles[key as EventCategory].split(' ')[0])} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <Card className="glass-card bg-transparent overflow-hidden rounded-[40px] border-white/5">
          <CardContent className="p-4 md:p-8">
            <div className="mb-8 grid grid-cols-7 gap-4 text-center">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="text-[10px] font-black tracking-widest text-white/30">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                    key={currentMonth}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-7 grid grid-cols-7 gap-2 md:gap-4"
                >
                    {emptyDays.map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square rounded-3xl bg-white/[0.02]" />
                    ))}

                    {days.map((day) => {
                        const dayDate = new Date(currentYear, currentMonth, day);
                        const dateId = formatDateToId(dayDate);
                        const dayEvents = eventsByDate.get(dateId) ?? [];
                        const isToday = isSameDay(dayDate, today);
                        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
                        const isPrimaryHoliday = dayEvents.some((event) => event.category === "Gazetted");

                        return (
                        <motion.button
                            key={dateId}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setSelectedDate(dayDate); setIsDialogOpen(true); }}
                            className={cn(
                            "group relative aspect-square rounded-[28px] md:rounded-[40px] border p-2 text-left transition-all overflow-hidden",
                            isWeekend ? "bg-white/[0.03]" : "bg-white/[0.05]",
                            isPrimaryHoliday ? "border-rose-500/40 neon-glow-purple" : "border-white/5 shadow-xl",
                            isToday && "border-cyan-400 ring-2 ring-cyan-400/20 neon-glow-cyan",
                            "hover:border-white/20"
                            )}
                        >
                            <div className="flex flex-col h-full justify-between items-center py-2 md:py-4">
                                <span className={cn(
                                    "text-lg md:text-2xl font-outfit font-black mb-1",
                                    isToday ? "text-cyan-400" : "text-white/60 group-hover:text-white"
                                )}>
                                    {day}
                                </span>
                                {dayEvents.length > 0 && (
                                    <div className="flex gap-1">
                                        {dayEvents.slice(0, 3).map((e, idx) => (
                                            <div key={idx} className={cn("h-1.5 w-1.5 rounded-full", categoryBadgeStyles[e.category].split(' ')[0])} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.button>
                        );
                    })}
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <Card className="glass-card bg-white/[0.03] border-white/5 rounded-[40px] p-8">
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                        <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-outfit font-bold">Month Focus</h3>
                </div>
                
                <div className="space-y-4">
                    {eventsForMonth.slice(0, 4).map((event) => (
                        <div key={`${event.date}-${event.name}`} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-cyan-400/5 text-cyan-300">
                                    <EventIcon icon={event.icon} className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-outfit font-bold text-lg">{event.name}</p>
                                    <p className="text-sm text-white/40 mb-2">{format(new Date(event.date), "dd MMMM")}</p>
                                    <Badge className={cn("text-[9px] font-black uppercase tracking-widest bg-transparent border", categoryBadgeStyles[event.category])}>
                                        {event.category}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </Card>

          <Card className="glass-card bg-gradient-to-br from-cyan-500/10 to-transparent border-white/10 rounded-[40px] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target className="h-24 w-24 text-cyan-400" />
            </div>
            <h3 className="text-xl font-outfit font-bold mb-4">Precision Planning</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
                Tap any grid coordinate to initialize daily protocol logs. AI synthesis active.
            </p>
            <div className="h-1 lg:w-3/4 bg-white/10 rounded-full" />
          </Card>
        </div>
      </div>

      {/* Dialog Redesign */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl glass-card border-white/10 bg-black/90 text-white rounded-[48px] p-8 md:p-12">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-4xl md:text-5xl font-outfit font-black tracking-tighter">
              {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </DialogTitle>
            <DialogDescription className="text-lg text-white/40">
              Protocol initialization for selected temporal coordinate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {selectedDateEvents.map((event) => (
                <div key={event.name} className="p-6 rounded-[32px] bg-white/5 border border-white/10">
                    <div className="flex items-start gap-4 text-white">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            <EventIcon icon={event.icon} className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-xl font-bold">{event.name}</h4>
                                <Badge className={cn("uppercase text-[10px]", categoryBadgeStyles[event.category])}>
                                    {event.category}
                                </Badge>
                            </div>
                            <p className="text-white/60 leading-relaxed">{event.description}</p>
                        </div>
                    </div>
                </div>
            ))}
            
            {selectedDate && (
                <div className="mt-8">
                    <DailyScheduleForm date={selectedDate} scheduleData={null} onClose={() => setIsDialogOpen(false)} />
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {audioSrc && <audio ref={audioRef} src={audioSrc} />}
    </div>
  );
}
