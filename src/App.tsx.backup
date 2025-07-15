import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LogActivity } from './components/LogActivity';
import { Habits } from './components/Habits';
import { Rewards } from './components/Rewards';
import { Wellbeing } from './components/Wellbeing';
import { Analytics } from './components/Analytics';
import Goals from './components/Goals';
import { Profile } from './components/Profile';
import { CharacterHub } from './components/character/CharacterHub';
import { CardDeck } from './components/cards/CardDeck';
import { AICardGenerator } from './components/cards/AICardGenerator';
import { PersonalityTest } from './components/onboarding/PersonalityTest';
import { ClassReveal } from './components/onboarding/ClassReveal';
import { AuthModal } from './components/Auth/AuthModal';
import { PageType } from './types';
import { useAppContext } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import { useAuthenticatedCharacter } from './hooks/useAuthenticatedCharacter';
// import { useUserData } from './hooks/useUserData';

function App() {
  const { state } = useAppContext();
  const { user, loading: authLoading } = useAuth();
  const { createCharacterInDatabase } = useAuthenticatedCharacter();
  const [currentPage, setCurrentPage] = useState<PageType>('character-hub');
  const [onboardingStep, setOnboardingStep] = useState<'test' | 'reveal' | 'complete'>('test');
  const [personalityResult, setPersonalityResult] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Initialize user data hook - temporarily disabled
  // useUserData();

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
  
  const handlePersonalityTestComplete = (result: any) => {
    setPersonalityResult(result);
    setOnboardingStep('reveal');
  };
  
  const handleClassRevealAccept = async () => {
    if (personalityResult && user) {
      const characterData = {
        name: user.email?.split('@')[0] || 'Hero', // Use email username or default
        characterClass: personalityResult.dominantClass,
        personalityResult,
        isOnboarded: true
      };
      
      await createCharacterInDatabase(characterData);
      setOnboardingStep('complete');
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
        </div>
      </div>
    );
  }

  // Show onboarding if user is authenticated but character hasn't completed it
  if (user && needsOnboarding) {
    if (onboardingStep === 'test') {
      return <PersonalityTest onComplete={handlePersonalityTestComplete} />;
    }
    
    if (onboardingStep === 'reveal' && personalityResult) {
      return (
        <ClassReveal
          dominantClass={personalityResult.dominantClass}
          secondaryClass={personalityResult.secondaryClass}
          scores={personalityResult.scores}
          onAccept={handleClassRevealAccept}
        />
      );
    }
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
        return <AICardGenerator />;
      case 'training-ground':
        return <div className="text-amber-200">Training Ground - Coming Soon</div>;
      case 'character-sheet':
        return <div className="text-amber-200">Character Sheet - Coming Soon</div>;
      case 'guild-settings':
        return <div className="text-amber-200">Guild Settings - Coming Soon</div>;
      // Legacy pages (for migration)
      case 'log-activity':
        return <LogActivity />;
      case 'habits':
        return <Habits />;
      case 'goals':
        return <Goals />;
      case 'rewards':
        return <Rewards />;
      case 'wellbeing':
        return <Wellbeing />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile />;
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