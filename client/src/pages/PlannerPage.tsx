import React from 'react';
import { Sparkles, Home, Calendar, Plus, CheckCircle } from 'lucide-react';

export default function PlannerPage() {
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
              placeholder="Ask me about Ing setting or plans!"
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
            />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          </div>
          <p className="text-gray-400 text-xs mt-2">Ask me anything about budgeting, savings, or investments!</p>
        </div>

        {/* Financial Goals */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Financial Goals</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Dream Home */}
            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl p-4 border border-pink-500/30 relative">
              <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                30% Achieved
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-3xl mt-6 mb-3">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Dream Home</h4>
              <p className="text-gray-300 text-xs mb-1">Downpayment</p>
              <p className="text-gray-400 text-xs mb-2">Dec 2028</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            {/* Retirement */}
            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-3xl mb-3">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Retirement</h4>
              <p className="text-gray-300 text-xs mb-1">Feruoden</p>
              <p className="text-gray-400 text-xs mb-2">15 Years to Go</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gray-600 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Personalized Plans */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Personalized Plans</h3>
          
          <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Monthly Budget Plan</h4>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Monthly Budget Plan</p>
                  <p className="text-gray-400 text-xs">Plain</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">On Track</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Expenses/Income</span>
                <span className="text-white font-semibold">₹ 100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-gray-400 text-xs">Follow-up</p>
            </div>
          </div>

          <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <span>Create New Goal</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
