"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter, DialogClose } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { DollarSign, BookOpen, ListTodo, Briefcase, GraduationCap, Sparkles, Save, CheckCircle2 } from "lucide-react";

interface DailyScheduleFormProps {
    date: Date;
    onClose: () => void;
}

function formatDateToId(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function DailyScheduleForm({ date, onClose }: DailyScheduleFormProps) {
    const { toast } = useToast();
    const dateId = formatDateToId(date);

    // Simple state — no react-hook-form complexity
    const [tasks, setTasks] = useState('');
    const [budget, setBudget] = useState('');
    const [importantWork, setImportantWork] = useState('');
    const [studyHours, setStudyHours] = useState('');
    const [workingHours, setWorkingHours] = useState('');
    const [diaryNote, setDiaryNote] = useState('');
    const [saved, setSaved] = useState(false);

    // Load existing data when date changes
    useEffect(() => {
        const existing = localStorage.getItem(`schedule_${dateId}`);
        if (existing) {
            try {
                const data = JSON.parse(existing);
                setTasks(data.tasks || '');
                setBudget(data.budget !== undefined ? String(data.budget) : '');
                setImportantWork(data.importantWork || '');
                setStudyHours(data.studyHours !== undefined ? String(data.studyHours) : '');
                setWorkingHours(data.workingHours !== undefined ? String(data.workingHours) : '');
                setDiaryNote(data.diaryNote || '');
            } catch (e) {
                console.error('Failed to parse saved schedule', e);
            }
        } else {
            // Reset all fields for a new date
            setTasks('');
            setBudget('');
            setImportantWork('');
            setStudyHours('');
            setWorkingHours('');
            setDiaryNote('');
        }
        setSaved(false);
    }, [dateId]);

    const handleSave = () => {
        const data = {
            tasks,
            budget: budget !== '' ? Number(budget) : undefined,
            importantWork,
            studyHours: studyHours !== '' ? Number(studyHours) : undefined,
            workingHours: workingHours !== '' ? Number(workingHours) : undefined,
            diaryNote,
        };
        localStorage.setItem(`schedule_${dateId}`, JSON.stringify(data));
        setSaved(true);
        toast({
            title: "✅ Saved!",
            description: `Diary & schedule saved for ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}.`,
        });
        setTimeout(() => onClose(), 800);
    };

    return (
        <div className="space-y-8">
            {/* Tasks Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                        <ListTodo className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-bold text-white/80">Today's Tasks</h3>
                </div>
                <Textarea
                    value={tasks}
                    onChange={e => setTasks(e.target.value)}
                    placeholder="What tasks do you want to complete today?"
                    className="bg-white/5 border-white/10 rounded-2xl min-h-[90px] p-4 text-white placeholder:text-white/20 focus:border-cyan-500/40"
                />
            </div>

            {/* Budget + Priority */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
                        <DollarSign className="h-3 w-3" /> Budget (₹)
                    </label>
                    <Input
                        type="number"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        placeholder="0"
                        className="bg-white/5 border-white/10 h-12 rounded-2xl text-white placeholder:text-white/20"
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
                        <Sparkles className="h-3 w-3" /> Top Priority
                    </label>
                    <Input
                        value={importantWork}
                        onChange={e => setImportantWork(e.target.value)}
                        placeholder="Most important thing today..."
                        className="bg-white/5 border-white/10 h-12 rounded-2xl text-white placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* Hours */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
                        <GraduationCap className="h-3 w-3" /> Study Hours
                    </label>
                    <Input
                        type="number"
                        value={studyHours}
                        onChange={e => setStudyHours(e.target.value)}
                        placeholder="0"
                        className="bg-white/5 border-white/10 h-12 rounded-2xl text-center text-white font-bold placeholder:text-white/20"
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
                        <Briefcase className="h-3 w-3" /> Work Hours
                    </label>
                    <Input
                        type="number"
                        value={workingHours}
                        onChange={e => setWorkingHours(e.target.value)}
                        placeholder="0"
                        className="bg-white/5 border-white/10 h-12 rounded-2xl text-center text-white font-bold placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* DIARY SECTION */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-purple-400/10 text-purple-400">
                        <BookOpen className="h-4 w-4" />
                    </span>
                    <div>
                        <h3 className="text-base font-bold text-white/80">📔 Diary Entry</h3>
                        <p className="text-white/30 text-xs">Write your thoughts, feelings, plans for the day...</p>
                    </div>
                </div>
                <Textarea
                    value={diaryNote}
                    onChange={e => setDiaryNote(e.target.value)}
                    placeholder="How was your day? What's on your mind? Write anything here..."
                    className="bg-purple-900/10 border-purple-500/20 rounded-2xl min-h-[140px] p-4 text-white placeholder:text-white/20 focus:border-purple-500/50 focus:bg-purple-800/10 leading-relaxed"
                />
                {diaryNote.length > 0 && (
                    <p className="text-purple-400/60 text-xs text-right">{diaryNote.length} characters</p>
                )}
            </div>

            {/* Action Buttons */}
            <DialogFooter className="gap-3 flex-col sm:flex-row pt-2">
                <DialogClose asChild>
                    <Button type="button" variant="ghost" className="rounded-full h-12 px-6 text-white/40 hover:text-white">
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    type="button"
                    onClick={handleSave}
                    className="rounded-full h-12 px-10 font-bold bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
                >
                    {saved ? (
                        <><CheckCircle2 className="h-4 w-4" /> Saved!</>
                    ) : (
                        <><Save className="h-4 w-4" /> Save Entry</>
                    )}
                </Button>
            </DialogFooter>
        </div>
    );
}
