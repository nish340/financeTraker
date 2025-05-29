import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { Save, Download, Upload, Moon, Sun } from "lucide-react";

export default function Settings() {
  const { user, updateUser } = useStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currency: user.currency,
    theme: user.theme,
    notifications: user.notifications,
    monthlyAlerts: user.monthlyAlerts
  });
  
  const currencies = [
    { value: "$", label: "USD ($)" },
    { value: "€", label: "EUR (€)" },
    { value: "£", label: "GBP (£)" },
    { value: "¥", label: "JPY (¥)" },
    { value: "₹", label: "INR (₹)" },
    { value: "₽", label: "RUB (₽)" },
    { value: "元", label: "CNY (元)" },
  ];
  
  const handleSaveSettings = () => {
    updateUser(formData);
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved successfully.",
    });
  };
  
  const handleExportData = () => {
    const state = useStore.getState();
    const data = {
      user: state.user,
      categories: state.categories,
      budgets: state.budgets,
      expenses: state.expenses,
      incomes: state.incomes,
      savingsGoals: state.savingsGoals,
      financialHealthScores: state.financialHealthScores
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fintrack-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your financial data has been exported successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account preferences</p>
      </div>
      
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => setFormData({...formData, currency: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme">Dark Mode</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark theme
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-gray-500" />
              <Switch 
                id="theme" 
                checked={formData.theme === 'dark'}
                onCheckedChange={(checked) => 
                  setFormData({...formData, theme: checked ? 'dark' : 'light'})
                }
              />
              <Moon className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable push notifications
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={formData.notifications}
              onCheckedChange={(checked) => 
                setFormData({...formData, notifications: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="monthlyAlerts">Monthly Budget Alerts</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get alerts when approaching budget limits
              </p>
            </div>
            <Switch 
              id="monthlyAlerts" 
              checked={formData.monthlyAlerts}
              onCheckedChange={(checked) => 
                setFormData({...formData, monthlyAlerts: checked})
              }
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export or backup your financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExportData} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}