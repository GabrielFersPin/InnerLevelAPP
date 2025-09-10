import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './Auth/AuthModal';
import { LogIn, Home, LogOut } from 'lucide-react';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export function Header({ onNavigateHome }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {/* Home Button - Always visible */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-lg px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-500/30 hover:border-amber-400"
          title="Go to Character Hub"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-slate-200">Hub</span>
        </button>

        {/* Sign In/Out Button */}
        {user && profile ? (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-slate-700/90 backdrop-blur-lg px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-300"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-amber-400 hover:to-amber-500 font-bold"
          >
            <LogIn className="w-4 h-4" />
            <span className="font-medium">Enter Realm</span>
          </button>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}