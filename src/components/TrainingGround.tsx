import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { CardExecutor } from './cards/CardExecutor';
import { CardComponent } from './cards/CardComponent';
import type { Card } from '../types/index';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Gift as GiftIcon,
  Star,
  Play,
  Pause,
  CheckCircle,
  Timer,
  RotateCcw,
  Swords,
  Brain,
  Square
} from 'lucide-react';

// Import Pixel Art Assets
import techSword from '../assets/tech_sword.jpg';
import techOrb from '../assets/tech_orb.png';
import techLantern from '../assets/tech_lantern.png';

interface PomodoroState {
  isActive: boolean;
  isPaused: boolean;
  timeLeft: number;
  totalTime: number;
  mode: 'work' | 'break';
  cycleCount: number;
}

export function TrainingGround() {
  const { state, dispatch } = useAppContext();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isExecutorOpen, setIsExecutorOpen] = useState(false);
  const [planningZone, setPlanningZone] = useState<Card[]>([]);
  const [actionField, setActionField] = useState<Card[]>([]);
  const [supportZone, setSupportZone] = useState<Card[]>([]);
  const [discardZone, setDiscardZone] = useState<Card[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionResults, setSessionResults] = useState<any[]>([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [draggedCard, setDraggedCard] = useState<{ card: Card, from: string } | null>(null);

  // Session execution mode
  const [executionMode, setExecutionMode] = useState<'pomodoro' | 'manual' | null>(null);
  const [showModeSelection, setShowModeSelection] = useState(false);

  // Pomodoro timer state
  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    isActive: false,
    isPaused: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    totalTime: 25 * 60,
    mode: 'work',
    cycleCount: 0
  });

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (pomodoro.isActive && !pomodoro.isPaused && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (pomodoro.timeLeft === 0) {
      // Timer finished
      handlePomodoroComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoro.isActive, pomodoro.isPaused, pomodoro.timeLeft]);

  // Handle Pomodoro timer completion
  const handlePomodoroComplete = () => {
    setPomodoro(prev => ({
      ...prev,
      isActive: false,
      isPaused: false
    }));

    // Show completion notification
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#047857']
    });

    // Auto-complete current card
    if (selectedCard) {
      const result = {
        message: `Completed "${selectedCard.name}" using Pomodoro technique!`,
        progressGained: selectedCard.impact,
        energyConsumed: selectedCard.energyCost,
        effects: [`+${selectedCard.impact} XP`, ...selectedCard.skillBonus.map(b => `+${b.xpBonus} ${b.skillName}`)],
        completionMethod: 'pomodoro'
      };
      handleSessionCardExecute(result);
    }
  };

  // Pomodoro controls
  const startPomodoro = () => {
    setPomodoro(prev => ({ ...prev, isActive: true, isPaused: false }));
  };

  const pausePomodoro = () => {
    setPomodoro(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetPomodoro = () => {
    setPomodoro(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      timeLeft: prev.totalTime
    }));
  };

  const stopPomodoro = () => {
    setPomodoro(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      timeLeft: prev.totalTime
    }));
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for timer
  const getTimerProgress = () => {
    return ((pomodoro.totalTime - pomodoro.timeLeft) / pomodoro.totalTime) * 100;
  };

  // Inventory: cards not in any zone
  const inventoryCards = state.cards.inventory.filter(
    c => !c.isOnCooldown
      && !planningZone.find(z => z.id === c.id)
      && !actionField.find(z => z.id === c.id)
      && !supportZone.find(z => z.id === c.id)
      && !discardZone.find(z => z.id === c.id)
  );

  // Drag-and-drop handlers
  const handleDragStart = (card: Card, from: string) => (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedCard({ card, from });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropToZone = (zoneSetter: React.Dispatch<React.SetStateAction<Card[]>>, zone: Card[], _zoneName: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedCard && !zone.find(c => c.id === draggedCard.card.id)) {
      // Remove from previous zone
      removeCardFromZone(draggedCard.card, draggedCard.from);
      // Add to new zone
      zoneSetter([...zone, draggedCard.card]);
    }
    setDraggedCard(null);
  };

  const removeCardFromZone = (card: Card, from: string) => {
    switch (from) {
      case 'inventory': break; // nothing to remove
      case 'planning': setPlanningZone(z => z.filter(c => c.id !== card.id)); break;
      case 'action': setActionField(z => z.filter(c => c.id !== card.id)); break;
      case 'support': setSupportZone(z => z.filter(c => c.id !== card.id)); break;
      case 'discard': setDiscardZone(z => z.filter(c => c.id !== card.id)); break;
    }
  };

  // Start session (show mode selection)
  const handleStartSession = () => {
    if (actionField.length > 0) {
      setShowModeSelection(true);
    }
  };

  // Start session with selected mode
  const startSessionWithMode = (mode: 'pomodoro' | 'manual') => {
    setExecutionMode(mode);
    setIsSessionActive(true);
    setSessionResults([]);
    setCurrentSessionIndex(0);
    setSelectedCard(actionField[0]);
    setShowModeSelection(false);

    if (mode === 'pomodoro') {
      // Reset and prepare pomodoro timer
      setPomodoro(prev => ({
        ...prev,
        timeLeft: 25 * 60,
        totalTime: 25 * 60,
        isActive: false,
        isPaused: false
      }));
    } else {
      setIsExecutorOpen(true);
    }
  };

  // Handle card execution in session
  const handleSessionCardExecute = (result: any) => {
    const currentCard = actionField[currentSessionIndex];

    // Dispatch to global state to sync progress
    if (currentCard) {
      dispatch({
        type: 'EXECUTE_CARD',
        payload: {
          cardId: currentCard.id,
          result: result
        }
      });
    }

    setSessionResults(results => [...results, result]);
    // Move card to discard
    setDiscardZone(z => [...z, actionField[currentSessionIndex]]);
    // Remove from action field
    setActionField(z => z.filter((_, i) => i !== currentSessionIndex));

    const newActionField = actionField.filter((_, i) => i !== currentSessionIndex);
    const nextIndex = currentSessionIndex;

    if (nextIndex < newActionField.length) {
      setSelectedCard(newActionField[nextIndex]);
      if (executionMode === 'manual') {
        setIsExecutorOpen(true);
      } else if (executionMode === 'pomodoro') {
        // Reset timer for next card
        setPomodoro(prev => ({
          ...prev,
          timeLeft: 25 * 60,
          isActive: false,
          isPaused: false
        }));
      }
    } else {
      // Session complete
      setIsSessionActive(false);
      setSelectedCard(null);
      setIsExecutorOpen(false);
      setCurrentSessionIndex(0);
      setExecutionMode(null);
      stopPomodoro();
    }
  };

  // Manual completion for current card
  const handleManualComplete = () => {
    if (selectedCard) {
      const result = {
        message: `Manually completed "${selectedCard.name}"!`,
        progressGained: selectedCard.impact,
        energyConsumed: selectedCard.energyCost,
        effects: [`+${selectedCard.impact} XP`, ...selectedCard.skillBonus.map(b => `+${b.xpBonus} ${b.skillName}`)],
        completionMethod: 'manual'
      };
      handleSessionCardExecute(result);
    }
  };

  // Session summary
  const totalEnergy = actionField.reduce((sum, c) => sum + c.energyCost, 0);
  const totalXP = actionField.reduce((sum, c) => sum + c.impact, 0);
  const allSkills = Array.from(new Set(actionField.flatMap(c => c.skillBonus.map(b => b.skillName))));
  // Random bonus state
  const [bonusMsg, setBonusMsg] = useState<string | null>(null);

  // Epic session confetti and bonus
  const handleEpicSessionComplete = () => {
    // Confetti burst
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#fbbf24', '#a78bfa', '#f472b6', '#f59e42', '#fef08a', '#818cf8', '#f472b6', '#facc15'],
      shapes: ['star', 'circle'],
      scalar: 1.5,
    });
    // Random bonus
    const roll = Math.random();
    if (roll < 0.33) {
      const xp = Math.floor(Math.random() * 50) + 20;
      setBonusMsg(`Bonus: +${xp} XP! ✨`);
    } else if (roll < 0.66) {
      setBonusMsg('Bonus: Mystery Chest! 🎁');
    } else {
      setBonusMsg('Bonus: Legendary Star! 🌟');
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 text-gold-200 font-cinzel text-glow-sm flex items-center gap-3">
        <Swords className="w-8 h-8 text-tech-cyan" />
        Training Ground
        <Swords className="w-8 h-8 text-tech-cyan transform scale-x-[-1]" />
      </h2>

      {/* Mode Selection Modal */}
      {showModeSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border-2 border-amber-400 rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-amber-200 mb-6 text-center">Choose Your Session Mode</h3>

            <div className="space-y-4">
              <button
                onClick={() => startSessionWithMode('pomodoro')}
                className="w-full p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-4"
              >
                <Timer className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-xl font-bold">Pomodoro Mode</div>
                  <div className="text-sm opacity-90">25-minute focused sessions with automatic completion</div>
                </div>
              </button>

              <button
                onClick={() => startSessionWithMode('manual')}
                className="w-full p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-4"
              >
                <CheckCircle className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-xl font-bold">Manual Mode</div>
                  <div className="text-sm opacity-90">Complete tasks at your own pace</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowModeSelection(false)}
              className="w-full mt-4 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Inventory */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-tech-cyan mb-3 font-cinzel flex items-center gap-2">
          <img src={techOrb} alt="Orb" className="w-6 h-6 pixelated" />
          Card Inventory
        </h3>
        <div
          className="flex flex-wrap gap-3 min-h-[80px] p-4 border border-tech-cyan/30 rounded-xl bg-void-950/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)]"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropToZone(() => { }, inventoryCards, 'inventory')}
        >
          {inventoryCards.map(card => (
            <CardComponent
              key={card.id}
              card={card}
              size="minimal"
              draggable
              onDragStart={handleDragStart(card, 'inventory')}
            />
          ))}
        </div>
      </div>

      {/* Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Planning Zone */}
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-bold text-tech-magenta mb-3 font-cinzel flex items-center gap-2">
            <Brain className="w-6 h-6 text-tech-magenta" />
            Planning Zone
          </h3>
          <div
            className="flex-1 min-h-[120px] p-4 border-2 border-tech-magenta/30 rounded-xl bg-void-950/40 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,255,0.1)] flex flex-wrap gap-3 content-start transition-all hover:border-tech-magenta/50"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToZone(setPlanningZone, planningZone, 'planning')}
          >
            {planningZone.length === 0 && <div className="text-slate-400 italic font-inter text-sm w-full text-center mt-4">Drag cards here to plan your moves.</div>}
            {planningZone.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                size="minimal"
                draggable
                onDragStart={handleDragStart(card, 'planning')}
              />
            ))}
          </div>
        </div>

        {/* Action Field */}
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-bold text-tech-gold mb-3 font-cinzel flex items-center gap-2">
            <img src={techSword} alt="Sword" className="w-6 h-6 rounded-full border border-tech-gold" />
            Action Field
          </h3>
          <div
            className="flex-1 min-h-[120px] p-4 border-2 border-tech-gold rounded-xl bg-void-950/60 backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.15)] flex flex-wrap gap-3 content-start relative overflow-hidden group"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToZone(setActionField, actionField, 'action')}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-tech-gold/5 to-transparent pointer-events-none"></div>
            {actionField.length === 0 && <div className="text-slate-400 italic font-inter text-sm w-full text-center mt-4">Drag cards here to use them this turn.</div>}
            {actionField.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                size="minimal"
                draggable
                onDragStart={handleDragStart(card, 'action')}
              />
            ))}
          </div>

          {/* Session Summary and Start */}
          <div className="bg-void-950/80 border border-tech-gold/50 rounded-xl p-4 mt-4 flex flex-wrap gap-4 items-center justify-between shadow-lg backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-tech-gold font-bold font-cinzel text-xs uppercase tracking-wider">Energy</span>
              <span className="text-white font-bold font-inter text-lg">{totalEnergy}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-tech-gold font-bold font-cinzel text-xs uppercase tracking-wider">XP</span>
              <span className="text-white font-bold font-inter text-lg">{totalXP}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-tech-gold font-bold font-cinzel text-xs uppercase tracking-wider">Skills</span>
              <span className="text-white font-bold font-inter text-sm truncate max-w-[100px]">{allSkills.join(', ') || '-'}</span>
            </div>
          </div>

          <button
            onClick={handleStartSession}
            disabled={actionField.length === 0 || isSessionActive}
            className="mt-4 w-full px-8 py-3 bg-gradient-to-r from-tech-gold to-orange-500 text-void-950 font-bold rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed font-cinzel tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Session
          </button>
        </div>

        {/* Support Zone */}
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-bold text-tech-cyan mb-3 font-cinzel flex items-center gap-2">
            <img src={techLantern} alt="Lantern" className="w-6 h-6 pixelated" />
            Support Zone
          </h3>
          <div
            className="flex-1 min-h-[120px] p-4 border-2 border-tech-cyan/30 rounded-xl bg-void-950/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)] flex flex-wrap gap-3 content-start transition-all hover:border-tech-cyan/50"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToZone(setSupportZone, supportZone, 'support')}
          >
            {supportZone.length === 0 && <div className="text-slate-400 italic font-inter text-sm w-full text-center mt-4">Drag support cards here.</div>}
            {supportZone.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                size="minimal"
                draggable
                onDragStart={handleDragStart(card, 'support')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active Session Display */}
      {isSessionActive && selectedCard && (
        <div className="bg-void-950/80 border-2 border-tech-cyan rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-cyan to-transparent opacity-50"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-tech-cyan flex items-center gap-3 font-cinzel">
              <span className="animate-pulse-slow">●</span>
              Current Protocol: {selectedCard.name}
            </h3>
            <div className="text-tech-cyan/70 font-inter text-sm border border-tech-cyan/30 px-3 py-1 rounded-full">
              Sequence {currentSessionIndex + 1} / {actionField.length + currentSessionIndex + 1}
            </div>
          </div>

          <p className="text-slate-300 mb-6 font-inter text-lg leading-relaxed border-l-2 border-tech-cyan/30 pl-4">{selectedCard.description}</p>

          {executionMode === 'pomodoro' && (
            <div className="bg-void-900/50 rounded-xl p-8 border border-tech-cyan/20 relative">
              <div className="absolute top-4 right-4 text-tech-cyan/20">
                <Timer className="w-12 h-12" />
              </div>
              <h4 className="text-xl font-bold text-tech-cyan mb-6 flex items-center gap-2 font-cinzel">
                <Timer className="w-6 h-6" />
                Chronometer Active
              </h4>

              {/* Timer Display */}
              <div className="text-center mb-8 relative">
                <div className="text-7xl font-mono font-bold text-white mb-4 tracking-wider text-glow-sm">
                  {formatTime(pomodoro.timeLeft)}
                </div>
                <div className="w-full bg-void-800 rounded-full h-2 mb-4 overflow-hidden border border-void-700">
                  <div
                    className="bg-gradient-to-r from-tech-cyan to-blue-500 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                    style={{ width: `${getTimerProgress()}%` }}
                  ></div>
                </div>
                <div className="text-tech-cyan/80 font-cinzel uppercase tracking-widest text-sm">
                  {pomodoro.mode === 'work' ? 'Focus Cycle Initiated' : 'Recharge Cycle Active'}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4">
                {!pomodoro.isActive ? (
                  <button
                    onClick={startPomodoro}
                    className="flex items-center gap-2 px-8 py-3 bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/50 rounded-lg hover:bg-tech-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-cinzel tracking-wide"
                  >
                    <Play className="w-5 h-5" />
                    Initialize
                  </button>
                ) : (
                  <button
                    onClick={pausePomodoro}
                    className="flex items-center gap-2 px-8 py-3 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-lg hover:bg-amber-500/30 transition-all font-cinzel tracking-wide"
                  >
                    <Pause className="w-5 h-5" />
                    {pomodoro.isPaused ? 'Resume' : 'Suspend'}
                  </button>
                )}

                <button
                  onClick={resetPomodoro}
                  className="flex items-center gap-2 px-6 py-3 bg-void-800 text-slate-400 border border-slate-700 rounded-lg hover:bg-void-700 hover:text-white transition-all font-cinzel"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>

                <button
                  onClick={stopPomodoro}
                  className="flex items-center gap-2 px-6 py-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/40 transition-all font-cinzel"
                >
                  <Square className="w-5 h-5" />
                  Abort
                </button>
              </div>

              {/* Manual complete option for Pomodoro mode */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleManualComplete}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-tech-cyan transition-colors font-inter underline decoration-slate-700 hover:decoration-tech-cyan"
                >
                  Override Protocol (Mark Complete)
                </button>
              </div>
            </div>
          )}

          {executionMode === 'manual' && (
            <div className="text-center py-8">
              <button
                onClick={handleManualComplete}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-tech-cyan to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transform hover:-translate-y-1 font-cinzel text-lg"
              >
                <CheckCircle className="w-6 h-6" />
                Complete Protocol
              </button>
            </div>
          )}
        </div>
      )}

      {/* Discard/Graveyard */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-400 mb-2">Discard / Graveyard</h3>
        <div className="flex flex-wrap gap-3 min-h-[40px] p-2 border border-slate-600 rounded-lg bg-slate-800">
          {discardZone.length === 0 && <div className="text-slate-500 italic">Used cards will appear here.</div>}
          {discardZone.map(card => (
            <CardComponent
              key={card.id}
              card={card}
              size="minimal"
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* Card Execution (Manual Mode) */}
      {executionMode === 'manual' && selectedCard && (
        <CardExecutor
          card={selectedCard}
          isOpen={isExecutorOpen}
          onClose={() => setIsExecutorOpen(false)}
          onExecute={handleSessionCardExecute}
          currentEnergy={state.energy.current}
        />
      )}

      {/* Session Summary */}
      {!isSessionActive && sessionResults.length > 0 && (
        <div className="bg-void-950/90 border-2 border-tech-gold rounded-2xl p-8 mt-8 shadow-[0_0_50px_rgba(255,215,0,0.2)] text-center animate-fadeIn relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/src/assets/rpg_background.png')] opacity-20 bg-repeat"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-transparent to-void-950"></div>

          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-tech-gold mb-6 flex items-center justify-center gap-4 font-cinzel text-glow-sm">
              <img src={techOrb} alt="Orb" className="w-12 h-12 animate-spin-slow" />
              Session Complete
              <img src={techOrb} alt="Orb" className="w-12 h-12 animate-spin-slow" />
            </h3>

            <div className="mb-8 text-2xl text-white font-bold font-cinzel">
              <span className="text-tech-gold drop-shadow-md">+{sessionResults.reduce((sum, r) => sum + (r.progressGained || 0), 0)} XP</span>
              <span className="mx-4 text-slate-600">|</span>
              <span className="text-tech-cyan drop-shadow-md">{sessionResults.reduce((sum, r) => sum + (r.energyConsumed || 0), 0)} Energy</span>
            </div>

            <div className="mb-6 text-lg text-mythic-300 font-inter bg-void-900/50 inline-block px-6 py-2 rounded-full border border-mythic-500/30">
              Skills Advanced: <span className="font-bold text-mythic-100">{allSkills.join(', ') || 'None'}</span>
            </div>

            <div className="mb-8 text-slate-300 italic font-cinzel text-lg">"Your power grows with every challenge overcome."</div>

            {/* Show random bonus */}
            {bonusMsg && (
              <div className="mb-8 p-4 bg-gradient-to-r from-tech-gold/20 to-orange-500/20 border border-tech-gold/50 rounded-xl inline-block animate-pulse-slow">
                <div className="text-2xl font-bold text-tech-gold flex items-center justify-center gap-3 font-cinzel">
                  {bonusMsg.includes('Chest') ? <GiftIcon className="w-8 h-8 animate-bounce" /> : bonusMsg.includes('Star') ? <Star className="w-8 h-8 animate-spin-slow" /> : <Sparkles className="w-8 h-8 animate-bounce" />}
                  {bonusMsg}
                </div>
              </div>
            )}

            <div className="grid gap-2 mb-8 max-w-2xl mx-auto text-left">
              {sessionResults.map((result, i) => (
                <div key={i} className="bg-void-900/80 p-3 rounded-lg border border-void-700 flex justify-between items-center">
                  <span className="text-slate-200 font-inter">{result.message}</span>
                  <span className="text-xs text-tech-cyan font-mono">[{result.effects?.join(', ')}]</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSessionResults([]);
                setActionField(planningZone);
                setPlanningZone([]);
                setSupportZone([]);
                setDiscardZone([]);
                setBonusMsg(null);
                handleEpicSessionComplete();
              }}
              className="px-12 py-4 bg-gradient-to-r from-tech-gold to-orange-600 text-void-950 font-extrabold rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:from-yellow-400 hover:to-orange-500 animate-pulse text-xl flex items-center gap-3 mx-auto font-cinzel transform hover:-translate-y-1 transition-all"
            >
              <Sparkles className="w-6 h-6" /> Continue Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}