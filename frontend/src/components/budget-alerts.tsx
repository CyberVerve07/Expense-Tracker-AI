"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

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
      // Check if category already exists
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
    if (percentage >= 100) return 'text-red-500';
    if (percentage >= 80) return 'text-orange-500';
    return 'text-green-500';
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Budget Alerts
            </CardTitle>
            <CardDescription>Set limits and get alerts when spending approaches limits</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Budget Limit</DialogTitle>
                <DialogDescription>Set a monthly spending limit for a category</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  >
                    {defaultCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="limit">Monthly Limit (₹)</Label>
                  <Input
                    id="limit"
                    type="number"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                    placeholder="5000"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addBudget}>Set Budget</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Overall Budget Usage</span>
            <span className={`text-sm font-medium ${getStatusColor(overallPercentage)}`}>
              ₹{totalSpent.toLocaleString('en-IN')} / ₹{totalBudget.toLocaleString('en-IN')} ({overallPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress 
            value={Math.min(overallPercentage, 100)} 
            className="h-3"
            style={{
              backgroundColor: overallPercentage >= 100 ? '#ef4444' : overallPercentage >= 80 ? '#f97316' : '#22c55e'
            }}
          />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map(alert => (
              <Alert key={alert.id} variant={alert.level === 'critical' ? 'destructive' : 'default'} className={
                alert.level === 'warning' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950' : ''
              }>
                {alert.level === 'critical' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                <AlertTitle>
                  {alert.level === 'critical' ? 'Budget Exceeded!' : 'Budget Warning'}
                </AlertTitle>
                <AlertDescription>
                  You've used {alert.percentage.toFixed(1)}% of your ₹{alert.limit.toLocaleString('en-IN')} {alert.category} budget.
                  {alert.level === 'critical' 
                    ? ` You're ₹${(alert.spent - alert.limit).toLocaleString('en-IN')} over budget!`
                    : ` Only ₹${(alert.limit - alert.spent).toLocaleString('en-IN')} remaining.`
                  }
                </AlertDescription>
              </Alert>
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
              <div
                key={budget.id}
                className={`rounded-lg border p-4 space-y-3 ${
                  isOverBudget ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950' :
                  isWarning ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950' :
                  'bg-background'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOverBudget ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : isWarning ? (
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-green-500" />
                    )}
                    <span className="font-medium">{budget.category}</span>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(percentage)}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ₹{budget.spent.toLocaleString('en-IN')} spent
                    </span>
                    <span className="text-muted-foreground">
                      ₹{Math.abs(remaining).toLocaleString('en-IN')} {remaining >= 0 ? 'left' : 'over'}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                    style={{
                      backgroundColor: isOverBudget ? '#ef4444' : isWarning ? '#f97316' : '#22c55e'
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Add expense"
                    className="h-8"
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
                  <Button 
                    size="sm" 
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No budget limits set. Create budget limits to get alerts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
