import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppData, Task, Habit, Todo, Reward, RedeemedReward, EmotionalLog, Goal } from '../types';

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
  | { type: 'ADD_GOAL'; payload: Goal } // NUEVO
  | { type: 'UPDATE_GOAL'; payload: { goalId: number; updates: Partial<Goal> } } // NUEVO
  | { type: 'DELETE_GOAL'; payload: number } // NUEVO
  | { type: 'LOAD_DATA'; payload: AppData };

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
  goals: [] // NUEVO
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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = {
      tasks: JSON.parse(localStorage.getItem('innerlevel_tasks') || '[]'),
      habits: JSON.parse(localStorage.getItem('innerlevel_habits') || 'null'),
      todos: JSON.parse(localStorage.getItem('innerlevel_todos') || '[]'),
      rewards: JSON.parse(localStorage.getItem('innerlevel_rewards') || 'null'),
      redeemedRewards: JSON.parse(localStorage.getItem('innerlevel_redeemed') || '[]'),
      emotionalLogs: JSON.parse(localStorage.getItem('innerlevel_emotional') || '[]'),
      goals: JSON.parse(localStorage.getItem('innerlevel_goals') || '[]') // NUEVO
    };

    // Only load if we have existing data, otherwise keep initial state
    if (savedData.tasks.length > 0 || savedData.todos.length > 0 || savedData.redeemedRewards.length > 0 || savedData.goals.length > 0) {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          ...savedData,
          habits: savedData.habits || initialState.habits,
          rewards: savedData.rewards || initialState.rewards
        }
      });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('innerlevel_tasks', JSON.stringify(state.tasks));
    localStorage.setItem('innerlevel_habits', JSON.stringify(state.habits));
    localStorage.setItem('innerlevel_todos', JSON.stringify(state.todos));
    localStorage.setItem('innerlevel_rewards', JSON.stringify(state.rewards));
    localStorage.setItem('innerlevel_redeemed', JSON.stringify(state.redeemedRewards));
    localStorage.setItem('innerlevel_emotional', JSON.stringify(state.emotionalLogs));
    localStorage.setItem('innerlevel_goals', JSON.stringify(state.goals)); // NUEVO
  }, [state]);

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