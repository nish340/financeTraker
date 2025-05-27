import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, Target, TrendingUp, Clock, DollarSign, Edit, Trash2 } from "lucide-react";
import { format, differenceInMonths, addMonths } from "date-fns";
import { cn } from "@/lib/utils";

const goalCategories = [
  { id: 'emergency', name: 'Emergency Fund', icon: '🛡️', color: 'bg-red-100 text-red-800' },
  { id: 'vacation', name: 'Vacation', icon: '🏖️', color: 'bg-blue-100 text-blue-800' },
  { id: 'car', name: 'Car', icon: '🚗', color: 'bg-green-100 text-green-800' },
  { id: 'home', name: 'Home', icon: '🏠', color: 'bg-purple-100 text-purple-800' },
  { id: 'wedding', name: 'Wedding', icon: '💒', color: 'bg-pink-100 text-pink-800' },
  { id: 'education', name: 'Education', icon: '📚', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'business', name: 'Business', icon: '💼', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'other', name: 'Other', icon: '🎯', color: 'bg-gray-100 text-gray-800' },
];

const initialGoals = [
  {
    id: 1,
    name: 'Emergency Fund',
    category: 'emergency',
    targetAmount: 10000,
    currentAmount: 6500,
    monthlyContribution: 500,
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-12-31'),
    priority: 'high'
  },
  {
    id: 2,
    name: 'Hawaii Vacation',
    category: 'vacation',
    targetAmount: 5000,
    currentAmount: 1800,
    monthlyContribution: 300,
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-08-15'),
    priority: 'medium'
  },
  {
    id: 3,
    name: 'New Car Down Payment',
    category: 'car',
    targetAmount: 15000,
    currentAmount: 8500,
    monthlyContribution: 800,
    startDate: new Date('2023-06-01'),
    targetDate: new Date('2024-06-01'),
    priority: 'high'
  },
];

export default function SavingsGoals() {
  const [goals, setGoals] = useState(initialGoals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    category: "",
    targetAmount: "",
    monthlyContribution: "",
    targetDate: undefined as Date | undefined,
    priority: "medium"
  });

  const getCategoryInfo = (categoryId: string) => {
    return goalCategories.find(cat => cat.id === categoryId) || goalCategories[goalCategories.length - 1];
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateMonthsToGoal = (current: number, target: number, monthly: number) => {
    if (monthly <= 0) return Infinity;
    return Math.ceil((target - current) / monthly);
  };

  const calculateProjectedDate = (current: number, target: number, monthly: number, startDate: Date) => {
    const monthsNeeded = calculateMonthsToGoal(current, target, monthly);
    if (monthsNeeded === Infinity) return null;
    return addMonths(startDate, monthsNeeded);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.category || !newGoal.targetAmount || !newGoal.monthlyContribution) {
      return;
    }

    const goal = {
      id: Date.now(),
      name: newGoal.name,
      category: newGoal.category,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      monthlyContribution: parseFloat(newGoal.monthlyContribution),
      startDate: new Date(),
      targetDate: newGoal.targetDate || addMonths(new Date(), 12),
      priority: newGoal.priority
    };

    setGoals([...goals, goal]);
    
    // Reset form
    setNewGoal({
      name: "",
      category: "",
      targetAmount: "",
      monthlyContribution: "",
      targetDate: undefined,
      priority: "medium"
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const totalSavingsGoals = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalMonthlyContributions = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600">Track and achieve your financial goals</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., Dream Vacation"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="5000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  placeholder="300"
                  value={newGoal.monthlyContribution}
                  onChange={(e) => setNewGoal({...newGoal, monthlyContribution: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="targetDate">Target Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newGoal.targetDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGoal.targetDate ? format(newGoal.targetDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGoal.targetDate}
                      onSelect={(date) => setNewGoal({...newGoal, targetDate: date})}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleAddGoal}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Create Goal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalSavingsGoals.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Savings</p>
                <p className="text-2xl font-bold text-green-600">${totalCurrentSavings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Contributions</p>
                <p className="text-2xl font-bold text-purple-600">${totalMonthlyContributions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No savings goals yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first savings goal to track your progress.</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const categoryInfo = getCategoryInfo(goal.category);
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const monthsToGoal = calculateMonthsToGoal(goal.currentAmount, goal.targetAmount, goal.monthlyContribution);
            const projectedDate = calculateProjectedDate(goal.currentAmount, goal.targetAmount, goal.monthlyContribution, goal.startDate);
            const isOnTrack = projectedDate ? projectedDate <= goal.targetDate : false;

            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{categoryInfo.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{goal.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={categoryInfo.color}>{categoryInfo.name}</Badge>
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Current</p>
                      <p className="font-semibold text-green-600">${goal.currentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target</p>
                      <p className="font-semibold">${goal.targetAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Monthly</p>
                      <p className="font-semibold text-blue-600">${goal.monthlyContribution}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target Date</p>
                      <p className="font-semibold">{format(goal.targetDate, "MMM yyyy")}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</span>
                      <span>
                        {monthsToGoal === Infinity ? 'No monthly contribution' : 
                         monthsToGoal <= 1 ? 'Less than 1 month' :
                         `${monthsToGoal} months to go`}
                      </span>
                    </div>
                  </div>

                  {projectedDate && (
                    <div className={`p-3 rounded-lg ${isOnTrack ? 'bg-green-50' : 'bg-yellow-50'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isOnTrack ? 'text-green-600' : 'text-yellow-600'}`} />
                        <span className={`text-sm ${isOnTrack ? 'text-green-700' : 'text-yellow-700'}`}>
                          {isOnTrack ? 'On track!' : 'Behind schedule'} 
                          {' '}Projected completion: {format(projectedDate, "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
