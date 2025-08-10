import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ArcaneEngine } from "../../services/arcaneEngine";
import { getClassTheme } from '../../data/characterClasses';
import { Brain, Sparkles, RefreshCw, Clock, Target, Zap, Plus, CreditCard } from 'lucide-react';
import type { Card } from '../../types/index';
import GoalCreationForm from './GoalCreationForm';

export function MysticForge() {
  const { state, dispatch } = useAppContext();
  const { character, goals } = state;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
  const [goalDescription, setGoalDescription] = useState('');
  const [timeframe, setTimeframe] = useState(7);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [usage, setUsage] = useState<{ period: string; generations: { used: number; limit: number }; tokens: { used: number; limit: number } } | null>(null);
  const paymentUrl = import.meta.env.VITE_PAYMENT_URL || '/pricing';

  if (!character) return null;

  const theme = getClassTheme(character.class);

  const fetchUsage = async () => {
    try {
      const userId = (state as any)?.user?.id || (state as any)?.auth?.user?.id || 'anonymous';
      const res = await fetch(`http://localhost:5000/api/usage?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (e) {
      // ignore
    }
  };

  const outOfTokens = usage ? usage.tokens.used >= usage.tokens.limit : false;
  const outOfGenerations = usage ? usage.generations.used >= usage.generations.limit : false;

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleGenerateCards = async () => {
    if (outOfTokens || outOfGenerations) {
      window.open(paymentUrl, '_blank');
      return;
    }
    setIsGenerating(true);
    try {
      let cards: Card[] = [];
      if (goalDescription.trim()) {
        // Use authenticated user id if available
        const userId = (state as any)?.user?.id || (state as any)?.auth?.user?.id || 'anonymous';
        cards = await ArcaneEngine.generateGoalCards(character, goalDescription, timeframe, userId);
      }
      setGeneratedCards(cards);
    } catch (error) {
      console.error('Failed to generate cards:', error);
      alert(typeof error?.message === 'string' && error.message.includes('quota')
        ? 'Monthly AI generation quota reached. Try again next month.'
        : 'Failed to generate cards. Please try again.');
      // Show fallback cards
      setGeneratedCards([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const addCardToInventory = (card: Card) => {
    dispatch({ type: 'ADD_CARD', payload: card });
  };

  const addAllCards = () => {
    generatedCards.forEach(card => {
      dispatch({ type: 'ADD_CARD', payload: card });
    });
    setGeneratedCards([]);
  };

  // Removed manual create buttons for non goal-oriented types

  const handleAddGoal = (newGoal) => {
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    setShowGoalForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Removed demo/upgrade banner */}
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-200 mb-2">
          🧠 Mystic Forge
        </h1>
        <p className="text-xl text-slate-300">
          Create personalized cards using advanced AI tailored to your {character.class} journey
        </p>
      </div>

      {/* Generator Controls */}
      <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
        <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
          <Brain className="w-6 h-6 mr-2" />
          Spellcrafting Options
        </h3>

        {/* Only goal-oriented generation is supported */}

        {/* Conditional Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              Goal Description
            </label>
            <textarea
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="e.g., Learn Python programming, Run a 10K, Build a mobile app..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              Timeframe (days)
            </label>
            <input
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(parseInt(e.target.value) || 7)}
              min="1"
              max="365"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              Recommended: 7-30 days for most goals
            </p>
          </div>
        </div>

        {/* Goal-oriented only */}

        {/* Character Context Display */}
        <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Your Character Context</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Class:</span>
              <span className="text-amber-300 ml-2">{character.class}</span>
            </div>
            <div>
              <span className="text-slate-400">Level:</span>
              <span className="text-amber-300 ml-2">{character.level}</span>
            </div>
            <div>
              <span className="text-slate-400">Energy:</span>
              <span className="text-amber-300 ml-2">{Math.round(character.energy.current)}/{character.energy.maximum}</span>
            </div>
          </div>
        </div>

        {/* Token Quota Graph + Pay button */}
        <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-slate-300">Monthly Token Usage</h4>
            <button onClick={fetchUsage} className="text-xs text-amber-300 hover:text-amber-200">Refresh</button>
          </div>
          {usage ? (
            <div>
              <div className="text-xs text-slate-400 mb-1">{usage.tokens.used} / {usage.tokens.limit} tokens</div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-amber-500 to-amber-600"
                  style={{ width: `${Math.min(100, (usage.tokens.used / Math.max(1, usage.tokens.limit)) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Click Refresh to load your usage.</div>
          )}
          <div className="mt-4 flex justify-end">
            <a href={paymentUrl} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
              <CreditCard className="w-4 h-4" />
              Pay to Generate
            </a>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateCards}
          disabled={isGenerating || !goalDescription.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating AI Cards...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2" />
              {outOfTokens || outOfGenerations ? 'Pay to Generate' : 'Generate Goal-Oriented Cards'}
            </span>
          )}
        </button>
      </div>

      {/* Generated Cards Display */}
      {generatedCards.length > 0 && (
        <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-amber-200 flex items-center">
              <Sparkles className="w-6 h-6 mr-2" />
              Generated Cards ({generatedCards.length})
            </h3>
            
            <button
              onClick={addAllCards}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              <Plus className="w-4 h-4 mr-1 inline" />
              Add All to Deck
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedCards.map((card, index) => {
              const canAfford = character.energy.current >= card.energyCost;
              const typeIcon = card.type === 'action' ? '⚔️' : 
                             card.type === 'power' ? '✨' : 
                             card.type === 'recovery' ? '💚' : 
                             card.type === 'event' ? '📅' : '🛡️';

              return (
                <div key={card.id} className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-medium text-slate-200">{card.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{typeIcon}</span>
                      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">AI</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4">
                    {card.description}
                  </p>

                  {/* Skill Bonuses */}
                  {card.skillBonus && card.skillBonus.length > 0 && (
                    <div className="mb-3 text-xs">
                      <div className="text-purple-300 font-medium mb-1">Skill Bonuses:</div>
                      <div className="space-x-2">
                        {card.skillBonus.map((bonus, i) => (
                          <span key={i} className="text-purple-400">
                            {bonus.skillName} +{bonus.xpBonus}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {card.energyCost}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {card.duration}h
                    </span>
                    <span className="flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      +{card.impact}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => addCardToInventory(card)}
                    disabled={!canAfford}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                      !canAfford
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                    }`}
                  >
                    {!canAfford ? 'Not Enough Energy' : 'Add to Deck'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
        <h3 className="text-xl font-bold text-amber-200 mb-4">How Mystic Forge Works</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-300">
          <div>
            <div className="text-purple-400 font-semibold mb-2">🧠 Character Analysis</div>
            <p>AI analyzes your class, level, skills, energy, and current progress to understand your optimal growth path.</p>
          </div>
          <div>
            <div className="text-purple-400 font-semibold mb-2">🎯 Context Understanding</div>
            <p>Based on your input, AI understands your specific situation, goals, or current needs.</p>
          </div>
          <div>
            <div className="text-purple-400 font-semibold mb-2">✨ Smart Generation</div>
            <p>Creates cards optimized for your character type with appropriate difficulty, energy cost, and skill bonuses.</p>
          </div>
        </div>
      </div>

      {/* Goal-oriented only */}

      {/* Goal Management Section */}
      <div className="space-y-8 p-8 bg-slate-900 min-h-screen">
        <h1 className="text-4xl font-bold text-amber-200 mb-4">Goal Management</h1>

        {/* Botón para abrir el formulario */}
        <button 
          onClick={() => setShowGoalForm(true)} 
          className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-600"
        >
          Add New Goal
        </button>

        {/* Formulario de creación de objetivos */}
        {showGoalForm && (
          <GoalCreationForm 
            characterClass={character.class}
            onSubmit={handleAddGoal}
            onClose={() => setShowGoalForm(false)}
          />
        )}

        {/* Lista de objetivos */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-amber-200">{goal.title}</h3>
              <p className="text-slate-300">{goal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}