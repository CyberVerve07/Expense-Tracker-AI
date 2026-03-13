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
} from "lucide-react";
import { endOfMonth, format, isSameDay, startOfDay, startOfMonth } from "date-fns";
import { collection, doc, query, where } from "firebase/firestore";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import calendarData from "@/lib/calendar-data.json";
import DailyScheduleForm from "./daily-schedule-form";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { useCollection, useDoc, useFirebase, useMemoFirebase } from "@/firebase";
import type { DailySchedule } from "@/lib/types";

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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const seasonThemes: Record<Season, string> = {
  winter: "from-sky-100 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950",
  spring: "from-lime-100 via-emerald-50 to-yellow-100 dark:from-emerald-950 dark:via-slate-900 dark:to-lime-950",
  summer: "from-amber-100 via-orange-50 to-rose-100 dark:from-orange-950 dark:via-slate-900 dark:to-amber-950",
  monsoon: "from-sky-100 via-indigo-50 to-slate-100 dark:from-blue-950 dark:via-slate-900 dark:to-indigo-950",
  autumn: "from-orange-100 via-amber-50 to-rose-100 dark:from-amber-950 dark:via-slate-900 dark:to-red-950",
};

const categoryBadgeStyles: Record<EventCategory, string> = {
  Gazetted: "bg-rose-500/10 text-rose-700 border-rose-200 dark:text-rose-300 dark:border-rose-900/60",
  Restricted: "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-300 dark:border-amber-900/60",
  Festival: "bg-violet-500/10 text-violet-700 border-violet-200 dark:text-violet-300 dark:border-violet-900/60",
  Observance: "bg-sky-500/10 text-sky-700 border-sky-200 dark:text-sky-300 dark:border-sky-900/60",
  Season: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-900/60",
};

const seasonLabels: Record<Season, string> = {
  winter: "Cool season",
  spring: "Fresh bloom",
  summer: "Heat and travel",
  monsoon: "Rainy cycle",
  autumn: "Festival stretch",
};

const seasonSummaries: Record<Season, string> = {
  winter: "Start the year with national dates, quiet planning, and bright winter observances.",
  spring: "Colour, harvest, and new-year festivals make this stretch feel alive.",
  summer: "Longer days, spiritual observances, and mid-year reset energy.",
  monsoon: "Rainy months with major national and cultural celebrations.",
  autumn: "The richest festive run of 2026 from Navratri to Diwali.",
};

const statsCopy: Record<EventCategory, string> = {
  Gazetted: "official holidays",
  Restricted: "optional holidays",
  Festival: "major festive dates",
  Observance: "cultural markers",
  Season: "season changes",
};

const getSeason = (month: number): Season => {
  if (month >= 2 && month <= 3) return "spring";
  if (month >= 4 && month <= 6) return "summer";
  if (month >= 7 && month <= 8) return "monsoon";
  if (month >= 9 && month <= 10) return "autumn";
  return "winter";
};

const UmbrellaIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-umbrella", className)}
  >
    <path d="M22 12a10.06 10.06 1 0 0-20 0Z" />
    <path d="M12 12v8a2 2 0 0 0 4 0" />
    <path d="M12 2v1" />
  </svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-leaf", className)}
  >
    <path d="M22 22 2 22" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.75-1.06-5.25-2.77-7.07" />
    <path d="M22 2 12 12" />
  </svg>
);

