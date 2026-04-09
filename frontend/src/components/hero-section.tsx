"use client";

import Image from 'next/image';
import TrendChart from './trend-chart';
import placeholderImages from '@/lib/placeholder-images.json';
import { motion } from 'framer-motion';

const moodTrendData = [
  { date: 'Jan 1', mood: 4 },
  { date: 'Jan 2', mood: 3 },
  { date: 'Jan 3', mood: 5 },
  { date: 'Jan 4', mood: 4 },
  { date: 'Jan 5', mood: 2 },
  { date: 'Jan 6', mood: 4 },
  { date: 'Jan 7', mood: 5 },
];

const spendingData = [
  { category: 'Food', value: 400 },
  { category: 'Transport', value: 300 },
  { category: 'Entertainment', value: 200 },
  { category: 'Shopping', value: 278 },
  { category: 'Utilities', value: 189 },
];

export default function HeroSection() {
    const heroImage = placeholderImages.placeholderImages.find(img => img.id === "hero-wellness");
    
    return (
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-4xl font-bold font-outfit tracking-tight">Visualize Your <span className="text-gradient-cyan">Progress.</span></h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Track your mood and spending habits over time to identify patterns and make informed decisions about your well-being.
                </p>
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-72 rounded-[32px] overflow-hidden p-6 glass-card bg-black/40 border-white/5 shadow-inner"
                >
                    <TrendChart moodData={moodTrendData} spendingData={spendingData} />
                </motion.div>
            </div>
            
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative h-full min-h-[400px] rounded-[40px] overflow-hidden shadow-2xl glass-card group"
            >
                {heroImage ? (
                    <>
                        <Image
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            data-ai-hint={heroImage.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-white/80 text-sm font-medium backdrop-blur-md bg-black/20 px-4 py-2 rounded-full w-fit">
                                Live AI Synthesis
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Pulse visualization active...</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
