"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { diaryAnalysisAndRecommendations } from '@/ai/flows/diary-analysis-flow';
import type { DiaryAnalysisOutput } from '@/ai/flows/diary-analysis-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalysisResultCard from './analysis-result-card';
import { Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import Link from 'next/link';
import { useFirebase } from '@/firebase';

const formSchema = z.object({
  diaryEntries: z.string().min(50, {
    message: "Please enter at least 50 characters for a meaningful analysis.",
  }),
});

export default function DiaryAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<DiaryAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diaryEntries: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await diaryAnalysisAndRecommendations(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Diary analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your diary entries. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='shadow-md'>
      <CardHeader>
        <CardTitle>Diary Analysis</CardTitle>
        <CardDescription>Get insights on your mood, productivity, and well-being from your diary entries.</CardDescription>
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
              name="diaryEntries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Diary Entries</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your diary entries here... For example: 'Jan 1: Felt energetic today, finished all my tasks. Went for a run in the evening...'"
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
              Analyze Diary
            </Button>
          </form>
        </Form>
        
        {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-card rounded-lg border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground font-semibold">Analyzing your entries...</p>
                <p className="mt-1 text-sm text-muted-foreground">This may take a moment.</p>
            </div>
        )}

        {analysisResult && <AnalysisResultCard result={analysisResult} />}
      </CardContent>
    </Card>
  );
}
