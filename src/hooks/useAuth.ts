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

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-anon-key';
};

export function useAuth() {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | MockProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [useLocalAuth] = useState(!isSupabaseConfigured());

  // Log which authentication system is being used
  useEffect(() => {
    if (useLocalAuth) {
      console.log('🔮 Using Local Authentication for development (no Supabase config found)');
    } else {
      console.log('⚡ Using Supabase Authentication');
    }
  }, []);

  useEffect(() => {
    if (useLocalAuth) {
      // Use local authentication for development
      const user = localAuth.getCurrentUser();
      const profile = localAuth.getUserProfile();
      
      setUser(user);
      setProfile(profile);
      setLoading(false);

      // Listen for local auth changes
      const { data: { subscription } } = localAuth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user);
            const profile = localAuth.getUserProfile();
            setProfile(profile);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Use Supabase authentication
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [useLocalAuth]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (useLocalAuth) {
      // Use local authentication
      const result = await localAuth.signUp(email, password, username);
      if (result.data?.user) {
        setUser(result.data.user);
        const profile = localAuth.getUserProfile();
        setProfile(profile);
      }
      return result;
    } else {
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
    }
  };

  const signIn = async (email: string, password: string) => {
    if (useLocalAuth) {
      // Use local authentication
      const result = await localAuth.signIn(email, password);
      if (result.data?.user) {
        setUser(result.data.user);
        const profile = localAuth.getUserProfile();
        setProfile(profile);
      }
      return result;
    } else {
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
    }
  };

  const signOut = async () => {
    if (useLocalAuth) {
      // Use local authentication
      const result = await localAuth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      return result;
    } else {
      // Use Supabase authentication
      const { error } = await supabase.auth.signOut();
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    if (useLocalAuth) {
      // Use local authentication
      const result = await localAuth.updateProfile(updates);
      if (result.data) {
        setProfile(result.data);
      }
      return result;
    } else {
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
    }
  };

  const updateUserData = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') };

    if (useLocalAuth) {
      // Use local authentication
      return await localAuth.updateUserData(updates);
    } else {
      // Use Supabase authentication
      try {
        const { data, error } = await supabase
          .from('user_data')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  };

  const getUserData = async () => {
    if (!user) return { data: null, error: new Error('No user logged in') };

    if (useLocalAuth) {
      // Use local authentication
      const data = localAuth.getUserData();
      return { data, error: null };
    } else {
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