const EventIcon = ({ icon, className }: { icon: string; className?: string }) => {
  switch (icon) {
    case "PartyPopper":
      return <PartyPopper className={className} />;
    case "Cake":
      return <Cake className={className} />;
    case "Flag":
      return <Flag className={className} />;
    case "Mountain":
      return <Mountain className={className} />;
    case "Palette":
      return <Palette className={className} />;
    case "HeartHandshake":
      return <HeartHandshake className={className} />;
    case "PersonStanding":
      return <PersonStanding className={className} />;
    case "Target":
      return <Target className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Gift":
      return <Gift className={className} />;
    case "Sun":
      return <Sun className={className} />;
    case "Snowflake":
      return <Snowflake className={className} />;
    case "Moon":
      return <Moon className={className} />;
    case "Leaf":
      return <LeafIcon className={className} />;
    case "Umbrella":
      return <UmbrellaIcon className={className} />;
    default:
      return <CalendarDays className={className} />;
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

  const { user, firestore } = useFirebase();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const season = getSeason(currentMonth);
  const today = startOfDay(new Date());

  const scheduleId = selectedDate ? formatDateToId(selectedDate) : null;
  const scheduleRef = useMemoFirebase(() => {
    if (!user || !scheduleId || !firestore) return null;
    return doc(firestore, "users", user.uid, "schedules", scheduleId);
  }, [user, scheduleId, firestore]);

  const { data: scheduleData } = useDoc<DailySchedule>(scheduleRef);

  const monthSchedulesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, "users", user.uid, "schedules"),
      where("date", ">=", startOfMonth(currentDate).toISOString()),
      where("date", "<=", endOfMonth(currentDate).toISOString())
    );
  }, [user, firestore, currentDate]);

  const { data: monthSchedules } = useCollection<DailySchedule>(monthSchedulesQuery);

  const loggedDays = useMemo(() => {
    if (!monthSchedules) return new Set<string>();
    return new Set(monthSchedules.map((schedule) => format(new Date(schedule.date), "yyyy-MM-dd")));
  }, [monthSchedules]);

  const eventsForMonth = useMemo(
    () =>
      events
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;
        })
        .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name)),
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

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate.get(formatDateToId(selectedDate)) ?? [];
  }, [eventsByDate, selectedDate]);

  const categoryCounts = useMemo(() => {
    return eventsForMonth.reduce<Record<EventCategory, number>>(
      (acc, event) => {
        acc[event.category] += 1;
        return acc;
      },
      {
        Gazetted: 0,
        Restricted: 0,
        Festival: 0,
        Observance: 0,
        Season: 0,
      }
    );
  }, [eventsForMonth]);

  const nextUpcomingEvent = useMemo(() => {
    const monthStartId = formatDateToId(currentDate);
    return events.find((event) => event.date >= monthStartId) ?? events[0];
  }, [currentDate]);

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(() => {
        return;
      });
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  return (
    <div className="space-y-6">
      <section
        className={cn(
          "relative overflow-hidden rounded-[32px] border border-border/60 bg-gradient-to-br p-5 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] md:p-8",
          seasonThemes[season]
        )}
      >
        {season === "winter" && <div className="snow" />}
        {season === "spring" && <div className="spring-petals" />}
        {season === "summer" && <div className="summer-heatwave" />}
        {season === "monsoon" && <div className="monsoon-umbrellas" />}
        {season === "autumn" && <div className="autumn-leaves" />}

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs tracking-[0.25em] text-slate-700 uppercase dark:bg-white/10 dark:text-slate-200">
                  India 2026 calendar
                </Badge>
                <Badge variant="outline" className="rounded-full border-white/50 bg-white/50 px-4 py-1 dark:bg-white/5">
                  {seasonLabels[season]}
                </Badge>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 md:text-6xl">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-300 md:text-base">
                  {seasonSummaries[season]} Real 2026 holiday data is layered with cultural festivals,
                  seasonal markers, and your own daily planning.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full border-white/60 bg-white/80 backdrop-blur dark:bg-white/5"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/60 bg-white/80 px-4 backdrop-blur dark:bg-white/5"
                onClick={handleSeasonSound}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Season sound
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full border-white/60 bg-white/80 backdrop-blur dark:bg-white/5"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(categoryCounts).map(([key, count]) => (
              <div
                key={key}
                className="rounded-3xl border border-white/50 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{key}</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-black text-slate-950 dark:text-slate-50">{count}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">{statsCopy[key as EventCategory]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <Card className="overflow-hidden rounded-[28px] border border-border/60 bg-card/85 shadow-lg backdrop-blur">
          <CardContent className="p-4 md:p-6">
            <div className="mb-4 grid grid-cols-7 gap-2 border-b border-border/60 pb-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="hidden min-h-[140px] rounded-3xl bg-muted/20 md:block" />
              ))}

              {days.map((day) => {
                const dayDate = new Date(currentYear, currentMonth, day);
                const dateId = formatDateToId(dayDate);
                const dayEvents = eventsByDate.get(dateId) ?? [];
                const visibleEvents = dayEvents.slice(0, 2);
                const extraCount = Math.max(dayEvents.length - visibleEvents.length, 0);
                const isToday = isSameDay(dayDate, today);
                const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
                const isDayLogged = loggedDays.has(dateId);
                const isPrimaryHoliday = dayEvents.some((event) => event.category === "Gazetted");

                return (
                  <button
                    key={dateId}
                    type="button"
                    onClick={() => {
                      setSelectedDate(dayDate);
                      setIsDialogOpen(true);
                    }}
                    className={cn(
                      "group min-h-[118px] rounded-[24px] border p-2 text-left transition duration-200 md:min-h-[172px] md:p-3",
                      isWeekend ? "bg-muted/30" : "bg-background/90",
                      isPrimaryHoliday && "border-rose-300/70 shadow-[0_12px_30px_-22px_rgba(244,63,94,0.7)] dark:border-rose-900/70",
                      isDayLogged && "border-emerald-300/80 bg-emerald-500/5 dark:border-emerald-800",
                      isToday && "border-primary ring-2 ring-primary/20",
                      "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold md:h-10 md:w-10",
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : "bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-slate-100"
                        )}
                      >
                        {day}
                      </div>
                      {isDayLogged && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                    </div>

                    <div className="space-y-1.5">
                      {visibleEvents.map((event) => (
                        <div
                          key={`${dateId}-${event.name}`}
                          className={cn(
                            "rounded-2xl border px-2 py-1.5 text-[10px] md:text-xs",
                            categoryBadgeStyles[event.category]
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <EventIcon icon={event.icon} className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate font-medium">{event.name}</span>
                          </div>
                        </div>
                      ))}
                      {extraCount > 0 && (
                        <div className="rounded-2xl border border-dashed border-border px-2 py-1.5 text-[10px] text-muted-foreground md:text-xs">
                          +{extraCount} more for this day
                        </div>
                      )}
                      {dayEvents.length === 0 && (
                        <div className="pt-5 text-[10px] text-muted-foreground md:pt-8 md:text-xs">
                          {isWeekend ? "Weekend buffer" : "Open day for planning"}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border border-border/60 bg-card/85 shadow-lg">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">This month</p>
                  <h3 className="mt-2 text-2xl font-black">{eventsForMonth.length} important dates</h3>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {monthNames[currentMonth]}
                </Badge>
              </div>

              <div className="space-y-3">
                {eventsForMonth.slice(0, 6).map((event) => (
                  <div
                    key={`${event.date}-${event.name}`}
                    className="rounded-3xl border border-border/60 bg-background/80 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                        <EventIcon icon={event.icon} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{event.name}</p>
                          <Badge className={cn("rounded-full border", categoryBadgeStyles[event.category])}>
                            {event.category}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {format(new Date(event.date), "dd MMM, EEE")}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-border/60 bg-card/85 shadow-lg">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Year pulse</p>
                <h3 className="mt-2 text-2xl font-black">Next major date</h3>
              </div>

              <div className="rounded-[28px] border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                    <EventIcon icon={nextUpcomingEvent.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{nextUpcomingEvent.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format(new Date(nextUpcomingEvent.date), "dd MMMM yyyy")}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{nextUpcomingEvent.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                {(Object.keys(categoryBadgeStyles) as EventCategory[]).map((category) => (
                  <div key={category} className="flex items-center justify-between rounded-2xl border border-border/60 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-3 w-3 rounded-full", categoryBadgeStyles[category].split(" ")[0])} />
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{categoryCounts[category]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
            <DialogDescription>
              Daily planning plus the important holidays and observances for this date.
            </DialogDescription>
          </DialogHeader>

          {selectedDateEvents.length > 0 && (
            <div className="grid gap-3 pb-2">
              {selectedDateEvents.map((event) => (
                <div key={`${event.date}-${event.name}`} className="rounded-3xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                      <EventIcon icon={event.icon} className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{event.name}</p>
                        <Badge className={cn("rounded-full border", categoryBadgeStyles[event.category])}>
                          {event.category}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedDate && (
            <DailyScheduleForm date={selectedDate} scheduleData={scheduleData} onClose={() => setIsDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {audioSrc && <audio ref={audioRef} src={audioSrc} />}
    </div>
  );
}
