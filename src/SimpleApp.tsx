import React from 'react';

function SimpleApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-amber-200 mb-8">⚔️ LifeQuest Cards</h1>
        <div className="bg-slate-800/90 backdrop-blur-lg border border-amber-500/30 rounded-3xl p-8">
          <h2 className="text-2xl text-amber-200 mb-4">War Room Dashboard</h2>
          <p className="text-slate-200">Your RPG adventure awaits!</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-xl border border-amber-500/20">
              <h3 className="text-amber-200 font-bold">⚡ Energy</h3>
              <div className="w-full bg-slate-600 rounded-full h-4 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-4 rounded-full" style={{width: '85%'}}></div>
              </div>
              <p className="text-slate-300 text-sm mt-1">85/100</p>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-xl border border-amber-500/20">
              <h3 className="text-amber-200 font-bold">🎴 Cards</h3>
              <p className="text-slate-300">15 in inventory</p>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-xl border border-amber-500/20">
              <h3 className="text-amber-200 font-bold">🗡️ Active Quests</h3>
              <p className="text-slate-300">3 in progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;