import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CharacterHub } from './components/character/CharacterHub';
import CharacterSheet from './components/character/CharacterSheet';
import { CardDeck } from './components/cards/CardDeck';
import { MysticForge } from './components/cards/MysticForge';
import { ClassReveal } from './components/onboarding/ClassReveal';
import { AuthModal } from './components/Auth/AuthModal';
import { GuildSettings } from './components/GuildSettings';
import { PageType } from './types';
import { CharacterClass } from './types';
import { useAppContext } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import { useAuthenticatedCharacter } from './hooks/useAuthenticatedCharacter';
import { TrainingGround } from './components/TrainingGround';
import Inventory from './components/Inventory';
import GuildSettings from './components/GuildSettings';


// import { useUserData } from './hooks/useUserData';

function App() {
  const { state } = useAppContext();
  const { user, loading: authLoading } = useAuth();
  const { createCharacterInDatabase } = useAuthenticatedCharacter();
  const [currentPage, setCurrentPage] = useState<PageType>('character-hub');
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Remove onboardingStep and personalityResult

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-slate-900 rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-amber-200 mb-2">Entering the Realm...</h2>
          <p className="text-slate-300">Preparing your adventure</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-amber-600 text-slate-900 rounded-lg hover:bg-amber-500 transition-colors"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-amber-200 mb-4">LifeQuest RPG</h1>
            <p className="text-slate-300 text-lg">Transform your life into an epic adventure</p>
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
        return <div className="text-amber-200">Log Activity - Coming Soon</div>;
      case 'habits':
        return <div className="text-amber-200">Habits - Coming Soon</div>;
      case 'goals':
        return <div className="text-amber-200">Goals - Coming Soon</div>;
      case 'rewards':
        return <Inventory />;
      case 'wellbeing':
        return <div className="text-amber-200">Wellbeing - Coming Soon</div>;
      case 'analytics':
        return <div className="text-amber-200">Analytics - Coming Soon</div>;
      case 'profile':
        return <div className="text-amber-200">Profile - Coming Soon</div>;
      default:
        return <CharacterHub />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <Header onNavigateHome={() => setCurrentPage('character-hub')} />
        <div className="container mx-auto flex min-h-screen max-w-7xl">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          <main className="flex-1 ml-80 p-8 bg-slate-800/90 backdrop-blur-lg border border-amber-500/30 rounded-l-3xl mt-5 mb-5 mr-5 shadow-2xl overflow-y-auto max-h-[calc(100vh-40px)]">
            <div className="animate-fadeIn">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

export default App;