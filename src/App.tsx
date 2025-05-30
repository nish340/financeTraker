import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import BudgetOverview from "./pages/BudgetOverview";
import ExpenseTracker from "./pages/ExpenseTracker";
import OneTimeExpenses from "./pages/OneTimeExpenses";
import SavingsOverview from "./pages/SavingsOverview";
import SavingsGoals from "./pages/SavingsGoals";
import InvestmentCalculator from "./pages/InvestmentCalculator";
// import FinancialForecast from "./pages/FinancialForecast";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<BudgetOverview />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/one-time-expenses" element={<OneTimeExpenses />} />
            <Route path="/savings" element={<SavingsOverview />} />
            <Route path="/goals" element={<SavingsGoals />} />
            <Route path="/investment" element={<InvestmentCalculator />} />
            {/* <Route path="/forecast" element={<FinancialForecast />} /> */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;