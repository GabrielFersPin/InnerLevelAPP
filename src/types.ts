export type PageType = 
  | 'character-hub'
  | 'card-deck'
  | 'ai-card-generator'
  | 'training-ground'
  | 'character-sheet'
  | 'guild-settings'
  | 'personality-test'
  | 'class-reveal'
  | 'log-activity'
  | 'habits'
  | 'goals'
  | 'rewards'
  | 'wellbeing'
  | 'analytics'
  | 'profile'
  | 'payment-success';

// Re-export from index for convenience
export type { CharacterClass } from './types/index';