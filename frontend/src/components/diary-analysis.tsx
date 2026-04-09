"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { diaryAnalysisFlow } from '@/ai/flows/diary-analysis-flow';
import type { DiaryAnalysisOutput } from '@/ai/flows/diary-analysis-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalysisResultCard from './analysis-result-card';
import { Loader2, BookOpen, PenTool, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const formSchema = z.object({
  diaryEntries: z.string().min(50, {
    message: "Please write a bit more (at least 50 characters) for a deeper AI analysis.",
  }),
});

export default function DiaryAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<DiaryAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      const result = await diaryAnalysisFlow(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Diary analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Insight Extraction Failed",
        description: "Your AI companion couldn't process this entry. Please try a different reflection.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="glass-card border-white/5 shadow-2xl overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-all duration-1000" />
        
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
               <BookOpen className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-outfit font-black tracking-tight">Diary Intelligence</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Share your thoughts, feelings, or daily log. Our AI will extract mood patterns and growth opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField
                control={form.control}
                name="diaryEntries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-foreground/80 flex items-center gap-2 mb-4">
                       <PenTool className="h-4 w-4 text-purple-400" />
                       Your Reflections
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="How was your day? What's on your mind? 'Today I felt a bit overwhelmed with the project but managed to finish the core logic. I also had a great lunch with a friend which cheered me up...'"
                          className="min-h-[300px] bg-white/5 border-white/10 rounded-[40px] p-8 focus:ring-purple-500/50 focus:border-purple-500 text-lg leading-relaxed transition-all placeholder:text-muted-foreground/30 shadow-inner"
                          {...field}
                        />
                        <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="h-8 w-8 text-purple-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-2">
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    size="lg"
                    className="rounded-full h-14 px-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg neon-glow-purple transition-all active:scale-95"
                >
                  {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                  {isLoading ? 'Decrypting Thoughts...' : 'Extract AI Insights'}
                </Button>
              </div>
            </form>
          </Form>
          
          {isLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 flex flex-col items-center justify-center text-center p-12 glass-card rounded-[40px] border-white/5"
              >
                  <div className="relative">
                    <Loader2 className="h-14 w-14 animate-spin text-purple-400" />
                    <div className="absolute inset-0 blur-2xl bg-purple-400/30 animate-pulse" />
                  </div>
                  <p className="mt-8 text-2xl font-outfit font-black text-foreground">AI Ruminating...</p>
                  <p className="mt-2 text-muted-foreground max-w-sm">
                    Analyzing emotional resonance and behavioral patterns across your reflection...
                  </p>
              </motion.div>
          )}
        </CardContent>
      </Card>
      
      {analysisResult && <AnalysisResultCard result={analysisResult} />}
    </div>
  );
}
