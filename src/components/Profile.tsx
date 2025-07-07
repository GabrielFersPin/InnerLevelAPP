import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { showAlert } from '../utils/notifications';
import { User, Mail, Edit2, Save, X, Shield, Bell, Palette, Database, Download, Upload, Trash2 } from 'lucide-react';

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
    } catch (error) {
      showAlert('Failed to update profile', 'error');
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
        <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Please sign in to access your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">👤 Profile & Settings</h2>
        <p className="text-gray-600">
          Manage your account, preferences, and data settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
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
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Profile Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{profile.username}</h4>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
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
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
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
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">App Preferences</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Theme Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setPreferences(prev => ({ ...prev, theme: theme.value }))}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        preferences.theme === theme.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${theme.color} mb-2`}></div>
                      <span className="text-xs font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Notifications</h3>
            
            <div className="space-y-4">
              {[
                { key: 'notifications', label: 'Push Notifications', description: 'Receive notifications for important updates' },
                { key: 'emailUpdates', label: 'Email Updates', description: 'Get updates and tips via email' },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly progress summaries' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-800">{setting.label}</h4>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[setting.key as keyof typeof preferences] as boolean}
                      onChange={(e) => setPreferences(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Data Export & Import</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">Export Your Data</h4>
                <p className="text-blue-700 text-sm mb-4">
                  Download all your InnerLevel data as a JSON file for backup or transfer purposes.
                </p>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Export Data
                </button>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Import Data</h4>
                <p className="text-green-700 text-sm mb-4">
                  Import previously exported InnerLevel data. This will replace your current data.
                </p>
                <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Data Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Activities', value: JSON.parse(localStorage.getItem('innerlevel_tasks') || '[]').length },
                { label: 'Habits Created', value: JSON.parse(localStorage.getItem('innerlevel_habits') || '[]').length },
                { label: 'Tasks Completed', value: JSON.parse(localStorage.getItem('innerlevel_todos') || '[]').filter((t: any) => t.status === 'Completed').length },
                { label: 'Goals Set', value: JSON.parse(localStorage.getItem('innerlevel_goals') || '[]').length },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Account Security</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-yellow-800 mb-2">Password Management</h4>
                <p className="text-yellow-700 text-sm mb-4">
                  Change your password to keep your account secure.
                </p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Change Password
                </button>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Two-Factor Authentication</h4>
                <p className="text-green-700 text-sm mb-4">
                  Add an extra layer of security to your account.
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Enable 2FA
                </button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                <p className="text-red-700 text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Account Activity</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Last Login</h4>
                  <p className="text-sm text-gray-600">Today at 2:30 PM</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Account Created</h4>
                  <p className="text-sm text-gray-600">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}