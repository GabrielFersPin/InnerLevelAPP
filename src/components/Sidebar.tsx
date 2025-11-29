import React from 'react';
import { Home, BookOpen, User, Settings, Sword, Brain, Gift as GiftIcon } from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigation = [
  // Core LifeQuest Pages
  { id: 'character-hub' as PageType, icon: Home, label: '🏠 Character Hub', description: 'Dashboard & Overview' },
  { id: 'card-deck' as PageType, icon: BookOpen, label: '🎴 Card Deck', description: 'Your Card Collection' },
  { id: 'ai-card-generator' as PageType, icon: Brain, label: '🔮 Mystic Forge', description: 'Create Smart Cards' },
  { id: 'training-ground' as PageType, icon: Sword, label: '⚔️ Training Ground', description: 'Execute Cards' },
  { id: 'rewards' as PageType, icon: GiftIcon, label: '🎁 Inventory', description: 'Your Rewards & Gifts' },
  { id: 'character-sheet' as PageType, icon: User, label: '🏆 Character Sheet', description: 'Stats & Progress' },
  { id: 'guild-settings' as PageType, icon: Settings, label: '⚙️ Guild Settings', description: 'Configuration' },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <nav className="w-80 rpg-panel p-6 fixed h-full overflow-y-auto z-30 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent font-cinzel tracking-wide drop-shadow-sm">
          ⚔️ LifeQuest Cards
        </h1>
        <p className="text-gold-300/70 text-sm mt-1 font-inter tracking-wider uppercase text-[10px]">Epic Personal Development</p>
      </div>

      <div className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isNewFeature = ['ai-card-generator', 'training-ground', 'character-sheet', 'guild-settings'].includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left relative group ${isActive
                ? 'bg-gradient-to-r from-tech-cyan/20 to-tech-magenta/10 border border-tech-cyan/40 text-tech-cyan shadow-lg shadow-tech-cyan/10'
                : 'bg-void-800/30 hover:bg-void-700/50 text-slate-400 hover:text-tech-cyan hover:translate-x-1 border border-transparent hover:border-tech-cyan/20'
                }`}
            >
              <Icon size={18} className={`transition-colors duration-300 ${isActive ? 'text-tech-cyan' : 'text-slate-500 group-hover:text-tech-cyan'}`} />
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm font-cinzel ${isActive ? 'text-tech-cyan' : 'text-slate-300 group-hover:text-tech-cyan'}`}>
                  {item.label}
                </div>
                <div className={`text-xs font-inter ${isActive ? 'text-tech-cyan/70' : 'text-slate-500 group-hover:text-tech-cyan/50'}`}>
                  {item.description}
                </div>
              </div>
              {isNewFeature && (
                <div className="absolute -top-1 -right-1">
                  <span className="text-[10px] bg-tech-magenta/90 text-white px-1.5 py-0.5 rounded-full font-bold shadow-sm border border-tech-magenta/50">
                    NEW
                  </span>
                </div>
              )}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-tech-cyan/5 animate-pulse-slow pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-slate-400 space-y-2 font-inter">
        <div className="text-gold-500/80 font-semibold font-cinzel text-xs tracking-widest uppercase">⚔️ LifeQuest Cards</div>
        <div className="text-[10px] text-slate-500">Transform your life through epic quests</div>
        <div className="text-[10px] text-slate-600">© 2025 - Adventure Awaits</div>
      </div>
    </nav>
  );
}