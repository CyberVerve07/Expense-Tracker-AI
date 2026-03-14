"use client";

import Image from 'next/image';
import { Card } from './ui/card';
import TrendChart from './trend-chart';
import placeholderImages from '@/lib/placeholder-images.json';

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
        <Card className="p-4 md:p-6 grid md:grid-cols-2 gap-6 items-center shadow-md border-primary/20">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold font-headline">Visualize Your Progress</h2>
                <p className="text-muted-foreground">Track your mood and spending habits over time to identify patterns and make informed decisions about your well-being.</p>
                <div className="h-64 rounded-lg overflow-hidden border">
                    <TrendChart moodData={moodTrendData} spendingData={spendingData} />
                </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[320px] rounded-lg overflow-hidden">
                {heroImage ? (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Image not found</p>
                    </div>
                )}
            </div>
        </Card>
    )
}
