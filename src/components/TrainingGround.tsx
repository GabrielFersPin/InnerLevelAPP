import React, { useState, useEffect, useCallback } from 'react';
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
  Square, 
  Clock, 
  CheckCircle,
  Timer,
  RotateCcw
} from 'lucide-react';

interface PomodoroState {
  isActive: boolean;
  isPaused: boolean;
  timeLeft: number;
  totalTime: number;
  mode: 'work' | 'break';
  cycleCount: number;
}

export function TrainingGround() {
  const { state } = useAppContext();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isExecutorOpen, setIsExecutorOpen] = useState(false);
  const [planningZone, setPlanningZone] = useState<Card[]>([]);
  const [actionField, setActionField] = useState<Card[]>([]);
  const [supportZone, setSupportZone] = useState<Card[]>([]);
  const [discardZone, setDiscardZone] = useState<Card[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionResults, setSessionResults] = useState<any[]>([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [draggedCard, setDraggedCard] = useState<{card: Card, from: string} | null>(null);
  
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
        message: `Completed "${selectedCard.title}" using Pomodoro technique!`,
        progressGained: selectedCard.impact,
        energyConsumed: selectedCard.energyCost,
        effects: [`+${selectedCard.impact} XP`, ...selectedCard.skillBonus.map(b => `+${b.amount} ${b.skillName}`)],
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
    c => !planningZone.find(z => z.id === c.id)
      && !actionField.find(z => z.id === c.id)
      && !supportZone.find(z => z.id === c.id)
      && !discardZone.find(z => z.id === c.id)
  );

  // Drag-and-drop handlers
  const handleDragStart = (card: Card, from: string) => (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedCard({ card, from });
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDropToZone = (zoneSetter: React.Dispatch<React.SetStateAction<Card[]>>, zone: Card[], zoneName: string) => (e: React.DragEvent<HTMLDivElement>) => {
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
        message: `Manually completed "${selectedCard.title}"!`,
        progressGained: selectedCard.impact,
        energyConsumed: selectedCard.energyCost,
        effects: [`+${selectedCard.impact} XP`, ...selectedCard.skillBonus.map(b => `+${b.amount} ${b.skillName}`)],
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
      <h2 className="text-2xl font-bold mb-4 text-amber-200">Training Ground</h2>
      
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
      <div className="mb-6">
        <h3 className="text-lg font-bold text-amber-300 mb-2">Inventory</h3>
        <div
          className="flex flex-wrap gap-3 min-h-[60px] p-2 border border-slate-700 rounded-lg bg-slate-900"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropToZone(() => {}, inventoryCards, 'inventory')}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Planning Zone */}
        <div>
          <h3 className="text-lg font-bold text-blue-300 mb-2">Planning Zone</h3>
          <div
            className="min-h-[60px] p-2 border-2 border-blue-400 rounded-lg bg-blue-900/30 flex flex-wrap gap-3"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToZone(setPlanningZone, planningZone, 'planning')}
          >
            {planningZone.length === 0 && <div className="text-slate-400 italic">Drag cards here to plan your moves.</div>}
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
        <div>
          <h3 className="text-lg font-bold text-emerald-300 mb-2">Action Field</h3>
          <div
            className="min-h-[60px] p-2 border-2 border-emerald-400 rounded-lg bg-emerald-900/30 flex flex-wrap gap-3"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToZone(setActionField, actionField, 'action')}
          >
            {actionField.length === 0 && <div className="text-slate-400 italic">Drag cards here to use them this turn.</div>}
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
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 border-2 border-amber-400 rounded-xl p-4 mt-2 flex flex-wrap gap-6 items-center shadow-lg">
            <div><span className="text-amber-200 font-bold drop-shadow">Total Energy:</span> <span className="text-white font-semibold">{totalEnergy}</span></div>
            <div><span className="text-amber-200 font-bold drop-shadow">Total XP:</span> <span className="text-white font-semibold">{totalXP}</span></div>
            <div><span className="text-amber-200 font-bold drop-shadow">Skills:</span> <span className="text-white font-semibold">{allSkills.join(', ') || 'None'}</span></div>
          </div>

          <button
            onClick={handleStartSession}
            disabled={actionField.length === 0 || isSessionActive}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold rounded-2xl shadow-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Session
          </button>
        </div>

        {/* Support Zone */}
        <div>
          <h3 className="text-lg font-bold text-purple-300 mb-2">Support Zone</h3>
          <div
            className="min-h-[60px] p-2 border-2 border-purple-400 rounded-lg bg-purple-900/30 flex flex-wrap gap-3"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToZone(setSupportZone, supportZone, 'support')}
          >
            {supportZone.length === 0 && <div className="text-slate-400 italic">Drag support cards here for ongoing effects.</div>}
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
        <div className="bg-gradient-to-r from-slate-800 to-indigo-900 border-2 border-amber-400 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-amber-200">
              Current Task: {selectedCard.title}
            </h3>
            <div className="text-slate-300">
              Card {currentSessionIndex + 1} of {actionField.length + currentSessionIndex + 1}
            </div>
          </div>
          
          <p className="text-slate-300 mb-4">{selectedCard.description}</p>
          
          {executionMode === 'pomodoro' && (
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                <Timer className="w-6 h-6" />
                Pomodoro Timer
              </h4>
              
              {/* Timer Display */}
              <div className="text-center mb-6">
                <div className="text-6xl font-mono font-bold text-white mb-2">
                  {formatTime(pomodoro.timeLeft)}
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${getTimerProgress()}%` }}
                  ></div>
                </div>
                <div className="text-slate-400">
                  {pomodoro.mode === 'work' ? 'Focus Time' : 'Break Time'}
                </div>
              </div>
              
              {/* Timer Controls */}
              <div className="flex justify-center gap-4">
                {!pomodoro.isActive ? (
                  <button
                    onClick={startPomodoro}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pausePomodoro}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                    {pomodoro.isPaused ? 'Resume' : 'Pause'}
                  </button>
                )}
                
                <button
                  onClick={resetPomodoro}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
                
                <button
                  onClick={stopPomodoro}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Square className="w-5 h-5" />
                  Stop
                </button>
              </div>
              
              {/* Manual complete option for Pomodoro mode */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleManualComplete}
                  className="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
                >
                  Mark as Complete (Skip Timer)
                </button>
              </div>
            </div>
          )}
          
          {executionMode === 'manual' && (
            <div className="text-center">
              <button
                onClick={handleManualComplete}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all mx-auto"
              >
                <CheckCircle className="w-6 h-6" />
                Mark as Complete
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
        <div className="bg-gradient-to-br from-amber-900/90 via-emerald-900/80 to-indigo-900/90 border-4 border-amber-400 rounded-2xl p-8 mt-8 shadow-2xl text-center animate-fadeIn">
          <h3 className="text-3xl font-extrabold text-amber-300 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 animate-bounce" /> Victory! Session Complete <Sparkles className="w-8 h-8 animate-bounce" />
          </h3>
          <div className="mb-4 text-lg text-white font-bold">
            You earned <span className="text-amber-300">{sessionResults.reduce((sum, r) => sum + (r.progressGained || 0), 0)}</span> XP and used <span className="text-emerald-300">{sessionResults.reduce((sum, r) => sum + (r.energyConsumed || 0), 0)}</span> Energy!
          </div>
          <div className="mb-4 text-md text-indigo-200">
            Skills trained: <span className="font-semibold">{allSkills.join(', ') || 'None'}</span>
          </div>
          <div className="mb-4 text-amber-200 italic">"Every session makes you stronger!"</div>
          
          {/* Show completion methods */}
          <div className="mb-4 text-sm text-slate-300">
            Completion methods: {sessionResults.map(r => r.completionMethod).join(', ')}
          </div>
          
          {/* Show random bonus */}
          {bonusMsg && (
            <div className="mb-4 text-2xl font-bold text-amber-300 animate-pulse flex items-center justify-center gap-2">
              {bonusMsg.includes('Chest') ? <GiftIcon className="w-7 h-7 animate-bounce" /> : bonusMsg.includes('Star') ? <Star className="w-7 h-7 animate-spin-slow" /> : <Sparkles className="w-7 h-7 animate-bounce" />} {bonusMsg}
            </div>
          )}
          
          <ul className="mb-4 text-slate-200">
            {sessionResults.map((result, i) => (
              <li key={i} className="mb-2">{result.message} <span className="text-xs text-slate-400">({result.effects?.join(', ')})</span></li>
            ))}
          </ul>
          
          <div className="flex gap-8 text-lg text-emerald-200 font-bold justify-center mb-4">
            <div>Total Energy Used: {sessionResults.reduce((sum, r) => sum + (r.energyConsumed || 0), 0)}</div>
            <div>Total XP Gained: {sessionResults.reduce((sum, r) => sum + (r.progressGained || 0), 0)}</div>
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
            className="mt-6 px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-extrabold rounded-2xl shadow-lg hover:from-amber-600 hover:to-orange-600 animate-pulse text-xl flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6" /> Start Another Adventure!
          </button>
        </div>
      )}
    </div>
  );
}