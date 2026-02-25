"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Flame, Calendar, Target } from 'lucide-react';

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
    { id: '3', name: 'Drink 8 glasses of water', streak: 7, completedDates: [getToday()] },
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
          // Uncheck - decrease streak
          newStreak = Math.max(0, habit.streak - 1);
          return {
            ...habit,
            completedDates: habit.completedDates.filter(d => d !== today),
            streak: newStreak
          };
        } else {
          // Check - increase streak
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Habit Tracker
            </CardTitle>
            <CardDescription>Build consistent habits and track your streaks</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
                <DialogDescription>Add a new habit to track daily</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="habitName">Habit Name</Label>
                  <Input
                    id="habitName"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="e.g., Morning Exercise"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addHabit}>Create Habit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-orange-500">{getTotalStreak()}</div>
            <div className="text-xs text-muted-foreground">Total Streak Days</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-green-500">{getCompletedToday()}/{habits.length}</div>
            <div className="text-xs text-muted-foreground">Completed Today</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-blue-500">{habits.length}</div>
            <div className="text-xs text-muted-foreground">Active Habits</div>
          </div>
        </div>

        {/* Today's Habits */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Today - {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today);
            
            return (
              <div
                key={habit.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  isCompleted ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`habit-${habit.id}`}
                    checked={isCompleted}
                    onCheckedChange={() => toggleHabit(habit.id)}
                  />
                  <label
                    htmlFor={`habit-${habit.id}`}
                    className={`text-sm font-medium cursor-pointer ${
                      isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {habit.name}
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-medium">{habit.streak}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    ×
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No habits tracked yet. Create your first habit to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
