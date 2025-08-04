import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppData, Task, Habit, Todo, Reward, RedeemedReward, EmotionalLog, Goal, Card, Quest, CardResult, Character, CharacterClass, PersonalityTestResult, GuildData, Guild, Friend, FriendRequest, PrivacySettings, NotificationSettings } from '../types/index';
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
  | { type: 'UPDATE_CARD'; payload: Card }
  // Guild Actions
  | { type: 'JOIN_GUILD'; payload: Guild }
  | { type: 'LEAVE_GUILD' }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'REMOVE_FRIEND'; payload: number }
  | { type: 'ADD_FRIEND_REQUEST'; payload: FriendRequest }
  | { type: 'ACCEPT_FRIEND_REQUEST'; payload: number }
  | { type: 'DECLINE_FRIEND_REQUEST'; payload: number }
  | { type: 'UPDATE_PRIVACY_SETTINGS'; payload: Partial<PrivacySettings> }
  | { type: 'UPDATE_NOTIFICATION_SETTINGS'; payload: Partial<NotificationSettings> };

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
  },
  // Guild System initial state
  guild: {
    currentGuild: null,
    friends: [],
    friendRequests: [],
    privacy: {
      profileVisibility: 'friends',
      showStreak: true,
      showLevel: true,
      showGoals: 'friends',
      showAchievements: true,
      allowFriendRequests: true,
      allowGuildInvites: true
    },
    notifications: {
      friendRequests: true,
      guildInvites: true,
      goalReminders: true,
      achievementUnlocks: true,
      weeklyReport: true,
      friendActivity: false
    }
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
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
    // NUEVAS ACCIONES PARA GOALS
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
          inventory: [...state.cards.inventory, action.payload]
        }
      };
    
    case 'EXECUTE_CARD': {
      const { cardId, result } = action.payload;
      const executedCard = state.cards.inventory.find(c => c.id === cardId);
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
          inventory: state.cards.inventory.map(card =>
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
          inventory: state.cards.inventory.map(card =>
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
          activeCards: [...state.cards.activeCards, action.payload]
        }
      };
    
    case 'DEACTIVATE_CARD':
      return {
        ...state,
        cards: {
          ...state.cards,
          activeCards: state.cards.activeCards.filter(id => id !== action.payload)
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
          inventory: state.cards.inventory.map(card =>
            card.id === action.payload.id ? { ...card, ...action.payload } : card
          )
        }
      };
    
    // Guild Reducers
    case 'JOIN_GUILD':
      return {
        ...state,
        guild: {
          ...state.guild,
          currentGuild: action.payload
        }
      };
    
    case 'LEAVE_GUILD':
      return {
        ...state,
        guild: {
          ...state.guild,
          currentGuild: null
        }
      };
    
    case 'ADD_FRIEND':
      return {
        ...state,
        guild: {
          ...state.guild,
          friends: [...state.guild.friends, action.payload]
        }
      };
    
    case 'REMOVE_FRIEND':
      return {
        ...state,
        guild: {
          ...state.guild,
          friends: state.guild.friends.filter(friend => friend.id !== action.payload)
        }
      };
    
    case 'ADD_FRIEND_REQUEST':
      return {
        ...state,
        guild: {
          ...state.guild,
          friendRequests: [...state.guild.friendRequests, action.payload]
        }
      };
    
    case 'ACCEPT_FRIEND_REQUEST': {
      const request = state.guild.friendRequests.find(req => req.id === action.payload);
      if (!request) return state;
      
      const newFriend: Friend = {
        id: request.from.id,
        name: request.from.name,
        class: request.from.class,
        level: request.from.level,
        status: 'offline',
        streak: 0
      };
      
      return {
        ...state,
        guild: {
          ...state.guild,
          friends: [...state.guild.friends, newFriend],
          friendRequests: state.guild.friendRequests.filter(req => req.id !== action.payload)
        }
      };
    }
    
    case 'DECLINE_FRIEND_REQUEST':
      return {
        ...state,
        guild: {
          ...state.guild,
          friendRequests: state.guild.friendRequests.filter(req => req.id !== action.payload)
        }
      };
    
    case 'UPDATE_PRIVACY_SETTINGS':
      return {
        ...state,
        guild: {
          ...state.guild,
          privacy: { ...state.guild.privacy, ...action.payload }
        }
      };
    
    case 'UPDATE_NOTIFICATION_SETTINGS':
      return {
        ...state,
        guild: {
          ...state.guild,
          notifications: { ...state.guild.notifications, ...action.payload }
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const generateId = () => Date.now() + Math.random();

  // Load data from localStorage on mount - temporarily disabled
  useEffect(() => {
    try {
      const savedData = {
        tasks: JSON.parse(localStorage.getItem('innerlevel_tasks') || '[]'),
        habits: JSON.parse(localStorage.getItem('innerlevel_habits') || 'null'),
        todos: JSON.parse(localStorage.getItem('innerlevel_todos') || '[]'),
        rewards: JSON.parse(localStorage.getItem('innerlevel_rewards') || 'null'),
        redeemedRewards: JSON.parse(localStorage.getItem('innerlevel_redeemed') || '[]'),
        emotionalLogs: JSON.parse(localStorage.getItem('innerlevel_emotional') || '[]'),
        goals: JSON.parse(localStorage.getItem('innerlevel_goals') || '[]'),
        // LifeQuest Character data
        character: JSON.parse(localStorage.getItem('innerlevel_character') || 'null'),
        // LifeQuest Cards data
        cards: JSON.parse(localStorage.getItem('innerlevel_cards') || 'null'),
        quests: JSON.parse(localStorage.getItem('innerlevel_quests') || 'null'),
        energy: JSON.parse(localStorage.getItem('innerlevel_energy') || 'null'),
        recommendations: JSON.parse(localStorage.getItem('innerlevel_recommendations') || 'null'),
        // Guild System data
        guild: JSON.parse(localStorage.getItem('innerlevel_guild') || 'null')
      };

      // Only load if we have existing data, otherwise keep initial state
      if (savedData.tasks.length > 0 || savedData.todos.length > 0 || savedData.redeemedRewards.length > 0 || savedData.goals.length > 0 || savedData.cards || savedData.character || savedData.guild) {
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            ...savedData,
            habits: savedData.habits || initialState.habits,
            rewards: savedData.rewards || initialState.rewards,
            character: savedData.character || initialState.character,
            cards: savedData.cards || initialState.cards,
            quests: savedData.quests || initialState.quests,
            energy: savedData.energy || initialState.energy,
            recommendations: savedData.recommendations || initialState.recommendations,
            guild: savedData.guild || initialState.guild
          }
        });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Clear corrupted data
      localStorage.clear();
    }
  }, []);

  // Save data to localStorage whenever state changes - temporarily disabled
  useEffect(() => {
    try {
      localStorage.setItem('innerlevel_tasks', JSON.stringify(state.tasks));
      localStorage.setItem('innerlevel_habits', JSON.stringify(state.habits));
      localStorage.setItem('innerlevel_todos', JSON.stringify(state.todos));
      localStorage.setItem('innerlevel_rewards', JSON.stringify(state.rewards));
      localStorage.setItem('innerlevel_redeemed', JSON.stringify(state.redeemedRewards));
      localStorage.setItem('innerlevel_emotional', JSON.stringify(state.emotionalLogs));
      localStorage.setItem('innerlevel_goals', JSON.stringify(state.goals));
      // LifeQuest Character localStorage
      localStorage.setItem('innerlevel_character', JSON.stringify(state.character));
      // LifeQuest Cards localStorage
      localStorage.setItem('innerlevel_cards', JSON.stringify(state.cards));
      localStorage.setItem('innerlevel_quests', JSON.stringify(state.quests));
      localStorage.setItem('innerlevel_energy', JSON.stringify(state.energy));
      localStorage.setItem('innerlevel_recommendations', JSON.stringify(state.recommendations));
      // Guild System localStorage
      localStorage.setItem('innerlevel_guild', JSON.stringify(state.guild));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state]);

  // Update energy from time passage every minute - temporarily disabled
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch({ type: 'UPDATE_ENERGY_FROM_TIME' });
  //   }, 60000); // Update every minute

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, generateId }}>
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