import React, { useState, useEffect } from 'react';
import { Card, CardResult } from '../../types';
import { X, Play, CheckCircle, Clock, Zap, Target } from 'lucide-react';
import { CardComponent } from './CardComponent';

interface CardExecutorProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onExecute: (result: CardResult) => void;
  currentEnergy: number;
}

export function CardExecutor({ card, isOpen, onClose, onExecute, currentEnergy }: CardExecutorProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(card.duration * 60); // in minutes
  const [feedback, setFeedback] = useState('');
  const [emotionBefore, setEmotionBefore] = useState('');
  const [emotionAfter, setEmotionAfter] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [completionNotes, setCompletionNotes] = useState('');

  useEffect(() => {
    if (isExecuting && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [isExecuting, timeRemaining]);

  const canExecute = currentEnergy >= card.energyCost && !card.isOnCooldown;

  const handleStartExecution = () => {
    if (!canExecute) return;

    setIsExecuting(true);
    setTimeRemaining(card.duration * 60);
  };

  const handleCompleteExecution = () => {
    // Calculate result based on feedback and energy level
    let progressGained = card.impact;

    // Apply energy level multiplier
    const energyMultiplier = energyLevel / 5; // 1.0 at level 5
    progressGained *= energyMultiplier;

    // Apply completion quality multiplier
    const qualityMultiplier = feedback === 'excellent' ? 1.5 :
      feedback === 'good' ? 1.2 :
        feedback === 'average' ? 1.0 : 0.8;
    progressGained *= qualityMultiplier;

    const result: CardResult = {
      success: true,
      energyConsumed: card.energyCost,
      progressGained: Math.round(progressGained),
      effects: [
        `Energy consumed: ${card.energyCost}`,
        `Progress gained: ${Math.round(progressGained)}`,
        feedback && `Quality: ${feedback}`,
        emotionBefore && `Started feeling: ${emotionBefore}`,
        emotionAfter && `Ended feeling: ${emotionAfter}`
      ].filter(Boolean),
      message: `Successfully completed "${card.name}"! Great work!`
    };

    console.log('⚡ CardExecutor calling onExecute with result:', result);
    onExecute(result);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setIsExecuting(false);
    setTimeRemaining(card.duration * 60);
    setFeedback('');
    setEmotionBefore('');
    setEmotionAfter('');
    setEnergyLevel(5);
    setCompletionNotes('');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rpg-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-amber-500/30">
          <h2 className="text-2xl font-bold text-rpg-title">Execute Card</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Display */}
          <div className="flex justify-center">
            <div className="w-80">
              <CardComponent
                card={card}
                size="large"
                showDetails={true}
                isDisabled={!canExecute}
              />
            </div>
          </div>

          {/* Energy Check */}
          {!canExecute && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400">
                <Zap size={20} />
                <span className="font-semibold">
                  {currentEnergy < card.energyCost
                    ? `Insufficient Energy (Need: ${card.energyCost}, Have: ${currentEnergy})`
                    : 'Card is on cooldown'
                  }
                </span>
              </div>
            </div>
          )}

          {/* Pre-execution Form */}
          {!isExecuting && canExecute && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  How are you feeling before starting?
                </label>
                <select
                  value={emotionBefore}
                  onChange={(e) => setEmotionBefore(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="">Select...</option>
                  <option value="excited">😄 Excited</option>
                  <option value="motivated">💪 Motivated</option>
                  <option value="focused">🎯 Focused</option>
                  <option value="calm">😌 Calm</option>
                  <option value="tired">😴 Tired</option>
                  <option value="stressed">😰 Stressed</option>
                  <option value="neutral">😐 Neutral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Current Energy Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Low</span>
                  <span className="text-amber-400 font-semibold">{energyLevel}/10</span>
                  <span>High</span>
                </div>
              </div>

              <button
                onClick={handleStartExecution}
                className="w-full btn-rpg flex items-center justify-center gap-2"
              >
                <Play size={20} />
                Start Activity
              </button>
            </div>
          )}

          {/* Execution Timer */}
          {isExecuting && timeRemaining > 0 && (
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-amber-400">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-slate-300">
                Stay focused! You're doing great.
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="quest-progress h-3 rounded-full transition-all duration-1000"
                  style={{
                    width: `${((card.duration * 60 - timeRemaining) / (card.duration * 60)) * 100}%`
                  }}
                />
              </div>
              <button
                onClick={() => setTimeRemaining(0)}
                className="text-amber-400 hover:text-amber-300 text-sm underline"
              >
                Skip timer (if completed early)
              </button>
            </div>
          )}

          {/* Completion Form */}
          {isExecuting && timeRemaining === 0 && (
            <div className="space-y-4">
              <div className="text-center text-emerald-400 mb-4">
                <CheckCircle size={48} className="mx-auto mb-2" />
                <h3 className="text-xl font-bold">Time's Up!</h3>
                <p className="text-slate-300">How did it go?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  How well did you complete this activity?
                </label>
                <select
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="">Select...</option>
                  <option value="excellent">🌟 Excellent - Exceeded expectations</option>
                  <option value="good">✅ Good - Completed successfully</option>
                  <option value="average">👍 Average - Did okay</option>
                  <option value="poor">👎 Poor - Struggled to complete</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  How are you feeling after completing this?
                </label>
                <select
                  value={emotionAfter}
                  onChange={(e) => setEmotionAfter(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="">Select...</option>
                  <option value="accomplished">🏆 Accomplished</option>
                  <option value="energized">⚡ Energized</option>
                  <option value="satisfied">😊 Satisfied</option>
                  <option value="proud">😤 Proud</option>
                  <option value="relieved">😅 Relieved</option>
                  <option value="tired">😴 Tired</option>
                  <option value="frustrated">😤 Frustrated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Additional notes (optional)
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 h-20 resize-none"
                  placeholder="Any insights, challenges, or wins to note?"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsExecuting(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-slate-200 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteExecution}
                  disabled={!feedback || !emotionAfter}
                  className="flex-1 btn-rpg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete & Earn Rewards
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}