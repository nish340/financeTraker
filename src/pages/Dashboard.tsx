import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Plus,
  DollarSign,
  PiggyBank,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from "@/lib/store";
import { formatCurrency, calculatePercentage, getCurrentMonth, getMonthRange, getFinancialHealthStatus } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    user, 
    expenses, 
    incomes, 
    savingsGoals, 
    financialHealthScores,
    calculateFinancialHealthScore
  } = useStore();
  
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentIncome, setCurrentIncome] = useState(0);
  const [currentExpenses, setCurrentExpenses] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [financialScore, setFinancialScore] = useState(0);
  
  useEffect(() => {
    // Calculate financial health score if not available
    if (financialHealthScores.length === 0) {
      calculateFinancialHealthScore();
    }
    
    // Set current month
    const now = new Date();
    setCurrentMonth(now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    
    // Calculate monthly data for charts
    const months = getMonthRange(6);
    const monthlyDataArray = months.map(month => {
      const monthIncome = incomes
        .filter(i => i.date.startsWith(month))
        .reduce((sum, i) => sum + i.amount, 0);
      
      const monthExpenses = expenses
        .filter(e => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0);
      
      const monthSavings = monthIncome - monthExpenses;
      
      return {
        month: month.substring(5, 7), // Get MM part
        income: monthIncome,
        expenses: monthExpenses,
        savings: monthSavings
      };
    });
    
    setMonthlyData(monthlyDataArray);
    
    // Calculate current month stats
    const currentMonthStr = getCurrentMonth();
    const monthIncome = incomes
      .filter(i => i.date.startsWith(currentMonthStr))
      .reduce((sum, i) => sum + i.amount, 0);
    
    const monthExpenses = expenses
      .filter(e => e.date.startsWith(currentMonthStr))
      .reduce((sum, e) => sum + e.amount, 0);
    
    setCurrentIncome(monthIncome);
    setCurrentExpenses(monthExpenses);
    setCurrentSavings(monthIncome - monthExpenses);
    
    // Calculate expense breakdown by category
    const categoryTotals: Record<string, number> = {};
    expenses
      .filter(e => e.date.startsWith(currentMonthStr))
      .forEach(expense => {
        if (!categoryTotals[expense.categoryId]) {
          categoryTotals[expense.categoryId] = 0;
        }
        categoryTotals[expense.categoryId] += expense.amount;
      });
    
    const expenseBreakdown = Object.entries(categoryTotals).map(([categoryId, value]) => {
      const category = useStore.getState().categories.find(c => c.id === categoryId);
      return {
        name: category ? category.name : 'Other',
        value,
        color: category ? category.color : '#888888'
      };
    });
    
    setExpenseData(expenseBreakdown);
    
    // Calculate net worth (simplified)
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const savingsGoalsTotal = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    setNetWorth(totalIncome - totalExpenses + savingsGoalsTotal);
    
    // Get latest financial score
    if (financialHealthScores.length > 0) {
      const latestScore = financialHealthScores[financialHealthScores.length - 1];
      setFinancialScore(latestScore.score);
    }
  }, [expenses, incomes, savingsGoals, financialHealthScores, calculateFinancialHealthScore]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Financial Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">{currentMonth} Overview</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/expenses')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="outline" onClick={() => navigate('/expenses')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(currentIncome, user.currency)}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(currentExpenses, user.currency)}</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +7.8% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Savings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(currentSavings, user.currency)}</p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -15.4% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Worth</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(netWorth, user.currency)}</p>
                <div className="flex items-center mt-2">
                  {financialScore > 0 && (
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      getFinancialHealthStatus(financialScore).color
                    } bg-opacity-20 text-opacity-90`}>
                      Health Score: {financialScore}%
                    </div>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value), user.currency), '']} />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${formatCurrency(value, user.currency)}`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(Number(value), user.currency), '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Savings Goals Progress</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/goals')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {savingsGoals.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No savings goals yet. Add your first goal to track progress!
              </p>
            ) : (
              savingsGoals.slice(0, 3).map((goal) => {
                const progress = calculatePercentage(goal.currentAmount, goal.targetAmount);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{goal.name}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(goal.currentAmount, user.currency)} / {formatCurrency(goal.targetAmount, user.currency)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{Math.round(progress)}% complete</span>
                      <span>{formatCurrency(goal.targetAmount - goal.currentAmount, user.currency)} remaining</span>
                    </div>
                  </div>
                );
              })
            )}
            {savingsGoals.length > 3 && (
              <Button variant="link" className="w-full" onClick={() => navigate('/goals')}>
                View all {savingsGoals.length} goals
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/expenses')}>
              <Plus className="w-6 h-6" />
              Add Expense
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/expenses')}>
              <DollarSign className="w-6 h-6" />
              Add Income
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/goals')}>
              <Target className="w-6 h-6" />
              New Goal
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/budget')}>
              <AlertTriangle className="w-6 h-6" />
              Budget Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}