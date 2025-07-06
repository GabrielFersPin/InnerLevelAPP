import React from 'react';
import { Home, PlusCircle, Zap, CheckSquare, Gift, Heart, BarChart3 } from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigation = [
  { id: 'dashboard' as PageType, icon: Home, label: 'Dashboard' },
  { id: 'log-activity' as PageType, icon: PlusCircle, label: 'Log Activity' },
  { id: 'habits' as PageType, icon: Zap, label: 'Manage Habits' },
  { id: 'todo' as PageType, icon: CheckSquare, label: 'To-Do List' },
  { id: 'rewards' as PageType, icon: Gift, label: 'Rewards' },
  { id: 'wellbeing' as PageType, icon: Heart, label: 'Emotional Well-being' },
  { id: 'analytics' as PageType, icon: BarChart3, label: 'Analytics' },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <nav className="w-80 bg-white/95 backdrop-blur-lg p-6 shadow-xl rounded-r-3xl fixed h-full overflow-y-auto z-40">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          🎮 InnerLevel
        </h1>
      </div>

      <div className="space-y-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'bg-purple-50 hover:bg-purple-100 text-gray-700 hover:translate-x-1'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-gray-600">
        <p className="font-semibold">🎮 InnerLevel</p>
        <p className="mt-2">Making personal development fun and rewarding</p>
        <p className="mt-1">© 2025</p>
      </div>
    </nav>
  );
}