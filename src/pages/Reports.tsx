import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyTrends = [
  { month: 'Jan', income: 5000, expenses: 3500, savings: 1500, netWorth: 23000 },
  { month: 'Feb', income: 5200, expenses: 3800, savings: 1400, netWorth: 24400 },
  { month: 'Mar', income: 5100, expenses: 3200, savings: 1900, netWorth: 26300 },
  { month: 'Apr', income: 5300, expenses: 3600, savings: 1700, netWorth: 28000 },
  { month: 'May', income: 5400, expenses: 3900, savings: 1500, netWorth: 29500 },
  { month: 'Jun', income: 5500, expenses: 4200, savings: 1300, netWorth: 30800 },
];

const expenseCategories = [
  { name: 'Food & Dining', value: 1200, color: '#ef4444', percentage: 28.6 },
  { name: 'Transportation', value: 800, color: '#f97316', percentage: 19.0 },
  { name: 'Rent & Housing', value: 1500, color: '#eab308', percentage: 35.7 },
  { name: 'Utilities', value: 400, color: '#22c55e', percentage: 9.5 },
  { name: 'Entertainment', value: 300, color: '#3b82f6', percentage: 7.1 },
];

const savingsGoalsData = [
  { name: 'Emergency Fund', target: 10000, current: 6500, percentage: 65 },
  { name: 'Vacation', target: 3000, current: 1800, percentage: 60 },
  { name: 'New Car', target: 25000, current: 8500, percentage: 34 },
  { name: 'Home Down Payment', target: 50000, current: 12000, percentage: 24 },
];

const incomeVsExpenses = [
  { month: 'Jan', income: 5000, expenses: 3500 },
  { month: 'Feb', income: 5200, expenses: 3800 },
  { month: 'Mar', income: 5100, expenses: 3200 },
  { month: 'Apr', income: 5300, expenses: 3600 },
  { month: 'May', income: 5400, expenses: 3900 },
  { month: 'Jun', income: 5500, expenses: 4200 },
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedReport, setSelectedReport] = useState("overview");

  const currentMonth = monthlyTrends[monthlyTrends.length - 1];
  const previousMonth = monthlyTrends[monthlyTrends.length - 2];
  
  const incomeGrowth = ((currentMonth.income - previousMonth.income) / previousMonth.income * 100).toFixed(1);
  const expenseGrowth = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses * 100).toFixed(1);
  const savingsGrowth = ((currentMonth.savings - previousMonth.savings) / previousMonth.savings * 100).toFixed(1);
  const netWorthGrowth = ((currentMonth.netWorth - previousMonth.netWorth) / previousMonth.netWorth * 100).toFixed(1);

  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);
  const totalGoalsTarget = savingsGoalsData.reduce((sum, goal) => sum + goal.target, 0);
  const totalGoalsCurrent = savingsGoalsData.reduce((sum, goal) => sum + goal.current, 0);
  const overallGoalsProgress = (totalGoalsCurrent / totalGoalsTarget * 100).toFixed(1);

  const handleDownloadReport = () => {
    console.log(`Downloading ${selectedReport} report for ${selectedPeriod}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive financial insights and trends</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="goals">Goals</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleDownloadReport} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900">${currentMonth.income.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{incomeGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-gray-900">${currentMonth.expenses.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">+{expenseGrowth}%</span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
                <p className="text-2xl font-bold text-gray-900">${currentMonth.savings.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">{savingsGrowth}%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Worth</p>
                <p className="text-2xl font-bold text-gray-900">${currentMonth.netWorth.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{netWorthGrowth}%</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
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
              <LineChart data={incomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percentage}) => `${name}: ${percentage}%`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Net Worth Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Bar dataKey="netWorth" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Savings Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Overall Progress: ${totalGoalsCurrent.toLocaleString()} of ${totalGoalsTarget.toLocaleString()}
              </span>
              <Badge className="bg-blue-100 text-blue-800">
                {overallGoalsProgress}% Complete
              </Badge>
            </div>
            
            {savingsGoalsData.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-sm text-gray-600">
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${goal.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{goal.percentage}% complete</span>
                  <span>${(goal.target - goal.current).toLocaleString()} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category-wise Expense Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Category-wise Expense Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${category.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{category.percentage}% of total</div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 font-semibold">
              <span>Total Expenses</span>
              <span>${totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Savings Rate</h4>
              <p className="text-2xl font-bold text-green-900">
                {((currentMonth.savings / currentMonth.income) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-green-600">Recommended: 20%+</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Expense Ratio</h4>
              <p className="text-2xl font-bold text-blue-900">
                {((currentMonth.expenses / currentMonth.income) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-blue-600">Recommended: &lt;80%</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800">Net Worth Growth</h4>
              <p className="text-2xl font-bold text-purple-900">+{netWorthGrowth}%</p>
              <p className="text-sm text-purple-600">Month over month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}