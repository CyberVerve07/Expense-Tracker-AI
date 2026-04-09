"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiaryAnalysis from './diary-analysis';
import ExpenseAnalysis from './expense-analysis';
import WellnessInsights from './wellness-insights';
import HeroSection from './hero-section';
import GoalTracker from './goal-tracker';
import HabitTracker from './habit-tracker';
import BudgetAlerts from './budget-alerts';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BarChart3, PieChart, Activity } from 'lucide-react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('diary');
    
    return (
        <div className="w-full max-w-7xl mx-auto space-y-16 pb-24">
            {/* Dashboard Header */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-gradient-cyan">
                    Interactive Hub
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Manage your lifestyle intelligence from a single hovering command center.
                </p>
            </motion.div>

            {/* Top Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <GoalTracker />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                    <HabitTracker />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <BudgetAlerts />
                </motion.div>
            </div>

            {/* Main Visualizer */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-[40px] glass-card p-1 md:p-8"
            >
                <HeroSection />
            </motion.div>

            {/* AI Analysis Tabbed Area */}
            <section className="space-y-10">
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-3xl font-bold font-outfit flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-cyan-400" />
                        AI Analysis Suite
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full" />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-16 glass-card p-1.5 rounded-full overflow-hidden mb-12">
                        <TabsTrigger 
                            value="diary" 
                            className="rounded-full h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 gap-2 font-medium"
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Diary</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="expense" 
                            className="rounded-full h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 gap-2 font-medium"
                        >
                            <PieChart className="h-4 w-4" />
                            <span className="hidden sm:inline">Expense</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="wellness" 
                            className="rounded-full h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 gap-2 font-medium"
                        >
                            <Activity className="h-4 w-4" />
                            <span className="hidden sm:inline">Wellness</span>
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <TabsContent value="diary" className="mt-0 ring-offset-background focus-visible:outline-none">
                                    <DiaryAnalysis />
                                </TabsContent>
                                <TabsContent value="expense" className="mt-0 ring-offset-background focus-visible:outline-none">
                                    <ExpenseAnalysis />
                                </TabsContent>
                                <TabsContent value="wellness" className="mt-0 ring-offset-background focus-visible:outline-none">
                                    <WellnessInsights />
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Tabs>
            </section>
        </div>
    );
}
