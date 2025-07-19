import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CardExecutor } from './cards/CardExecutor';
import { CardComponent } from './cards/CardComponent';
import type { Card } from '../types/index';
import confetti from 'canvas-confetti';
import { Sparkles, Gift as GiftIcon, Star } from 'lucide-react';

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

  // Start session (execute all cards in Action Field)
  const handleStartSession = () => {
    if (actionField.length > 0) {
      setIsSessionActive(true);
      setSessionResults([]);
      setCurrentSessionIndex(0);
      setSelectedCard(actionField[0]);
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
    const nextIndex = currentSessionIndex + 1;
    if (nextIndex < actionField.length) {
      setCurrentSessionIndex(nextIndex);
      setSelectedCard(actionField[nextIndex]);
      setIsExecutorOpen(true);
    } else {
      setIsSessionActive(false);
      setSelectedCard(null);
      setIsExecutorOpen(false);
      setCurrentSessionIndex(0);
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
      {/* Card Execution (Session Mode) */}
      {isSessionActive && selectedCard && (
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
          <div className="mb-4 text-amber-200 italic">“Every session makes you stronger!”</div>
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