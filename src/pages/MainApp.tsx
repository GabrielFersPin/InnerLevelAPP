import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CharacterHub } from '../components/character/CharacterHub';
import CharacterSheet from '../components/character/CharacterSheet';
import { CardDeck } from '../components/cards/CardDeck';
import { MysticForge } from '../components/cards/MysticForge';
import { ClassReveal } from '../components/onboarding/ClassReveal';
import { AuthModal } from '../components/Auth/AuthModal';
import { GuildSettings } from '../components/GuildSettings';
import { PageType } from '../types';
import { CharacterClass } from '../types';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useAuthenticatedCharacter } from '../hooks/useAuthenticatedCharacter';
import { TrainingGround } from '../components/TrainingGround';
import Inventory from '../components/Inventory';

import rpgBackground from '../assets/rpg_background.png';

export function MainApp() {
  const { state } = useAppContext();
  const { user, loading: authLoading } = useAuth();
  const { createCharacterInDatabase } = useAuthenticatedCharacter();
  const [currentPage, setCurrentPage] = useState<PageType>('character-hub');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show auth modal if user is not authenticated and not loading
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    } else if (user) {
      setShowAuthModal(false);
    }
  }, [user, authLoading]);

  // Check if character needs onboarding
  const needsOnboarding = !state.character?.isOnboarded;

  // Handle class selection and character creation
  const handleClassSelect = async (selectedClass: CharacterClass) => {
    if (user) {
      const characterData = {
        name: user.email?.split('@')[0] || 'Hero',
        characterClass: selectedClass,
        isOnboarded: true
      };
      await createCharacterInDatabase(characterData);
      setCurrentPage('character-hub');
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-void-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/20 animate-pulse">
            <div className="w-8 h-8 bg-void-950 rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-gold-200 mb-2 font-cinzel">Entering the Realm...</h2>
          <p className="text-slate-400 font-inter">Preparing your adventure</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-gold-600 text-void-950 rounded-lg hover:bg-gold-500 transition-colors font-bold"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding if user is authenticated but character hasn't completed it
  if (user && needsOnboarding) {
    return <ClassReveal onAccept={handleClassSelect} />;
  }

  // Don't render main app if user is not authenticated
  if (!user) {
    return (
      <>
        <div
          className="min-h-screen bg-void-950 bg-repeat flex items-center justify-center relative overflow-hidden"
          style={{ backgroundImage: `url(${rpgBackground})` }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-void-950/80 pointer-events-none"></div>

          <div className="text-center z-10 relative">
            <h1 className="text-5xl font-bold text-gold-100 mb-4 font-cinzel text-glow">LifeQuest RPG</h1>
            <p className="text-slate-300 text-lg font-inter">Transform your life into an epic adventure</p>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'character-hub':
        return <CharacterHub />;
      case 'card-deck':
        return <CardDeck onNavigateToAI={() => setCurrentPage('ai-card-generator')} />;
      case 'ai-card-generator':
        return <MysticForge />;
      case 'training-ground':
        return <TrainingGround />;
      case 'character-sheet':
        return <CharacterSheet />;
      case 'guild-settings':
        return <GuildSettings />;
      // Legacy pages (for migration)
      case 'log-activity':
        return <div className="text-gold-200 font-cinzel text-xl p-8">Log Activity - Coming Soon</div>;
      case 'habits':
        return <div className="text-gold-200 font-cinzel text-xl p-8">Habits - Coming Soon</div>;
      case 'goals':
        return <div className="text-gold-200 font-cinzel text-xl p-8">Goals - Coming Soon</div>;
      case 'rewards':
        return <Inventory />;
      case 'wellbeing':
        return <div className="text-gold-200 font-cinzel text-xl p-8">Wellbeing - Coming Soon</div>;
      case 'analytics':
        return <div className="text-gold-200 font-cinzel text-xl p-8">Analytics - Coming Soon</div>;
      case 'profile':
        return <div className="text-gold-200 font-cinzel text-xl p-8">Profile - Coming Soon</div>;
      default:
        return <CharacterHub />;
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-void-950 bg-repeat text-slate-200 font-inter selection:bg-gold-500/30 relative"
        style={{ backgroundImage: `url(${rpgBackground})` }}
      >
        <div className="absolute inset-0 bg-void-950/90 pointer-events-none fixed"></div>
        <div className="relative z-10">
          <Header onNavigateHome={() => setCurrentPage('character-hub')} />
          <div className="container mx-auto flex min-h-screen max-w-7xl relative">
            <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
            <main className="flex-1 ml-80 p-8 my-6 mr-6 overflow-y-auto max-h-[calc(100vh-48px)] relative z-10">
              <div className="animate-fadeIn">
                {renderCurrentPage()}
              </div>
            </main>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </>
  );
}
