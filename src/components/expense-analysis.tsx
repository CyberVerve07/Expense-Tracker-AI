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
import { Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import Link from 'next/link';
import { useFirebase } from '@/firebase';


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
  const { user } = useFirebase();


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
    <Card className='shadow-md'>
      <CardHeader>
        <CardTitle>Expense Optimization</CardTitle>
        <CardDescription>Enter your expenses and income to get personalized budgeting strategies.</CardDescription>
      </CardHeader>
      <CardContent>
        {!user && (
            <Alert className="mb-6 bg-primary/10 border-primary/20">
                <Info className="h-4 w-4" />
                <AlertTitle>You are not logged in</AlertTitle>
                <AlertDescription>
                    <Link href="/auth/login" className="font-bold underline">Log in</Link> to save your analysis and track progress over time.
                </AlertDescription>
            </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Monthly Income (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 50000" 
                      {...field} 
                      value={field.value ?? ''}
                      onChange={e => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? undefined : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Expenses</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List your expenses here. For example: 'Groceries: ₹5000, Rent: ₹15000, Movie ticket: ₹500...'"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Expenses
            </Button>
          </form>
        </Form>
        
        {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-card rounded-lg border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground font-semibold">Crunching the numbers...</p>
                <p className="mt-1 text-sm text-muted-foreground">This may take a moment.</p>
            </div>
        )}
        
        {analysisResult && <AnalysisResultCard result={analysisResult} />}
      </CardContent>
    </Card>
  );
}
