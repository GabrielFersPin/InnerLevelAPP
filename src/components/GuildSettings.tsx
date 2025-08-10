import React, { useRef, useState } from 'react';
import { Settings, User, Shield, Bell, Palette, Database, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function GuildSettings() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('general');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="rpg-panel p-6 rounded-xl border border-amber-500/30">
        <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Dark Mode</label>
              <p className="text-slate-400 text-sm">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={() => dispatch({ 
                type: 'UPDATE_PREFERENCES', 
                payload: { 
                  darkMode: !state.guild.preferences.darkMode,
                  theme: !state.guild.preferences.darkMode ? 'dark' : 'light'
                } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.preferences.darkMode ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.guild.preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Sound Effects</label>
              <p className="text-slate-400 text-sm">Enable audio feedback for actions</p>
            </div>
            <button
              onClick={() => dispatch({ 
                type: 'UPDATE_PREFERENCES', 
                payload: { soundEnabled: !state.guild.preferences.soundEnabled } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.preferences.soundEnabled ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.guild.preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Notifications</label>
              <p className="text-slate-400 text-sm">Receive reminders and updates</p>
            </div>
            <button
              onClick={() => dispatch({ 
                type: 'UPDATE_NOTIFICATION_SETTINGS', 
                payload: { goalReminders: !state.guild.notifications.goalReminders } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.notifications.goalReminders ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.guild.notifications.goalReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="rpg-panel p-6 rounded-xl border border-amber-500/30">
        <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Character Profile
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-slate-200 font-medium">Character Name</label>
            <input
              type="text"
              defaultValue={state.character?.name || 'Hero'}
              className="w-full mt-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="text-slate-200 font-medium">Character Class</label>
            <div className="mt-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200">
              {state.character?.class ? (
                <span className="capitalize">{state.character.class}</span>
              ) : (
                <span className="text-slate-400">Not selected</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-slate-200 font-medium">Level</label>
            <div className="mt-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200">
              {state.character?.level || 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="rpg-panel p-6 rounded-xl border border-amber-500/30">
        <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Security
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-slate-200 font-medium">Profile Visibility</label>
            <p className="text-slate-400 text-sm mb-2">Control who can see your profile</p>
            <select 
              value={state.guild.privacy.profileVisibility}
              onChange={(e) => dispatch({ 
                type: 'UPDATE_PRIVACY_SETTINGS', 
                payload: { profileVisibility: e.target.value as 'public' | 'friends' | 'private' } 
              })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="public">Public - Everyone can see your profile</option>
              <option value="friends">Friends - Only friends can see your profile</option>
              <option value="private">Private - Only you can see your profile</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Show Streak</label>
              <p className="text-slate-400 text-sm">Display your current streak to others</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_PRIVACY_SETTINGS', 
                payload: { showStreak: !state.guild.privacy.showStreak } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.privacy.showStreak ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.privacy.showStreak ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Show Level</label>
              <p className="text-slate-400 text-sm">Display your character level to others</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_PRIVACY_SETTINGS', 
                payload: { showLevel: !state.guild.privacy.showLevel } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.privacy.showLevel ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.privacy.showLevel ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="text-slate-200 font-medium">Goals Visibility</label>
            <p className="text-slate-400 text-sm mb-2">Control who can see your goals</p>
            <select 
              value={state.guild.privacy.showGoals}
              onChange={(e) => dispatch({ 
                type: 'UPDATE_PRIVACY_SETTINGS', 
                payload: { showGoals: e.target.value as 'public' | 'friends' | 'private' } 
              })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="public">Public - Everyone can see your goals</option>
              <option value="friends">Friends - Only friends can see your goals</option>
              <option value="private">Private - Only you can see your goals</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Show Achievements</label>
              <p className="text-slate-400 text-sm">Display your achievements to others</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_PRIVACY_SETTINGS', 
                payload: { showAchievements: !state.guild.privacy.showAchievements } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.privacy.showAchievements ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.privacy.showAchievements ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Allow Friend Requests</label>
              <p className="text-slate-400 text-sm">Let others send you friend requests</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_PRIVACY_SETTINGS', 
                payload: { allowFriendRequests: !state.guild.privacy.allowFriendRequests } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.privacy.allowFriendRequests ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.privacy.allowFriendRequests ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Allow Guild Invites</label>
              <p className="text-slate-400 text-sm">Let others invite you to guilds</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_PRIVACY_SETTINGS', 
                payload: { allowGuildInvites: !state.guild.privacy.allowGuildInvites } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.privacy.allowGuildInvites ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.privacy.allowGuildInvites ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="rpg-panel p-6 rounded-xl border border-amber-500/30">
        <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Daily Reminders</label>
              <p className="text-slate-400 text-sm">Get reminded to complete your daily quests</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_NOTIFICATION_SETTINGS', 
                payload: { goalReminders: !state.guild.notifications.goalReminders } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.notifications.goalReminders ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.notifications.goalReminders ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Achievement Alerts</label>
              <p className="text-slate-400 text-sm">Celebrate when you unlock achievements</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_NOTIFICATION_SETTINGS', 
                payload: { achievementUnlocks: !state.guild.notifications.achievementUnlocks } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.notifications.achievementUnlocks ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.notifications.achievementUnlocks ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Friend Requests</label>
              <p className="text-slate-400 text-sm">Get notified when someone sends a friend request</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_NOTIFICATION_SETTINGS', 
                payload: { friendRequests: !state.guild.notifications.friendRequests } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.notifications.friendRequests ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.notifications.friendRequests ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Guild Invites</label>
              <p className="text-slate-400 text-sm">Get notified when invited to join a guild</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_NOTIFICATION_SETTINGS', 
                payload: { guildInvites: !state.guild.notifications.guildInvites } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.notifications.guildInvites ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.notifications.guildInvites ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Weekly Report</label>
              <p className="text-slate-400 text-sm">Receive a weekly summary of your progress</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_NOTIFICATION_SETTINGS', 
                payload: { weeklyReport: !state.guild.notifications.weeklyReport } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.notifications.weeklyReport ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-slate-200 font-medium">Friend Activity</label>
              <p className="text-slate-400 text-sm">See when friends complete quests and achievements</p>
            </div>
            <button 
              onClick={() => dispatch({ 
                type: 'UPDATE_NOTIFICATION_SETTINGS', 
                payload: { friendActivity: !state.guild.notifications.friendActivity } 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                state.guild.notifications.friendActivity ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.guild.notifications.friendActivity ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="rpg-panel p-6 rounded-xl border border-amber-500/30">
        <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Appearance
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-slate-200 font-medium">Theme</label>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => dispatch({ type: 'UPDATE_PREFERENCES', payload: { theme: 'dark', darkMode: true } })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${state.guild.preferences.theme === 'dark' ? 'bg-amber-600 text-slate-900' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
              <button
                onClick={() => dispatch({ type: 'UPDATE_PREFERENCES', payload: { theme: 'light', darkMode: false } })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${state.guild.preferences.theme === 'light' ? 'bg-amber-600 text-slate-900' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-200 font-medium">Accent Color</label>
            <div className="mt-2 flex gap-2">
              {(['amber', 'emerald', 'blue', 'purple', 'rose'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => dispatch({ type: 'UPDATE_PREFERENCES', payload: { accentColor: color } })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    state.guild.preferences.accentColor === color ? 'border-white' : 'border-slate-600'
                  }`}
                  style={{ backgroundColor: `var(--${color}-500)` }}
                  aria-label={`Select ${color} accent`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="rpg-panel p-6 rounded-xl border border-amber-500/30">
        <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data & Backup
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              const backup = {
                tasks: state.tasks,
                habits: state.habits,
                todos: state.todos,
                rewards: state.rewards,
                redeemedRewards: state.redeemedRewards,
                emotionalLogs: state.emotionalLogs,
                goals: state.goals,
                character: state.character,
                cards: state.cards,
                quests: state.quests,
                energy: state.energy,
                recommendations: state.recommendations,
                guild: state.guild
              };
              const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `LifeQuest_Backup_${new Date().toISOString().slice(0,10)}.json`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="w-full px-4 py-2 bg-amber-600 text-slate-900 rounded-lg hover:bg-amber-500 transition-colors"
          >
            Export Character Data
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Import Character Data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const data = JSON.parse(text);
                // Basic validation: ensure object
                if (typeof data !== 'object' || data === null) throw new Error('Invalid file');
                dispatch({ type: 'LOAD_DATA', payload: {
                  tasks: data.tasks ?? state.tasks,
                  habits: data.habits ?? state.habits,
                  todos: data.todos ?? state.todos,
                  rewards: data.rewards ?? state.rewards,
                  redeemedRewards: data.redeemedRewards ?? state.redeemedRewards,
                  emotionalLogs: data.emotionalLogs ?? state.emotionalLogs,
                  goals: data.goals ?? state.goals,
                  character: data.character ?? state.character,
                  cards: data.cards ?? state.cards,
                  quests: data.quests ?? state.quests,
                  energy: data.energy ?? state.energy,
                  recommendations: data.recommendations ?? state.recommendations,
                  guild: data.guild ?? state.guild,
                } });
              } catch (err) {
                console.error('Failed to import backup:', err);
                alert('Failed to import backup file.');
              } finally {
                e.currentTarget.value = '';
              }
            }}
          />
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                dispatch({ type: 'RESET_ALL_PROGRESS' });
              }
            }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'profile':
        return renderProfileSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
          ⚙️ Guild Settings
        </h1>
        <p className="text-slate-300">Configure your LifeQuest RPG experience</p>
      </div>

      <div className="flex gap-6">
        {/* Tab Navigation */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-600/30 to-amber-700/30 border border-amber-500/50 text-amber-200 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:translate-x-1 border border-slate-600/30'
                }`}
              >
                <Icon size={18} className={activeTab === tab.id ? 'text-amber-400' : 'text-slate-400'} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 