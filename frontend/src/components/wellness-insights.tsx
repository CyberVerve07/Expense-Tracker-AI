"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { wellnessInsightsFlow } from '@/ai/flows/wellness-insights-flow';
import type { WellnessInsightsOutput } from '@/ai/flows/wellness-insights-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalysisResultCard from './analysis-result-card';
import { Loader2, Activity, Heart, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const formSchema = z.object({
  wellnessData: z.string().min(30, {
    message: "Please provide a bit more detail (at least 30 characters) for a quality wellness audit.",
  }),
});

export default function WellnessInsights() {
  const [analysisResult, setAnalysisResult] = useState<WellnessInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wellnessData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await wellnessInsightsFlow(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Wellness analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Synthesis Error",
        description: " could not generate wellness insights at this time. Please check your input.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="glass-card border-white/5 shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/5 via-transparent to-cyan-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <CardHeader className="relative space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-magenta-500/10 text-magenta-400">
               <Activity className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-outfit font-black tracking-tight">Wellness Core</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Map your physical and mental energy. Our AI correlates your habits with your optimal performance states.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField
                control={form.control}
                name="wellnessData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-foreground/80 flex items-center gap-2 mb-4">
                       <Heart className="h-4 w-4 text-magenta-400" />
                       Vitals & Patterns
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Log your sleep, stress levels, exercise, or mood. e.g., 'Slept 6 hours, felt restless. Drank 3 coffees. Did a 20min run in the evening. Mood was stable but focus was low...'"
                          className="min-h-[250px] bg-white/5 border-white/10 rounded-[40px] p-8 focus:ring-magenta-500/50 focus:border-magenta-500 text-lg leading-relaxed transition-all placeholder:text-muted-foreground/30 shadow-inner"
                          {...field}
                        />
                        <div className="absolute bottom-6 right-6 p-3 rounded-2xl bg-magenta-500/10 border border-magenta-500/20">
                            <Zap className="h-5 w-5 text-magenta-300" />
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
                    className="rounded-full h-14 px-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg transition-all active:scale-95 group"
                >
                  {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                  {isLoading ? 'Synthesizing Patterns...' : 'Generate Wellness Matrix'}
                  <div className="ml-2 h-2 w-2 rounded-full bg-magenta-400 group-hover:animate-ping hidden md:block" />
                </Button>
              </div>
            </form>
          </Form>
          
          {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex flex-col items-center justify-center text-center p-12 glass-card rounded-[40px] border-white/5"
              >
                  <div className="flex gap-2 mb-8">
                    {[0, 1, 2].map((i) => (
                        <motion.div 
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            className="h-3 w-3 rounded-full bg-magenta-400" 
                        />
                    ))}
                  </div>
                  <p className="text-2xl font-outfit font-black text-foreground tracking-tight">Accessing Bio-Patterns</p>
                  <p className="mt-2 text-muted-foreground max-w-sm">
                    Cross-referencing your activity logs with optimal wellness benchmarks...
                  </p>
              </motion.div>
          )}
        </CardContent>
      </Card>
      
      {analysisResult && <AnalysisResultCard result={analysisResult} />}
    </div>
  );
}
