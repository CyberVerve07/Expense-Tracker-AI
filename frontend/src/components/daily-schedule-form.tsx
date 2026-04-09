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
import { Coffee, GraduationCap, Briefcase, DollarSign, ListTodo, Sparkles } from "lucide-react";

const scheduleSchema = z.object({
    tasks: z.string().optional(),
    budget: z.coerce.number().optional(),
    importantWork: z.string().optional(),
    studyHours: z.coerce.number().optional(),
    workingHours: z.coerce.number().optional(),
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
        };
    }, []);

    const form = useForm<DailyScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: getSafeDefaultValues(scheduleData),
    });
     
    useEffect(() => {
        // Try to load from localStorage if scheduleData is not provided
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
        // Save to localStorage
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
                <div className="grid gap-8">
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
                                                className="bg-white/5 border-white/10 rounded-3xl min-h-[120px] p-5 focus:ring-cyan-500/30"
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
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] text-lg font-outfit"
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
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] font-outfit"
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
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] text-center font-outfit font-bold text-xl"
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
                                                    className="bg-white/5 border-white/10 h-14 rounded-[20px] text-center font-outfit font-bold text-xl"
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
                </div>

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
