import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AppData, Task, Habit, Todo, Reward, RedeemedReward, EmotionalLog, Goal, Card, Quest, CardResult, Character, CharacterClass, PersonalityTestResult } from '../types/index';
import { createNewCharacter } from '../data/characterClasses';

interface AppState extends AppData {}

type AppAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: number }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'COMPLETE_TODO'; payload: { todoId: number; task: Task } }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'ADD_REWARD'; payload: Reward }
  | { type: 'REDEEM_REWARD'; payload: { rewardId: number; redeemedReward: RedeemedReward } }
  | { type: 'ADD_EMOTIONAL_LOG'; payload: EmotionalLog }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: { goalId: number; updates: Partial<Goal> } }
  | { type: 'DELETE_GOAL'; payload: number }
  // Character Actions
  | { type: 'CREATE_CHARACTER'; payload: { name: string; characterClass: CharacterClass; personalityResult?: PersonalityTestResult } }
  | { type: 'LOAD_CHARACTER'; payload: Character }
  | { type: 'UPDATE_CHARACTER'; payload: Partial<Character> }
  | { type: 'GAIN_EXPERIENCE'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'UPDATE_SKILL'; payload: { skillName: string; xp: number } }
  | { type: 'COMPLETE_ONBOARDING' }
  // LifeQuest Cards Actions
  | { type: 'ADD_CARD'; payload: Card }
  | { type: 'EXECUTE_CARD'; payload: { cardId: string; result: CardResult } }
  | { type: 'UPDATE_CARD_COOLDOWN'; payload: { cardId: string; cooldownUntil: Date } }
  | { type: 'ACTIVATE_CARD'; payload: string }
  | { type: 'DEACTIVATE_CARD'; payload: string }
  | { type: 'CREATE_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST_PROGRESS'; payload: { questId: string; progress: number } }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'UPDATE_ENERGY'; payload: { current?: number; maximum?: number; regenerationRate?: number } }
  | { type: 'CONSUME_ENERGY'; payload: number }
  | { type: 'GENERATE_RECOMMENDATIONS'; payload: Card[] }
  | { type: 'UPDATE_ENERGY_FROM_TIME' }
  | { type: 'LOAD_DATA'; payload: AppData }
  | { type: 'UPDATE_CARD'; payload: Card };

