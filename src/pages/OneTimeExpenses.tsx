import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, Plus, Save, Trash2, Edit, Filter, ArrowUpDown, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OneTimeExpenses() {
  const { 
    user, 
    categories, 
    expenses,
    addExpense,
    updateExpense,
    deleteExpense
  } = useStore();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filterPlanned, setFilterPlanned] = useState<boolean | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Form data for expenses
  const [expenseForm, setExpenseForm] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: "",
    notes: "",
    isRecurring: false,
    isOneTime: true,
    isPlanned: true,
    receiptImage: ""
  });
  
  // Filter one-time expenses
  const oneTimeExpenses = expenses.filter(expense => expense.isOneTime);
  
  const filteredExpenses = oneTimeExpenses
    .filter(expense => {
      if (filterPlanned !== null && expense.isPlanned !== filterPlanned) {
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
  
  useEffect(() => {
    // Prepare data for chart
    const plannedTotal = oneTimeExpenses
      .filter(e => e.isPlanned)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const unplannedTotal = oneTimeExpenses
      .filter(e => !e.isPlanned)
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Group by category
    const categoryTotals: Record<string, { planned: number, unplanned: number }> = {};
    
    oneTimeExpenses.forEach(expense => {
      if (!categoryTotals[expense.categoryId]) {
        categoryTotals[expense.categoryId] = { planned: 0, unplanned: 0 };
      }
      
      if (expense.isPlanned) {
        categoryTotals[expense.categoryId].planned += expense.amount;
      } else {
        categoryTotals[expense.categoryId].unplanned += expense.amount;
      }
    });
    
    const chartDataArray = Object.entries(categoryTotals).map(([categoryId, values]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category ? category.name : 'Other',
        planned: values.planned,
        unplanned: values.unplanned
      };
    });
    
    // Add total
    chartDataArray.push({
      name: 'Total',
      planned: plannedTotal,
      unplanned: unplannedTotal
    });
    
    setChartData(chartDataArray);
  }, [oneTimeExpenses, categories]);
  
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
    
    if (editingItem) {
      updateExpense(editingItem.id, {
        amount: expenseForm.amount,
        date: expenseForm.date,
        categoryId: expenseForm.categoryId,
        notes: expenseForm.notes,
        isRecurring: false,
        isOneTime: true,
        isPlanned: expenseForm.isPlanned,
        receiptImage: expenseForm.receiptImage
      });
    } else {
      addExpense({
        amount: expenseForm.amount,
        date: expenseForm.date,
        categoryId: expenseForm.categoryId,
        notes: expenseForm.notes,
        isRecurring: false,
        isOneTime: true,
        isPlanned: expenseForm.isPlanned,
        receiptImage: expenseForm.receiptImage
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
      isRecurring: false,
      isOneTime: true,
      isPlanned: expense.isPlanned,
      receiptImage: expense.receiptImage || ""
    });
    setDialogOpen(true);
  };
  
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
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
      isOneTime: true,
      isPlanned: true,
      receiptImage: ""
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload to a server or cloud storage
    // For this demo, we'll use a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setExpenseForm({
        ...expenseForm,
        receiptImage: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">One-Time Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400">Track large or unexpected expenses separately</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add One-Time Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit One-Time Expense" : "Add New One-Time Expense"}
                </DialogTitle>
                <DialogDescription>
                  Enter the details of your one-time expense
                </DialogDescription>
              </DialogHeader>
              
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
                    id="planned" 
                    checked={expenseForm.isPlanned}
                    onCheckedChange={(checked) => 
                      setExpenseForm({...expenseForm, isPlanned: checked === true})
                    }
                  />
                  <Label htmlFor="planned">Planned Expense</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receipt">Receipt Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('receipt-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Receipt
                    </Button>
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {expenseForm.receiptImage && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Image uploaded
                      </span>
                    )}
                  </div>
                  {expenseForm.receiptImage && (
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <img 
                        src={expenseForm.receiptImage} 
                        alt="Receipt" 
                        className="max-h-40 object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleAddExpense}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Planned vs Unplanned Spending</CardTitle>
          <CardDescription>
            Compare your planned and unplanned one-time expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value), user.currency)} />
                <Legend />
                <Bar dataKey="planned" name="Planned" fill="#10b981" />
                <Bar dataKey="unplanned" name="Unplanned" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Expense List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>One-Time Expenses</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Tabs 
                defaultValue="all" 
                onValueChange={(value) => {
                  if (value === "all") setFilterPlanned(null);
                  else if (value === "planned") setFilterPlanned(true);
                  else setFilterPlanned(false);
                }}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="planned">Planned</TabsTrigger>
                  <TabsTrigger value="unplanned">Unplanned</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
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
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No one-time expenses found. Add your first one-time expense!</p>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Receipt</TableHead>
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
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(expense.amount, user.currency)}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            expense.isPlanned 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                          }`}>
                            {expense.isPlanned ? 'Planned' : 'Unplanned'}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{expense.notes}</TableCell>
                        <TableCell>
                          {expense.receiptImage && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Receipt</h4>
                                  <div className="border rounded-md overflow-hidden">
                                    <img 
                                      src={expense.receiptImage} 
                                      alt="Receipt" 
                                      className="w-full object-contain"
                                    />
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </TableCell>
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
    </div>
  );
}