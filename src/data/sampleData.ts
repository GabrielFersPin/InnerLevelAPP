import { Card } from '../types';

export const getDailyRecommendations = (): Card[] => {
    return [
        {
            id: 'rec-1',
            name: 'Morning Meditation',
            description: 'Start your day with clarity and focus.',
            type: 'recovery',
            rarity: 'common',
            classTypes: ['sage'],
            energyCost: 10,
            duration: 0.5,
            impact: 15,
            skillBonus: [{ skillName: 'Mindfulness', xpBonus: 10 }],
            requirements: {},
            conditions: {},
            tags: ['meditation', 'morning'],
            createdAt: new Date(),
            forged: true,
            usageCount: 0,
            isOnCooldown: false
        },
        {
            id: 'rec-2',
            name: 'Power Workout',
            description: 'High intensity interval training.',
            type: 'action',
            rarity: 'uncommon',
            classTypes: ['warrior'],
            energyCost: 30,
            duration: 1,
            impact: 40,
            skillBonus: [{ skillName: 'Strength', xpBonus: 25 }],
            requirements: {},
            conditions: {},
            tags: ['fitness', 'strength'],
            createdAt: new Date(),
            forged: true,
            usageCount: 0,
            isOnCooldown: false
        }
    ];
};
