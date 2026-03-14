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

// Goal Types
export interface Goal {
    id: string;
    userId: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: 'savings' | 'investment' | 'expense' | 'personal';
    createdAt: string;
    status: 'active' | 'completed' | 'cancelled';
}

export type GoalFormData = Omit<Goal, 'id' | 'userId' | 'createdAt' | 'status'>;

// Habit Types
export interface Habit {
    id: string;
    userId: string;
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    createdAt: string;
    isActive: boolean;
}

export interface HabitLog {
    id: string;
    userId: string;
    habitId: string;
    date: string;
    completed: boolean;
}

export type HabitFormData = Omit<Habit, 'id' | 'userId' | 'createdAt'>;

// Budget Alert Types
export interface BudgetAlert {
    id: string;
    userId: string;
    category: string;
    limit: number;
    spent: number;
    month: string;
    alertTriggered: boolean;
}

export type BudgetAlertFormData = Omit<BudgetAlert, 'id' | 'userId' | 'spent' | 'alertTriggered'>;
