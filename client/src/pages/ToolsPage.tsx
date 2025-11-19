import React, { useState } from 'react';
import { PiggyBank, TrendingUp, Calculator, Wallet, Home, Shield, Sparkles } from 'lucide-react';

export default function ToolsPage() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  
  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiYears, setEmiYears] = useState(5);

  // Savings Goal State
  const [targetAmount, setTargetAmount] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [savingsRate, setSavingsRate] = useState(6);

  const calculateSIP = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const futureValue = sipAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = sipAmount * months;
    const returns = futureValue - invested;
    return { futureValue, invested, returns };
  };

  const calculateEMI = () => {
    const monthlyRate = emiRate / 12 / 100;
    const months = emiYears * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;
    return { emi, totalPayment, totalInterest };
  };

  const calculateSavingsGoal = () => {
    const monthlyRate = savingsRate / 12 / 100;
    const months = Math.log(targetAmount * monthlyRate / monthlyContribution + 1) / Math.log(1 + monthlyRate);
    const years = months / 12;
    return { months: Math.ceil(months), years: years.toFixed(1) };
  };

  const sipResult = calculateSIP();
  const emiResult = calculateEMI();
  const savingsResult = calculateSavingsGoal();

  const calculators = [
    { id: 'sip', icon: TrendingUp, label: 'SIP Calculator', color: 'from-pink-500 to-rose-500' },
    { id: 'emi', icon: Home, label: 'EMI Calculator', color: 'from-blue-500 to-indigo-500' },
    { id: 'savings', icon: PiggyBank, label: 'Savings Goal', color: 'from-purple-500 to-violet-500' },
    { id: 'retirement', icon: Shield, label: 'Retirement', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">WomensWealthWave.AI</h1>
              <p className="text-gray-400 text-xs">Hello, Dioyal! Let's something something today</p>
            </div>
          </div>
          <p className="text-purple-300 text-sm mt-2">पाप अनापणी साल नौसली ना साधे पो वहे हैं।</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* AI Assistant */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h2 className="text-white font-semibold mb-3">AI Financial Assistant</h2>
          <div className="flex gap-2 items-center bg-gray-900/60 rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Aasr/ng/reall"
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
            />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          </div>
          <p className="text-gray-400 text-xs mt-2">Ask me anything about budgeting, savings, or investments!</p>
        </div>

        {/* Financial Calculators */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h2 className="text-white font-semibold mb-4">Financial Calculators</h2>
          <div className="grid grid-cols-4 gap-3">
            {calculators.map((calc, idx) => {
              const Icon = calc.icon;
              return (
                <button
                  key={calc.id}
                  onClick={() => setActiveCalculator(calc.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-900/60 hover:bg-gray-900/80 transition-all border border-gray-700 relative"
                >
                  {idx === 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                  )}
                  {idx === 3 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs text-center">{calc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Calculator */}
        {activeCalculator === 'sip' && (
          <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              SIP Calculator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Expected Return (% p.a.)</label>
                <input
                  type="number"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Time Period (Years)</label>
                <input
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-pink-500/30 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Invested Amount:</span>
                    <span className="text-white font-semibold">₹{sipResult.invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Est. Returns:</span>
                    <span className="text-emerald-400 font-semibold">₹{sipResult.returns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-white font-semibold">Total Value:</span>
                    <span className="text-pink-400 font-bold text-lg">₹{sipResult.futureValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCalculator === 'emi' && (
          <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-400" />
              EMI Calculator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  value={emiRate}
                  onChange={(e) => setEmiRate(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Loan Tenure (Years)</label>
                <input
                  type="number"
                  value={emiYears}
                  onChange={(e) => setEmiYears(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-4 border border-blue-500/30 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Monthly EMI:</span>
                    <span className="text-blue-400 font-bold text-lg">₹{emiResult.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Total Interest:</span>
                    <span className="text-orange-400 font-semibold">₹{emiResult.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-white font-semibold">Total Payment:</span>
                    <span className="text-white font-bold">₹{emiResult.totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCalculator === 'savings' && (
          <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-purple-400" />
              Savings Goal Calculator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Target Amount (₹)</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Monthly Savings (₹)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Expected Return (% p.a.)</label>
                <input
                  type="number"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(Number(e.target.value))}
                  className="w-full mt-1 bg-gray-900/60 text-white rounded-lg px-4 py-2 outline-none border border-gray-700"
                />
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 mt-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">Time to reach your goal:</p>
                  <p className="text-purple-400 font-bold text-3xl">{savingsResult.years} years</p>
                  <p className="text-gray-400 text-sm mt-1">({savingsResult.months} months)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Net Worth Tracker */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <h3 className="text-white font-semibold">Net Worth Tracker</h3>
              </div>
              <p className="text-gray-400 text-xs mt-1">Total Assets</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-400 text-sm font-semibold">20%</span>
            </div>
          </div>
          
          <div className="text-white font-bold text-2xl mb-2">₹25,000</div>
          <p className="text-gray-400 text-xs">Huwoga Rular</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-3 p-3 bg-gray-900/60 rounded-xl hover:bg-gray-900/80 transition-all border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white text-sm">Budget Creator</span>
            </button>
            <button className="flex items-center gap-3 p-3 bg-gray-900/60 rounded-xl hover:bg-gray-900/80 transition-all border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white text-sm">Tax Estimator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
