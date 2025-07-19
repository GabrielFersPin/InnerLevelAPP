import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAppContext } from '../context/AppContext';

export function useAuthenticatedCharacter() {
  const { user, getUserData, updateUserData } = useAuth();
  const { state, dispatch } = useAppContext();

  // Load character data from database when user logs in
  useEffect(() => {
    if (user) {
      loadCharacterFromDatabase();
    }
  }, [user]);

  // Save character data to database when character changes
  useEffect(() => {
    if (user && state.character) {
      saveCharacterToDatabase();
    }
  }, [state.character, user]);

  const loadCharacterFromDatabase = async () => {
    try {
      console.log('[loadCharacterFromDatabase] called');
      const { data } = await getUserData();
      console.log('[loadCharacterFromDatabase] data from Supabase:', data);
      if (data?.character) {
        dispatch({
          type: 'LOAD_CHARACTER',
          payload: data.character
        });
      }
      if (data?.is_onboarded) {
        dispatch({ type: 'COMPLETE_ONBOARDING' });
      }
    } catch (error) {
      console.error('Error loading character from database:', error);
    }
  };

  const saveCharacterToDatabase = async () => {
    try {
      const payload = {
        character: state.character,
        is_onboarded: state.character?.isOnboarded || false
      };
      console.log('[saveCharacterToDatabase] saving to Supabase:', payload);
      await updateUserData(payload);
    } catch (error) {
      console.error('Error saving character to database:', error);
    }
  };

  const createCharacterInDatabase = async (characterData: any) => {
    try {
      const payload = {
        character: characterData,
        is_onboarded: true
      };
      console.log('[createCharacterInDatabase] saving to Supabase:', payload);
      await updateUserData(payload);
      dispatch({
        type: 'CREATE_CHARACTER',
        payload: characterData
      });
      dispatch({ type: 'COMPLETE_ONBOARDING' });
    } catch (error) {
      console.error('Error creating character in database:', error);
    }
  };

  return {
    createCharacterInDatabase,
    loadCharacterFromDatabase,
    saveCharacterToDatabase,
  };
}