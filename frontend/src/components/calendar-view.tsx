"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Cake,
  CalendarDays,
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
  Zap,
  Droplets,
  Leaf,
  Flame
} from "lucide-react";
import { format, isSameDay, startOfDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import calendarData from "@/lib/calendar-data.json";
import DailyScheduleForm from "./daily-schedule-form";
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UNIQUE SEASONAL THEMES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type SeasonTheme = {
  card: string;
  accent: string;
  headerBg: string;
  dayHover: string;
  todayRing: string;
  label: string;
  summary: string;
  icon: React.ReactNode;
  particles: string;
  accentColor: string;
};

const seasonThemes: Record<Season, SeasonTheme> = {
  winter: {
    card: "bg-blue-950/30 border-blue-400/20 shadow-[0_0_60px_-12px_rgba(147,197,253,0.25)]",
    accent: "text-blue-300",
    headerBg: "from-blue-900/40 to-slate-900/60",
    dayHover: "hover:bg-blue-500/10 hover:border-blue-400/30",
    todayRing: "border-blue-400 ring-2 ring-blue-400/30",
    label: "❄️ Shishir — Winter",
    summary: "The season of deep focus. Cold mornings, warm study sessions, and year-end financial planning.",
    icon: <Snowflake className="h-5 w-5" />,
    particles: "bg-blue-400",
    accentColor: "#93c5fd",
  },
  spring: {
    card: "bg-emerald-950/30 border-emerald-400/20 shadow-[0_0_60px_-12px_rgba(52,211,153,0.25)]",
    accent: "text-emerald-300",
    headerBg: "from-emerald-900/40 to-teal-900/60",
    dayHover: "hover:bg-emerald-500/10 hover:border-emerald-400/30",
    todayRing: "border-emerald-400 ring-2 ring-emerald-400/30",
    label: "🌸 Vasant — Spring",
    summary: "A cycle of rebirth. Holi celebrations, new beginnings, and cultural energy at its peak.",
    icon: <Sparkles className="h-5 w-5" />,
    particles: "bg-emerald-400",
    accentColor: "#34d399",
  },
  summer: {
    card: "bg-orange-950/30 border-orange-400/20 shadow-[0_0_60px_-12px_rgba(251,146,60,0.25)]",
    accent: "text-orange-300",
    headerBg: "from-orange-900/40 to-amber-900/60",
    dayHover: "hover:bg-orange-500/10 hover:border-orange-400/30",
    todayRing: "border-orange-400 ring-2 ring-orange-400/30",
    label: "☀️ Grishma — Summer",
    summary: "Peak solar energy. Beat the heat expenses, manage AC bills, and plan summer retreats wisely.",
    icon: <Flame className="h-5 w-5" />,
    particles: "bg-orange-400",
    accentColor: "#fb923c",
  },
  monsoon: {
    card: "bg-indigo-950/30 border-indigo-400/20 shadow-[0_0_60px_-12px_rgba(129,140,248,0.25)]",
    accent: "text-indigo-300",
    headerBg: "from-indigo-900/40 to-violet-900/60",
    dayHover: "hover:bg-indigo-500/10 hover:border-indigo-400/30",
    todayRing: "border-indigo-400 ring-2 ring-indigo-400/30",
    label: "🌧️ Varsha — Monsoon",
    summary: "Reflective rains. India's Independence celebrations, cozy indoor days, and budget mindfulness.",
    icon: <Droplets className="h-5 w-5" />,
    particles: "bg-indigo-400",
    accentColor: "#818cf8",
  },
  autumn: {
    card: "bg-rose-950/30 border-rose-400/20 shadow-[0_0_60px_-12px_rgba(251,113,133,0.25)]",
    accent: "text-rose-300",
    headerBg: "from-rose-900/40 to-pink-900/60",
    dayHover: "hover:bg-rose-500/10 hover:border-rose-400/30",
    todayRing: "border-rose-400 ring-2 ring-rose-400/30",
    label: "🍁 Sharad — Autumn",
    summary: "Festive harvest! From Navratri to Diwali — the grandest spending and celebration season.",
    icon: <Leaf className="h-5 w-5" />,
    particles: "bg-rose-400",
    accentColor: "#fb7185",
  },
};

const categoryBadgeStyles: Record<EventCategory, string> = {
  Gazetted: "bg-rose-500/20 text-rose-400 border-rose-500/40",
  Restricted: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  Festival: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  Observance: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  Season: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
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
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(2026, now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [daysWithNotes, setDaysWithNotes] = useState<Set<string>>(new Set());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const season = getSeason(currentMonth);
  const theme = seasonThemes[season];
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

  // Load note indicators for the current month
  useEffect(() => {
    const notesFound = new Set<string>();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateId = formatDateToId(date);
      const saved = localStorage.getItem(`schedule_${dateId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.diaryNote || parsed.tasks || parsed.importantWork) {
            notesFound.add(dateId);
          }
        } catch (e) {}
      }
    }
    setDaysWithNotes(notesFound);
  }, [currentMonth, currentYear, isDialogOpen]);


  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  return (
    <div className="space-y-12">
      {/* Season Header */}
      <AnimatePresence mode="wait">
        <motion.section
          key={season}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "relative overflow-hidden rounded-[48px] border p-8 md:p-12 glass-card transition-all duration-1000",
            theme.card
          )}
        >
          {/* Season-specific floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={cn("absolute h-1 w-1 rounded-full opacity-40", theme.particles)}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 10, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
              />
            ))}
          </div>

          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <CalendarDays className="h-64 w-64" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className={cn("rounded-full px-5 py-1.5 text-xs font-bold tracking-[0.15em] uppercase border backdrop-blur-xl flex items-center gap-2", theme.card, theme.accent)}>
                    <span className={theme.accent}>{theme.icon}</span>
                    {theme.label}
                  </Badge>
                  <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", theme.particles)} />
                  <span className="text-sm font-outfit font-medium text-white/50 uppercase tracking-widest">
                    2026 Calendar
                  </span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-white">
                    {monthNames[currentMonth]}
                  </h2>
                  <p className={cn("max-w-2xl text-lg md:text-xl leading-relaxed font-outfit", theme.accent)}>
                    {theme.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-black/30 p-2 rounded-full border border-white/5 backdrop-blur-3xl">
                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full hover:bg-white/10" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <span className={cn("px-4 font-outfit font-bold text-sm", theme.accent)}>
                  {currentYear}
                </span>
                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full hover:bg-white/10" onClick={handleNextMonth}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(categoryCounts).map(([key, count]) => (
                <div key={key} className="rounded-3xl border border-white/5 bg-black/20 p-6 group hover:bg-white/5 transition-colors">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-4">{key}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-outfit font-black text-white">{count}</span>
                    <div className={cn("h-2 w-2 rounded-full", theme.particles)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

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
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
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
                    const hasNote = daysWithNotes.has(dateId);

                    return (
                      <motion.button
                        key={dateId}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedDate(dayDate); setIsDialogOpen(true); }}
                        className={cn(
                          "group relative aspect-square rounded-[28px] md:rounded-[40px] border p-2 text-left transition-all overflow-hidden",
                          isWeekend ? "bg-white/[0.03]" : "bg-white/[0.05]",
                          isPrimaryHoliday ? "border-rose-500/40" : "border-white/5 shadow-xl",
                          isToday && theme.todayRing,
                          theme.dayHover
                        )}
                      >
                        <div className="flex flex-col h-full justify-between items-center py-2 md:py-4">
                          <span className={cn(
                            "text-lg md:text-2xl font-outfit font-black mb-1",
                            isToday ? theme.accent : "text-white/60 group-hover:text-white"
                          )}>
                            {day}
                          </span>
                          
                          <div className="flex flex-col items-center gap-1.5 w-full">
                            {hasNote && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn("h-1.5 w-1.5 rounded-full shadow-lg", theme.particles)}
                                style={{ boxShadow: `0 0 8px ${theme.accentColor}` }}
                              />
                            )}
                            {dayEvents.length > 0 && (
                              <div className="flex gap-1 justify-center">
                                {dayEvents.slice(0, 3).map((e, idx) => (
                                  <div key={idx} className={cn("h-1 w-1 rounded-full", categoryBadgeStyles[e.category].split(' ')[0])} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className={cn("glass-card border rounded-[40px] p-8", theme.card)}>
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl bg-white/10", theme.accent)}>
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-outfit font-bold">Month Events</h3>
              </div>
              
              <div className="space-y-4">
                {eventsForMonth.length === 0 && (
                  <p className="text-white/30 text-sm">No events this month.</p>
                )}
                {eventsForMonth.slice(0, 4).map((event) => (
                  <div key={`${event.date}-${event.name}`} className="p-5 rounded-3xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-2xl bg-white/5", theme.accent)}>
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

          <Card className={cn("glass-card border rounded-[40px] p-8 overflow-hidden relative", theme.card)}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="h-24 w-24" />
            </div>
            <h3 className="text-xl font-outfit font-bold mb-4">Daily Diary</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Click any date to write your diary, plan your day, and log expenses. All data saved locally.
            </p>
            <div className={cn("h-1 lg:w-3/4 rounded-full opacity-40", theme.particles)} />
          </Card>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={cn(
          "max-h-[85vh] overflow-y-auto sm:max-w-3xl glass-card border text-white rounded-[48px] p-8 md:p-12",
          theme.card
        )}>
          <DialogHeader className="mb-8">
            <DialogTitle className="text-4xl md:text-5xl font-outfit font-black tracking-tighter">
              {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </DialogTitle>
            <DialogDescription className={cn("text-lg", theme.accent)}>
              {theme.label} · Click Save to store your diary entry locally.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {selectedDateEvents.map((event) => (
              <div key={event.name} className="p-6 rounded-[32px] bg-black/20 border border-white/10">
                <div className="flex items-start gap-4 text-white">
                  <div className={cn("p-3 rounded-2xl bg-white/5", theme.accent)}>
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
                <DailyScheduleForm 
                  date={selectedDate}
                  onClose={() => setIsDialogOpen(false)} 
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
