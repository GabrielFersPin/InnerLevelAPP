import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ArcaneEngine } from "../../services/arcaneEngine";
import { getClassTheme } from '../../data/characterClasses';
import { Brain, Sparkles, RefreshCw, Clock, Target, Zap, Plus } from 'lucide-react';
import type { Card } from '../../types/index';

export function MysticForge() {
  const { state, dispatch } = useAppContext();
  const { character } = state;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
  const [situation, setSituation] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [timeframe, setTimeframe] = useState(7);
  const [generationType, setGenerationType] = useState<'daily' | 'goal' | 'situation'>('daily');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Demo mode detection
  const isDemoMode = !import.meta.env.VITE_CLAUDE_API_KEY || !import.meta.env.VITE_CLAUDE_API_ENDPOINT;

  if (!character) return null;

  const theme = getClassTheme(character.class);

  const handleGenerateCards = async () => {
    setIsGenerating(true);
    try {
      let cards: Card[] = [];
      const currentGoals = character.currentGoals || [];
      const goalTitles = currentGoals.map(g => g.title || '').filter(Boolean);
      const goalDescriptions = currentGoals.map(g => g.description || '').filter(Boolean);
      switch (generationType) {
        case 'daily':
          if (goalTitles.length > 0) {
            // Use goals as context for daily cards
            cards = await ArcaneEngine.generateContextualCards(
              'Daily Focus',
              goalTitles,
              []
            );
          } else {
            // Fallback to character-based daily
            const dailyRec = await ArcaneEngine.getSmartRecommendations(character);
            cards = dailyRec.cards;
          }
          break;
        case 'goal':
          if (goalDescription.trim()) {
            cards = await ArcaneEngine.generateGoalCards(character, goalDescription, timeframe);
          }
          break;
        case 'situation':
          if (situation.trim()) {
            // Use goals as context for situational cards
            cards = await ArcaneEngine.generateContextualCards(
              situation,
              goalTitles,
              []
            );
          }
          break;
      }
      setGeneratedCards(cards);
    } catch (error) {
      console.error('Failed to generate cards:', error);
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

  return (
    <div className="space-y-8">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg text-center mb-4 border-2 border-amber-300 animate-pulse">
          Demo Mode: AI-powered card generation is limited. <br />
          <span className="font-normal">Upgrade to unlock personalized AI cards and advanced features!</span>
          <div className="mt-3 flex justify-center">
            <button
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
              onClick={() => setShowUpgradeModal(true)}
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
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

        {/* Generation Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-amber-200 mb-3">
            Generation Type
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { id: 'daily', label: 'Daily Optimized', desc: 'Cards for today based on your energy and schedule' },
              { id: 'goal', label: 'Goal-Oriented', desc: 'Cards specifically designed to achieve a goal' },
              { id: 'situation', label: 'Situational', desc: 'Cards for a specific situation or challenge' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setGenerationType(type.id as any)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  generationType === type.id
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                }`}
              >
                <h4 className="font-semibold text-slate-200 mb-1">{type.label}</h4>
                <p className="text-sm text-slate-400">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Inputs */}
        {generationType === 'goal' && (
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
        )}

        {generationType === 'situation' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-amber-200 mb-2">
              Situation Description
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., Preparing for a job interview, Dealing with stress, Starting a new project..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
              rows={3}
            />
          </div>
        )}

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

        {/* Generate Button */}
        <button
          onClick={handleGenerateCards}
          disabled={isGenerating || (generationType === 'goal' && !goalDescription.trim()) || (generationType === 'situation' && !situation.trim())}
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
              Generate {generationType === 'daily' ? 'Daily' : generationType === 'goal' ? 'Goal' : 'Situational'} Cards
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
    </div>
  );
}