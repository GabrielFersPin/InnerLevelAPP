import { useAuth } from './useAuth';
import { useAppContext } from '../context/AppContext';

export function useAuthenticatedCharacter() {
  const { user, updateUserData } = useAuth();
  const { state, dispatch } = useAppContext();

  // NOTE: Character loading is now handled by AppContext's loadUserData
  // This hook only handles character creation

  const saveCharacterToDatabase = async () => {
    if (!user) return;

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
    saveCharacterToDatabase,
  };
}