import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './Auth/AuthModal';
import { UserProfile } from './Auth/UserProfile';
import { User, LogIn, Home } from 'lucide-react';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export function Header({ onNavigateHome }: HeaderProps) {
  const { user, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {/* Home Button - Always visible */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-lg px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300"
          title="Go to Dashboard"
        >
          <Home className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Dashboard</span>
        </button>

        {/* User Profile or Sign In Button */}
        {user && profile ? (
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-3 bg-white/95 backdrop-blur-lg px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800">{profile.username}</div>
              <div className="text-xs text-gray-600">{profile.email}</div>
            </div>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-purple-800"
          >
            <LogIn className="w-4 h-4" />
            <span className="font-medium">Sign In</span>
          </button>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <UserProfile 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
}