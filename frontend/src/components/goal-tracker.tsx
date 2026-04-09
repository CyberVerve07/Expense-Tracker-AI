"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, TrendingUp, Wallet, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: 'savings' | 'investment' | 'debt' | 'education' | 'other';
  deadline: string;
}

const categoryIcons = {
  savings: Wallet,
  investment: TrendingUp,
  debt: Target,
  education: BookOpen,
  other: Target,
};

const categoryColors = {
  savings: 'text-cyan-400',
  investment: 'text-purple-400',
  debt: 'text-rose-400',
  education: 'text-blue-400',
  other: 'text-white/40',
};

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Emergency Fund', targetAmount: 50000, currentAmount: 25000, category: 'savings', deadline: '2026-12-31' },
    { id: '2', title: 'New Laptop', targetAmount: 80000, currentAmount: 40000, category: 'savings', deadline: '2026-06-30' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    category: 'savings' as Goal['category'],
    deadline: '',
  });

  const addGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        category: newGoal.category,
        deadline: newGoal.deadline,
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', targetAmount: '', category: 'savings', deadline: '' });
      setIsDialogOpen(false);
    }
  };

  const updateProgress = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ));
  };

  const totalProgress = goals.length > 0 
    ? goals.reduce((acc, goal) => acc + (goal.currentAmount / goal.targetAmount), 0) / goals.length * 100
    : 0;

  return (
    <Card className="glass-card border-white/5 bg-transparent overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 font-outfit text-xl">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                 <Target className="h-5 w-5" />
              </span>
              Ambitions
            </CardTitle>
            <CardDescription className="text-white/40">Financial velocity tracking</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="h-10 w-10 min-w-[40px] rounded-full bg-white/10 hover:bg-white/20 border-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 bg-black/90 text-white rounded-[40px] p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-outfit font-black">Define Ambition</DialogTitle>
                <DialogDescription>Set a new financial target to synchronize.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6 font-outfit">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white/60">Ambition Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="bg-white/5 border-white/10 h-12 rounded-2xl"
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount" className="text-white/60">Target Credit (₹)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    className="bg-white/5 border-white/10 h-12 rounded-2xl"
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white/60">Category Vector</Label>
                  <select
                    id="category"
                    className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 text-sm focus:ring-1 focus:ring-cyan-500 outline-none"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                  >
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                    <option value="debt">Debt Repayment</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-white/60">Timeline Lock</Label>
                  <Input
                    id="deadline"
                    type="date"
                    className="bg-white/5 border-white/10 h-12 rounded-2xl"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addGoal} className="w-full h-14 rounded-full font-bold text-lg bg-cyan-500 hover:bg-cyan-400">Initialize Ambition</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Overall Progress */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-white/40">Master Progress</span>
            <span className="text-2xl font-outfit font-black text-cyan-400">{totalProgress.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${totalProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 neon-glow-cyan" 
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-5">
          {goals.map((goal) => {
            const Icon = categoryIcons[goal.category];
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            
            return (
              <motion.div
                key={goal.id}
                whileHover={{ scale: 1.02 }}
                className="rounded-[32px] bg-white/[0.02] border border-white/5 p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-white/5", categoryColors[goal.category])}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-outfit font-bold">{goal.title}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Locked till: {new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white/60">
                      ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-cyan-400">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full", progress > 90 ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-white/20")} 
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Input gain..."
                    className="h-10 bg-white/5 border-white/10 rounded-full px-5 text-sm focus:ring-1 focus:ring-cyan-500/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseFloat((e.target as HTMLInputElement).value);
                        if (value > 0) {
                          updateProgress(goal.id, value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12 space-y-4 opacity-40">
            <Target className="h-12 w-12 mx-auto" />
            <p className="font-outfit text-sm tracking-wide">NO ACTIVE VECTORS</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
