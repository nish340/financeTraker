import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "$") {
  return `${currency}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculatePercentage(current: number, target: number) {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getMonthName(monthIndex: number) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
}

export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthRange(months: number = 6) {
  const result = [];
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const month = new Date(now);
    month.setMonth(now.getMonth() - i);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    result.unshift(monthStr);
  }
  
  return result;
}

export function calculateFutureValue(principal: number, monthlyContribution: number, interestRate: number, years: number) {
  const monthlyRate = interestRate / 100 / 12;
  const months = years * 12;
  let futureValue = principal;
  
  for (let i = 0; i < months; i++) {
    futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
  }
  
  return Math.round(futureValue);
}

export function calculateSIPReturns(monthlyInvestment: number, interestRate: number, years: number) {
  const monthlyRate = interestRate / 100 / 12;
  const months = years * 12;
  const amount = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(amount);
}

export function calculateLumpsumReturns(principal: number, interestRate: number, years: number) {
  const amount = principal * Math.pow(1 + interestRate / 100, years);
  return Math.round(amount);
}

export function getFinancialHealthStatus(score: number) {
  if (score >= 80) return { label: "Excellent", color: "bg-green-500" };
  if (score >= 60) return { label: "Good", color: "bg-blue-500" };
  if (score >= 40) return { label: "Fair", color: "bg-yellow-500" };
  return { label: "Needs Attention", color: "bg-red-500" };
}