"use client";

import Header from '@/components/layout/header';
import CalendarView from '@/components/calendar-view';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background mesh-gradient overflow-x-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col pt-24">
        {/* Hero Section */}
        <section className="container px-4 py-12 md:py-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 bg-primary/5 blur-[120px] rounded-full" />
          
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider"
            >
              <Zap className="h-3 w-3 fill-current" />
              Next Gen AI Assistant
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-outfit font-black tracking-tight leading-[1.1]"
            >
              Master your time and <span className="text-gradient-cyan">money.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              The first AI-driven planner that maps your expenses, diary, and wellness into a single, beautiful 2026 interactive calendar.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <Button size="lg" className="rounded-full px-8 h-14 text-base gap-2 neon-glow-cyan">
                  Explore AI Insights <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring', damping: 20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24"
          >
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6 text-cyan-400" />}
              title="Expense Flows"
              description="AI analyzes your spending patterns and suggests optimizations for a healthier bank balance."
            />
            <FeatureCard 
              icon={<Sparkles className="h-6 w-6 text-purple-400" />}
              title="Diary Intelligence"
              description="Your daily thoughts turned into actionable insights for mood tracking and productivity."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6 text-pink-400" />}
              title="Wellness Score"
              description="Integrated wellness checkpoints mapped directly into your 2026 holiday calendar."
            />
          </motion.div>
        </section>

        {/* Calendar Section */}
        <section className="container px-4 py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="rounded-[40px] glass-card p-1 md:p-4"
          >
            <CalendarView />
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[32px] glass-card group hover:bg-white/5 transition-colors duration-500">
      <div className="mb-6 p-3 w-fit rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-outfit font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
