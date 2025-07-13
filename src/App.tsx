import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LogActivity } from './components/LogActivity';
import { Habits } from './components/Habits';
import { TodoList } from './components/TodoList';
import { Rewards } from './components/Rewards';
import { Wellbeing } from './components/Wellbeing';
import { Analytics } from './components/Analytics';
import Goals from './components/Goals'; // NUEVO IMPORT
import { Profile } from './components/Profile';
import { PageType } from './types';
// import { useUserData } from './hooks/useUserData';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  
  // Initialize user data hook - temporarily disabled
  // useUserData();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'log-activity':
        return <LogActivity />;
      case 'habits':
        return <Habits />;
      case 'todo':
        return <TodoList />;
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
      // LifeQuest Cards pages
      case 'card-inventory':
        return <div className="text-amber-200">Card Inventory - Coming Soon</div>;
      case 'quest-designer':
        return <div className="text-amber-200">Quest Designer - Coming Soon</div>;
      case 'card-generator':
        return <div className="text-amber-200">Card Generator - Coming Soon</div>;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <Header onNavigateHome={() => setCurrentPage('dashboard')} />
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