const initialState: AppState = {
  tasks: [],
  habits: [
    {id: 1, name: "Daily Coding", category: "Professional", points: 5},
    {id: 2, name: "LinkedIn Post", category: "Professional", points: 10},
    {id: 3, name: "Job Application", category: "Professional", points: 15},
    {id: 4, name: "Exercise", category: "Personal", points: 5},
    {id: 5, name: "Reading", category: "Personal", points: 3},
    {id: 6, name: "Slept well 7 hours", category: "Self-Care", points: 10},
    {id: 7, name: "Screen-free break (20 min)", category: "Self-Care", points: 5},
    {id: 8, name: "Wrote how I felt today", category: "Self-Care", points: 15},
    {id: 9, name: "Guilt-free rest", category: "Self-Care", points: 20},    
    {id: 10, name: "Meditation", category: "Self-Care", points: 10}
  ],
  todos: [],
  rewards: [
    {id: 1, name: "Coffee Shop Visit", description: "Treat yourself to a nice coffee", points: 50, category: "Small Treat", redeemed: false},
    {id: 2, name: "Movie Night", description: "Watch that movie you've been wanting to see", points: 100, category: "Entertainment", redeemed: false},
    {id: 3, name: "New Book", description: "Buy that book from your wishlist", points: 200, category: "Learning", redeemed: false}
  ],
  redeemedRewards: [],
  emotionalLogs: [],
  goals: [],
  // LifeQuest RPG Character System  
  character: createNewCharacter("Player", "strategist"), // Default character
  // LifeQuest Cards initial state
  cards: {
    inventory: [],
    activeCards: [],
    cooldowns: {}
  },
  quests: {
    active: [],
    completed: []
  },
  energy: {
    current: 100,
    maximum: 100,
    regenerationRate: 4.17, // ~100 energy per day (24 hours)
    lastUpdate: new Date(),
    dailyUsage: []
  },
  recommendations: {
    daily: [],
    lastGenerated: new Date()
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_DATA':
      // ✅ ARREGLO: Asegurar que todos los arrays existan
      const loadedData = {
        ...action.payload,
        cards: {
          inventory: Array.isArray(action.payload.cards?.inventory) ? action.payload.cards.inventory : [],
          activeCards: Array.isArray(action.payload.cards?.activeCards) ? action.payload.cards.activeCards : [],
          cooldowns: action.payload.cards?.cooldowns || {}
        },
        quests: {
          active: Array.isArray(action.payload.quests?.active) ? action.payload.quests.active : [],
          completed: Array.isArray(action.payload.quests?.completed) ? action.payload.quests.completed : []
        }
      };
      return loadedData;
      
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
      
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
      
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
      
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
      
    case 'COMPLETE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.todoId 
            ? { ...todo, status: 'Completed' as const }
            : todo
        ),
        tasks: [...state.tasks, action.payload.task]
      };
      
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };
      
    case 'ADD_REWARD':
      return { ...state, rewards: [...state.rewards, action.payload] };
      
    case 'REDEEM_REWARD':
      return {
        ...state,
        rewards: state.rewards.map(reward => 
          reward.id === action.payload.rewardId 
            ? { ...reward, redeemed: true }
            : reward
        ),
        redeemedRewards: [...state.redeemedRewards, action.payload.redeemedReward]
      };
      
    case 'ADD_EMOTIONAL_LOG':
      return { ...state, emotionalLogs: [...state.emotionalLogs, action.payload] };
      
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
      
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.goalId
            ? { ...goal, ...action.payload.updates }
            : goal
        )
      };
      
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    
    // Character Reducers
    case 'CREATE_CHARACTER':
      return {
        ...state,
        character: createNewCharacter(
          action.payload.name, 
          action.payload.characterClass, 
          action.payload.personalityResult
        )
      };
    
    case 'LOAD_CHARACTER':
      return {
        ...state,
        character: action.payload
      };
    
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        character: { ...state.character, ...action.payload }
      };
    
    case 'GAIN_EXPERIENCE': {
      const newExp = state.character.experience + action.payload;
      const currentLevel = state.character.level;
      const newLevel = Math.min(50, Math.floor(Math.sqrt(newExp / 100)) + 1);
      
      return {
        ...state,
        character: {
          ...state.character,
          experience: newExp,
          level: newLevel,
          skillPoints: state.character.skillPoints + (newLevel > currentLevel ? newLevel - currentLevel : 0)
        }
      };
    }
    
    case 'UPDATE_SKILL': {
      const { skillName, xp } = action.payload;
      const currentSkill = state.character.skills[skillName];
      const newXP = currentSkill.totalXP + xp;
      const newLevel = Math.min(50, Math.floor(newXP / 100) + 1);
      
      return {
        ...state,
        character: {
          ...state.character,
          skills: {
            ...state.character.skills,
            [skillName]: {
              level: newLevel,
              experience: newXP % 100,
              totalXP: newXP
            }
          }
        }
      };
    }
    
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        character: { ...state.character, isOnboarded: true }
      };
    
    // LifeQuest Cards Reducers
    case 'ADD_CARD':
      return {
        ...state,
        cards: {
          ...state.cards,
          inventory: [
            ...(state.cards?.inventory || []), // ✅ ARREGLO: usar fallback si inventory no existe
            action.payload
          ]
        }
      };
    
    case 'EXECUTE_CARD': {
      const { cardId, result } = action.payload;
      const inventory = Array.isArray(state.cards?.inventory) ? state.cards.inventory : [];
      const executedCard = inventory.find(c => c.id === cardId);
      
      // Add XP/points to character
      const newExp = state.character.experience + (result.progressGained || 0);
      const currentLevel = state.character.level;
      const newLevel = Math.min(50, Math.floor(Math.sqrt(newExp / 100)) + 1);

      return {
        ...state,
        character: {
          ...state.character,
          experience: newExp,
          level: newLevel,
          skillPoints: state.character.skillPoints + (newLevel > currentLevel ? newLevel - currentLevel : 0)
        },
        cards: {
          ...state.cards,
          inventory: inventory.map(card =>
            card.id === cardId 
              ? { 
                  ...card, 
                  usageCount: card.usageCount + 1,
                  lastUsed: new Date(),
                  isOnCooldown: card.cooldown ? true : false
                }
              : card
          ),
          cooldowns: executedCard?.cooldown 
            ? { 
                ...state.cards.cooldowns, 
                [cardId]: new Date(Date.now() + executedCard.cooldown * 60 * 60 * 1000) 
              }
            : state.cards.cooldowns
        },
        energy: {
          ...state.energy,
          current: Math.max(0, state.energy.current - result.energyConsumed)
        }
      };
    }
    
    case 'UPDATE_CARD_COOLDOWN':
      return {
        ...state,
        cards: {
          ...state.cards,
          cooldowns: {
            ...state.cards.cooldowns,
            [action.payload.cardId]: action.payload.cooldownUntil
          },
          inventory: (Array.isArray(state.cards?.inventory) ? state.cards.inventory : []).map(card =>
            card.id === action.payload.cardId
              ? { ...card, isOnCooldown: action.payload.cooldownUntil > new Date() }
              : card
          )
        }
      };
    
    case 'ACTIVATE_CARD':
      return {
        ...state,
        cards: {
          ...state.cards,
          activeCards: [
            ...(Array.isArray(state.cards?.activeCards) ? state.cards.activeCards : []), 
            action.payload
          ]
        }
      };
    
    case 'DEACTIVATE_CARD':
      return {
        ...state,
        cards: {
          ...state.cards,
          activeCards: (Array.isArray(state.cards?.activeCards) ? state.cards.activeCards : [])
            .filter(id => id !== action.payload)
        }
      };
    
    case 'CREATE_QUEST':
      return {
        ...state,
        quests: {
          ...state.quests,
          active: [...state.quests.active, action.payload]
        }
      };
    
    case 'UPDATE_QUEST_PROGRESS':
      return {
        ...state,
        quests: {
          ...state.quests,
          active: state.quests.active.map(quest =>
            quest.id === action.payload.questId
              ? { ...quest, progress: Math.min(100, action.payload.progress) }
              : quest
          )
        }
      };
    
    case 'COMPLETE_QUEST': {
      const completedQuest = state.quests.active.find(q => q.id === action.payload);
      return {
        ...state,
        quests: {
          active: state.quests.active.filter(q => q.id !== action.payload),
          completed: completedQuest 
            ? [...state.quests.completed, { ...completedQuest, status: 'completed' as const }]
            : state.quests.completed
        }
      };
    }
    
    case 'UPDATE_ENERGY':
      return {
        ...state,
        energy: {
          ...state.energy,
          ...action.payload,
          lastUpdate: new Date()
        }
      };
    
    case 'CONSUME_ENERGY':
      return {
        ...state,
        energy: {
          ...state.energy,
          current: Math.max(0, state.energy.current - action.payload),
          lastUpdate: new Date()
        }
      };
    
    case 'GENERATE_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: {
          daily: action.payload,
          lastGenerated: new Date()
        }
      };
    
    case 'UPDATE_ENERGY_FROM_TIME': {
      const now = new Date();
      const timeDiff = (now.getTime() - state.energy.lastUpdate.getTime()) / (1000 * 60 * 60); // hours
      const energyGained = Math.min(
        state.energy.maximum - state.energy.current,
        timeDiff * state.energy.regenerationRate
      );
      return {
        ...state,
        energy: {
          ...state.energy,
          current: Math.min(state.energy.maximum, state.energy.current + energyGained),
          lastUpdate: now
        }
      };
    }
    
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: {
          ...state.cards,
          inventory: (Array.isArray(state.cards?.inventory) ? state.cards.inventory : []).map(card =>
            card.id === action.payload.id ? { ...card, ...action.payload } : card
          )
        }
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  generateId: () => number;
  user: User | null;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const generateId = () => Date.now() + Math.random();

  // Initialize auth and load user data
  useEffect(() => {
    async function initializeAuth() {
      try {
        console.log('🔄 Initializing auth...');
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ User found, loading data...');
          setUser(session.user);
          await loadUserData(session.user.id);
        } else {
          console.log('❌ No user session found');
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔄 Auth state change:', event);
            
            if (event === 'SIGNED_IN' && session?.user) {
              setUser(session.user);
              await loadUserData(session.user.id);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              dispatch({ type: 'LOAD_DATA', payload: initialState });
            }
          }
        );

        setIsInitialized(true);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  // Load user data from Supabase
  async function loadUserData(userId: string) {
    try {
      console.log('📥 Loading user data for:', userId);
      
      const { data: userData, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading user data:', error);
        throw error;
      }

      if (userData) {
        console.log('✅ User data loaded successfully');
        
        // Parse dates in energy object and ensure all fields exist
        const parsedData: AppState = {
          tasks: userData.tasks || [],
          habits: userData.habits || initialState.habits,
          todos: userData.todos || [],
          rewards: userData.rewards || initialState.rewards,
          redeemedRewards: userData.redeemed_rewards || [],
          emotionalLogs: userData.emotional_logs || [],
          goals: userData.goals || [],
          character: userData.character || initialState.character,
          cards: userData.cards || initialState.cards,
          quests: userData.quests || initialState.quests,
          energy: userData.energy ? {
            ...userData.energy,
            lastUpdate: new Date(userData.energy.lastUpdate || Date.now())
          } : initialState.energy,
          recommendations: userData.recommendations || initialState.recommendations
        };

        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } else {
        console.log('📝 Creating initial user data...');
        await createInitialUserData(userId);
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      // Fallback to initial state if loading fails
      dispatch({ type: 'LOAD_DATA', payload: initialState });
    }
  }

  // Create initial user data for new users
  async function createInitialUserData(userId: string) {
    try {
      const { error } = await supabase
        .from('user_data')
        .insert({
          user_id: userId,
          tasks: initialState.tasks,
          habits: initialState.habits,
          todos: initialState.todos,
          rewards: initialState.rewards,
          redeemed_rewards: initialState.redeemedRewards,
          emotional_logs: initialState.emotionalLogs,
          goals: initialState.goals,
          character: initialState.character,
          cards: initialState.cards,
          quests: initialState.quests,
          energy: initialState.energy,
          recommendations: initialState.recommendations,
          is_onboarded: false
        });

      if (error) throw error;
      
      console.log('✅ Initial user data created');
      dispatch({ type: 'LOAD_DATA', payload: initialState });
    } catch (error) {
      console.error('❌ Error creating initial user data:', error);
    }
  }

  // Save data to Supabase with debouncing
  useEffect(() => {
    // Don't save if not initialized, no user, or still loading
    if (!isInitialized || !user || loading) return;

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout for debounced save
    const newTimeout = setTimeout(async () => {
      try {
        console.log('💾 Saving user data...');
        
        const { error } = await supabase
          .from('user_data')
          .upsert({
            user_id: user.id,
            tasks: state.tasks,
            habits: state.habits,
            todos: state.todos,
            rewards: state.rewards,
            redeemed_rewards: state.redeemedRewards,
            emotional_logs: state.emotionalLogs,
            goals: state.goals,
            character: state.character,
            cards: state.cards,
            quests: state.quests,
            energy: state.energy,
            recommendations: state.recommendations,
            is_onboarded: state.character.isOnboarded
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('❌ Error saving user data:', error);
        } else {
          console.log('✅ User data saved successfully!');
        }
      } catch (error) {
        console.error('❌ Error saving to Supabase:', error);
      }
    }, 1000); // 1 second debounce

    setSaveTimeout(newTimeout);

    // Cleanup timeout on unmount
    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
  }, [state, user, loading, isInitialized]);

  return (
    <AppContext.Provider value={{ state, dispatch, generateId, user, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}