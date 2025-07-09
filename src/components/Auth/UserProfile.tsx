import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { showAlert } from '../../utils/notifications';
import { User, Mail, Edit2, Save, X } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    email: profile?.email || '',
  });

  const handleSave = async () => {
    try {
      const { error } = await updateProfile({
        username: formData.username,
        email: formData.email,
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

  const handleSignOut = async () => {
    try {
      await signOut();
      showAlert('Signed out successfully', 'success');
      onClose();
    } catch (error) {
      showAlert('Failed to sign out', 'error');
    }
  };

  if (!isOpen || !user || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
          <p className="text-gray-600 mt-2">Manage your account settings</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
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
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl transition-all ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p><strong>Account created:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
            <p><strong>Last updated:</strong> {new Date(profile.updated_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    username: profile.username,
                    email: profile.email,
                  });
                }}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 transition-all duration-300 font-medium"
          >
            Sign Out
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}