import React, { useCallback, useEffect, useState } from 'react';
import { 
  Sparkles, TrendingUp, PiggyBank, Home, CreditCard, Shield, 
  Calculator, BarChart3, BookOpen, Video, Users, Search,
  Bell, User, ChevronRight, Play, Activity, IndianRupee, Coins
} from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import type { TooltipProps } from 'recharts';

type ToolKey = 'emi' | 'savings' | 'nse' | 'gold' | 'tax' | 'insurance';
type EmiField = 'amount' | 'rate' | 'tenure';
type TaxField = 'income' | 'deductions';

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: { value?: number }[];
};

interface NseDatum {
  name: string;
  price: number;
}

const logoSrc = '/logoai.jpg';

const LogoBadge = ({ className = 'w-10 h-10', rounded = 'rounded-xl' }: { className?: string; rounded?: string }) => (
  <div
    className={`${className} ${rounded} overflow-hidden border border-emerald-400/40 shadow-lg shadow-emerald-500/20 bg-slate-900/50`}
  >
    <img src={logoSrc} alt="WomenWealthWave.AI" className="h-full w-full object-cover" />
  </div>
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
  const [showChatModal, setShowChatModal] = useState(false);

  const [selectedTool, setSelectedTool] = useState<ToolKey>('emi');
  const [emiInputs, setEmiInputs] = useState({ amount: 500000, rate: 10.5, tenure: 36 });
  const [savingsData, setSavingsData] = useState({ current: 150000, goal: 500000, monthly: 15000 });
  const [nseData, setNseData] = useState({ price: 20125.35, change: 0.42 });
  const [nseHistory, setNseHistory] = useState<number[]>([20080, 20110, 20125, 20105, 20140, 20110, 20135]);
  const [goldHistory, setGoldHistory] = useState<number[]>([5900, 5925, 5940, 5930, 5955, 5965, 5975]);
  const [taxInputs, setTaxInputs] = useState({ income: 900000, deductions: 150000 });

  const insurancePolicies = [
    {
      name: 'Women Care Shield',
      coverage: '₹25L Health & Maternity',
      premium: '₹899/month',
      badge: 'Popular'
    },
    {
      name: 'Secure Start Plan',
      coverage: '₹50L Term Cover',
      premium: '₹1,499/month',
      badge: 'Tax Saver'
    },
    {
      name: 'Sakhi Gold Guard',
      coverage: '₹15L Jewellery Protection',
      premium: '₹399/month'
    }
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);

  const calculateEmi = () => {
    const principal = emiInputs.amount;
    const monthlyRate = emiInputs.rate / 12 / 100;
    const months = emiInputs.tenure;

    if (monthlyRate === 0) {
      return {
        emi: principal / months,
        totalPayment: principal,
        totalInterest: 0
      };
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const emi = (principal * monthlyRate * factor) / (factor - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return { emi, totalPayment, totalInterest };
  };

  const savingsProgress = Math.min(
    100,
    Math.round((savingsData.current / savingsData.goal) * 100)
  );

  const getTaxAmount = () => {
    let taxable = Math.max(0, taxInputs.income - taxInputs.deductions);
    const slabs = [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.10 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 }
    ];

    let remaining = taxable;
    let prevLimit = 0;
    let tax = 0;

    slabs.forEach((slab) => {
      if (remaining <= 0) return;
      const slabAmount = Math.min(remaining, slab.limit - prevLimit);
      tax += slabAmount * slab.rate;
      remaining -= slabAmount;
      prevLimit = slab.limit;
    });

    const effectiveRate = taxable === 0 ? 0 : (tax / taxable) * 100;

    return { tax, taxable, effectiveRate };
  };

  const handleToolSelect = useCallback((key: ToolKey) => {
    setSelectedTool(key);
  }, []);

  const handleEmiChange = useCallback((field: EmiField, value: number) => {
    setEmiInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTaxChange = useCallback((field: TaxField, value: number) => {
    setTaxInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const getTrendRange = (series: number[]) => {
    if (!series.length) {
      return { min: 0, max: 1 };
    }
    const min = Math.min(...series);
    const max = Math.max(...series);
    return { min, max: max === min ? min + 1 : max };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNseData((prev) => {
        const delta = (Math.random() - 0.5) * 15;
        const nextPrice = Math.max(19950, prev.price + delta);
        const rounded = Math.round(nextPrice * 100) / 100;
        setNseHistory((hist) => [...hist.slice(-6), rounded]);
        const change = ((rounded - prev.price) / prev.price) * 100;
        return {
          price: rounded,
          change: Math.round(change * 100) / 100
        };
      });
      setGoldHistory((hist) => {
        const last = hist[hist.length - 1] ?? 5900;
        const delta = (Math.random() - 0.5) * 10;
        const next = Math.max(5700, Math.round((last + delta) * 100) / 100);
        return [...hist.slice(-6), next];
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const emiStats = calculateEmi();
  const taxStats = getTaxAmount();
  const nseRange = getTrendRange(nseHistory);
  const goldRange = getTrendRange(goldHistory);
  const nseChartData: NseDatum[] = nseHistory.map((price, idx, arr) => ({
    name: idx === arr.length - 1 ? 'Now' : `T-${arr.length - idx - 1}`,
    price: Number(price.toFixed(2))
  }));

  const NseTooltip = (props: CustomTooltipProps) => {
    const { active, payload } = props;
    if (active && payload?.length) {
      const value = payload[0].value ?? 0;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white shadow-lg">
          <div className="font-semibold">{value.toFixed(2)}</div>
          <div className="text-xs text-slate-400">Index points</div>
        </div>
      );
    }
    return null;
  };

  const getBarHeight = (value: number, range: { min: number; max: number }) => {
    const span = range.max - range.min;
    if (span === 0) return 50;
    return ((value - range.min) / span) * 100;
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'emi':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Loan Amount</span>
                  <span>{formatCurrency(emiInputs.amount)}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={2000000}
                  step={50000}
                  value={emiInputs.amount}
                  onChange={(e) => handleEmiChange('amount', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Interest Rate</span>
                  <span>{emiInputs.rate.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={20}
                  step={0.1}
                  value={emiInputs.rate}
                  onChange={(e) => handleEmiChange('rate', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Tenure (Months)</span>
                  <span>{emiInputs.tenure} m</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={240}
                  step={6}
                  value={emiInputs.tenure}
                  onChange={(e) => handleEmiChange('tenure', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-800/70 p-4 border border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-400">Monthly EMI</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(Math.round(emiStats.emi))}</p>
              </div>
              <div className="rounded-2xl bg-slate-800/70 p-4 border border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-400">Total Interest</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(Math.round(emiStats.totalInterest))}</p>
              </div>
              <div className="rounded-2xl bg-slate-800/70 p-4 border border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-400">Total Payment</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(Math.round(emiStats.totalPayment))}</p>
              </div>
            </div>
          </div>
        );
      case 'savings':
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-400">Current Savings</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(savingsData.current)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-slate-400">Goal</p>
                  <p className="text-white font-semibold">{formatCurrency(savingsData.goal)}</p>
                </div>
              </div>
              <div className="h-3 rounded-full bg-slate-700">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                  style={{ width: `${savingsProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Monthly Auto-Save</span>
                <span>{formatCurrency(savingsData.monthly)}</span>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-xs uppercase text-slate-400">Time to Goal</p>
                <p className="text-xl font-semibold text-white">
                  {Math.max(0, Math.ceil((savingsData.goal - savingsData.current) / savingsData.monthly))} months
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-xs uppercase text-slate-400">Projected 1Y Value (7%)</p>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(Math.round((savingsData.current + savingsData.monthly * 12) * 1.07))}
                </p>
              </div>
            </div>
          </div>
        );
      case 'nse':
        return (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase text-slate-400">Nifty 50 Live</p>
                <p className="text-3xl font-bold text-white">{nseData.price.toFixed(2)}</p>
              </div>
              <div className={`rounded-full px-3 py-1 text-sm font-semibold ${nseData.change >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                {nseData.change >= 0 ? '+' : ''}{nseData.change.toFixed(2)}%
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={nseChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<NseTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                  <Bar dataKey="price" radius={[6, 6, 0, 0]} fill="url(#nseGradient)" />
                  <defs>
                    <linearGradient id="nseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-slate-400">Updated every 12s • Simulated data for design preview</div>
          </div>
        );
      case 'gold':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-400">24K Gold (10g)</p>
                <p className="text-3xl font-bold text-white">₹{goldHistory[goldHistory.length - 1].toFixed(2)}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                Avg week: ₹{Math.round(goldHistory.reduce((a, b) => a + b, 0) / goldHistory.length)}
              </div>
            </div>
            <div className="flex h-24 items-end gap-2">
              {goldHistory.map((value, idx) => (
                <div
                  key={`gold-${idx}-${value}`}
                  className="flex-1 rounded-full bg-gradient-to-t from-amber-500/20 to-amber-300"
                  style={{ height: `${getBarHeight(value, goldRange)}%` }}
                />
              ))}
            </div>
            <div className="text-xs text-slate-400">Prices refreshed every 12s • Mock feed</div>
          </div>
        );
      case 'tax':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-slate-400">Annual Income</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-white"
                  value={taxInputs.income}
                  min={0}
                  onChange={(e) => handleTaxChange('income', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-400">Deductions (80C/80D)</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-white"
                  value={taxInputs.deductions}
                  min={0}
                  onChange={(e) => handleTaxChange('deductions', Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-xs uppercase text-slate-400">Taxable Income</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(Math.round(taxStats.taxable))}</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-xs uppercase text-slate-400">Estimated Tax</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(Math.round(taxStats.tax))}</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-xs uppercase text-slate-400">Effective Rate</p>
                <p className="text-2xl font-semibold text-white">{taxStats.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        );
      case 'insurance':
        return (
          <div className="space-y-3">
            {insurancePolicies.map((policy) => (
              <div key={policy.name} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{policy.name}</p>
                  <p className="text-sm text-slate-400">{policy.coverage}</p>
                </div>
                <div className="text-right">
                  {policy.badge && (
                    <span className="mb-1 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {policy.badge}
                    </span>
                  )}
                  <p className="font-semibold text-white">{policy.premium}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-500">*Indicative premiums for illustrative purposes only.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if (!searchQuery.trim() || isLoading) return;

    const userMessage = searchQuery;
    setSearchQuery('');
    setIsLoading(true);
    setShowChatModal(true);

    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chat_history: chatMessages
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || 'I apologize, but I couldn\'t generate a response. Please try again.' 
      }]);
    } catch (error: any) {
      console.error('Error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ Error: ${error.message || 'Unknown error occurred'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const microLearningTopics = [
    { icon: PiggyBank, label: 'Savings', color: 'from-pink-500 to-rose-500', badge: null },
    { icon: TrendingUp, label: 'Investing', color: 'from-emerald-500 to-teal-500', badge: '5' },
    { icon: CreditCard, label: 'Debt Management', color: 'from-purple-500 to-violet-500', badge: null },
    { icon: Calculator, label: 'Taxes', color: 'from-blue-500 to-cyan-500', badge: '2' },
    { icon: Shield, label: 'Insurance', color: 'from-orange-500 to-amber-500', badge: '1' },
  ];

  const toolCards: { key: ToolKey; label: string; icon: React.ElementType; hint: string }[] = [
    { key: 'emi', label: 'EMI Calculator', icon: Calculator, hint: 'Plan monthly payouts' },
    { key: 'savings', label: 'Current Savings', icon: PiggyBank, hint: 'Track your goals' },
    { key: 'nse', label: 'Live NSE Pulse', icon: TrendingUp, hint: 'Nifty 50 tracker' },
    { key: 'gold', label: 'Gold Price Chart', icon: Coins, hint: '10g daily trend' },
    { key: 'tax', label: 'Tax Calculator', icon: BarChart3, hint: 'Estimate FY taxes' },
    { key: 'insurance', label: 'Insurance Picks', icon: Shield, hint: 'Best policy matches' },
  ];

  const deepDiveTopics = [
    {
      title: 'Investing in Stocks & Mutual Funds',
      subtitle: 'Aadi on lening Budgeting Investments',
      image: '💹',
      lessons: 18,
      progress: 25,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Investing Wane ad ting Diys Tmauid Inng efreth',
      subtitle: 'Focusing Debt on Burreus',
      image: '📊',
      lessons: 10,
      progress: 50,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Retirement Weaned Nng Silannin G',
      subtitle: 'Alien tax Investmentssss',
      image: '🏦',
      lessons: 8,
      progress: 15,
      color: 'from-emerald-500 to-teal-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Top Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">WomensWealthWave.AI</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">Home</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">Tools</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">Live</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">Planner</a>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <User className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h1 className="text-3xl font-bold text-white mb-6">Welcome, Dional!</h1>

              {/* AI Assistant Input */}
              <div className="mb-6">
                <h2 className="text-white font-semibold mb-3">AI Financial Assistant</h2>
                <div className="flex items-center gap-3 bg-slate-900/60 rounded-xl p-3 border border-slate-700/50">
                  <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="explain finance"
                    className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!searchQuery.trim() || isLoading}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-white text-lg">→</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Micro Learning Hub */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {microLearningTopics.map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={idx}
                      className="flex flex-col items-center gap-2 min-w-[80px] relative group"
                    >
                      {topic.badge && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
                          {topic.badge}
                        </div>
                      )}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white text-xs text-center">{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finance Tools & Dashboard */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-white font-semibold mb-4">Finance Tools & Cashboard</h2>
              
              {/* Weekly Expense Tracker */}
              <div className="bg-slate-900/60 rounded-xl p-4 mb-4 border border-slate-700/50">
                <h3 className="text-white font-medium mb-4">Weekly Expense Tracker</h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {[40, 60, 45, 80, 55].map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg" style={{ height: `${height}%` }}></div>
                      <span className="text-slate-400 text-xs">
                        {['Food', '1.0', 'Transport', '30', '30'][idx]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">5 days!</p>
                    <p className="text-slate-400 text-xs">You're banning up ud smart choices!</p>
                  </div>
                </div>
              </div>

              {/* Interactive Tool Grid */}
              <div className="grid gap-3 md:grid-cols-3">
                {toolCards.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = selectedTool === tool.key;
                  return (
                    <button
                      key={tool.key}
                      onClick={() => handleToolSelect(tool.key)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                        isActive
                          ? 'border-emerald-400/60 bg-slate-900'
                          : 'border-slate-700/50 bg-slate-900/40 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className={`rounded-2xl p-3 ${isActive ? 'bg-gradient-to-br from-emerald-400 to-cyan-500' : 'bg-slate-800/70'}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{tool.label}</p>
                        <p className="text-xs text-slate-400">{tool.hint}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
                {renderToolContent()}
              </div>
            </div>

            {/* Deep Dive Topics */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-white font-semibold mb-4">Deep Dive Topics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deepDiveTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all group cursor-pointer"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-6xl">
                      {topic.image}
                      <div className="absolute top-3 right-3 w-8 h-8 bg-slate-800/80 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium mb-1 text-sm">{topic.title}</h3>
                      <p className="text-slate-400 text-xs mb-3">{topic.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Play className="w-3 h-3 text-red-400" />
                          <span className="text-slate-400 text-xs">{topic.lessons}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-emerald-400 text-xs font-semibold">{topic.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Modules */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-white font-semibold mb-4">Investing in Stocks Hbe Vinet vluing dond Mutual Funds</h2>
              <p className="text-slate-400 text-sm mb-4">Aadi on lening Budgeting Investments Inning no Debt burlings it nechAALLL</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-4 h-4 text-red-400" />
                <span className="text-slate-400 text-sm">Tinent Incepp Investssss</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {microLearningTopics.slice(0, 3).map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={idx}
                      className="flex flex-col items-center gap-2 p-3 bg-slate-900/60 rounded-xl hover:bg-slate-900/80 transition-all border border-slate-700/50 relative"
                    >
                      {idx === 1 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          5
                        </div>
                      )}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-white text-xs text-center">{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Live Price Updates */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3">Live Price Updates</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 text-sm">Gold ₹22,500/10g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Nifty 20,22,900.22</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Nifty 50</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-semibold">+0.85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-slate-900/60 rounded-lg hover:bg-slate-900/80 transition-all border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-sm">Budget Creator</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-900/60 rounded-lg hover:bg-slate-900/80 transition-all border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-sm">Tax Estimator</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Community */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3">Community</h3>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300 text-sm">2,547 members online</span>
              </div>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-all">
                Join Discussion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-center">
          <h2 className="text-white font-bold text-2xl mb-2">Ask me anything about budgeting and finance!</h2>
          <p className="text-white/80 mb-4">Get personalized financial advice powered by AI</p>
          <button className="bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-all">
            Start Learning Now
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <LogoBadge className="w-10 h-10" />
                <div>
                  <h3 className="text-white font-semibold">AI Financial Assistant</h3>
                  <p className="text-slate-400 text-xs">Powered by WomensWealthWave.AI</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <LogoBadge className="w-8 h-8 flex-shrink-0" rounded="rounded-xl" />
                  )}
                  
                  <div className={`max-w-[70%] rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <LogoBadge className="w-8 h-8" rounded="rounded-xl" />
                  <div className="bg-slate-700 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-3 bg-slate-900/60 rounded-xl p-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!searchQuery.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-white text-lg">→</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
