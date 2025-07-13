import React from 'react';
import { Sword, PlusCircle, Zap, CheckSquare, Gift, Heart, BarChart3, Target, Settings, BookOpen, Scroll, Sparkles } from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigation = [
  // War Room Section
  { id: 'dashboard' as PageType, icon: Sword, label: '⚔️ War Room', description: 'Command Center' },
  
  // LifeQuest Cards Section
  { id: 'card-inventory' as PageType, icon: BookOpen, label: '🎴 Card Grimoire', description: 'Card Collection' },
  { id: 'quest-designer' as PageType, icon: Scroll, label: '📜 Quest Scribe', description: 'Create Adventures' },
  { id: 'card-generator' as PageType, icon: Sparkles, label: '🔮 Daily Oracle', description: 'Generate Cards' },
  
  // Legacy Features (Enhanced)
  { id: 'log-activity' as PageType, icon: PlusCircle, label: '📝 Activity Log', description: 'Record Actions' },
  { id: 'habits' as PageType, icon: Zap, label: '⚡ Battle Habits', description: 'Power Training' },
  { id: 'todo' as PageType, icon: CheckSquare, label: '✅ Task Quests', description: 'Daily Missions' },
  { id: 'goals' as PageType, icon: Target, label: '🏆 Epic Goals', description: 'Grand Quests' },
  { id: 'rewards' as PageType, icon: Gift, label: '🎁 Treasure Vault', description: 'Earned Rewards' },
  { id: 'wellbeing' as PageType, icon: Heart, label: '💚 Soul Monitor', description: 'Inner Balance' },
  { id: 'analytics' as PageType, icon: BarChart3, label: '📊 Chronicles', description: 'Progress Stats' },
  { id: 'profile' as PageType, icon: Settings, label: '⚙️ Guild Settings', description: 'Configuration' },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <nav className="w-80 rpg-panel p-6 shadow-2xl rounded-r-3xl fixed h-full overflow-y-auto z-30">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          ⚔️ LifeQuest Cards
        </h1>
        <p className="text-amber-300/70 text-sm mt-1">Epic Personal Development</p>
      </div>

      <div className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isNewFeature = ['card-inventory', 'quest-designer', 'card-generator'].includes(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left relative ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600/30 to-amber-700/30 border border-amber-500/50 text-amber-200 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:translate-x-1 border border-slate-600/30'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm ${isActive ? 'text-amber-200' : 'text-slate-200'}`}>
                  {item.label}
                </div>
                <div className={`text-xs ${isActive ? 'text-amber-300/70' : 'text-slate-400'}`}>
                  {item.description}
                </div>
              </div>
              {isNewFeature && (
                <div className="absolute -top-1 -right-1">
                  <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-slate-400 space-y-2">
        <div className="text-amber-400 font-semibold">⚔️ LifeQuest Cards</div>
        <div className="text-xs text-slate-500">Transform your life through epic quests</div>
        <div className="text-xs text-slate-500">© 2025 - Adventure Awaits</div>
      </div>
    </nav>
  );
}