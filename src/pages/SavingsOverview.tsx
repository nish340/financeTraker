import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatCurrency, getMonthRange } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LightbulbIcon, TrendingUp, TrendingDown } from "lucide-react";

export default function SavingsOverview() {
  const { 
    user, 
    expenses, 
    incomes
  } = useStore();
  
  const [monthlySavings, setMonthlySavings] = useState<any[]>([]);
  const [savingsTips, setSavingsTips] = useState<string[]>([]);
  const [savingsRatio, setSavingsRatio] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsVsSpendingData, setSavingsVsSpendingData] = useState<any[]>([]);
  
  useEffect(() => {
    // Calculate monthly savings over time
    const months = getMonthRange(12);
    const monthlySavingsData = months.map(month => {
      const monthIncome = incomes
        .filter(i => i.date.startsWith(month))
        .reduce((sum, i) => sum + i.amount, 0);
      
      const monthExpenses = expenses
        .filter(e => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0);
      
      const savings = monthIncome - monthExpenses;
      
      return {
        month: month.substring(5, 7), // Get MM part
        year: month.substring(0, 4),  // Get YYYY part
        savings,
        income: monthIncome,
        expenses: monthExpenses
      };
    });
    
    setMonthlySavings(monthlySavingsData);
    
    // Calculate total savings
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const savings = totalIncome - totalExpenses;
    setTotalSavings(savings);
    
    // Calculate savings ratio
    const savingsRatio = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    setSavingsRatio(savingsRatio);
    
    // Prepare data for pie chart
    setSavingsVsSpendingData([
      { name: 'Savings', value: Math.max(0, savings), color: '#10b981' },
      { name: 'Spending', value: totalExpenses, color: '#ef4444' }
    ]);
    
    // Generate savings tips based on data
    generateSavingsTips(monthlySavingsData, savingsRatio);
  }, [expenses, incomes]);
  
  const generateSavingsTips = (savingsData: any[], ratio: number) => {
    const tips: string[] = [];
    
    // Basic tips
    tips.push("Aim to save at least 20% of your monthly income.");
    tips.push("Set up automatic transfers to your savings account on payday.");
    
    // Data-driven tips
    if (ratio < 10) {
      tips.push("Your savings rate is below 10%. Try to reduce non-essential expenses.");
    } else if (ratio >= 20) {
      tips.push("Great job! You're saving more than 20% of your income.");
    }
    
    // Check for declining savings trend
    if (savingsData.length >= 3) {
      const lastThreeMonths = savingsData.slice(-3);
      if (lastThreeMonths[0].savings > lastThreeMonths[1].savings && 
          lastThreeMonths[1].savings > lastThreeMonths[2].savings) {
        tips.push("Your savings have been declining for the last 3 months. Review your spending habits.");
      }
    }
    
    // Check for categories with high spending
    const categorySpending: Record<string, number> = {};
    expenses.forEach(expense => {
      if (!categorySpending[expense.categoryId]) {
        categorySpending[expense.categoryId] = 0;
      }
      categorySpending[expense.categoryId] += expense.amount;
    });
    
    const topCategories = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    
    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      const category = useStore.getState().categories.find(c => c.id === topCategory[0]);
      if (category) {
        tips.push(`Your highest spending category is ${category.name}. Consider setting a budget for this category.`);
      }
    }
    
    setSavingsTips(tips);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Savings Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your savings progress over time</p>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalSavings, user.currency)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lifetime savings</p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                totalSavings >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {totalSavings >= 0 ? (
                  <TrendingUp className={`h-6 w-6 text-green-600 dark:text-green-400`} />
                ) : (
                  <TrendingDown className={`h-6 w-6 text-red-600 dark:text-red-400`} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Savings Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {savingsRatio.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {savingsRatio >= 20 
                    ? 'Excellent savings rate' 
                    : savingsRatio >= 10 
                      ? 'Good savings rate' 
                      : 'Needs improvement'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                savingsRatio >= 20 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : savingsRatio >= 10 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                    : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {savingsRatio >= 20 ? (
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : savingsRatio >= 10 ? (
                  <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(
                    monthlySavings.length > 0 
                      ? monthlySavings.reduce((sum, m) => sum + m.savings, 0) / monthlySavings.length 
                      : 0, 
                    user.currency
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average monthly savings</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Savings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Savings Trend</CardTitle>
            <CardDescription>
              Track how your savings have changed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySavings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value, index) => {
                      const item = monthlySavings[index];
                      return item ? `${item.month}/${item.year.substring(2)}` : value;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value), user.currency), '']}
                    labelFormatter={(label, items) => {
                      const item = monthlySavings.find(m => m.month === label);
                      return item ? `${item.month}/${item.year}` : label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Savings vs Spending Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Savings vs Spending Ratio</CardTitle>
            <CardDescription>
              Visualize how much of your income goes to savings vs spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={savingsVsSpendingData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value, percent}) => 
                      `${name}: ${formatCurrency(value, user.currency)} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {savingsVsSpendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value), user.currency), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Savings Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Savings Tips</CardTitle>
          <CardDescription>
            Personalized recommendations to help you save more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savingsTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="mt-0.5">
                  <LightbulbIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-emerald-900 dark:text-emerald-200">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>
            Detailed view of your income, expenses, and savings by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="py-3 px-4 text-left font-medium">Month</th>
                  <th className="py-3 px-4 text-right font-medium">Income</th>
                  <th className="py-3 px-4 text-right font-medium">Expenses</th>
                  <th className="py-3 px-4 text-right font-medium">Savings</th>
                  <th className="py-3 px-4 text-right font-medium">Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlySavings.slice().reverse().map((item, index) => {
                  const savingsRate = item.income > 0 
                    ? (item.savings / item.income) * 100 
                    : 0;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`border-t ${
                        index % 2 === 0 
                          ? 'bg-white dark:bg-gray-950' 
                          : 'bg-gray-50 dark:bg-gray-900'
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">
                        {item.month}/{item.year}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.income, user.currency)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.expenses, user.currency)}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        item.savings >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(item.savings, user.currency)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{savingsRate.toFixed(1)}%</span>
                          {savingsRate >= 20 ? (
                            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : savingsRate >= 10 ? (
                            <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}