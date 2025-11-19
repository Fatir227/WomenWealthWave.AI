import React from 'react';
import { Sparkles, BookOpen, TrendingUp, Users, Video } from 'lucide-react';

export default function LearnPage() {
  const quickstartModules = [
    { title: 'Budgeting Basics', progress: 75, total: 82, completion: 18, icon: '💰', color: 'from-purple-500 to-violet-500' },
    { title: 'Saving Strategies', progress: 23, total: 28, completion: 19, icon: '💎', color: 'from-blue-500 to-cyan-500' },
  ];

  const deepDiveTopics = [
    { title: 'Investing in Stocks & Mutual Funds', weeks: 30, completion: 25, icon: '💹', color: 'from-pink-500 to-rose-500' },
    { title: 'Understanding Estate Planning', weeks: 72, completion: 0, icon: '📋', color: 'from-indigo-500 to-purple-500' },
    { title: 'Investing & Entrepreneurship', subtitle: 'Entrepreneur ka wise hant tune and beginners', weeks: 17, completion: 39, icon: '💼', color: 'from-orange-500 to-red-500' },
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
              <p className="text-gray-400 text-xs">Hello, Dioyal! Let's something something new today!</p>
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
              placeholder="Search topics..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
            />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          </div>
          <p className="text-gray-400 text-xs mt-2">Ask me anything about budgeting, savings, or investments!</p>
        </div>

        {/* Quickstart Modules */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Quickstart Modules</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickstartModules.map((module, idx) => (
              <div key={idx} className="bg-gray-900/60 rounded-xl p-4 border border-gray-700">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl mb-3`}>
                  {module.icon}
                </div>
                <h4 className="text-white font-medium text-sm mb-2">{module.title}</h4>
                <p className="text-gray-400 text-xs mb-2">{module.progress} Write {module.total}</p>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                  <div className={`bg-gradient-to-r ${module.color} h-1.5 rounded-full`} style={{ width: `${module.completion}%` }}></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-400 text-xs font-semibold">{module.completion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Topics */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Deep Dive Topics</h3>
          <div className="space-y-3">
            {deepDiveTopics.map((topic, idx) => (
              <div key={idx} className="bg-gray-900/60 rounded-xl p-4 border border-gray-700">
                <div className="flex gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">{topic.title}</h4>
                    {topic.subtitle && <p className="text-gray-400 text-xs mb-2">{topic.subtitle}</p>}
                    <p className="text-gray-400 text-xs mb-2">{topic.weeks} Weeks Course 3-5</p>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                      <div className={`bg-gradient-to-r ${topic.color} h-1.5 rounded-full`} style={{ width: `${topic.completion}%` }}></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-emerald-400 text-xs font-semibold">{topic.completion}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workshops & Webinars */}
        <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Workshops & Webinars</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium text-sm">Success Stories</h4>
            </div>
            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium text-sm">Trolle Met</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
