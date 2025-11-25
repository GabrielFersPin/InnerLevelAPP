import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useAppContext } from '../context/AppContext';

export function useAuthenticatedCharacter() {
  const { user, getUserData, updateUserData } = useAuth();
  const { state, dispatch } = useAppContext();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);

  // Load character data from database when user logs in
  useEffect(() => {
    if (user && !isLoadingRef.current) {
      loadCharacterFromDatabase();
    }
  }, [user]);

  // Save character data to database when character changes (with debounce)
  useEffect(() => {
    if (user && state.character && !isLoadingRef.current) {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save - wait 1 second after last change
      saveTimeoutRef.current = setTimeout(() => {
        saveCharacterToDatabase();
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.character?.level, state.character?.experience, state.character?.energy, state.character?.isOnboarded, user]);

  const loadCharacterFromDatabase = async () => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
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
    } finally {
      isLoadingRef.current = false;
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
      // Ensure isOnboarded is true in the character object
      const characterWithOnboarded = { ...characterData, isOnboarded: true };
      const payload = {
        character: characterWithOnboarded,
        is_onboarded: true
      };
      console.log('[createCharacterInDatabase] saving to Supabase:', payload);
      await updateUserData(payload);
      dispatch({
        type: 'CREATE_CHARACTER',
        payload: characterWithOnboarded
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