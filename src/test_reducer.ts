
import { appReducer, initialState } from './context/AppContext';
import { Card, CardResult } from './types';

// Mock card
const mockCard: Card = {
    id: 'test-card-1',
    name: 'Test Card',
    description: 'A test card',
    type: 'action',
    rarity: 'common',
    energyCost: 10,
    duration: 30,
    impact: 20,
    tags: ['test'],
    cooldown: 0,
    usageCount: 0,
    isOnCooldown: false
};

// Mock result
const mockResult: CardResult = {
    success: true,
    energyConsumed: 10,
    progressGained: 20,
    effects: ['Test effect'],
    message: 'Success'
};

// Initial state with the card in inventory
const stateWithCard = {
    ...initialState,
    cards: {
        ...initialState.cards,
        inventory: [mockCard]
    },
    character: {
        ...initialState.character,
        experience: 0,
        level: 1,
        completedCards: [],
        dailyProgress: {
            date: new Date().toISOString().split('T')[0],
            cardsCompleted: 0,
            energyUsed: 0,
            xpGained: 0,
            goalsAdvanced: [],
            mood: 'neutral',
            notes: ''
        }
    }
};

console.log('Initial State:', {
    xp: stateWithCard.character.experience,
    completedCards: stateWithCard.character.completedCards.length,
    dailyCards: stateWithCard.character.dailyProgress.cardsCompleted
});

// Execute action
const action = {
    type: 'EXECUTE_CARD',
    payload: {
        cardId: mockCard.id,
        result: mockResult
    }
};

const newState = appReducer(stateWithCard, action);

console.log('New State:', {
    xp: newState.character.experience,
    completedCards: newState.character.completedCards.length,
    dailyCards: newState.character.dailyProgress.cardsCompleted,
    energy: newState.energy.current
});

if (newState.character.experience === 20 &&
    newState.character.completedCards.length === 1 &&
    newState.character.dailyProgress.cardsCompleted === 1) {
    console.log('✅ Reducer test PASSED');
} else {
    console.error('❌ Reducer test FAILED');
}
