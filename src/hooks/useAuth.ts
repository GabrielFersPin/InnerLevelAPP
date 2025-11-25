import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { localAuth, MockUser, MockProfile } from '../services/localAuth';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔐 [useAuth] Starting authentication...');
    setLoading(true);

    // Use Supabase authentication
    console.log('🔐 [useAuth] Calling getSession...');
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        console.log('🔐 [useAuth] Got session:', session ? 'User exists' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log('🔐 [useAuth] Fetching profile for user:', session.user.id);
          fetchProfile(session.user.id);
        } else {
          console.log('🔐 [useAuth] No session, setting loading to false');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('❌ [useAuth] Error getting session:', error);
        setLoading(false);
      });

    // Listen for auth changes
    console.log('🔐 [useAuth] Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 [useAuth] Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    console.log('🔐 [useAuth] Auth listener setup complete');
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔐 [useAuth] fetchProfile - Starting for userId:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('🔐 [useAuth] fetchProfile - Query complete. Error:', error?.code || 'none');

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [useAuth] fetchProfile - Error (not PGRST116):', error);
        throw error;
      }

      if (error && error.code === 'PGRST116') {
        console.log('⚠️ [useAuth] fetchProfile - No profile found (PGRST116), this is expected for new users');
      }

      console.log('🔐 [useAuth] fetchProfile - Setting profile data:', data ? 'Profile exists' : 'No profile');
      setProfile(data);
    } catch (error) {
      console.error('❌ [useAuth] fetchProfile - Caught error:', error);
    } finally {
      console.log('🔐 [useAuth] fetchProfile - Setting loading to false');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    // Use Supabase authentication
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            username,
            email,
          });

        if (profileError) throw profileError;

        // Create initial user data
        const { error: dataError } = await supabase
          .from('user_data')
          .insert({
            user_id: data.user.id,
            tasks: [],
            habits: [],
            todos: [],
            rewards: [],
            redeemed_rewards: [],
            emotional_logs: [],
            goals: [],
            character: null,
            is_onboarded: false,
          });

        if (dataError) throw dataError;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Use Supabase authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    // Use Supabase authentication
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    // Use Supabase authentication
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateUserData = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') };

    // Use Supabase authentication
    try {
      const { data, error } = await supabase
        .from('user_data')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const getUserData = async () => {
    if (!user) return { data: null, error: new Error('No user logged in') };

    // Use Supabase authentication
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchProfile,
    updateUserData,
    getUserData,
  };
}