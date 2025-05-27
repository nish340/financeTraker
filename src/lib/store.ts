import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from './utils';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  monthlyAlerts: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: YYYY-MM
  spent: number;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isOneTime: boolean;
  isPlanned: boolean;
  receiptImage?: string;
}

export interface Income {
  id: string;
  amount: number;
  date: string;
  source: string;
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyDeposit: number;
  startDate: string;
  targetDate: string;
  icon: string;
  color: string;
}

export interface InvestmentCalculation {
  id: string;
  type: 'sip' | 'lumpsum' | 'retirement';
  amount: number;
  duration: number; // in months
  interestRate: number;
  result: number;
  createdAt: string;
}

export interface FinancialForecast {
  id: string;
  name: string;
  incomeGrowth: number;
  inflation: number;
  investmentReturns: number;
  additionalSavings: number;
  additionalInvestment: number;
  years: number;
  createdAt: string;
}

export interface FinancialHealthScore {
  score: number;
  date: string;
  savingsRatio: number;
  budgetAdherence: number;
  debtRatio: number;
  investmentRatio: number;
}

export interface AppState {
  user: User;
  categories: Category[];
  budgets: Budget[];
  expenses: Expense[];
  incomes: Income[];
  savingsGoals: SavingsGoal[];
  investmentCalculations: InvestmentCalculation[];
  financialForecasts: FinancialForecast[];
  financialHealthScores: FinancialHealthScore[];
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  
  addInvestmentCalculation: (calc: Omit<InvestmentCalculation, 'id'>) => void;
  deleteInvestmentCalculation: (id: string) => void;
  
  addFinancialForecast: (forecast: Omit<FinancialForecast, 'id'>) => void;
  deleteFinancialForecast: (id: string) => void;
  
  updateUser: (user: Partial<User>) => void;
  calculateFinancialHealthScore: () => void;
}

// Initial data
const defaultCategories: Category[] = [
  { id: '1', name: 'Food', icon: 'utensils', color: '#ef4444' },
  { id: '2', name: 'Transport', icon: 'car', color: '#f97316' },
  { id: '3', name: 'Rent', icon: 'home', color: '#eab308' },
  { id: '4', name: 'Utilities', icon: 'bolt', color: '#22c55e' },
  { id: '5', name: 'Entertainment', icon: 'film', color: '#3b82f6' },
  { id: '6', name: 'Shopping', icon: 'shopping-bag', color: '#a855f7' },
  { id: '7', name: 'Health', icon: 'heart', color: '#ec4899' },
  { id: '8', name: 'Education', icon: 'book', color: '#06b6d4' },
];

