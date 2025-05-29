import { Category, Expense, Income, Budget, SavingsGoal, FinancialHealthScore } from './store';
import { getCurrentMonth, getMonthRange } from './utils';

// Get date ranges for sample data
const today = new Date();
const currentMonth = getCurrentMonth();
const last6Months = getMonthRange(6);

// Sample categories
export const sampleCategories: Category[] = [
  { id: '1', name: 'Food', icon: 'utensils', color: '#ef4444' },
  { id: '2', name: 'Transport', icon: 'car', color: '#f97316' },
  { id: '3', name: 'Rent', icon: 'home', color: '#eab308' },
  { id: '4', name: 'Utilities', icon: 'bolt', color: '#22c55e' },
  { id: '5', name: 'Entertainment', icon: 'film', color: '#3b82f6' },
  { id: '6', name: 'Shopping', icon: 'shopping-bag', color: '#a855f7' },
  { id: '7', name: 'Health', icon: 'heart', color: '#ec4899' },
  { id: '8', name: 'Education', icon: 'book', color: '#06b6d4' },
];

// Sample expenses
export const sampleExpenses: Expense[] = [
  // Current month expenses
  {
    id: 'e1',
    amount: 450,
    date: `${currentMonth}-05`,
    categoryId: '1',
    notes: 'Grocery shopping',
    isRecurring: false,
    isOneTime: false,
    isPlanned: true
  },
  {
    id: 'e2',
    amount: 120,
    date: `${currentMonth}-10`,
    categoryId: '2',
    notes: 'Fuel',
    isRecurring: true,
    recurringFrequency: 'monthly',
    isOneTime: false,
    isPlanned: true
  },
  {
    id: 'e3',
    amount: 1200,
    date: `${currentMonth}-01`,
    categoryId: '3',
    notes: 'Monthly rent',
    isRecurring: true,
    recurringFrequency: 'monthly',
    isOneTime: false,
    isPlanned: true
  },
  {
    id: 'e4',
    amount: 85,
    date: `${currentMonth}-15`,
    categoryId: '4',
    notes: 'Electricity bill',
    isRecurring: true,
    recurringFrequency: 'monthly',
    isOneTime: false,
    isPlanned: true
  },
  {
    id: 'e5',
    amount: 200,
    date: `${currentMonth}-20`,
    categoryId: '5',
    notes: 'Concert tickets',
    isRecurring: false,
    isOneTime: true,
    isPlanned: false
  },
  {
    id: 'e6',
    amount: 350,
    date: `${currentMonth}-18`,
    categoryId: '6',
    notes: 'New clothes',
    isRecurring: false,
    isOneTime: false,
    isPlanned: true
  },
  
  // Previous months expenses (simplified)
  ...last6Months.slice(0, 5).flatMap((month, monthIndex) => {
    return [
      {
        id: `e${monthIndex + 1}1`,
        amount: 400 + Math.floor(Math.random() * 100),
        date: `${month}-05`,
        categoryId: '1',
        notes: 'Grocery shopping',
        isRecurring: false,
        isOneTime: false,
        isPlanned: true
      },
      {
        id: `e${monthIndex + 1}2`,
        amount: 100 + Math.floor(Math.random() * 50),
        date: `${month}-10`,
        categoryId: '2',
        notes: 'Fuel',
        isRecurring: true,
        recurringFrequency: 'monthly',
        isOneTime: false,
        isPlanned: true
      },
      {
        id: `e${monthIndex + 1}3`,
        amount: 1200,
        date: `${month}-01`,
        categoryId: '3',
        notes: 'Monthly rent',
        isRecurring: true,
        recurringFrequency: 'monthly',
        isOneTime: false,
        isPlanned: true
      },
      {
        id: `e${monthIndex + 1}4`,
        amount: 70 + Math.floor(Math.random() * 30),
        date: `${month}-15`,
        categoryId: '4',
        notes: 'Electricity bill',
        isRecurring: true,
        recurringFrequency: 'monthly',
        isOneTime: false,
        isPlanned: true
      },
      {
        id: `e${monthIndex + 1}5`,
        amount: 150 + Math.floor(Math.random() * 100),
        date: `${month}-20`,
        categoryId: '5',
        notes: 'Entertainment',
        isRecurring: false,
        isOneTime: false,
        isPlanned: true
      }
    ];
  }),
  
  // One-time large expenses
  {
    id: 'e100',
    amount: 1500,
    date: `${last6Months[3]}-12`,
    categoryId: '6',
    notes: 'New smartphone',
    isRecurring: false,
    isOneTime: true,
    isPlanned: true
  },
  {
    id: 'e101',
    amount: 800,
    date: `${last6Months[1]}-22`,
    categoryId: '7',
    notes: 'Emergency dental work',
    isRecurring: false,
    isOneTime: true,
    isPlanned: false
  },
  {
    id: 'e102',
    amount: 2500,
    date: `${currentMonth}-08`,
    categoryId: '8',
    notes: 'Course enrollment',
    isRecurring: false,
    isOneTime: true,
    isPlanned: true
  }
];

