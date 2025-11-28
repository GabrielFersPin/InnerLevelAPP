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
          className="flex items-center gap-2 bg-void-900/80 backdrop-blur-lg px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gold-500/30 hover:border-gold-400 group"
          title="Go to Character Hub"
        >
          <Home className="w-4 h-4 text-gold-400 group-hover:text-gold-300" />
          <span className="text-sm font-medium text-slate-200 group-hover:text-white font-cinzel">Hub</span>
        </button>

        {/* Sign In/Out Button */}
        {user && profile ? (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-void-900/80 backdrop-blur-lg px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-300 group"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium font-cinzel">Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-void-950 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-gold-400 hover:to-gold-500 font-bold border border-gold-400/50"
          >
            <LogIn className="w-4 h-4" />
            <span className="font-medium font-cinzel">Enter Realm</span>
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