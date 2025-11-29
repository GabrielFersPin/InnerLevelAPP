import React, { useRef, useState } from 'react';
import { Settings, User, Shield, Bell, Palette, Database, Moon, Sun, Save, Upload, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import techHammer from '../assets/tech_hammer.png';

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
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-void-950/40 border border-tech-cyan/30 p-6 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <h3 className="text-xl font-bold text-gold-200 mb-4 flex items-center gap-2 font-cinzel">
          <Settings className="w-5 h-5 text-tech-cyan" />
          General Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-void-900/50 rounded-lg border border-white/5">
            <div>
              <label className="text-gold-100 font-bold font-cinzel">Dark Mode</label>
              <p className="text-slate-400 text-sm font-inter">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={() => dispatch({
                type: 'UPDATE_PREFERENCES',
                payload: {
                  darkMode: !state.guild.preferences.darkMode,
                  theme: !state.guild.preferences.darkMode ? 'dark' : 'light'
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.guild.preferences.darkMode ? 'bg-tech-gold' : 'bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-void-950 transition-transform ${state.guild.preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-void-900/50 rounded-lg border border-white/5">
            <div>
              <label className="text-gold-100 font-bold font-cinzel">Sound Effects</label>
              <p className="text-slate-400 text-sm font-inter">Enable audio feedback for actions</p>
            </div>
            <button
              onClick={() => dispatch({
                type: 'UPDATE_PREFERENCES',
                payload: { soundEnabled: !state.guild.preferences.soundEnabled }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.guild.preferences.soundEnabled ? 'bg-tech-gold' : 'bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-void-950 transition-transform ${state.guild.preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-void-900/50 rounded-lg border border-white/5">
            <div>
              <label className="text-gold-100 font-bold font-cinzel">Notifications</label>
              <p className="text-slate-400 text-sm font-inter">Receive reminders and updates</p>
            </div>
            <button
              onClick={() => dispatch({
                type: 'UPDATE_NOTIFICATION_SETTINGS',
                payload: { goalReminders: !state.guild.notifications.goalReminders }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.guild.notifications.goalReminders ? 'bg-tech-gold' : 'bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-void-950 transition-transform ${state.guild.notifications.goalReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-void-950/40 border border-tech-magenta/30 p-6 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(255,0,255,0.1)]">
        <h3 className="text-xl font-bold text-gold-200 mb-4 flex items-center gap-2 font-cinzel">
          <User className="w-5 h-5 text-tech-magenta" />
          Character Profile
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-tech-magenta font-bold font-cinzel text-sm uppercase tracking-wider">Character Name</label>
            <input
              type="text"
              defaultValue={state.character?.name || 'Hero'}
              className="w-full mt-2 px-4 py-2 bg-void-900/50 border border-tech-magenta/30 rounded-lg text-white focus:border-tech-magenta focus:outline-none focus:ring-1 focus:ring-tech-magenta transition-all font-inter"
            />
          </div>

          <div>
            <label className="text-tech-magenta font-bold font-cinzel text-sm uppercase tracking-wider">Character Class</label>
            <div className="mt-2 px-4 py-2 bg-void-900/50 border border-tech-magenta/30 rounded-lg text-slate-300 font-inter">
              {state.character?.class ? (
                <span className="capitalize text-white font-bold">{state.character.class}</span>
              ) : (
                <span className="text-slate-500">Not selected</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-tech-magenta font-bold font-cinzel text-sm uppercase tracking-wider">Level</label>
            <div className="mt-2 px-4 py-2 bg-void-900/50 border border-tech-magenta/30 rounded-lg text-gold-400 font-mono font-bold">
              {state.character?.level || 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-void-950/40 border border-tech-cyan/30 p-6 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <h3 className="text-xl font-bold text-gold-200 mb-4 flex items-center gap-2 font-cinzel">
          <Shield className="w-5 h-5 text-tech-cyan" />
          Privacy & Security
        </h3>

        <div className="space-y-4">
          <div className="p-3 bg-void-900/50 rounded-lg border border-white/5">
            <label className="text-gold-100 font-bold font-cinzel block mb-1">Profile Visibility</label>
            <p className="text-slate-400 text-sm mb-3 font-inter">Control who can see your profile</p>
            <select
              value={state.guild.privacy.profileVisibility}
              onChange={(e) => dispatch({
                type: 'UPDATE_PRIVACY_SETTINGS',
                payload: { profileVisibility: e.target.value as 'public' | 'friends' | 'private' }
              })}
              className="w-full px-4 py-2 bg-void-950 border border-tech-cyan/30 rounded-lg text-white focus:border-tech-cyan focus:outline-none font-inter"
            >
              <option value="public">Public - Everyone can see your profile</option>
              <option value="friends">Friends - Only friends can see your profile</option>
              <option value="private">Private - Only you can see your profile</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-void-900/50 rounded-lg border border-white/5">
            <div>
              <label className="text-gold-100 font-bold font-cinzel">Show Streak</label>
              <p className="text-slate-400 text-sm font-inter">Display your current streak to others</p>
            </div>
            <button
              onClick={() => dispatch({
                type: 'UPDATE_PRIVACY_SETTINGS',
                payload: { showStreak: !state.guild.privacy.showStreak }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.guild.privacy.showStreak ? 'bg-tech-cyan' : 'bg-slate-600'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-void-950 transition-transform ${state.guild.privacy.showStreak ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>

          {/* More privacy settings... simplified for brevity but applying same style */}
          <div className="flex items-center justify-between p-3 bg-void-900/50 rounded-lg border border-white/5">
            <div>
              <label className="text-gold-100 font-bold font-cinzel">Show Level</label>
              <p className="text-slate-400 text-sm font-inter">Display your character level to others</p>
            </div>
            <button
              onClick={() => dispatch({
                type: 'UPDATE_PRIVACY_SETTINGS',
                payload: { showLevel: !state.guild.privacy.showLevel }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.guild.privacy.showLevel ? 'bg-tech-cyan' : 'bg-slate-600'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-void-950 transition-transform ${state.guild.privacy.showLevel ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-void-950/40 border border-tech-gold/30 p-6 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(255,215,0,0.1)]">
        <h3 className="text-xl font-bold text-gold-200 mb-4 flex items-center gap-2 font-cinzel">
          <Bell className="w-5 h-5 text-tech-gold" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-void-900/50 rounded-lg border border-white/5">
            <div>
              <label className="text-gold-100 font-bold font-cinzel">Daily Reminders</label>
              <p className="text-slate-400 text-sm font-inter">Get reminded to complete your daily quests</p>
            </div>
            <button
              onClick={() => dispatch({
                type: 'UPDATE_NOTIFICATION_SETTINGS',
                payload: { goalReminders: !state.guild.notifications.goalReminders }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.guild.notifications.goalReminders ? 'bg-tech-gold' : 'bg-slate-600'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-void-950 transition-transform ${state.guild.notifications.goalReminders ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-void-900/50 rounded-lg border border-white/5">
            <div>
              <label className="text-gold-100 font-bold font-cinzel">Achievement Alerts</label>
              <p className="text-slate-400 text-sm font-inter">Celebrate when you unlock achievements</p>
            </div>
            <button
              onClick={() => dispatch({
                type: 'UPDATE_NOTIFICATION_SETTINGS',
                payload: { achievementUnlocks: !state.guild.notifications.achievementUnlocks }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.guild.notifications.achievementUnlocks ? 'bg-tech-gold' : 'bg-slate-600'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-void-950 transition-transform ${state.guild.notifications.achievementUnlocks ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-void-950/40 border border-tech-magenta/30 p-6 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(255,0,255,0.1)]">
        <h3 className="text-xl font-bold text-gold-200 mb-4 flex items-center gap-2 font-cinzel">
          <Palette className="w-5 h-5 text-tech-magenta" />
          Appearance
        </h3>

        <div className="space-y-4">
          <div className="p-3 bg-void-900/50 rounded-lg border border-white/5">
            <label className="text-gold-100 font-bold font-cinzel block mb-2">Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'UPDATE_PREFERENCES', payload: { theme: 'dark', darkMode: true } })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${state.guild.preferences.theme === 'dark' ? 'bg-tech-magenta text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
              <button
                onClick={() => dispatch({ type: 'UPDATE_PREFERENCES', payload: { theme: 'light', darkMode: false } })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${state.guild.preferences.theme === 'light' ? 'bg-tech-magenta text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
            </div>
          </div>

          <div className="p-3 bg-void-900/50 rounded-lg border border-white/5">
            <label className="text-gold-100 font-bold font-cinzel block mb-2">Accent Color</label>
            <div className="flex gap-2">
              {(['amber', 'emerald', 'blue', 'purple', 'rose'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => dispatch({ type: 'UPDATE_PREFERENCES', payload: { accentColor: color } })}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${state.guild.preferences.accentColor === color ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-110' : 'border-slate-600'
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
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-void-950/40 border border-tech-cyan/30 p-6 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <h3 className="text-xl font-bold text-gold-200 mb-4 flex items-center gap-2 font-cinzel">
          <Database className="w-5 h-5 text-tech-cyan" />
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
              a.download = `LifeQuest_Backup_${new Date().toISOString().slice(0, 10)}.json`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="w-full px-4 py-3 bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/50 rounded-xl hover:bg-tech-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-bold flex items-center justify-center gap-2 font-cinzel"
          >
            <Save className="w-4 h-4" />
            Export Character Data
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 bg-tech-gold/20 text-tech-gold border border-tech-gold/50 rounded-xl hover:bg-tech-gold/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all font-bold flex items-center justify-center gap-2 font-cinzel"
          >
            <Upload className="w-4 h-4" />
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
                dispatch({
                  type: 'LOAD_DATA', payload: {
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
                  }
                });
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
            className="w-full px-4 py-3 bg-red-900/30 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-900/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all font-bold flex items-center justify-center gap-2 font-cinzel mt-8"
          >
            <RefreshCw className="w-4 h-4" />
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gold-200 mb-2 font-cinzel text-glow-sm flex items-center justify-center gap-3">
          <img src={techHammer} alt="Hammer" className="w-8 h-8 rounded-full border border-tech-gold" />
          Guild Settings
          <img src={techHammer} alt="Hammer" className="w-8 h-8 rounded-full border border-tech-gold transform scale-x-[-1]" />
        </h1>
        <p className="text-slate-300 font-inter">Configure your LifeQuest RPG experience</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left font-cinzel ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-tech-gold/20 to-orange-900/20 border border-tech-gold/50 text-gold-200 shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                    : 'bg-void-950/40 hover:bg-void-900/60 text-slate-400 hover:text-slate-200 hover:translate-x-1 border border-white/5'
                  }`}
              >
                <Icon size={18} className={activeTab === tab.id ? 'text-tech-gold' : 'text-slate-500'} />
                <span className="font-bold tracking-wide">{tab.label}</span>
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