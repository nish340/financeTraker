import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, PiggyBank, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function InvestmentCalculator() {
  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState("5000");
  const [sipDuration, setSipDuration] = useState("10");
  const [sipRate, setSipRate] = useState("12");

  // Lumpsum Calculator State
  const [lumpAmount, setLumpAmount] = useState("100000");
  const [lumpDuration, setLumpDuration] = useState("10");
  const [lumpRate, setLumpRate] = useState("12");

  // Retirement Calculator State
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("60");
  const [monthlyExpense, setMonthlyExpense] = useState("50000");
  const [currentSavings, setCurrentSavings] = useState("500000");
  const [retirementRate, setRetirementRate] = useState("8");

  const calculateSIP = (monthly: number, years: number, rate: number) => {
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const maturityAmount = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = monthly * months;
    const totalReturns = maturityAmount - totalInvestment;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns)
    };
  };

  const calculateLumpsum = (principal: number, years: number, rate: number) => {
    const maturityAmount = principal * Math.pow(1 + rate / 100, years);
    const totalReturns = maturityAmount - principal;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      totalInvestment: principal,
      totalReturns: Math.round(totalReturns)
    };
  };

  const calculateRetirement = (currentAge: number, retirementAge: number, monthlyExpense: number, currentSavings: number, rate: number) => {
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = 25; // Assuming 25 years post retirement
    const inflationRate = 6; // Assuming 6% inflation
    
    // Future value of current monthly expenses
    const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Required corpus for retirement
    const requiredCorpus = futureMonthlyExpense * 12 * yearsInRetirement;
    
    // Future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + rate / 100, yearsToRetirement);
    
    // Additional corpus needed
    const additionalCorpusNeeded = requiredCorpus - futureValueCurrentSavings;
    
    // Required monthly SIP
    const months = yearsToRetirement * 12;
    const monthlyRate = rate / 100 / 12;
    const requiredMonthlySIP = additionalCorpusNeeded / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    return {
      requiredCorpus: Math.round(requiredCorpus),
      futureMonthlyExpense: Math.round(futureMonthlyExpense),
      requiredMonthlySIP: Math.round(requiredMonthlySIP),
      additionalCorpusNeeded: Math.round(additionalCorpusNeeded),
      yearsToRetirement
    };
  };

  const generateChartData = (type: 'sip' | 'lumpsum', amount: number, years: number, rate: number) => {
    const data = [];
    
    for (let year = 1; year <= years; year++) {
      if (type === 'sip') {
        const sipResult = calculateSIP(amount, year, rate);
        data.push({
          year,
          invested: sipResult.totalInvestment,
          returns: sipResult.totalReturns,
          total: sipResult.maturityAmount
        });
      } else {
        const lumpResult = calculateLumpsum(amount, year, rate);
        data.push({
          year,
          invested: lumpResult.totalInvestment,
          returns: lumpResult.totalReturns,
          total: lumpResult.maturityAmount
        });
      }
    }
    
    return data;
  };

  const sipResults = calculateSIP(parseFloat(sipAmount) || 0, parseFloat(sipDuration) || 0, parseFloat(sipRate) || 0);
  const lumpResults = calculateLumpsum(parseFloat(lumpAmount) || 0, parseFloat(lumpDuration) || 0, parseFloat(lumpRate) || 0);
  const retirementResults = calculateRetirement(
    parseFloat(currentAge) || 0,
    parseFloat(retirementAge) || 0,
    parseFloat(monthlyExpense) || 0,
    parseFloat(currentSavings) || 0,
    parseFloat(retirementRate) || 0
  );

  const sipChartData = generateChartData('sip', parseFloat(sipAmount) || 0, parseFloat(sipDuration) || 0, parseFloat(sipRate) || 0);
  const lumpChartData = generateChartData('lumpsum', parseFloat(lumpAmount) || 0, parseFloat(lumpDuration) || 0, parseFloat(lumpRate) || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investment Calculator</h1>
        <p className="text-gray-600">Plan your investments and retirement with our comprehensive calculators</p>
      </div>

      <Tabs defaultValue="sip" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
          <TabsTrigger value="lumpsum">Lumpsum Calculator</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Planner</TabsTrigger>
        </TabsList>

        {/* SIP Calculator */}
        <TabsContent value="sip" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  SIP Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sipAmount">Monthly Investment Amount ($)</Label>
                  <Input
                    id="sipAmount"
                    type="number"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(e.target.value)}
                    placeholder="5000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sipDuration">Investment Duration (Years)</Label>
                  <Input
                    id="sipDuration"
                    type="number"
                    value={sipDuration}
                    onChange={(e) => setSipDuration(e.target.value)}
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sipRate">Expected Annual Return (%)</Label>
                  <Input
                    id="sipRate"
                    type="number"
                    value={sipRate}
                    onChange={(e) => setSipRate(e.target.value)}
                    placeholder="12"
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Investment</span>
                    <span className="font-semibold">${sipResults.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Returns</span>
                    <span className="font-semibold text-green-600">${sipResults.totalReturns.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Maturity Amount</span>
                    <span className="text-xl font-bold text-emerald-600">${sipResults.maturityAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SIP Growth Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sipChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} name="Invested" />
                    <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total Value" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lumpsum Calculator */}
        <TabsContent value="lumpsum" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  Lumpsum Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="lumpAmount">Investment Amount ($)</Label>
                  <Input
                    id="lumpAmount"
                    type="number"
                    value={lumpAmount}
                    onChange={(e) => setLumpAmount(e.target.value)}
                    placeholder="100000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lumpDuration">Investment Duration (Years)</Label>
                  <Input
                    id="lumpDuration"
                    type="number"
                    value={lumpDuration}
                    onChange={(e) => setLumpDuration(e.target.value)}
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lumpRate">Expected Annual Return (%)</Label>
                  <Input
                    id="lumpRate"
                    type="number"
                    value={lumpRate}
                    onChange={(e) => setLumpRate(e.target.value)}
                    placeholder="12"
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Principal Amount</span>
                    <span className="font-semibold">${lumpResults.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Returns</span>
                    <span className="font-semibold text-green-600">${lumpResults.totalReturns.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Maturity Amount</span>
                    <span className="text-xl font-bold text-emerald-600">${lumpResults.maturityAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lumpsum Growth Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lumpChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} name="Invested" />
                    <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total Value" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>SIP vs Lumpsum Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-emerald-700">SIP Investment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Investment</span>
                      <span className="font-medium">${parseFloat(sipAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Invested</span>
                      <span className="font-medium">${sipResults.totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Maturity Value</span>
                      <span className="font-semibold text-emerald-600">${sipResults.maturityAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-700">Lumpsum Investment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">One-time Investment</span>
                      <span className="font-medium">${parseFloat(lumpAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Invested</span>
                      <span className="font-medium">${lumpResults.totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Maturity Value</span>
                      <span className="font-semibold text-blue-600">${lumpResults.maturityAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retirement Calculator */}
        <TabsContent value="retirement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Retirement Planner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(e.target.value)}
                      placeholder="60"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="monthlyExpense">Current Monthly Expenses ($)</Label>
                  <Input
                    id="monthlyExpense"
                    type="number"
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(e.target.value)}
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentSavings">Current Savings ($)</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    placeholder="500000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="retirementRate">Expected Return on Investment (%)</Label>
                  <Input
                    id="retirementRate"
                    type="number"
                    value={retirementRate}
                    onChange={(e) => setRetirementRate(e.target.value)}
                    placeholder="8"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retirement Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Years to Retirement</p>
                    <p className="text-2xl font-bold text-blue-700">{retirementResults.yearsToRetirement} years</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Future Monthly Expenses</p>
                    <p className="text-xl font-bold text-purple-700">${retirementResults.futureMonthlyExpense.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Required Corpus</p>
                    <p className="text-xl font-bold text-green-700">${retirementResults.requiredCorpus.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-600 font-medium">Required Monthly SIP</p>
                    <p className="text-xl font-bold text-emerald-700">${retirementResults.requiredMonthlySIP.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Key Assumptions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Inflation rate: 6% per annum</li>
                    <li>• Post-retirement life: 25 years</li>
                    <li>• Investment return: {retirementRate}% per annum</li>
                    <li>• Current savings will grow at {retirementRate}%</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Recommendations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Start investing early to leverage compound growth</li>
                    <li>• Review and adjust your plan annually</li>
                    <li>• Consider tax-saving retirement instruments</li>
                    <li>• Diversify your investment portfolio</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
