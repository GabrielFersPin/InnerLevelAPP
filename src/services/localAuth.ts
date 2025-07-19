// Mock authentication service for local development
// This allows the app to work without Supabase configuration

export interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

export interface MockProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MockUserData {
  id: string;
  user_id: string;
  tasks: any[];
  habits: any[];
  todos: any[];
  rewards: any[];
  redeemed_rewards: any[];
  emotional_logs: any[];
  goals: any[];
  character: any;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

class LocalAuthService {
  private static STORAGE_KEYS = {
    USER: 'lifequest_mock_user',
    PROFILE: 'lifequest_mock_profile',
    USER_DATA: 'lifequest_mock_user_data',
    SESSION: 'lifequest_mock_session'
  };

  // Mock user session management
  getCurrentUser(): MockUser | null {
    const userStr = localStorage.getItem(LocalAuthService.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserProfile(): MockProfile | null {
    const profileStr = localStorage.getItem(LocalAuthService.STORAGE_KEYS.PROFILE);
    return profileStr ? JSON.parse(profileStr) : null;
  }

  getUserData(): MockUserData | null {
    const dataStr = localStorage.getItem(LocalAuthService.STORAGE_KEYS.USER_DATA);
    return dataStr ? JSON.parse(dataStr) : null;
  }

  // Mock sign up
  async signUp(email: string, password: string, username: string) {
    try {
      const userId = 'mock_user_' + Date.now();
      const now = new Date().toISOString();

      const user: MockUser = {
        id: userId,
        email,
        created_at: now
      };

      const profile: MockProfile = {
        id: 'profile_' + userId,
        user_id: userId,
        username,
        email,
        created_at: now,
        updated_at: now
      };

      const userData: MockUserData = {
        id: 'data_' + userId,
        user_id: userId,
        tasks: [],
        habits: [],
        todos: [],
        rewards: [],
        redeemed_rewards: [],
        emotional_logs: [],
        goals: [],
        character: null,
        is_onboarded: false,
        created_at: now,
        updated_at: now
      };

      // Store in localStorage
      localStorage.setItem(LocalAuthService.STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(LocalAuthService.STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      localStorage.setItem(LocalAuthService.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(LocalAuthService.STORAGE_KEYS.SESSION, 'active');

      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Mock sign in
  async signIn(email: string, password: string) {
    try {
      // For demo purposes, allow any email/password combination
      // In a real app, you'd validate credentials
      
      const existingUser = this.getCurrentUser();
      if (existingUser && existingUser.email === email) {
        // User already exists, just activate session
        localStorage.setItem(LocalAuthService.STORAGE_KEYS.SESSION, 'active');
        return { data: { user: existingUser }, error: null };
      }

      // Create new user if doesn't exist
      const username = email.split('@')[0];
      return await this.signUp(email, password, username);
    } catch (error) {
      return { data: null, error };
    }
  }

  // Mock sign out
  async signOut() {
    localStorage.removeItem(LocalAuthService.STORAGE_KEYS.SESSION);
    return { error: null };
  }

  // Update user data
  async updateUserData(updates: Partial<MockUserData>) {
    try {
      const currentData = this.getUserData();
      if (!currentData) {
        throw new Error('No user data found');
      }

      const updatedData = {
        ...currentData,
        ...updates,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(LocalAuthService.STORAGE_KEYS.USER_DATA, JSON.stringify(updatedData));
      return { data: updatedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update profile
  async updateProfile(updates: Partial<MockProfile>) {
    try {
      const currentProfile = this.getUserProfile();
      if (!currentProfile) {
        throw new Error('No profile found');
      }

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(LocalAuthService.STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
      return { data: updatedProfile, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Check if user has active session
  hasActiveSession(): boolean {
    return localStorage.getItem(LocalAuthService.STORAGE_KEYS.SESSION) === 'active';
  }

  // Mock auth state change listeners
  onAuthStateChange(callback: (event: string, session: any) => void) {
    // For local development, we'll simulate auth state
    const user = this.getCurrentUser();
    const hasSession = this.hasActiveSession();
    
    if (user && hasSession) {
      setTimeout(() => callback('SIGNED_IN', { user }), 100);
    } else {
      setTimeout(() => callback('SIGNED_OUT', null), 100);
    }

    // Return a mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  // Get mock session
  async getSession() {
    const user = this.getCurrentUser();
    const hasSession = this.hasActiveSession();
    
    if (user && hasSession) {
      return { data: { session: { user } }, error: null };
    }
    
    return { data: { session: null }, error: null };
  }
}

export const localAuth = new LocalAuthService();