import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { 
  Home, 
  Calendar, 
  TrendingUp, 
  Target, 
  Calculator, 
  BarChart3, 
  Settings,
  Menu,
  Wallet,
  PiggyBank,
  LineChart,
  BarChart,
  Receipt
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Budget", href: "/budget", icon: Wallet },
  { name: "Expenses", href: "/expenses", icon: Calendar },
  { name: "One-Time Expenses", href: "/one-time-expenses", icon: Receipt },
  { name: "Savings", href: "/savings", icon: PiggyBank },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Investment", href: "/investment", icon: Calculator },
  { name: "Forecast", href: "/forecast", icon: LineChart },
  { name: "Reports", href: "/reports", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useStore();
  const [theme, setTheme] = useState(user.theme);
  
  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  useEffect(() => {
    // Update theme when user preference changes
    setTheme(user.theme);
  }, [user.theme]);

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center gap-2 p-6 border-b">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-emerald-900 dark:text-emerald-400">FinTrack</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-900 dark:text-emerald-400">FinTrack</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}