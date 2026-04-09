"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { expenseAnalysisAndBudgeting } from '@/ai/flows/expense-analysis-flow';
import type { ExpenseAnalysisOutput } from '@/ai/flows/expense-analysis-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalysisResultCard from './analysis-result-card';
import { Loader2, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const formSchema = z.object({
  expenses: z.string().min(20, {
    message: "Please list some expenses for a meaningful analysis.",
  }),
  income: z.coerce.number({invalid_type_error: "Please enter a valid number."}).min(1, {
      message: "Please enter your monthly income."
  }),
});

export default function ExpenseAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<ExpenseAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenses: "",
      income: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await expenseAnalysisAndBudgeting(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Expense analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your expenses. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="glass-card border-white/5 shadow-2xl overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
               <Wallet className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-outfit font-bold">Expense Optimization</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Enter your financial data to generate an AI-powered savings strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-cyan-400" />
                        Monthly Net Income (₹)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 75000" 
                          className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-cyan-500/50 focus:border-cyan-500 text-lg transition-all"
                          {...field} 
                          value={field.value ?? ''}
                          onChange={e => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? undefined : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                       <TrendingDown className="h-4 w-4 text-purple-400" />
                       Detailed Spendings
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List your outgoings. Format doesn't matter, our AI understands context. e.g., 'Ate at Starbucks ₹700, Netflix subscription $15, Cab to office ₹350...'"
                        className="min-h-[220px] bg-white/5 border-white/10 rounded-[32px] p-6 focus:ring-purple-500/50 focus:border-purple-500 text-base leading-relaxed transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-4">
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    size="lg"
                    className="rounded-full h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all active:scale-95"
                >
                  {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                  {isLoading ? 'Decrypting Finance...' : 'Run Financial Analysis'}
                </Button>
              </div>
            </form>
          </Form>
          
          {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 flex flex-col items-center justify-center text-center p-12 glass-card rounded-[40px] border-white/10"
              >
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
                    <div className="absolute inset-0 blur-xl bg-cyan-400/20 animate-pulse" />
                  </div>
                  <p className="mt-6 text-xl font-outfit font-bold text-foreground">AI is Crunching Data</p>
                  <p className="mt-2 text-muted-foreground">Mapping your spending clusters and identifying leaks...</p>
              </motion.div>
          )}
        </CardContent>
      </Card>
      
      {analysisResult && <AnalysisResultCard result={analysisResult} />}
    </div>
  );
}
