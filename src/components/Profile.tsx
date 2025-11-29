import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { showAlert } from '../utils/notifications';
import { User, Mail, Edit2, Save, X, Shield, Bell, Palette, Database, Download, Upload, Trash2, Key, Lock, Target } from 'lucide-react';
import techOrb from '../assets/tech_orb.png';

export function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: profile?.username || '',
    email: profile?.email || '',
    avatar_url: profile?.avatar_url || '',
  });

  const [preferences, setPreferences] = useState({
    theme: 'purple',
    notifications: true,
    emailUpdates: false,
    weeklyReports: true,
    language: 'en',
    timezone: 'UTC',
  });

  const handleSaveProfile = async () => {
    try {
      const { error } = await updateProfile({
        username: profileForm.username,
        email: profileForm.email,
        avatar_url: profileForm.avatar_url,
      });

      if (error) {
        showAlert(error.message, 'error');
      } else {
        showAlert('Profile updated successfully!', 'success');
        setIsEditing(false);
      }
    } catch (error: any) {
      showAlert(error.message || 'Failed to update profile', 'error');
    }
  };

  const handleExportData = () => {
    // Get data from localStorage
    const userData = {
      tasks: JSON.parse(localStorage.getItem('innerlevel_tasks') || '[]'),
      habits: JSON.parse(localStorage.getItem('innerlevel_habits') || '[]'),
      todos: JSON.parse(localStorage.getItem('innerlevel_todos') || '[]'),
      rewards: JSON.parse(localStorage.getItem('innerlevel_rewards') || '[]'),
      redeemedRewards: JSON.parse(localStorage.getItem('innerlevel_redeemed') || '[]'),
      emotionalLogs: JSON.parse(localStorage.getItem('innerlevel_emotional') || '[]'),
      goals: JSON.parse(localStorage.getItem('innerlevel_goals') || '[]'),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `innerlevel-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAlert('Data exported successfully!', 'success');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        // Validate data structure
        const requiredFields = ['tasks', 'habits', 'todos', 'rewards', 'redeemedRewards', 'emotionalLogs', 'goals'];
        const isValid = requiredFields.every(field => Array.isArray(importedData[field]));

        if (!isValid) {
          showAlert('Invalid data format. Please check your file.', 'error');
          return;
        }

        // Save to localStorage
        localStorage.setItem('innerlevel_tasks', JSON.stringify(importedData.tasks));
        localStorage.setItem('innerlevel_habits', JSON.stringify(importedData.habits));
        localStorage.setItem('innerlevel_todos', JSON.stringify(importedData.todos));
        localStorage.setItem('innerlevel_rewards', JSON.stringify(importedData.rewards));
        localStorage.setItem('innerlevel_redeemed', JSON.stringify(importedData.redeemedRewards));
        localStorage.setItem('innerlevel_emotional', JSON.stringify(importedData.emotionalLogs));
        localStorage.setItem('innerlevel_goals', JSON.stringify(importedData.goals));

        showAlert('Data imported successfully! Please refresh the page to see changes.', 'success');
      } catch (error) {
        showAlert('Failed to import data. Please check your file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation === 'DELETE') {
      try {
        // Clear all local data
        localStorage.clear();
        await signOut();
        showAlert('Account deletion initiated. Please contact support to complete the process.', 'warning');
      } catch (error) {
        showAlert('Failed to delete account', 'error');
      }
    }
  };

  const themeColors = [
    { name: 'Purple', value: 'purple', color: 'bg-purple-600' },
    { name: 'Blue', value: 'blue', color: 'bg-blue-600' },
    { name: 'Green', value: 'green', color: 'bg-green-600' },
    { name: 'Pink', value: 'pink', color: 'bg-pink-600' },
    { name: 'Indigo', value: 'indigo', color: 'bg-indigo-600' },
  ];

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto mb-4 text-slate-500" />
        <p className="text-slate-400 font-cinzel">Please sign in to access your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-4">
        <img src={techOrb} alt="Orb" className="w-12 h-12 animate-pulse" />
        <div>
          <h2 className="text-4xl font-bold text-gold-200 font-cinzel text-glow-sm">Profile & Settings</h2>
          <p className="text-slate-400 font-inter">
            Manage your account, preferences, and data settings.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'preferences', label: 'Preferences', icon: Palette },
          { id: 'data', label: 'Data Management', icon: Database },
          { id: 'security', label: 'Security', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-all font-cinzel tracking-wide whitespace-nowrap ${activeTab === tab.id
                ? 'border-tech-magenta text-tech-magenta bg-tech-magenta/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-magenta/50 to-transparent"></div>

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gold-200 font-cinzel flex items-center gap-2">
              <User className="w-6 h-6 text-tech-magenta" />
              Profile Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-tech-magenta/20 text-tech-magenta px-4 py-2 rounded-lg border border-tech-magenta/50 hover:bg-tech-magenta/30 hover:shadow-[0_0_15px_rgba(219,39,119,0.3)] transition-all font-cinzel font-bold text-sm"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-void-900 rounded-full flex items-center justify-center border-2 border-tech-magenta/50 shadow-[0_0_20px_rgba(219,39,119,0.3)] relative group">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-tech-magenta" />
                )}
                <div className="absolute inset-0 rounded-full border border-white/20"></div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gold-100 font-cinzel">{profile.username}</h4>
                <p className="text-tech-cyan font-mono">{profile.email}</p>
                <p className="text-sm text-slate-500 mt-1 font-inter">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gold-200 mb-2 font-cinzel">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-void-900/50 border rounded-lg text-white placeholder-slate-500 font-inter transition-all ${isEditing
                      ? 'border-tech-magenta/50 focus:border-tech-magenta focus:ring-1 focus:ring-tech-magenta'
                      : 'border-white/10 cursor-not-allowed opacity-70'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gold-200 mb-2 font-cinzel">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-void-900/50 border rounded-lg text-white placeholder-slate-500 font-inter transition-all ${isEditing
                      ? 'border-tech-magenta/50 focus:border-tech-magenta focus:ring-1 focus:ring-tech-magenta'
                      : 'border-white/10 cursor-not-allowed opacity-70'
                      }`}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4 border-t border-white/10">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-emerald-900/50 text-emerald-100 px-6 py-3 rounded-lg border border-emerald-500/50 hover:bg-emerald-800/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all font-cinzel font-bold"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileForm({
                      username: profile.username,
                      email: profile.email,
                      avatar_url: profile.avatar_url || '',
                    });
                  }}
                  className="flex items-center gap-2 bg-void-800 text-slate-300 px-6 py-3 rounded-lg border border-white/10 hover:bg-void-700 transition-all font-cinzel font-bold"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
              <Palette className="w-6 h-6 text-tech-cyan" />
              App Preferences
            </h3>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gold-200 mb-3 font-cinzel">
                  Theme Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setPreferences(prev => ({ ...prev, theme: theme.value }))}
                      className={`flex flex-col items-center p-3 rounded-xl border transition-all ${preferences.theme === theme.value
                        ? 'border-tech-cyan bg-tech-cyan/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'border-white/10 hover:border-white/30 bg-void-900/50'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${theme.color} mb-2 border border-white/20 shadow-inner`}></div>
                      <span className="text-xs font-medium text-slate-300 font-inter">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gold-200 mb-2 font-cinzel">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 bg-void-900/50 border border-white/10 rounded-lg text-white focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan font-inter"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gold-200 mb-2 font-cinzel">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-4 py-3 bg-void-900/50 border border-white/10 rounded-lg text-white focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan font-inter"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
              <Bell className="w-6 h-6 text-tech-gold" />
              Notifications
            </h3>

            <div className="space-y-4">
              {[
                { key: 'notifications', label: 'Push Notifications', description: 'Receive notifications for important updates' },
                { key: 'emailUpdates', label: 'Email Updates', description: 'Get updates and tips via email' },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly progress summaries' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-void-900/50 border border-white/5 rounded-xl hover:border-tech-gold/30 transition-all">
                  <div>
                    <h4 className="font-bold text-gold-100 font-cinzel">{setting.label}</h4>
                    <p className="text-sm text-slate-400 font-inter">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[setting.key as keyof typeof preferences] as boolean}
                      onChange={(e) => setPreferences(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-void-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tech-gold peer-checked:after:bg-white"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-400" />
              Data Export & Import
            </h3>

            <div className="space-y-6">
              <div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                <h4 className="font-bold text-blue-300 mb-2 font-cinzel">Export Your Data</h4>
                <p className="text-blue-200/70 text-sm mb-4 font-inter">
                  Download all your InnerLevel data as a JSON file for backup or transfer purposes.
                </p>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-lg border border-blue-500/50 hover:bg-blue-600/30 transition-all font-cinzel font-bold text-sm hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                >
                  <Download size={16} />
                  Export Data
                </button>
              </div>

              <div className="p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2 font-cinzel">Import Data</h4>
                <p className="text-emerald-200/70 text-sm mb-4 font-inter">
                  Import previously exported InnerLevel data. This will replace your current data.
                </p>
                <label className="flex items-center gap-2 w-fit bg-emerald-600/20 text-emerald-300 px-4 py-2 rounded-lg border border-emerald-500/50 hover:bg-emerald-600/30 transition-all font-cinzel font-bold text-sm cursor-pointer hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <Upload size={16} />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
              <Target className="w-6 h-6 text-tech-magenta" />
              Data Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Activities', value: JSON.parse(localStorage.getItem('innerlevel_tasks') || '[]').length },
                { label: 'Habits Created', value: JSON.parse(localStorage.getItem('innerlevel_habits') || '[]').length },
                { label: 'Tasks Completed', value: JSON.parse(localStorage.getItem('innerlevel_todos') || '[]').filter((t: any) => t.status === 'Completed').length },
                { label: 'Goals Set', value: JSON.parse(localStorage.getItem('innerlevel_goals') || '[]').length },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-void-900/50 border border-white/5 rounded-xl hover:border-tech-magenta/30 transition-all">
                  <div className="text-3xl font-bold text-tech-magenta font-mono mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400 font-inter">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-400" />
              Account Security
            </h3>

            <div className="space-y-6">
              <div className="p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                <h4 className="font-bold text-amber-300 mb-2 font-cinzel flex items-center gap-2">
                  <Key size={16} />
                  Password Management
                </h4>
                <p className="text-amber-200/70 text-sm mb-4 font-inter">
                  Change your password to keep your account secure.
                </p>
                <button className="bg-amber-600/20 text-amber-300 px-4 py-2 rounded-lg border border-amber-500/50 hover:bg-amber-600/30 transition-all font-cinzel font-bold text-sm">
                  Change Password
                </button>
              </div>

              <div className="p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2 font-cinzel flex items-center gap-2">
                  <Lock size={16} />
                  Two-Factor Authentication
                </h4>
                <p className="text-emerald-200/70 text-sm mb-4 font-inter">
                  Add an extra layer of security to your account.
                </p>
                <button className="bg-emerald-600/20 text-emerald-300 px-4 py-2 rounded-lg border border-emerald-500/50 hover:bg-emerald-600/30 transition-all font-cinzel font-bold text-sm">
                  Enable 2FA
                </button>
              </div>

              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                <h4 className="font-bold text-red-300 mb-2 font-cinzel flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete Account
                </h4>
                <p className="text-red-200/70 text-sm mb-4 font-inter">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 bg-red-600/20 text-red-300 px-4 py-2 rounded-lg border border-red-500/50 hover:bg-red-600/30 transition-all font-cinzel font-bold text-sm hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
              <Database className="w-6 h-6 text-slate-400" />
              Account Activity
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-void-900/50 border border-white/5 rounded-xl">
                <div>
                  <h4 className="font-bold text-gold-100 font-cinzel">Last Login</h4>
                  <p className="text-sm text-slate-400 font-inter">Today at 2:30 PM</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-pulse"></div>
              </div>

              <div className="flex justify-between items-center p-4 bg-void-900/50 border border-white/5 rounded-xl">
                <div>
                  <h4 className="font-bold text-gold-100 font-cinzel">Account Created</h4>
                  <p className="text-sm text-slate-400 font-inter">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}