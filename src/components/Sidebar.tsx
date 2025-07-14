import React from 'react';
import { Home, BookOpen, User, Settings, Sword, Brain } from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigation = [
  // Core LifeQuest Pages
  { id: 'character-hub' as PageType, icon: Home, label: '🏠 Character Hub', description: 'Dashboard & Overview' },
  { id: 'card-deck' as PageType, icon: BookOpen, label: '🎴 Card Deck', description: 'Your Card Collection' },
  { id: 'ai-card-generator' as PageType, icon: Brain, label: '🧠 AI Generator', description: 'Create Smart Cards' },
  { id: 'training-ground' as PageType, icon: Sword, label: '⚔️ Training Ground', description: 'Execute Cards' },
  { id: 'character-sheet' as PageType, icon: User, label: '🏆 Character Sheet', description: 'Stats & Progress' },
  { id: 'guild-settings' as PageType, icon: Settings, label: '⚙️ Guild Settings', description: 'Configuration' },
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
          const isNewFeature = ['ai-card-generator', 'training-ground', 'character-sheet'].includes(item.id);
          
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