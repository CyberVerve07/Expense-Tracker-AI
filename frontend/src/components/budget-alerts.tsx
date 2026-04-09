"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BudgetLimit {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

const defaultCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Other'
];

export default function BudgetAlerts() {
  const [budgets, setBudgets] = useState<BudgetLimit[]>([
    { id: '1', category: 'Food & Dining', limit: 10000, spent: 6500 },
    { id: '2', category: 'Shopping', limit: 5000, spent: 4800 },
    { id: '3', category: 'Entertainment', limit: 3000, spent: 1500 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food & Dining',
    limit: '',
  });

  const addBudget = () => {
    if (newBudget.category && newBudget.limit) {
      const existing = budgets.find(b => b.category === newBudget.category);
      if (existing) {
        setBudgets(budgets.map(b => 
          b.category === newBudget.category 
            ? { ...b, limit: parseFloat(newBudget.limit) }
            : b
        ));
      } else {
        const budget: BudgetLimit = {
          id: Date.now().toString(),
          category: newBudget.category,
          limit: parseFloat(newBudget.limit),
          spent: 0,
        };
        setBudgets([...budgets, budget]);
      }
      setNewBudget({ category: 'Food & Dining', limit: '' });
      setIsDialogOpen(false);
    }
  };

  const updateSpent = (category: string, amount: number) => {
    setBudgets(budgets.map(b => 
      b.category === category 
        ? { ...b, spent: b.spent + amount }
        : b
    ));
  };

  const getUsagePercentage = (spent: number, limit: number) => (spent / limit) * 100;
  
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-rose-400';
    if (percentage >= 80) return 'text-orange-400';
    return 'text-cyan-400';
  };

  const getAlertLevel = (percentage: number) => {
    if (percentage >= 100) return 'critical';
    if (percentage >= 80) return 'warning';
    return 'normal';
  };

  const getAlerts = () => {
    return budgets
      .map(b => {
        const percentage = getUsagePercentage(b.spent, b.limit);
        return { ...b, percentage, level: getAlertLevel(percentage) };
      })
      .filter(b => b.level !== 'normal')
      .sort((a, b) => b.percentage - a.percentage);
  };

  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const alerts = getAlerts();

  return (
    <Card className="glass-card border-white/5 bg-transparent overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 font-outfit text-xl">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                 <AlertTriangle className="h-5 w-5" />
              </span>
              Perimeters
            </CardTitle>
            <CardDescription className="text-white/40">Resource boundary thresholds</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border-white/10">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 bg-black/90 text-white rounded-[40px] p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-outfit font-black">Set Perimeter</DialogTitle>
                <DialogDescription>Define a monthly resource cap for a specific vector.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2">
                  <Label className="text-white/60 font-outfit">Allocation Category</Label>
                  <select
                    className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 text-sm focus:ring-1 focus:ring-rose-500 outline-none"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  >
                    {defaultCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 font-outfit">Threshold Cap (₹)</Label>
                  <Input
                    type="number"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                    className="bg-white/5 border-white/10 h-14 rounded-2xl text-lg font-outfit"
                    placeholder="5000"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addBudget} className="w-full h-14 rounded-full font-bold text-lg bg-rose-500 hover:bg-rose-400">Lock Perimeter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Overall Status */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Aggregate Depletion</span>
            <div className="text-right">
                <p className="text-lg font-outfit font-bold text-white">₹{totalSpent.toLocaleString('en-IN')}</p>
                <p className={cn("text-xs font-black", getStatusColor(overallPercentage))}>{overallPercentage.toFixed(1)}% CONSUMED</p>
            </div>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                overallPercentage >= 100 ? "bg-rose-500 neon-glow-purple" : overallPercentage >= 80 ? "bg-orange-500" : "bg-cyan-500"
              )}
            />
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map(alert => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "p-4 rounded-2xl border flex gap-3 items-start",
                    alert.level === 'critical' ? "bg-rose-500/10 border-rose-500/20" : "bg-orange-500/10 border-orange-500/20"
                )}
              >
                <AlertTriangle className={cn("h-5 w-5 shrink-0 mt-0.5", alert.level === 'critical' ? "text-rose-400" : "text-orange-400")} />
                <div>
                   <h5 className={cn("text-xs font-black uppercase tracking-widest", alert.level === 'critical' ? "text-rose-400" : "text-orange-400")}>
                     {alert.level === 'critical' ? 'Containment Breach' : 'System Alert'}
                   </h5>
                   <p className="text-sm text-white/70 mt-1 leading-snug">
                     {alert.category} is at {alert.percentage.toFixed(0)}%. 
                     {alert.level === 'critical' ? " Exceeded by ₹" + (alert.spent - alert.limit).toLocaleString('en-IN') : " Approaching cap."}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Budget List */}
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = getUsagePercentage(budget.spent, budget.limit);
            const remaining = budget.limit - budget.spent;
            const isOverBudget = percentage >= 100;
            const isWarning = percentage >= 80;
            
            return (
              <motion.div
                key={budget.id}
                whileHover={{ x: 4 }}
                className={cn(
                  "p-5 rounded-[28px] border bg-white/[0.02] transition-colors",
                  isOverBudget ? "border-rose-500/30" : isWarning ? "border-orange-500/30" : "border-white/5"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-white/5", isOverBudget ? "text-rose-400" : "text-white/60")}>
                        {isOverBudget ? <TrendingDown className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                    </div>
                    <div>
                        <p className="font-outfit font-bold text-sm tracking-tight">{budget.category}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.1em]">Alloc: ₹{budget.limit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-black", getStatusColor(percentage))}>{percentage.toFixed(0)}%</p>
                    <p className="text-[10px] text-white/20 uppercase">Usage</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Input
                    type="number"
                    placeholder="Input outflow..."
                    className="h-10 bg-white/5 border-white/5 rounded-full px-5 text-sm font-outfit placeholder:text-white/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseFloat((e.target as HTMLInputElement).value);
                        if (value > 0) {
                          updateSpent(budget.category, value);
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

        {budgets.length === 0 && (
          <div className="text-center py-12 opacity-20">
            <AlertTriangle className="h-10 w-10 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest mt-4">No active perimeters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