// Sample incomes
export const sampleIncomes: Income[] = [
  // Current month income
  {
    id: 'i1',
    amount: 5000,
    date: `${currentMonth}-01`,
    source: 'Salary',
    notes: 'Monthly salary',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: 'i2',
    amount: 500,
    date: `${currentMonth}-15`,
    source: 'Freelance',
    notes: 'Website design project',
    isRecurring: false
  },
  
  // Previous months income
  ...last6Months.slice(0, 5).map((month, monthIndex) => ({
    id: `i${monthIndex + 10}`,
    amount: 5000,
    date: `${month}-01`,
    source: 'Salary',
    notes: 'Monthly salary',
    isRecurring: true,
    recurringFrequency: 'monthly'
  })),
  
  // Additional incomes
  {
    id: 'i20',
    amount: 1000,
    date: `${last6Months[2]}-10`,
    source: 'Bonus',
    notes: 'Performance bonus',
    isRecurring: false
  },
  {
    id: 'i21',
    amount: 300,
    date: `${last6Months[1]}-20`,
    source: 'Refund',
    notes: 'Tax refund',
    isRecurring: false
  }
];

// Sample budgets
export const sampleBudgets: Budget[] = [
  {
    id: 'b1',
    categoryId: '1',
    amount: 500,
    month: currentMonth,
    spent: 450
  },
  {
    id: 'b2',
    categoryId: '2',
    amount: 150,
    month: currentMonth,
    spent: 120
  },
  {
    id: 'b3',
    categoryId: '3',
    amount: 1200,
    month: currentMonth,
    spent: 1200
  },
  {
    id: 'b4',
    categoryId: '4',
    amount: 100,
    month: currentMonth,
    spent: 85
  },
  {
    id: 'b5',
    categoryId: '5',
    amount: 200,
    month: currentMonth,
    spent: 200
  },
  {
    id: 'b6',
    categoryId: '6',
    amount: 300,
    month: currentMonth,
    spent: 350
  }
];

// Sample savings goals
export const sampleSavingsGoals: SavingsGoal[] = [
  {
    id: 'g1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    monthlyDeposit: 500,
    startDate: last6Months[5],
    targetDate: new Date(today.getFullYear() + 1, today.getMonth(), 1).toISOString().split('T')[0],
    icon: 'shield',
    color: '#ef4444'
  },
  {
    id: 'g2',
    name: 'Vacation',
    targetAmount: 3000,
    currentAmount: 1800,
    monthlyDeposit: 300,
    startDate: last6Months[3],
    targetDate: new Date(today.getFullYear(), today.getMonth() + 4, 1).toISOString().split('T')[0],
    icon: 'plane',
    color: '#3b82f6'
  },
  {
    id: 'g3',
    name: 'New Car',
    targetAmount: 25000,
    currentAmount: 8500,
    monthlyDeposit: 800,
    startDate: last6Months[4],
    targetDate: new Date(today.getFullYear() + 2, today.getMonth(), 1).toISOString().split('T')[0],
    icon: 'car',
    color: '#22c55e'
  }
];

// Sample financial health scores
export const sampleFinancialHealthScores: FinancialHealthScore[] = [
  {
    score: 78,
    date: new Date().toISOString(),
    savingsRatio: 0.25,
    budgetAdherence: 0.9,
    debtRatio: 0.8,
    investmentRatio: 0.6
  }
];

// Function to initialize store with sample data
export function initializeStoreWithSampleData(store: any) {
  // Add sample data to store
  sampleCategories.forEach(category => {
    store.getState().addCategory(category);
  });
  
  sampleExpenses.forEach(expense => {
    store.getState().addExpense(expense);
  });
  
  sampleIncomes.forEach(income => {
    store.getState().addIncome(income);
  });
  
  sampleBudgets.forEach(budget => {
    store.getState().addBudget(budget);
  });
  
  sampleSavingsGoals.forEach(goal => {
    store.getState().addSavingsGoal(goal);
  });
  
  // Calculate financial health score
  store.getState().calculateFinancialHealthScore();
}