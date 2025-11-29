import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trophy, Crown, Sparkles, Target, BookOpen, Flame, Sword, CheckCircle, Zap } from 'lucide-react';
import { PageType } from '../types/index';
import { EnergyMeter } from './EnergyMeter';
import { CardComponent } from './cards/CardComponent';
import { CardExecutor } from './cards/CardExecutor';
import { sampleCards, getDailyRecommendations } from '../data/sampleData';
import { showAlert } from '../utils/notifications';
import { GoalRecommendations } from './goals/GoalRecommendations';
import techSword from '../assets/tech_sword.png';

interface DashboardProps {
  onPageChange: (page: PageType) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const { state, dispatch } = useAppContext();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isCardExecutorOpen, setIsCardExecutorOpen] = useState(false);
  const [dailyCards, setDailyCards] = useState<any[]>([]);

  // Debug: Log character state on mount and when it changes
  useEffect(() => {
    console.log('🎭 Character State:', {
      completedCards: state.character.completedCards,
      completedCardsLength: state.character.completedCards?.length || 0,
      dailyProgress: state.character.dailyProgress,
      experience: state.character.experience,
      level: state.character.level
    });
  }, [state.character]);

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

  // Calculate total experience from both quests AND completed cards
  const questExperience = state.quests.completed.reduce((sum, quest) => sum + quest.rewards.experience, 0);
  const cardExperience = state.character.completedCards?.reduce((sum, card) => sum + (card.xpGained || 0), 0) || 0;
  const totalExperience = state.character.experience; // Use character's actual experience

  const activeQuestCount = state.quests.active.length;
  const cardCount = state.cards.inventory.length;
  const completedCardsCount = state.character.completedCards?.length || 0;

  // Calculate total energy used from completed cards
  const totalEnergyUsed = state.character.completedCards?.reduce((sum, card) => sum + (card.energyUsed || 0), 0) || 0;

  // Debug: Log metrics on every render
  useEffect(() => {
    console.log('📊 Dashboard Metrics Updated:', {
      completedCardsCount,
      totalExperience,
      cardExperience,
      totalEnergyUsed,
      energyCurrent: state.energy.current,
      dailyProgress: state.character.dailyProgress
    });
  }, [completedCardsCount, totalExperience, cardExperience, totalEnergyUsed, state.energy.current, state.character.dailyProgress]);

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
    console.log('🎮 Dashboard handleCardExecute called with result:', result);
    console.log('🎮 Selected card:', selectedCard);
    console.log('🎮 Current completedCards before dispatch:', state.character.completedCards?.length || 0);
    console.log('🎮 Current dailyProgress before dispatch:', state.character.dailyProgress);

    dispatch({ type: 'EXECUTE_CARD', payload: { cardId: selectedCard.id, result } });
    // Note: Energy consumption is handled inside EXECUTE_CARD reducer

    // Log after a brief moment to see updated state
    setTimeout(() => {
      console.log('🎮 Current completedCards after dispatch:', state.character.completedCards?.length || 0);
      console.log('🎮 Current dailyProgress after dispatch:', state.character.dailyProgress);
    }, 100);

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
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Epic Hero Section */}
      <div className="bg-void-950/40 border border-tech-gold/30 backdrop-blur-md rounded-2xl p-8 text-white text-center relative overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.1)] group">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-gold/50 to-transparent"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <img src={techSword} alt="Sword" className="w-12 h-12 mr-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] animate-pulse" />
            <h2 className="text-5xl font-bold font-cinzel text-gold-200 text-glow-sm tracking-wide">
              War Room
            </h2>
            <img src={techSword} alt="Sword" className="w-12 h-12 ml-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] animate-pulse scale-x-[-1]" />
          </div>
          <p className="text-gold-100/80 text-lg leading-relaxed max-w-4xl mx-auto font-cinzel italic">
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
        <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:border-tech-cyan/30 transition-colors">
          <h3 className="text-xl font-bold mb-4 font-cinzel text-gold-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-tech-cyan" />
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-tech-gold" />
                <span className="text-slate-300 font-inter">Total Points</span>
              </div>
              <span className="text-gold-200 font-bold font-mono text-lg">{totalPoints}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-tech-magenta" />
                <span className="text-slate-300 font-inter">Experience</span>
              </div>
              <span className="text-tech-magenta font-bold font-mono text-lg">{totalExperience}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-emerald-400" />
                <span className="text-slate-300 font-inter">Active Quests</span>
              </div>
              <span className="text-emerald-400 font-bold font-mono text-lg">{activeQuestCount}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-tech-cyan" />
                <span className="text-slate-300 font-inter">Card Collection</span>
              </div>
              <span className="text-tech-cyan font-bold font-mono text-lg">{cardCount}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-slate-300 font-inter">Cards Completed</span>
              </div>
              <span className="text-green-400 font-bold font-mono text-lg">{completedCardsCount}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <span className="text-slate-300 font-inter">Current Streak</span>
              </div>
              <span className="text-orange-500 font-bold font-mono text-lg">{streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Quests Progress */}
      {state.quests.active.length > 0 && (
        <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 font-cinzel text-gold-200 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-tech-gold" />
            Active Quests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.quests.active.slice(0, 4).map((quest) => (
              <div key={quest.id} className="bg-void-900/50 rounded-xl p-4 border border-white/5 hover:border-tech-gold/30 transition-all hover:shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-gold-100 font-bold text-sm font-cinzel tracking-wide">{quest.name}</h4>
                  <span className="text-xs text-tech-cyan font-mono font-bold">{quest.progress}%</span>
                </div>
                <div className="w-full bg-void-950 rounded-full h-2 mb-2 border border-white/5">
                  <div
                    className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-tech-gold to-orange-500 shadow-[0_0_5px_rgba(255,215,0,0.5)]"
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 font-inter">{quest.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Recommendations */}
      <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-cinzel text-gold-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-tech-magenta" />
            Today's Recommended Cards
          </h3>
          <button
            onClick={() => onPageChange('card-generator')}
            className="px-4 py-2 bg-tech-magenta/20 text-tech-magenta border border-tech-magenta/50 rounded-lg hover:bg-tech-magenta/30 transition-all font-cinzel font-bold text-sm hover:shadow-[0_0_10px_rgba(219,39,119,0.3)]"
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
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-50" />
            <p className="font-cinzel text-lg">Generate your first daily cards to get started!</p>
          </div>
        )}
      </div>

      {/* Epic Actions */}
      <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-6 font-cinzel text-gold-200 flex items-center gap-2">
          <Sword className="w-5 h-5 text-tech-gold" />
          Begin Your Adventure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onPageChange('card-inventory')}
            className="flex items-center justify-center gap-3 py-4 bg-void-900/50 border border-white/10 rounded-xl hover:border-tech-cyan/50 hover:bg-tech-cyan/10 hover:text-tech-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group"
          >
            <BookOpen size={20} className="text-slate-400 group-hover:text-tech-cyan transition-colors" />
            <span className="font-cinzel font-bold text-slate-200 group-hover:text-tech-cyan">Card Grimoire</span>
          </button>
          <button
            onClick={() => onPageChange('quest-designer')}
            className="flex items-center justify-center gap-3 py-4 bg-void-900/50 border border-white/10 rounded-xl hover:border-tech-gold/50 hover:bg-tech-gold/10 hover:text-tech-gold hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all group"
          >
            <Sword size={20} className="text-slate-400 group-hover:text-tech-gold transition-colors" />
            <span className="font-cinzel font-bold text-slate-200 group-hover:text-tech-gold">Quest Scribe</span>
          </button>
          <button
            onClick={() => onPageChange('card-generator')}
            className="flex items-center justify-center gap-3 py-4 bg-void-900/50 border border-white/10 rounded-xl hover:border-tech-magenta/50 hover:bg-tech-magenta/10 hover:text-tech-magenta hover:shadow-[0_0_15px_rgba(219,39,119,0.2)] transition-all group"
          >
            <Sparkles size={20} className="text-slate-400 group-hover:text-tech-magenta transition-colors" />
            <span className="font-cinzel font-bold text-slate-200 group-hover:text-tech-magenta">Daily Oracle</span>
          </button>
          <button
            onClick={() => onPageChange('analytics')}
            className="flex items-center justify-center gap-3 py-4 bg-void-900/50 border border-white/10 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all group"
          >
            <Trophy size={20} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="font-cinzel font-bold text-slate-200 group-hover:text-emerald-400">Chronicles</span>
          </button>
        </div>
      </div>

      {/* Your Card Inventory */}
      <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-cinzel text-gold-200 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-tech-cyan" />
            Your Card Inventory
          </h3>
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
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-50" />
            <p className="font-cinzel text-lg">No cards in your inventory yet. Generate or add some!</p>
          </div>
        )}
      </div>

      {/* Resumen de progreso */}
      <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-gold-200 font-cinzel mb-4">Your Progress</h2>
        {/* ...otros componentes... */}
      </div>

      {/* Recomendaciones de objetivos */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gold-200 mb-4 font-cinzel">Recommended Goals</h2>
        <GoalRecommendations
          character={state.character}
          existingGoals={state.goals}
          onSelectGoal={(goal: any) => dispatch({ type: 'ADD_GOAL', payload: goal })}
        />
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