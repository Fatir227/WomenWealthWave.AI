import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, BookOpen, Calculator, TrendingUp, Calendar } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', icon: MessageCircle, label: 'Komt', labelHindi: 'चैट' },
    { path: '/learn', icon: BookOpen, label: 'Learn', labelHindi: 'सीखें' },
    { path: '/tools', icon: Calculator, label: 'Tools', labelHindi: 'उपकरण' },
    { path: '/live', icon: TrendingUp, label: 'Live', labelHindi: 'लाइव' },
    { path: '/planner', icon: Calendar, label: 'Planner', labelHindi: 'योजना' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 pb-safe z-50 md:hidden">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'text-emerald-400' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-400/20' 
                    : 'bg-transparent'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
