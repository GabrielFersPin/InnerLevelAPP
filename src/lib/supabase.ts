import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values for development
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(url, key);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          email: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          email: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          email?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_data: {
        Row: {
          id: string;
          user_id: string;
          tasks: any;
          habits: any;
          todos: any;
          rewards: any;
          redeemed_rewards: any;
          emotional_logs: any;
          goals: any;
          // Character data
          character: any;
          // Cards data
          cards: any;
          is_onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tasks?: any;
          habits?: any;
          todos?: any;
          rewards?: any;
          redeemed_rewards?: any;
          emotional_logs?: any;
          goals?: any;
          // Character data
          character?: any;
          // Cards data
          cards?: any;
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tasks?: any;
          habits?: any;
          todos?: any;
          rewards?: any;
          redeemed_rewards?: any;
          emotional_logs?: any;
          goals?: any;
          // Character data
          character?: any;
          // Cards data
          cards?: any;
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};