// Create store
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: '1',
        name: 'Nidhchay',
        email: 'nidhchay@example.com',
        currency: '$',
        theme: 'light',
        notifications: true,
        monthlyAlerts: true,
      },
      categories: defaultCategories,
      budgets: [],
      expenses: [],
      incomes: [],
      savingsGoals: [],
      investmentCalculations: [],
      financialForecasts: [],
      financialHealthScores: [],
      
      // Expense actions
      addExpense: (expense) => {
        const newExpense = { ...expense, id: generateId() };
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
        
        // Update budget spent amount
        if (expense.categoryId) {
          const currentMonth = new Date(expense.date).toISOString().substring(0, 7);
          set((state) => {
            const budget = state.budgets.find(
              (b) => b.categoryId === expense.categoryId && b.month === currentMonth
            );
            
            if (budget) {
              return {
                budgets: state.budgets.map((b) =>
                  b.id === budget.id ? { ...b, spent: b.spent + expense.amount } : b
                ),
              };
            }
            return {};
          });
        }
        
        // Recalculate financial health score
        get().calculateFinancialHealthScore();
      },
      
      updateExpense: (id, expense) => {
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...expense } : e
          ),
        }));
        get().calculateFinancialHealthScore();
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
        get().calculateFinancialHealthScore();
      },
      
      // Income actions
      addIncome: (income) => {
        const newIncome = { ...income, id: generateId() };
        set((state) => ({
          incomes: [...state.incomes, newIncome],
        }));
        get().calculateFinancialHealthScore();
      },
      
      updateIncome: (id, income) => {
        set((state) => ({
          incomes: state.incomes.map((i) =>
            i.id === id ? { ...i, ...income } : i
          ),
        }));
        get().calculateFinancialHealthScore();
      },
      
      deleteIncome: (id) => {
        set((state) => ({
          incomes: state.incomes.filter((i) => i.id !== id),
        }));
        get().calculateFinancialHealthScore();
      },
      
      // Budget actions
      addBudget: (budget) => {
        const newBudget = { ...budget, id: generateId() };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },
      
      updateBudget: (id, budget) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...budget } : b
          ),
        }));
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },
      
      // Category actions
      addCategory: (category) => {
        const newCategory = { ...category, id: generateId() };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      updateCategory: (id, category) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
      
      // Savings goal actions
      addSavingsGoal: (goal) => {
        const newGoal = { ...goal, id: generateId() };
        set((state) => ({
          savingsGoals: [...state.savingsGoals, newGoal],
        }));
      },
      
      updateSavingsGoal: (id, goal) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        }));
      },
      
      deleteSavingsGoal: (id) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.filter((g) => g.id !== id),
        }));
      },
      
      // Investment calculation actions
      addInvestmentCalculation: (calc) => {
        const newCalc = { ...calc, id: generateId(), createdAt: new Date().toISOString() };
        set((state) => ({
          investmentCalculations: [...state.investmentCalculations, newCalc],
        }));
      },
      
      deleteInvestmentCalculation: (id) => {
        set((state) => ({
          investmentCalculations: state.investmentCalculations.filter((c) => c.id !== id),
        }));
      },
      
      // Financial forecast actions
      addFinancialForecast: (forecast) => {
        const newForecast = { ...forecast, id: generateId(), createdAt: new Date().toISOString() };
        set((state) => ({
          financialForecasts: [...state.financialForecasts, newForecast],
        }));
      },
      
      deleteFinancialForecast: (id) => {
        set((state) => ({
          financialForecasts: state.financialForecasts.filter((f) => f.id !== id),
        }));
      },
      
      // User actions
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      
      // Calculate financial health score
      calculateFinancialHealthScore: () => {
        const state = get();
        const today = new Date();
        const currentMonth = today.toISOString().substring(0, 7);
        
        // Get this month's income
        const monthlyIncome = state.incomes
          .filter((i) => i.date.startsWith(currentMonth))
          .reduce((sum, i) => sum + i.amount, 0);
        
        // Get this month's expenses
        const monthlyExpenses = state.expenses
          .filter((e) => e.date.startsWith(currentMonth))
          .reduce((sum, e) => sum + e.amount, 0);
        
        // Calculate savings ratio (income - expenses) / income
        const savingsRatio = monthlyIncome > 0 
          ? (monthlyIncome - monthlyExpenses) / monthlyIncome 
          : 0;
        
        // Calculate budget adherence
        let budgetAdherence = 1;
        const budgetsForMonth = state.budgets.filter((b) => b.month === currentMonth);
        
        if (budgetsForMonth.length > 0) {
          const totalBudgetAmount = budgetsForMonth.reduce((sum, b) => sum + b.amount, 0);
          const totalSpent = budgetsForMonth.reduce((sum, b) => sum + b.spent, 0);
          budgetAdherence = totalBudgetAmount > 0 
            ? Math.min(1, (totalBudgetAmount - totalSpent) / totalBudgetAmount + 0.5) 
            : 1;
        }
        
        // Placeholder values for demo
        const debtRatio = 0.8; // Assuming low debt
        const investmentRatio = 0.6; // Moderate investment
        
        // Calculate overall score (0-100)
        const score = Math.round(
          (savingsRatio * 0.4 + budgetAdherence * 0.3 + debtRatio * 0.15 + investmentRatio * 0.15) * 100
        );
        
        const newScore: FinancialHealthScore = {
          score,
          date: today.toISOString(),
          savingsRatio,
          budgetAdherence,
          debtRatio,
          investmentRatio,
        };
        
        set((state) => ({
          financialHealthScores: [...state.financialHealthScores, newScore],
        }));
      },
    }),
    {
      name: 'fintrack-storage',
    }
  )
);