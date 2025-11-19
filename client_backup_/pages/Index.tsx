import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Send,
  Mic,
  BookOpen,
  TrendingUp,
  Zap,
  Users,
  Star,
  Mail,
  ArrowRight,
  Award,
  Heart,
} from "lucide-react";

export default function Index() {
  const [email, setEmail] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lavender rounded-full blur-3xl opacity-10 dark:opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-mint rounded-full blur-3xl opacity-10 dark:opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  Empowering Women to Master Money with AI.
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your personal guide to financial independence — learn, plan,
                  and grow with FinWise.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg">
                  Start Learning
                </button>
                <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all">
                  Chat with AI Advisor
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-2xl font-bold text-primary">10K+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Women Empowered
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">95%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Satisfaction
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">100+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expert Tips
                  </p>
                </div>
              </div>
            </div>

            {/* Right Illustration Area */}
            <div className="hidden lg:block relative h-96 animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 to-mint/20 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👩‍💼</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI Finance Companion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Interface */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Your Personal AI Finance Advisor
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get expert budgeting, savings, and investing tips with AI-powered
              suggestions in English & Hindi.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chat Interface Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-4">
              <div className="space-y-4 h-80 overflow-y-auto bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                <div className="flex justify-start">
                  <div className="bg-lavender text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">
                      Hi! I'm here to help you master your finances. What would
                      you like to learn about today?
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">
                      I want to learn about budgeting basics.
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-lavender text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">
                      Great! Budgeting is about tracking income and expenses.
                      Start with the 50-30-20 rule: 50% needs, 30% wants, 20%
                      savings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything about finance..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
                <button className="p-3 bg-mint text-primary rounded-lg hover:bg-mint/90 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { title: "Smart Budgeting Tips", desc: "Personalized budget advice" },
                {
                  title: "Savings Strategies",
                  desc: "Build wealth step by step",
                },
                { title: "Investing Guidance", desc: "Learn about stocks & funds" },
                {
                  title: "Multilingual Support",
                  desc: "Hindi & English assistance",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-2 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-mint/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-mint" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Micro-Learning Hub */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Learn at Your Own Pace
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Master financial concepts through bite-sized, interactive lessons.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Budgeting Basics",
                lessons: "12 Lessons",
                difficulty: "Beginner",
                icon: "💰",
              },
              {
                title: "Smart Saving",
                lessons: "8 Lessons",
                difficulty: "Beginner",
                icon: "🏦",
              },
              {
                title: "Investing 101",
                lessons: "15 Lessons",
                difficulty: "Intermediate",
                icon: "📈",
              },
              {
                title: "Understanding Taxes",
                lessons: "10 Lessons",
                difficulty: "Intermediate",
                icon: "📋",
              },
              {
                title: "Financial Safety",
                lessons: "7 Lessons",
                difficulty: "Beginner",
                icon: "🔒",
              },
              {
                title: "Women's Rights",
                lessons: "9 Lessons",
                difficulty: "Intermediate",
                icon: "⚖️",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{course.icon}</span>
                  <span className="px-3 py-1 bg-mint/20 text-mint text-xs font-semibold rounded-full">
                    {course.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-primary">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-lavender to-mint h-2 rounded-full"
                    style={{ width: `${Math.random() * 80 + 20}%` }}
                  ></div>
                </div>
                <button className="w-full px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold group-hover:border-primary group-hover:text-primary">
                  Continue →
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all">
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Finance Tools Dashboard */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Smart Finance Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Calculate, track, and optimize your financial decisions with
              powerful tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "SIP Calculator", icon: "📊", color: "lavender" },
              { name: "EMI Calculator", icon: "🏠", color: "mint" },
              { name: "SWP Calculator", icon: "💵", color: "lavender" },
              { name: "Tax Estimator", icon: "📝", color: "mint" },
              { name: "Expense Tracker", icon: "📈", color: "lavender" },
              { name: "Budget Planner", icon: "💼", color: "mint" },
            ].map((tool, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-4 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl">{tool.icon}</div>
                <h3 className="font-bold text-lg text-primary">{tool.name}</h3>
                <button className="text-primary font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-primary mb-4">
                Daily Expenses
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Food", value: 30, color: "bg-mint" },
                  { label: "Transport", value: 20, color: "bg-lavender" },
                  { label: "Shopping", value: 25, color: "bg-primary" },
                  { label: "Other", value: 25, color: "bg-gray-300" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                      <span className="font-semibold text-primary">
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-primary mb-4">
                Market Trends
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="font-semibold text-primary">Nifty 50</span>
                  <div className="text-right">
                    <p className="font-bold text-lg">19,245.50</p>
                    <p className="text-green-600 flex items-center gap-1 text-sm">
                      ↑ 2.15%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="font-semibold text-primary">Gold</span>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹62,850</p>
                    <p className="text-green-600 flex items-center gap-1 text-sm">
                      ↑ 1.25%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="font-semibold text-primary">Bank Nifty</span>
                  <div className="text-right">
                    <p className="font-bold text-lg">48,120.25</p>
                    <p className="text-red-600 flex items-center gap-1 text-sm">
                      ↓ 0.85%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Saving Planner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Plan Smarter, Save Better
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tell us about your goals and let AI create a personalized saving
              strategy.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  Monthly Income
                </label>
                <input
                  type="number"
                  placeholder="Enter monthly income"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">
                  Goal Type
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Emergency Fund</option>
                  <option>Home</option>
                  <option>Education</option>
                  <option>Retirement</option>
                  <option>Investment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 500000"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary">
                    Duration (Years)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all">
                Get Personalized Plan
              </button>
            </div>

            {/* Recommendation Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-lavender/10 to-mint/10 rounded-xl p-8 border border-lavender/20 space-y-4">
                <h3 className="text-xl font-bold text-primary">
                  Recommended Saving Strategy
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        Emergency Fund (3-6 months)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Build ₹50,000 safety net
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        Regular SIP Investment
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start ₹5,000/month in mutual funds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        Gold & Bonds Diversification
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allocate 20% to gold & 15% to bonds
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-primary">Projected Goal Completion:</span>{" "}
                  In 5 years with consistent ₹5,000/month savings at 8% annual
                  return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agentic AI Orchestration Panel */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 relative">
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
            Developer Mode
          </span>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Agentic AI Orchestration
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Advanced AI agent management with OpenTelemetry observability.
              Compose and deploy heterogeneous agents at runtime.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { name: "Budget Optimizer", status: "Active", icon: "🤖" },
                { name: "Investment Advisor", status: "Active", icon: "📊" },
                { name: "Tax Analyzer", status: "Inactive", icon: "📋" },
              ].map((agent, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.icon}</span>
                      <h4 className="font-semibold text-primary">
                        {agent.name}
                      </h4>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        agent.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time observability enabled
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                <span>+ Add Agent</span>
              </button>
              <button className="px-6 py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all">
                Remove Agent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Women Finance Insights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Finance Facts & Insights for Women
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Learn from real success stories and trending financial insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                type: "Fact",
                title: "Women investors earn 40% higher returns",
                desc: "Studies show women tend to hold investments longer",
                icon: "📈",
              },
              {
                type: "Story",
                title: "Priya's journey from ₹0 to ₹50L portfolio",
                desc: "How consistent SIP investing transformed her wealth",
                icon: "⭐",
              },
              {
                type: "Trend",
                title: "Women in crypto growing 3x faster",
                desc: "Digital finance adoption among Indian women surging",
                icon: "🚀",
              },
              {
                type: "Fact",
                title: "Financial literacy gap is closing",
                desc: "More women learning about investments than ever",
                icon: "📚",
              },
              {
                type: "Story",
                title: "Anika built her dream house through real estate",
                desc: "Strategic property investment & wealth building",
                icon: "🏠",
              },
              {
                type: "Insight",
                title: "Why women need financial independence",
                desc: "Building security and autonomy through wealth",
                icon: "💪",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
              >
                <div className="h-40 bg-gradient-to-br from-lavender/20 to-mint/20 flex items-center justify-center text-5xl">
                  {item.icon}
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-xs font-semibold text-mint uppercase">
                    {item.type}
                  </span>
                  <h3 className="font-bold text-lg text-primary line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                  <button className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-lavender/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Join the FinWise Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with thousands of women learning, growing, and succeeding
              together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "Discussion Threads",
                desc: "Share questions and get advice from the community",
                icon: "💬",
              },
              {
                name: "Peer Mentorship",
                desc: "Learn from experienced women in finance",
                icon: "👥",
              },
              {
                name: "Women-Led Events",
                desc: "Webinars, workshops, and networking sessions",
                icon: "🎯",
              },
              {
                name: "Leaderboard",
                desc: "Top Learners & Top Savers recognition",
                icon: "🏆",
              },
              {
                name: "Success Stories",
                desc: "Celebrate wins and inspire others",
                icon: "🌟",
              },
              {
                name: "Resource Library",
                desc: "Curated tools, templates, and guides",
                icon: "📚",
              },
            ].map((community, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <span className="text-4xl">{community.icon}</span>
                <h3 className="font-bold text-lg text-primary">
                  {community.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {community.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all">
              Join the Community
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              What Our Users Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real stories from real women transforming their finances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Kavya",
                role: "Software Engineer",
                content:
                  "FinWise helped me understand investments. Now I have a diversified portfolio worth ₹10L!",
                rating: 5,
              },
              {
                name: "Priya",
                role: "Entrepreneur",
                content:
                  "The AI advisor gives personalized tips that actually work for my business finances. Highly recommend!",
                rating: 5,
              },
              {
                name: "Anjali",
                role: "Homemaker",
                content:
                  "From zero financial knowledge to managing ₹5L portfolio. FinWise made it possible!",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender to-mint flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary via-lavender to-mint rounded-2xl p-8 sm:p-12 text-white space-y-6 shadow-xl">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Stay Updated
              </h2>
              <p className="text-white/90">
                Get weekly tips and tools to grow your financial confidence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>

            <p className="text-sm text-white/80 text-center">
              Join 10,000+ women receiving weekly financial insights. Unsubscribe
              anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
