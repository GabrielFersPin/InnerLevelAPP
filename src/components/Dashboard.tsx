import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trophy, Crown, Sparkles, Target, BookOpen, Flame, Sword } from 'lucide-react';
import { PageType } from '../types/index';
import { EnergyMeter } from './EnergyMeter';
import { CardComponent } from './cards/CardComponent';
import { CardExecutor } from './cards/CardExecutor';
import { sampleCards, getDailyRecommendations } from '../data/sampleData';
import { showAlert } from '../utils/notifications';

interface DashboardProps {
  onPageChange: (page: PageType) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const { state, dispatch } = useAppContext();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isCardExecutorOpen, setIsCardExecutorOpen] = useState(false);
  const [dailyCards, setDailyCards] = useState<any[]>([]);

  // Initialize sample data if needed
  useEffect(() => {
    if (state.cards.inventory.length === 0) {
      sampleCards.forEach(card => {
        dispatch({ type: 'ADD_CARD', payload: card });
      });
    }
  }, [state.cards.inventory.length, dispatch]);

  // Generate daily recommendations
  useEffect(() => {
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';
    const recommendations = getDailyRecommendations(state.energy.current, timeOfDay);
    setDailyCards(recommendations);
  }, [state.energy.current]);

  // Calculate enhanced metrics
  const totalPoints = state.tasks.reduce((sum, task) => sum + task.points, 0);
  const totalExperience = state.quests.completed.reduce((sum, quest) => sum + quest.rewards.experience, 0);
  const activeQuestCount = state.quests.active.length;
  const cardCount = state.cards.inventory.length;
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekPoints = state.tasks
    .filter(task => new Date(task.date) >= weekAgo)
    .reduce((sum, task) => sum + task.points, 0);

  // Calculate streak
  const sortedDates = [...new Set(state.tasks.map(task => task.date))].sort();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  if (sortedDates.includes(today)) {
    streak = 1;
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i + 1]);
      const prevDate = new Date(sortedDates[i]);
      const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  const handleCardExecute = (result: any) => {
    dispatch({ type: 'EXECUTE_CARD', payload: { cardId: selectedCard.id, result } });
    dispatch({ type: 'CONSUME_ENERGY', payload: result.energyConsumed });

    // Show notification for XP/points gained
    if (result.progressGained) {
      showAlert(`+${result.progressGained} XP gained!`, 'success');
    } else {
      showAlert('Card executed!', 'success');
    }

    // Update quest progress if applicable
    state.quests.active.forEach(quest => {
      if (selectedCard.tags.some((tag: string) => tag === quest.type)) {
        dispatch({ 
          type: 'UPDATE_QUEST_PROGRESS', 
          payload: { questId: quest.id, progress: quest.progress + (result.progressGained / 10) }
        });
      }
    });
  };

  // Show user's actual card inventory in the dashboard
  const inventoryCards = state.cards.inventory;

  return (
    <div className="space-y-8">
      {/* Epic Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-2xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="relative">
          <div className="flex items-center justify-center mb-4">
            <Crown size={48} className="text-amber-200 mr-3" />
            <h2 className="text-4xl font-bold">
              ⚔️ War Room
            </h2>
            <Crown size={48} className="text-amber-200 ml-3" />
          </div>
          <p className="text-amber-100 text-lg leading-relaxed max-w-4xl mx-auto">
            "Every great adventure begins with a single step into the unknown. Your journey of personal transformation 
            awaits – equipped with powerful cards, guided by epic quests, and fueled by your inner strength."
          </p>
        </div>
      </div>

      {/* Energy and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Meter - Takes full width on mobile, 2 columns on desktop */}
        <div className="lg:col-span-2">
          <EnergyMeter 
            energy={state.energy} 
            size="large"
            onEnergyUpdate={(newEnergy) => dispatch({ type: 'UPDATE_ENERGY', payload: newEnergy })}
          />
        </div>

        {/* Quick Stats */}
        <div className="rpg-panel p-6">
          <h3 className="text-rpg-title text-xl font-bold mb-4">⚡ Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                <span className="text-rpg-content">Total Points</span>
              </div>
              <span className="text-rpg-accent font-bold">{totalPoints}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-rpg-content">Experience</span>
              </div>
              <span className="text-rpg-accent font-bold">{totalExperience}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-emerald-400" />
                <span className="text-rpg-content">Active Quests</span>
              </div>
              <span className="text-rpg-accent font-bold">{activeQuestCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-blue-400" />
                <span className="text-rpg-content">Card Collection</span>
              </div>
              <span className="text-rpg-accent font-bold">{cardCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-400" />
                <span className="text-rpg-content">Current Streak</span>
              </div>
              <span className="text-rpg-accent font-bold">{streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Quests Progress */}
      {state.quests.active.length > 0 && (
        <div className="rpg-panel p-6">
          <h3 className="text-rpg-title text-xl font-bold mb-4">🏆 Active Quests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.quests.active.slice(0, 4).map((quest) => (
              <div key={quest.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-rpg-content font-semibold text-sm">{quest.name}</h4>
                  <span className="text-xs text-slate-400">{quest.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className="quest-progress h-2 rounded-full transition-all duration-500"
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">{quest.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Recommendations */}
      <div className="rpg-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-rpg-title text-xl font-bold">🔮 Today's Recommended Cards</h3>
          <button 
            onClick={() => onPageChange('card-generator')}
            className="btn-rpg text-sm py-2 px-4"
          >
            Generate More
          </button>
        </div>
        
        {dailyCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dailyCards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                size="small"
                onClick={() => {
                  setSelectedCard(card);
                  setIsCardExecutorOpen(true);
                }}
                isDisabled={state.energy.current < card.energyCost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <p>Generate your first daily cards to get started!</p>
          </div>
        )}
      </div>

      {/* Epic Actions */}
      <div className="rpg-panel p-6">
        <h3 className="text-rpg-title text-xl font-bold mb-6">⚔️ Begin Your Adventure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onPageChange('card-inventory')}
            className="btn-rpg flex items-center justify-center gap-3 py-4"
          >
            <BookOpen size={20} />
            <span>Card Grimoire</span>
          </button>
          <button 
            onClick={() => onPageChange('quest-designer')}
            className="btn-rpg flex items-center justify-center gap-3 py-4"
          >
            <Sword size={20} />
            <span>Quest Scribe</span>
          </button>
          <button 
            onClick={() => onPageChange('card-generator')}
            className="btn-rpg flex items-center justify-center gap-3 py-4"
          >
            <Sparkles size={20} />
            <span>Daily Oracle</span>
          </button>
          <button 
            onClick={() => onPageChange('analytics')}
            className="btn-rpg flex items-center justify-center gap-3 py-4"
          >
            <Trophy size={20} />
            <span>Chronicles</span>
          </button>
        </div>
      </div>

      {/* Your Card Inventory */}
      <div className="rpg-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-rpg-title text-xl font-bold">🃏 Your Card Inventory</h3>
        </div>
        {inventoryCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventoryCards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                size="small"
                onClick={() => {
                  setSelectedCard(card);
                  setIsCardExecutorOpen(true);
                }}
                isDisabled={state.energy.current < card.energyCost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <p>No cards in your inventory yet. Generate or add some!</p>
          </div>
        )}
      </div>

      {/* Card Executor Modal */}
      {selectedCard && (
        <CardExecutor
          card={selectedCard}
          isOpen={isCardExecutorOpen}
          onClose={() => {
            setIsCardExecutorOpen(false);
            setSelectedCard(null);
          }}
          onExecute={handleCardExecute}
          currentEnergy={state.energy.current}
        />
      )}
    </div>
  );
}