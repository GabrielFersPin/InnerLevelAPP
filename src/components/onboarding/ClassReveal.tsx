import React, { useState } from 'react';
import { CharacterClass } from '../../types/index';
import { classDescriptions } from '../../data/personalityTest';
import { Sword, Brain, Palette, Users, Book, Sparkles, Crown } from 'lucide-react';

interface ClassRevealProps {
  onAccept: (selectedClass: CharacterClass) => void;
}

const classIcons: Record<CharacterClass, React.ComponentType<any>> = {
  strategist: Brain,
  warrior: Sword,
  creator: Palette,
  connector: Users,
  sage: Book
};

export function ClassReveal({ onAccept }: ClassRevealProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-amber-200 mb-8">Choose Your Character Class</h1>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.entries(classDescriptions).map(([className, classInfo]) => {
            const Icon = classIcons[className as CharacterClass];
            const isSelected = selectedClass === className;
            return (
              <button
                key={className}
                onClick={() => setSelectedClass(className as CharacterClass)}
                className={`rounded-2xl p-8 shadow-2xl border-4 transition-all w-full h-full flex flex-col items-center justify-between space-y-4
                  ${isSelected ? 'border-amber-400 bg-slate-800/80 scale-105' : 'border-slate-700 bg-slate-800/60 hover:border-amber-300 hover:scale-105'}`}
              >
                <div className="mb-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Icon className="w-12 h-12 text-slate-900" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-amber-200 mb-2">{classInfo.name}</h2>
                <p className="text-amber-300 italic mb-2">"{classInfo.tagline}"</p>
                <p className="text-slate-200 text-sm mb-2">{classInfo.description}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {classInfo.traits.map((trait, i) => (
                    <span key={i} className="bg-amber-700/30 text-amber-200 px-2 py-1 rounded text-xs">{trait}</span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {classInfo.idealFor.map((area, i) => (
                    <span key={i} className="bg-indigo-700/30 text-indigo-200 px-2 py-1 rounded text-xs">{area}</span>
                  ))}
                </div>
                <div className="text-xs text-slate-400 mb-1">Energy: <span className="text-amber-300 font-bold">{classInfo.energyType}</span> | Max: {classInfo.maxEnergy} | Regen: {classInfo.regenRate}/hr</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {classInfo.primarySkills.map((skill, i) => (
                    <span key={i} className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs">{skill}</span>
                  ))}
                </div>
                {isSelected && <div className="mt-4"><Crown className="w-8 h-8 text-amber-400 mx-auto animate-bounce" /></div>}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => selectedClass && onAccept(selectedClass)}
          disabled={!selectedClass}
          className={`px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xl font-bold rounded-2xl shadow-2xl shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 ${!selectedClass ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6" />
            <span>Begin Your Quest</span>
            <Sparkles className="w-6 h-6" />
          </span>
        </button>
      </div>
    </div>
  );
}