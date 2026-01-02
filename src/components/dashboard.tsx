"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiaryAnalysis from './diary-analysis';
import ExpenseAnalysis from './expense-analysis';
import WellnessInsights from './wellness-insights';
import HeroSection from './hero-section';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('diary');
    
    return (
        <div className="w-full max-w-7xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Welcome to Your Expense Tracker
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Your personal AI assistant for a productive and balanced life. Get insights from your data to improve your well-being.
                </p>
            </div>

            <HeroSection />

            <div>
                <h2 className="text-3xl font-bold font-headline text-center mb-8">Get Your Analysis</h2>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 bg-card border">
                        <TabsTrigger value="diary">Diary Analysis</TabsTrigger>
                        <TabsTrigger value="expense">Expense Optimization</TabsTrigger>
                        <TabsTrigger value="wellness">Wellness Insights</TabsTrigger>
                    </TabsList>
                    <TabsContent value="diary" className="mt-6">
                        <DiaryAnalysis />
                    </TabsContent>
                    <TabsContent value="expense" className="mt-6">
                        <ExpenseAnalysis />
                    </TabsContent>
                    <TabsContent value="wellness" className="mt-6">
                        <WellnessInsights />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
