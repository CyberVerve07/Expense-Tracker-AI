"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Flame, Calendar, Target, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDates: string[];
}

const getToday = () => new Date().toISOString().split('T')[0];

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Exercise', streak: 5, completedDates: [getToday()] },
    { id: '2', name: 'Read for 30 mins', streak: 3, completedDates: [] },
    { id: '3', name: 'Hydration Cycle', streak: 7, completedDates: [getToday()] },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const today = getToday();

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit,
        streak: 0,
        completedDates: [],
      };
      setHabits([...habits, habit]);
      setNewHabit('');
      setIsDialogOpen(false);
    }
  };

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        let newStreak = habit.streak;
        
        if (isCompleted) {
          newStreak = Math.max(0, habit.streak - 1);
          return {
            ...habit,
            completedDates: habit.completedDates.filter(d => d !== today),
            streak: newStreak
          };
        } else {
          newStreak = habit.streak + 1;
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
            streak: newStreak
          };
        }
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };

  const getTotalStreak = () => habits.reduce((acc, h) => acc + h.streak, 0);
  const getCompletedToday = () => habits.filter(h => h.completedDates.includes(today)).length;

  return (
    <Card className="glass-card border-white/5 bg-transparent overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 font-outfit text-xl">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                 <Flame className="h-5 w-5" />
              </span>
              Protocols
            </CardTitle>
            <CardDescription className="text-white/40">Continuity reinforcement</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 bg-black/90 text-white rounded-[40px] p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-outfit font-black">Add Protocol</DialogTitle>
                <DialogDescription>Initialize a new recurring behavioral vector.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2">
                  <Label htmlFor="habitName" className="text-white/60 font-outfit">Habit Identifier</Label>
                  <Input
                    id="habitName"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    className="bg-white/5 border-white/10 h-14 rounded-2xl text-lg font-outfit"
                    placeholder="e.g., Deep Work Cycle"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addHabit} className="w-full h-14 rounded-full font-bold text-lg bg-orange-500 hover:bg-orange-400">Initialize Cycle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-outfit font-black text-orange-400">{getTotalStreak()}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Incarnations</div>
          </div>
          <div className="p-4 rounded-3xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-outfit font-black text-emerald-400">{getCompletedToday()}/{habits.length}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Daily Quota</div>
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Calendar className="h-3.5 w-3.5 text-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Temporal Log - {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
          
          <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {habits.map((habit) => {
                    const isCompleted = habit.completedDates.includes(today);
                    
                    return (
                    <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                        "group flex items-center justify-between p-5 rounded-[28px] border transition-all duration-500",
                        isCompleted 
                            ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <Checkbox
                                id={`habit-${habit.id}`}
                                checked={isCompleted}
                                onCheckedChange={() => toggleHabit(habit.id)}
                                className="h-6 w-6 rounded-lg border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none"
                            />
                            <label
                                htmlFor={`habit-${habit.id}`}
                                className={cn(
                                    "text-sm font-outfit font-bold cursor-pointer transition-all",
                                    isCompleted ? "text-white/40 line-through" : "text-white/80"
                                )}
                            >
                                {habit.name}
                            </label>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 shadow-inner">
                                <Flame className={cn("h-3.5 w-3.5", isCompleted ? "text-orange-400 animate-pulse" : "text-white/20")} />
                                <span className={cn("text-xs font-black", isCompleted ? "text-orange-400" : "text-white/40")}>{habit.streak}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteHabit(habit.id)}
                                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 hover:text-rose-400"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </motion.div>
                    );
                })}
              </AnimatePresence>
          </div>
        </div>

        {habits.length === 0 && (
          <div className="text-center py-12 space-y-4 opacity-30">
            <Target className="h-10 w-10 mx-auto" />
            <p className="font-outfit text-[11px] tracking-widest uppercase italic">Static Vitals - No Protocols Found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
