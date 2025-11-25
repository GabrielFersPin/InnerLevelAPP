import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { AppData } from '../types';

export function useUserData() {
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);

  // Load user data from database when user logs in
  useEffect(() => {
    if (user && !isLoadingRef.current) {
      loadUserData();
    }
  }, [user]);

  // Save user data to database whenever state changes (with debounce)
  useEffect(() => {
    if (user && !isLoadingRef.current) {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save - wait 1 second after last change
      saveTimeoutRef.current = setTimeout(() => {
        saveUserData();
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.tasks, state.habits, state.todos, state.rewards, state.redeemedRewards, state.emotionalLogs, state.goals, state.cards, user]);

  const loadUserData = async () => {
    if (!user || isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;

      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const userData: AppData = {
          tasks: data.tasks || [],
          habits: data.habits || [],
          todos: data.todos || [],
          rewards: data.rewards || [],
          redeemedRewards: data.redeemed_rewards || [],
          emotionalLogs: data.emotional_logs || [],
          goals: data.goals || [],
        };

        dispatch({ type: 'LOAD_DATA', payload: userData });

        // Load cards separately if they exist
        if (data.cards) {
          dispatch({ type: 'LOAD_CARDS', payload: data.cards });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  const saveUserData = async () => {
    if (!user) return;

    try {
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
          cards: state.cards, // Save cards to database
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return {
    loadUserData,
    saveUserData,
  };
}