import { useState } from 'react';
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
import { PageType } from './types';
import { useAppContext } from './context/AppContext';
// import { useUserData } from './hooks/useUserData';

function App() {
  const { state, dispatch } = useAppContext();
  const [currentPage, setCurrentPage] = useState<PageType>('character-hub');
  const [onboardingStep, setOnboardingStep] = useState<'test' | 'reveal' | 'complete'>('test');
  const [personalityResult, setPersonalityResult] = useState<any>(null);
  
  // Initialize user data hook - temporarily disabled
  // useUserData();
  
  // Check if character needs onboarding
  const needsOnboarding = !state.character?.isOnboarded;
  
  const handlePersonalityTestComplete = (result: any) => {
    setPersonalityResult(result);
    setOnboardingStep('reveal');
  };
  
  const handleClassRevealAccept = () => {
    if (personalityResult) {
      dispatch({
        type: 'CREATE_CHARACTER',
        payload: {
          name: 'Hero', // Could be customizable
          characterClass: personalityResult.dominantClass,
          personalityResult
        }
      });
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      setOnboardingStep('complete');
      setCurrentPage('character-hub');
    }
  };
  
  // Show onboarding if character hasn't completed it
  if (needsOnboarding) {
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
  );
}

export default App;