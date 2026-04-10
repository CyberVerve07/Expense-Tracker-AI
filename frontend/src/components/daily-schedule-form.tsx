"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter, DialogClose } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useEffect, useCallback } from "react";
import type { DailySchedule, DailyScheduleFormData } from "@/lib/types";
import { Coffee, GraduationCap, Briefcase, DollarSign, ListTodo, Sparkles, BookOpen, PenTool } from "lucide-react";
import { motion } from "framer-motion";

const scheduleSchema = z.object({
    tasks: z.string().optional(),
    budget: z.coerce.number().optional(),
    importantWork: z.string().optional(),
    studyHours: z.coerce.number().optional(),
    workingHours: z.coerce.number().optional(),
    diaryNote: z.string().optional(),
})

interface DailyScheduleFormProps {
    date: Date;
    scheduleData: DailySchedule | null;
    onClose: () => void;
}

function formatDateToId(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


export default function DailyScheduleForm({ date, scheduleData, onClose }: DailyScheduleFormProps) {
    const { toast } = useToast();
    const dateId = formatDateToId(date);

    const getSafeDefaultValues = useCallback((data: DailySchedule | null): DailyScheduleFormData => {
        return {
            tasks: data?.tasks || '',
            budget: data?.budget ?? undefined,
            importantWork: data?.importantWork || '',
            studyHours: data?.studyHours ?? undefined,
            workingHours: data?.workingHours ?? undefined,
            diaryNote: data?.diaryNote || '',
        };
    }, []);

    const form = useForm<DailyScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: getSafeDefaultValues(scheduleData),
    });
     
    useEffect(() => {
        const saved = localStorage.getItem(`schedule_${dateId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                form.reset(getSafeDefaultValues(parsed));
            } catch (e) {
                console.error("Local storage parse failed", e);
            }
        } else {
            form.reset(getSafeDefaultValues(scheduleData));
        }
    }, [scheduleData, form, getSafeDefaultValues, dateId]);


    const handleSubmit = (data: DailyScheduleFormData) => {
        localStorage.setItem(`schedule_${dateId}`, JSON.stringify(data));
        toast({
            title: "Protocol Locked",
            description: "Synchronized with local temporal database.",
        });
        onClose();
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid gap-8"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                                <ListTodo className="h-5 w-5" />
                            </span>
                            <h3 className="text-xl font-outfit font-bold tracking-tight">Main Objectives</h3>
                        </div>
                        
                        <div className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="tasks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 font-outfit text-xs uppercase tracking-widest">Tasks & Quotas</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Define your daily output..." 
                                                className="bg-white/5 border-white/10 rounded-3xl min-h-[100px] p-5 focus:ring-cyan-500/30 transition-all duration-300 focus:bg-white/10"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 font-outfit text-xs uppercase tracking-widest flex items-center gap-2">
                                                <DollarSign className="h-3 w-3" />
                                                Resource Usage (₹)
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="Allocation..." 
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] text-lg font-outfit transition-all duration-300 focus:bg-white/10"
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
                                    name="importantWork"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 font-outfit text-xs uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles className="h-3 w-3" />
                                                High Priority
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Critical vector..." 
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] font-outfit transition-all duration-300 focus:bg-white/10"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="studyHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 font-outfit text-xs uppercase tracking-widest flex items-center gap-2">
                                                <GraduationCap className="h-3 w-3" />
                                                Education (Hours)
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] text-center font-outfit font-bold text-xl transition-all duration-300 focus:bg-white/10"
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
                                    name="workingHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 font-outfit text-xs uppercase tracking-widest flex items-center gap-2">
                                                <Briefcase className="h-3 w-3" />
                                                Sector-X (Hours)
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] text-center font-outfit font-bold text-xl transition-all duration-300 focus:bg-white/10"
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
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-purple-400/10 text-purple-400">
                                <BookOpen className="h-5 w-5" />
                            </span>
                            <h3 className="text-xl font-outfit font-bold tracking-tight text-purple-100">Diary Reflections</h3>
                        </div>

                        <FormField
                            control={form.control}
                            name="diaryNote"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/40 font-outfit text-xs uppercase tracking-widest flex items-center gap-2">
                                        <PenTool className="h-3 w-3" />
                                        Internal Protocol Log
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Write your thoughts, reflections, or a detailed plan for the day..." 
                                            className="bg-purple-900/10 border-purple-500/20 rounded-[32px] min-h-[160px] p-6 focus:ring-purple-500/30 transition-all duration-500 focus:bg-purple-800/10 font-outfit text-white/80 leading-relaxed placeholder:text-white/20"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </motion.div>

                <DialogFooter className="gap-4 flex-col sm:flex-row pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost" className="rounded-full h-14 px-8 font-outfit text-white/40 hover:text-white">Decline Update</Button>
                    </DialogClose>
                    <Button type="submit" className="rounded-full h-14 px-12 font-black font-outfit text-lg bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] neon-glow-cyan">Synchronize Protocol</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
