import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ArcaneEngine } from "../../services/arcaneEngine";
import { getClassTheme } from '../../data/characterClasses';
import { Brain, Sparkles, RefreshCw, Clock, Target, Zap, Plus, CreditCard } from 'lucide-react';
import type { Card } from '../../types/index';
import GoalCreationForm from './GoalCreationForm';
import { getApiUrl } from '../../config/environment';
import techOrb from '../../assets/tech_orb.png';

export function MysticForge() {
  const { state, dispatch } = useAppContext();
  const { character, goals } = state;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
  const [goalDescription, setGoalDescription] = useState('');
  const [timeframe, setTimeframe] = useState(7);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [usage, setUsage] = useState<{ period: string; generations: { used: number; limit: number }; tokens: { used: number; limit: number } } | null>(null);
  const paymentUrl = import.meta.env.VITE_PAYMENT_URL || '/pricing';

  if (!character) return null;

  const theme = getClassTheme(character.class);

  const fetchUsage = async () => {
    try {
      const userId = (state as any)?.user?.id || (state as any)?.auth?.user?.id || 'anonymous';
      const res = await fetch(`${getApiUrl()}/api/usage?userId=${encodeURIComponent(userId)}`);
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
      alert('You\'ve reached your monthly limit of AI-generated cards. Try again next month!');
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
    } catch (error: any) {
      console.error('Failed to generate cards:', error);

      // Check if it's a quota exceeded error
      if (error?.code === 'quota_exceeded' || error?.status === 402) {
        alert('You\'ve reached your monthly limit of AI-generated cards. Try again next month!');
      } else {
        alert('Failed to generate cards. Please try again.');
      }
      // Show fallback cards
      setGeneratedCards([]);
    } finally {
      setIsGenerating(false);
    }
  };

  // In MysticForge.tsx - actualizar el handler
  const handlePaymentRedirect = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          priceId: 'price_1S9nazRzgYnoH4fIyNCsYgnk', // Tu Price ID
          userId: '902cd635-6ccf-40d7-b087-d82cabc08cf5', // ID del usuario actual
          email: 'gabrielfelipef.23@gmail.com' // Email del usuario
        })
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url; // Redirigir a Stripe Checkout
      } else {
        console.error('Error creating payment session:', data.error);
        // Aquí puedes mostrar tu página de error personalizada
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Aquí también puedes mostrar tu página de error personalizada
    }
  };

  // Removed manual create buttons for non goal-oriented types

  const addCardToInventory = (card: Card) => {
    dispatch({ type: 'ADD_CARD', payload: card });
    console.log('✅ Card added to deck:', card.name);
  };

  const addAllCards = () => {
    generatedCards.forEach(card => {
      dispatch({ type: 'ADD_CARD', payload: card });
    });
    console.log(`✅ Added ${generatedCards.length} cards to deck`);
    alert(`Successfully added ${generatedCards.length} cards to your deck!`);
  };

  const handleAddGoal = (newGoal: any) => {
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    setShowGoalForm(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Removed demo/upgrade banner */}
      {/* Header */}
      <div className="text-center relative mb-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <h1 className="text-4xl font-bold text-gold-200 mb-2 font-cinzel text-glow-sm flex items-center justify-center gap-3 relative z-10">
          <img src={techOrb} alt="Orb" className="w-8 h-8 animate-pulse" />
          Mystic Forge
          <img src={techOrb} alt="Orb" className="w-8 h-8 animate-pulse" />
        </h1>
        <p className="text-xl text-slate-300 font-cinzel relative z-10">
          Create personalized cards using advanced AI tailored to your <span className="text-tech-magenta font-bold">{character.class}</span> journey
        </p>
      </div>

      {/* Generator Controls */}
      <div className="bg-void-950/40 border border-purple-500/30 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <h3 className="text-2xl font-bold text-gold-200 mb-6 flex items-center font-cinzel">
          <Brain className="w-6 h-6 mr-2 text-tech-magenta" />
          Spellcrafting Options
        </h3>

        {/* Only goal-oriented generation is supported */}

        {/* Conditional Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2 font-cinzel">
              Goal Description
            </label>
            <textarea
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="e.g., Learn Python programming, Run a 10K, Build a mobile app..."
              className="w-full px-4 py-3 bg-void-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-tech-magenta focus:ring-1 focus:ring-tech-magenta resize-none font-inter transition-all"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2 font-cinzel">
              Timeframe (days)
            </label>
            <input
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(parseInt(e.target.value) || 7)}
              min="1"
              max="365"
              className="w-full px-4 py-3 bg-void-900/50 border border-white/10 rounded-lg text-white focus:border-tech-magenta focus:ring-1 focus:ring-tech-magenta font-inter transition-all"
            />
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Recommended: 7-30 days for most goals
            </p>
          </div>
        </div>

        {/* Goal-oriented only */}

        {/* Character Context Display */}
        <div className="mb-6 p-4 bg-void-900/30 rounded-lg border border-white/5">
          <h4 className="text-sm font-bold text-slate-300 mb-2 font-cinzel uppercase tracking-wider">Your Character Context</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-inter">Class:</span>
              <span className="text-tech-gold font-bold font-cinzel">{character.class}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-inter">Level:</span>
              <span className="text-tech-cyan font-bold font-mono">{character.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-inter">Energy:</span>
              <span className="text-tech-magenta font-bold font-mono">{Math.round(character.energy.current)}/{character.energy.maximum}</span>
            </div>
          </div>
        </div>

        {/* Token Quota Graph + Pay button */}
        <div className="mb-6 p-4 bg-void-900/30 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-300 font-cinzel uppercase tracking-wider">Monthly Token Usage</h4>
            <button onClick={fetchUsage} className="text-xs text-tech-gold hover:text-gold-100 font-mono underline decoration-dotted">Refresh</button>
          </div>
          {usage ? (
            <div>
              <div className="text-xs text-slate-400 mb-1 font-mono">{usage.tokens.used} / {usage.tokens.limit} tokens</div>
              <div className="w-full h-3 bg-void-950 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-3 bg-gradient-to-r from-tech-gold to-orange-500 shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                  style={{ width: `${Math.min(100, (usage.tokens.used / Math.max(1, usage.tokens.limit)) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-inter">Click Refresh to load your usage.</div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handlePaymentRedirect}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-100 border border-emerald-500/30 rounded-lg transition-all duration-200 font-cinzel text-sm font-bold hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            >
              <CreditCard className="w-4 h-4" />
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={outOfTokens || outOfGenerations ? handlePaymentRedirect : handleGenerateCards}
          disabled={isGenerating || !goalDescription.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-purple-100 font-bold font-cinzel rounded-xl border border-purple-500/50 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {isGenerating ? (
            <span className="flex items-center justify-center relative z-10">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating AI Cards...
            </span>
          ) : (
            <span className="flex items-center justify-center relative z-10">
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              {outOfTokens || outOfGenerations ? 'Upgrade to Generate' : 'Generate Goal-Oriented Cards'}
            </span>
          )}
        </button>
      </div>

      {/* Generated Cards Display */}
      {generatedCards.length > 0 && (
        <div className="bg-void-950/40 border border-tech-gold/30 backdrop-blur-md rounded-2xl p-8 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gold-200 flex items-center font-cinzel">
              <Sparkles className="w-6 h-6 mr-2 text-tech-gold" />
              Generated Cards ({generatedCards.length})
            </h3>

            <button
              onClick={addAllCards}
              className="px-4 py-2 bg-gradient-to-r from-emerald-900/50 to-green-900/50 text-emerald-100 font-bold font-cinzel rounded-lg border border-emerald-500/30 hover:bg-emerald-800/50 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all"
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
                <div key={card.id} className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:-translate-y-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"></div>

                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <span className="text-lg font-bold text-purple-200 font-cinzel">{card.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl drop-shadow-md">{typeIcon}</span>
                      <span className="text-xs bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded border border-purple-500/50 font-bold uppercase tracking-wider">AI</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-4 font-inter leading-relaxed relative z-10">
                    {card.description}
                  </p>

                  {/* Skill Bonuses */}
                  {card.skillBonus && card.skillBonus.length > 0 && (
                    <div className="mb-3 text-xs relative z-10">
                      <div className="text-purple-300 font-bold mb-1 uppercase tracking-wider">Skill Bonuses:</div>
                      <div className="flex flex-wrap gap-2">
                        {card.skillBonus.map((bonus, i) => (
                          <span key={i} className="text-purple-200 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-500/30">
                            {bonus.skillName} <span className="text-emerald-400 font-mono">+{bonus.xpBonus}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4 font-mono relative z-10">
                    <span className="flex items-center bg-void-950/50 px-2 py-1 rounded border border-white/5">
                      <Zap className="w-3 h-3 mr-1 text-blue-400" />
                      {card.energyCost}
                    </span>
                    <span className="flex items-center bg-void-950/50 px-2 py-1 rounded border border-white/5">
                      <Clock className="w-3 h-3 mr-1 text-amber-400" />
                      {card.duration}h
                    </span>
                    <span className="flex items-center bg-void-950/50 px-2 py-1 rounded border border-white/5">
                      <Target className="w-3 h-3 mr-1 text-emerald-400" />
                      +{card.impact}
                    </span>
                  </div>

                  <button
                    onClick={() => addCardToInventory(card)}
                    disabled={!canAfford}
                    className={`w-full px-4 py-2 rounded-lg font-bold font-cinzel tracking-wide transition-all relative z-10 ${!canAfford
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white hover:from-purple-500 hover:to-indigo-500 border border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]'
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
      <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-gold-200 mb-4 font-cinzel">How Mystic Forge Works</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-300">
          <div>
            <div className="text-tech-magenta font-bold mb-2 font-cinzel uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4" /> Character Analysis
            </div>
            <p className="font-inter text-slate-400">AI analyzes your class, level, skills, energy, and current progress to understand your optimal growth path.</p>
          </div>
          <div>
            <div className="text-tech-cyan font-bold mb-2 font-cinzel uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" /> Context Understanding
            </div>
            <p className="font-inter text-slate-400">Based on your input, AI understands your specific situation, goals, or current needs.</p>
          </div>
          <div>
            <div className="text-tech-gold font-bold mb-2 font-cinzel uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Smart Generation
            </div>
            <p className="font-inter text-slate-400">Creates cards optimized for your character type with appropriate difficulty, energy cost, and skill bonuses.</p>
          </div>
        </div>
      </div>

      {/* Goal-oriented only */}

      {/* Goal Management Section */}
      <div className="space-y-8 p-8 bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gold-200 mb-4 font-cinzel flex items-center gap-2">
          <Target className="w-8 h-8 text-tech-cyan" />
          Goal Management
        </h1>

        {/* Botón para abrir el formulario */}
        <button
          onClick={() => setShowGoalForm(true)}
          className="px-6 py-2.5 bg-tech-gold/20 text-tech-gold border border-tech-gold/50 rounded-lg hover:bg-tech-gold/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all font-cinzel font-bold tracking-wide"
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
          {goals.map((goal: any) => (
            <div key={goal.id} className="bg-void-900/50 p-6 rounded-xl border border-white/5 hover:border-tech-gold/30 transition-all">
              <h3 className="text-xl font-bold text-gold-100 font-cinzel mb-2">{goal.title}</h3>
              <p className="text-slate-300 font-inter">{goal.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}