import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { AppData } from '../types';

export function useUserData() {
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();

  // Load user data from database when user logs in
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Save user data to database whenever state changes
  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [state, user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
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
      }
    } catch (error) {
      console.error('Error loading user data:', error);
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