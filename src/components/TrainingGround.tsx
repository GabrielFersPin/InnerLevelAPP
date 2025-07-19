import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CardExecutor } from './cards/CardExecutor';
import { CardComponent } from './cards/CardComponent';

export function TrainingGround() {
  const { state } = useAppContext();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isExecutorOpen, setIsExecutorOpen] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsExecutorOpen(true);
  };

  const handleExecute = () => {
    setIsExecutorOpen(false);
    setSelectedCard(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-amber-200">Training Ground</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {state.cards.inventory.map(card => (
          <div key={card.id} onClick={() => handleCardClick(card)} style={{ cursor: 'pointer' }}>
            <CardComponent card={card} size="small" />
          </div>
        ))}
      </div>
      {selectedCard && (
        <CardExecutor
          card={selectedCard}
          isOpen={isExecutorOpen}
          onClose={() => setIsExecutorOpen(false)}
          onExecute={handleExecute}
          currentEnergy={state.energy.current}
        />
      )}
    </div>
  );
} 