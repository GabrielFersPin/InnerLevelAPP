import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export type Gift = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'locked' | 'unlocked' | 'used';
  level_required: number;
  created_at: string;
  used_at?: string;
};

export async function getUserGifts(userId: string): Promise<Gift[]> {
  const { data, error } = await supabase
    .from('user_gifts')
    .select('*')
    .eq('user_id', userId)
    .order('level_required', { ascending: true });
  if (error) throw error;
  return data as Gift[];
}

export async function addGift(userId: string, gift: Omit<Gift, 'id' | 'user_id' | 'created_at' | 'used_at'>): Promise<Gift> {
  const { data, error } = await supabase
    .from('user_gifts')
    .insert([{ ...gift, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data as Gift;
}

export async function updateGift(giftId: string, updates: Partial<Omit<Gift, 'id' | 'user_id' | 'created_at'>>): Promise<Gift> {
  const { data, error } = await supabase
    .from('user_gifts')
    .update(updates)
    .eq('id', giftId)
    .select()
    .single();
  if (error) throw error;
  return data as Gift;
}

export async function deleteGift(giftId: string): Promise<void> {
  const { error } = await supabase
    .from('user_gifts')
    .delete()
    .eq('id', giftId);
  if (error) throw error;
}

export async function claimGift(giftId: string): Promise<Gift> {
  const { data, error } = await supabase
    .from('user_gifts')
    .update({ status: 'used', used_at: new Date().toISOString() })
    .eq('id', giftId)
    .select()
    .single();
  if (error) throw error;
  return data as Gift;
} 