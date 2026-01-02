"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TrendChartProps {
    moodData: { date: string, mood: number }[];
    spendingData: { category: string, value: number }[];
}

const moodChartConfig = {
    mood: {
        label: 'Mood Level',
        color: 'hsl(var(--primary))',
    },
} satisfies ChartConfig;

const spendingChartConfig = {
    value: {
        label: 'Spending',
        color: 'hsl(var(--accent))',
    },
    category: {
        label: 'Category',
    }
} satisfies ChartConfig;


export default function TrendChart({ moodData, spendingData }: TrendChartProps) {
    return (
        <Tabs defaultValue="mood" className="w-full h-full flex flex-col bg-card">
            <TabsList className="grid w-full grid-cols-2 rounded-none rounded-t-lg border-b">
                <TabsTrigger value="mood">Mood Trend</TabsTrigger>
                <TabsTrigger value="spending">Spending Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="mood" className="flex-1 p-2">
                <ChartContainer config={moodChartConfig} className="h-full w-full">
                    <LineChart data={moodData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                         <YAxis 
                            domain={[0, 5]} 
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line
                            dataKey="mood"
                            type="monotone"
                            stroke="var(--color-mood)"
                            strokeWidth={2}
                            dot={true}
                        />
                    </LineChart>
                </ChartContainer>
            </TabsContent>
            <TabsContent value="spending" className="flex-1 p-2">
                <ChartContainer config={spendingChartConfig} className="h-full w-full">
                    <BarChart data={spendingData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={80}
                            className='text-xs'
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </TabsContent>
        </Tabs>
    );
}
