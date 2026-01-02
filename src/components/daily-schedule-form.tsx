
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
import { useFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Info } from "lucide-react";

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
    const { user, firestore } = useFirebase();

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
        form.reset(getSafeDefaultValues(scheduleData));
    }, [scheduleData, form, getSafeDefaultValues]);


    const handleSubmit = (data: DailyScheduleFormData) => {
        if (!user || !firestore) {
            toast({
                variant: "destructive",
                title: "Not logged in",
                description: "You must be logged in to save a schedule.",
            });
            return;
        }

        const scheduleId = formatDateToId(date);
        const scheduleRef = doc(firestore, 'users', user.uid, 'schedules', scheduleId);
        
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([_, v]) => v !== undefined)
        );

        const dataToSave: Partial<DailySchedule> = {
            ...cleanData,
            id: scheduleId,
            userId: user.uid,
            date: date.toISOString(),
        };

        setDocumentNonBlocking(scheduleRef, dataToSave, { merge: true });

        toast({
            title: "Schedule Saved!",
            description: "Your schedule for the day has been saved.",
        });
        onClose();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                 {!user && (
                    <Alert className="mb-4 bg-primary/10 border-primary/20">
                        <Info className="h-4 w-4" />
                        <AlertTitle>You are not logged in</AlertTitle>
                        <AlertDescription>
                            Your data will not be saved. <Link href="/auth/login" className="font-bold underline">Log in</Link> to save your progress.
                        </AlertDescription>
                    </Alert>
                )}
                <fieldset disabled={!user} className="grid gap-6 py-4">
                    <div>
                        <h3 className="text-lg font-medium mb-4">Productivity</h3>
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="tasks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Today's Tasks</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="What are your main tasks for today?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Today's Budget (₹)</FormLabel>
                                        <FormControl>
                                            <Input 
                                              type="number" 
                                              placeholder="e.g., 500" 
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
                                        <FormLabel className="font-bold">Important Work</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Any critical meetings or deadlines?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="studyHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Study Hours</FormLabel>
                                            <FormControl>
                                                <Input 
                                                  type="number" 
                                                  placeholder="e.g., 2" 
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
                                            <FormLabel className="font-bold">Working Hours</FormLabel>
                                            <FormControl>
                                                <Input 
                                                  type="number" 
                                                  placeholder="e.g., 8" 
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
                </fieldset>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={!user}>Save Schedule</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
