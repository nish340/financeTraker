import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Plus, Save, Trash2, Copy } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, calculatePercentage, getCurrentMonth } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BudgetOverview() {
  const { 
    user, 
    categories, 
    budgets, 
    expenses,
    addBudget,
    updateBudget,
    deleteBudget
  } = useStore();
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [budgetItems, setBudgetItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: 0
  });
  
  // Generate month options for the last year
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toISOString().substring(0, 7);
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return { value: month, label };
  });
  
  useEffect(() => {
    // Get budgets for the selected month
    const monthBudgets = budgets.filter(b => b.month === selectedMonth);
    
    // Calculate spent amount for each budget
    const budgetWithSpent = categories.map(category => {
      const budget = monthBudgets.find(b => b.categoryId === category.id);
      
      // Calculate spent amount from expenses
      const spent = expenses
        .filter(e => e.categoryId === category.id && e.date.startsWith(selectedMonth))
        .reduce((sum, e) => sum + e.amount, 0);
      
      return {
        id: budget?.id || "",
        categoryId: category.id,
        categoryName: category.name,
        categoryColor: category.color,
        amount: budget?.amount || 0,
        spent,
        progress: budget?.amount ? calculatePercentage(spent, budget.amount) : 0,
        isOverBudget: budget?.amount ? spent > budget.amount : false
      };
    });
    
    setBudgetItems(budgetWithSpent);
  }, [budgets, categories, expenses, selectedMonth]);
  
  const handleAddBudget = () => {
    if (!formData.categoryId || formData.amount <= 0) return;
    
    if (editingBudget) {
      updateBudget(editingBudget.id, {
        amount: formData.amount
      });
    } else {
      addBudget({
        categoryId: formData.categoryId,
        amount: formData.amount,
        month: selectedMonth,
        spent: 0
      });
    }
    
    setDialogOpen(false);
    setEditingBudget(null);
    setFormData({ categoryId: "", amount: 0 });
  };
  
  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount
    });
    setDialogOpen(true);
  };
  
  const handleDeleteBudget = (id: string) => {
    if (id) {
      deleteBudget(id);
    }
  };
  
  const handleCopyLastMonth = () => {
    // Get last month's date
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().substring(0, 7);
    
    // Get last month's budgets
    const lastMonthBudgets = budgets.filter(b => b.month === lastMonthStr);
    
    // Copy each budget to current month
    lastMonthBudgets.forEach(budget => {
      // Check if budget already exists for this category in current month
      const existingBudget = budgets.find(
        b => b.month === selectedMonth && b.categoryId === budget.categoryId
      );
      
      if (!existingBudget) {
        addBudget({
          categoryId: budget.categoryId,
          amount: budget.amount,
          month: selectedMonth,
          spent: 0
        });
      }
    });
  };
  
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverallOverBudget = totalSpent > totalBudget;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Monthly Budget</h1>
          <p className="text-gray-600 dark:text-gray-400">Plan and track your spending by category</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleCopyLastMonth}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Last Month
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
                <DialogDescription>
                  {editingBudget 
                    ? `Update budget for ${categories.find(c => c.id === editingBudget.categoryId)?.name}`
                    : "Set a monthly budget for a specific category"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({...formData, categoryId: value})}
                    disabled={!!editingBudget}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount ({user.currency})</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    min="0"
                    value={formData.amount} 
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddBudget}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingBudget ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Overall Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Progress</CardTitle>
          <CardDescription>
            {formatCurrency(totalSpent, user.currency)} spent of {formatCurrency(totalBudget, user.currency)} budgeted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={Math.min(overallProgress, 100)} 
              className={`h-4 ${isOverallOverBudget ? 'bg-red-200 dark:bg-red-950' : ''}`}
            />
            
            <div className="flex justify-between text-sm">
              <span>{Math.round(overallProgress)}% spent</span>
              <span className={isOverallOverBudget ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                {isOverallOverBudget 
                  ? `${formatCurrency(totalSpent - totalBudget, user.currency)} over budget` 
                  : `${formatCurrency(totalBudget - totalSpent, user.currency)} remaining`}
              </span>
            </div>
            
            {isOverallOverBudget && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You've exceeded your overall monthly budget. Consider adjusting your spending or increasing your budget.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetItems.map((budget) => (
          <Card key={budget.categoryId} className={`border-l-4`} style={{ borderLeftColor: budget.categoryColor }}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{budget.categoryName}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditBudget(budget)}
                    disabled={!budget.id}
                  >
                    Edit
                  </Button>
                  {budget.id && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription>
                {budget.amount > 0 
                  ? `${formatCurrency(budget.spent, user.currency)} of ${formatCurrency(budget.amount, user.currency)}`
                  : 'No budget set'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {budget.amount > 0 ? (
                <div className="space-y-2">
                  <Progress 
                    value={budget.progress} 
                    className={`h-3 ${budget.isOverBudget ? 'bg-red-200 dark:bg-red-950' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{budget.progress}% spent</span>
                    <span className={budget.isOverBudget ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                      {budget.isOverBudget 
                        ? `${formatCurrency(budget.spent - budget.amount, user.currency)} over budget` 
                        : `${formatCurrency(budget.amount - budget.spent, user.currency)} remaining`}
                    </span>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => {
                    setFormData({...formData, categoryId: budget.categoryId});
                    setDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Set Budget
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}