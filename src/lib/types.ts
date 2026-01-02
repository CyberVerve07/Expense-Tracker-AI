export interface DailySchedule {
    id: string;
    userId: string;
    date: string;
    tasks?: string;
    budget?: number;
    importantWork?: string;
    studyHours?: number;
    workingHours?: number;
}

export type DailyScheduleFormData = Omit<DailySchedule, 'id' | 'userId' | 'date'>;
