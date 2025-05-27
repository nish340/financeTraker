import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { CalendarIcon, Plus, Save, Trash2, Edit, Filter, ArrowUpDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ExpenseTracker() {
  const { 
    user, 
    categories, 
    expenses, 
    incomes,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome
  } = useStore();
  
  const [activeTab, setActiveTab] = useState("expenses");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Form data for expenses
  const [expenseForm, setExpenseForm] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: "",
    notes: "",
    isRecurring: false,
    recurringFrequency: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
    isOneTime: false,
    isPlanned: true
  });
  
  // Form data for income
  const [incomeForm, setIncomeForm] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    source: "",
    notes: "",
    isRecurring: false,
    recurringFrequency: "monthly" as "daily" | "weekly" | "monthly" | "yearly"
  });
  
  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      if (filterDate && !expense.date.startsWith(format(filterDate, "yyyy-MM"))) {
        return false;
      }
      if (filterCategory && expense.categoryId !== filterCategory) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc" 
          ? a.date.localeCompare(b.date) 
          : b.date.localeCompare(a.date);
      } else if (sortField === "amount") {
        return sortDirection === "asc" 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
      return 0;
    });
  
  // Filter and sort incomes
  const filteredIncomes = incomes
    .filter(income => {
      if (filterDate && !income.date.startsWith(format(filterDate, "yyyy-MM"))) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc" 
          ? a.date.localeCompare(b.date) 
          : b.date.localeCompare(a.date);
      } else if (sortField === "amount") {
        return sortDirection === "asc" 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
      return 0;
    });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  const handleAddExpense = () => {
    if (expenseForm.amount <= 0 || !expenseForm.categoryId) return;
    
    if (editingItem && activeTab === "expenses") {
      updateExpense(editingItem.id, {
        amount: expenseForm.amount,
        date: expenseForm.date,
        categoryId: expenseForm.categoryId,
        notes: expenseForm.notes,
        isRecurring: expenseForm.isRecurring,
        recurringFrequency: expenseForm.isRecurring ? expenseForm.recurringFrequency : undefined,
        isOneTime: expenseForm.isOneTime,
        isPlanned: expenseForm.isPlanned
      });
    } else {
      addExpense({
        amount: expenseForm.amount,
        date: expenseForm.date,
        categoryId: expenseForm.categoryId,
        notes: expenseForm.notes,
        isRecurring: expenseForm.isRecurring,
        recurringFrequency: expenseForm.isRecurring ? expenseForm.recurringFrequency : undefined,
        isOneTime: expenseForm.isOneTime,
        isPlanned: expenseForm.isPlanned
      });
    }
    
    resetForm();
  };
  
  const handleAddIncome = () => {
    if (incomeForm.amount <= 0 || !incomeForm.source) return;
    
    if (editingItem && activeTab === "income") {
      updateIncome(editingItem.id, {
        amount: incomeForm.amount,
        date: incomeForm.date,
        source: incomeForm.source,
        notes: incomeForm.notes,
        isRecurring: incomeForm.isRecurring,
        recurringFrequency: incomeForm.isRecurring ? incomeForm.recurringFrequency : undefined
      });
    } else {
      addIncome({
        amount: incomeForm.amount,
        date: incomeForm.date,
        source: incomeForm.source,
        notes: incomeForm.notes,
        isRecurring: incomeForm.isRecurring,
        recurringFrequency: incomeForm.isRecurring ? incomeForm.recurringFrequency : undefined
      });
    }
    
    resetForm();
  };
  
  const handleEditExpense = (expense: any) => {
    setEditingItem(expense);
    setExpenseForm({
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.categoryId,
      notes: expense.notes || "",
      isRecurring: expense.isRecurring,
      recurringFrequency: expense.recurringFrequency || "monthly",
      isOneTime: expense.isOneTime,
      isPlanned: expense.isPlanned
    });
    setDialogOpen(true);
  };
  
  const handleEditIncome = (income: any) => {
    setEditingItem(income);
    setIncomeForm({
      amount: income.amount,
      date: income.date,
      source: income.source,
      notes: income.notes || "",
      isRecurring: income.isRecurring,
      recurringFrequency: income.recurringFrequency || "monthly"
    });
    setDialogOpen(true);
  };
  
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  };
  
  const handleDeleteIncome = (id: string) => {
    deleteIncome(id);
  };
  
  const resetForm = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setExpenseForm({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      categoryId: "",
      notes: "",
      isRecurring: false,
      recurringFrequency: "monthly",
      isOneTime: false,
      isPlanned: true
    });
    setIncomeForm({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      source: "",
      notes: "",
      isRecurring: false,
      recurringFrequency: "monthly"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {activeTab === "expenses" ? "Expense Tracker" : "Income Tracker"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {activeTab === "expenses" 
              ? "Track and manage your daily expenses" 
              : "Record and monitor your income sources"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add {activeTab === "expenses" ? "Expense" : "Income"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem 
                    ? `Edit ${activeTab === "expenses" ? "Expense" : "Income"}` 
                    : `Add New ${activeTab === "expenses" ? "Expense" : "Income"}`}
                </DialogTitle>
                <DialogDescription>
                  {activeTab === "expenses" 
                    ? "Enter the details of your expense" 
                    : "Enter the details of your income"}
                </DialogDescription>
              </DialogHeader>
              
              {activeTab === "expenses" ? (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ({user.currency})</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={expenseForm.amount} 
                      onChange={(e) => setExpenseForm({...expenseForm, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expenseForm.date ? format(new Date(expenseForm.date), "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={expenseForm.date ? new Date(expenseForm.date) : undefined}
                          onSelect={(date) => setExpenseForm({
                            ...expenseForm, 
                            date: date ? format(date, "yyyy-MM-dd") : new Date().toISOString().split('T')[0]
                          })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={expenseForm.categoryId} 
                      onValueChange={(value) => setExpenseForm({...expenseForm, categoryId: value})}
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
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea 
                      id="notes" 
                      value={expenseForm.notes} 
                      onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="recurring" 
                      checked={expenseForm.isRecurring}
                      onCheckedChange={(checked) => 
                        setExpenseForm({...expenseForm, isRecurring: checked === true})
                      }
                    />
                    <Label htmlFor="recurring">Recurring Expense</Label>
                  </div>
                  
                  {expenseForm.isRecurring && (
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select 
                        value={expenseForm.recurringFrequency} 
                        onValueChange={(value: any) => setExpenseForm({...expenseForm, recurringFrequency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="oneTime" 
                      checked={expenseForm.isOneTime}
                      onCheckedChange={(checked) => 
                        setExpenseForm({...expenseForm, isOneTime: checked === true})
                      }
                    />
                    <Label htmlFor="oneTime">One-time Expense</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="planned" 
                      checked={expenseForm.isPlanned}
                      onCheckedChange={(checked) => 
                        setExpenseForm({...expenseForm, isPlanned: checked === true})
                      }
                    />
                    <Label htmlFor="planned">Planned Expense</Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ({user.currency})</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={incomeForm.amount} 
                      onChange={(e) => setIncomeForm({...incomeForm, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {incomeForm.date ? format(new Date(incomeForm.date), "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={incomeForm.date ? new Date(incomeForm.date) : undefined}
                          onSelect={(date) => setIncomeForm({
                            ...incomeForm, 
                            date: date ? format(date, "yyyy-MM-dd") : new Date().toISOString().split('T')[0]
                          })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input 
                      id="source" 
                      value={incomeForm.source} 
                      onChange={(e) => setIncomeForm({...incomeForm, source: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea 
                      id="notes" 
                      value={incomeForm.notes} 
                      onChange={(e) => setIncomeForm({...incomeForm, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="recurring" 
                      checked={incomeForm.isRecurring}
                      onCheckedChange={(checked) => 
                        setIncomeForm({...incomeForm, isRecurring: checked === true})
                      }
                    />
                    <Label htmlFor="recurring">Recurring Income</Label>
                  </div>
                  
                  {incomeForm.isRecurring && (
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select 
                        value={incomeForm.recurringFrequency} 
                        onValueChange={(value: any) => setIncomeForm({...incomeForm, recurringFrequency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button onClick={activeTab === "expenses" ? handleAddExpense : handleAddIncome}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Your Expenses</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Month</Label>
                          <Calendar
                            mode="single"
                            selected={filterDate}
                            onSelect={setFilterDate}
                            disabled={(date) => date > new Date()}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Categories</SelectItem>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setFilterDate(undefined);
                            setFilterCategory("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No expenses found. Add your first expense!</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <Button variant="ghost" onClick={() => handleSort("date")}>
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort("amount")}>
                            Amount
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => {
                        const category = categories.find(c => c.id === expense.categoryId);
                        return (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">{formatDate(expense.date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {category && (
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: category.color }}
                                  ></div>
                                )}
                                {category ? category.name : 'Unknown'}
                                {expense.isRecurring && (
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                    Recurring
                                  </span>
                                )}
                                {expense.isOneTime && (
                                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full">
                                    One-time
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(expense.amount, user.currency)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{expense.notes}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditExpense(expense)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Income Tab */}
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Your Income</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Month</Label>
                          <Calendar
                            mode="single"
                            selected={filterDate}
                            onSelect={setFilterDate}
                            disabled={(date) => date > new Date()}
                          />
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setFilterDate(undefined);
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredIncomes.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No income records found. Add your first income!</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <Button variant="ghost" onClick={() => handleSort("date")}>
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort("amount")}>
                            Amount
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIncomes.map((income) => (
                        <TableRow key={income.id}>
                          <TableCell className="font-medium">{formatDate(income.date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {income.source}
                              {income.isRecurring && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  Recurring
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(income.amount, user.currency)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{income.notes}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditIncome(income)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteIncome(income.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}