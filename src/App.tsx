import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LogActivity } from './components/LogActivity';
import { Habits } from './components/Habits';
import { TodoList } from './components/TodoList';
import { Rewards } from './components/Rewards';
import { Wellbeing } from './components/Wellbeing';
import { Analytics } from './components/Analytics';
import Goals from './components/Goals'; // NUEVO IMPORT
import { PageType } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

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
      case 'goals': // NUEVO CASE
        return <Goals />;
      case 'rewards':
        return <Rewards />;
      case 'wellbeing':
        return <Wellbeing />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <div className="container mx-auto flex min-h-screen max-w-7xl">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          
          <main className="flex-1 ml-80 p-8 bg-white/95 backdrop-blur-lg rounded-l-3xl mt-5 mb-5 mr-5 shadow-xl overflow-y-auto max-h-[calc(100vh-40px)]">
            <div className="animate-fadeIn">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;