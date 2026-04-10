import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: 'savings' | 'investment' | 'debt' | 'education' | 'other';
  deadline: string;
}

export interface UserProfile {
  xp: number;
  level: number;
  tier: string;
}

interface QuantumState {
  expenses: Expense[];
  goals: Goal[];
  userProfile: UserProfile;
  zenMode: boolean;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  addXP: (amount: number) => void;
  toggleZenMode: () => void;
}

const getTier = (level: number) => {
  if (level >= 50) return 'Quantum Master';
  if (level >= 30) return 'Nexus Voyager';
  if (level >= 10) return 'Plasma Operator';
  return 'Quantum Initiate';
};

export const useQuantumStore = create<QuantumState>()(
  persist(
    (set) => ({
      expenses: [],
      goals: [],
      userProfile: { xp: 0, level: 1, tier: 'Quantum Initiate' },
      zenMode: false,

      addExpense: (expense) =>
        set((state) => {
          const newExpense = { ...expense, id: Date.now().toString() };
          // Add 10 XP config 
          const newXp = state.userProfile.xp + 10;
          const newLevel = Math.floor(newXp / 100) + 1;
          const newTier = getTier(newLevel);
          return {
            expenses: [...state.expenses, newExpense],
            userProfile: { xp: newXp, level: newLevel, tier: newTier }
          };
        }),
      
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: Date.now().toString(), currentAmount: 0 }],
        })),

      updateGoalProgress: (id, amount) =>
        set((state) => {
          const newGoals = state.goals.map((g) => {
            if (g.id === id) {
              const newAmount = Math.min(g.currentAmount + amount, g.targetAmount);
              return { ...g, currentAmount: newAmount };
            }
            return g;
          });
          
          const completedGoal = newGoals.find(g => g.id === id && g.currentAmount === g.targetAmount && state.goals.find(oldG => oldG.id === id)?.currentAmount !== g.targetAmount);
          
          if (completedGoal) {
             const newXp = state.userProfile.xp + 100;
             const newLevel = Math.floor(newXp / 100) + 1;
             const newTier = getTier(newLevel);
             return {
                 goals: newGoals,
                 userProfile: { xp: newXp, level: newLevel, tier: newTier }
             }
          }

          return { goals: newGoals };
        }),
        
      addXP: (amount) =>
        set((state) => {
          const newXp = state.userProfile.xp + amount;
          const newLevel = Math.floor(newXp / 100) + 1;
          const newTier = getTier(newLevel);
          return { userProfile: { xp: newXp, level: newLevel, tier: newTier } };
        }),

      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
    }),
    {
      name: 'quantum-storage',
    }
  )
);
