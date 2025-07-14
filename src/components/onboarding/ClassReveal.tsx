import React, { useState, useEffect } from 'react';
import { CharacterClass } from '../../types/index';
import { classDescriptions } from '../../data/personalityTest';
import { Sword, Brain, Palette, Users, Book, Sparkles, Crown, Star } from 'lucide-react';

interface ClassRevealProps {
  dominantClass: CharacterClass;
  secondaryClass: CharacterClass;
  scores: Record<CharacterClass, number>;
  onAccept: () => void;
}

const classIcons: Record<CharacterClass, React.ComponentType<any>> = {
  strategist: Brain,
  warrior: Sword,
  creator: Palette,
  connector: Users,
  sage: Book
};

export function ClassReveal({ dominantClass, secondaryClass, scores, onAccept }: ClassRevealProps) {
  const [showSecondary, setShowSecondary] = useState(false);
  const [showAccept, setShowAccept] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSecondary(true), 2000);
    const timer2 = setTimeout(() => setShowAccept(true), 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const DominantIcon = classIcons[dominantClass];
  const SecondaryIcon = classIcons[secondaryClass];
  const dominantClassInfo = classDescriptions[dominantClass];
  const secondaryClassInfo = classDescriptions[secondaryClass];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Main Class Reveal */}
        <div className="mb-12 animate-fadeIn">
          <div className="relative">
            {/* Glowing Orb Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
            
            {/* Class Icon */}
            <div className="relative z-10 mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30 animate-bounce">
                <DominantIcon className="w-16 h-16 text-slate-900" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-8 h-8 text-amber-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-transparent">
                {dominantClassInfo.name}
              </h1>
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            
            <p className="text-2xl text-amber-300 font-medium italic">
              "{dominantClassInfo.tagline}"
            </p>
            
            <div className="max-w-2xl mx-auto bg-slate-800/90 backdrop-blur-lg border border-amber-500/30 rounded-2xl p-8 mt-8">
              <p className="text-xl text-slate-200 leading-relaxed">
                {dominantClassInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Class */}
        {showSecondary && (
          <div className="mb-12 animate-slideInUp">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Star className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-indigo-300">
                Secondary Affinity: {secondaryClassInfo.name}
              </h2>
              <Star className="w-6 h-6 text-indigo-400" />
            </div>
            
            <div className="max-w-xl mx-auto bg-indigo-900/50 backdrop-blur-lg border border-indigo-500/30 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <SecondaryIcon className="w-8 h-8 text-indigo-300" />
                <p className="text-lg text-indigo-200">
                  "{secondaryClassInfo.tagline}"
                </p>
              </div>
              <p className="text-indigo-200/80 text-sm">
                You show strong traits of {secondaryClassInfo.name.toLowerCase()}, giving you unique versatility in your approach to growth.
              </p>
            </div>
          </div>
        )}

        {/* Scores Breakdown */}
        {showSecondary && (
          <div className="mb-12 animate-slideInUp">
            <h3 className="text-xl font-bold text-slate-300 mb-6">Your Affinity Scores</h3>
            <div className="grid grid-cols-5 gap-4 max-w-3xl mx-auto">
              {Object.entries(scores).map(([className, score]) => {
                const classInfo = classDescriptions[className as CharacterClass];
                const Icon = classIcons[className as CharacterClass];
                const percentage = (score / Math.max(...Object.values(scores))) * 100;
                
                return (
                  <div key={className} className="text-center">
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <Icon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-200 mb-2">
                        {classInfo.name.replace('The ', '')}
                      </p>
                      <div className="w-full bg-slate-600 rounded-full h-2 mb-1">
                        <div 
                          className={`h-2 rounded-full ${
                            className === dominantClass 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : className === secondaryClass
                              ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                              : 'bg-slate-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400">{score} pts</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Character Traits */}
        {showSecondary && (
          <div className="mb-12 animate-slideInUp">
            <div className="max-w-3xl mx-auto bg-slate-800/90 backdrop-blur-lg border border-amber-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-amber-200 mb-6">Your Character Traits</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-amber-300 mb-4">Core Strengths</h4>
                  <div className="space-y-2">
                    {dominantClassInfo.traits.map((trait, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-200">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-amber-300 mb-4">Ideal For</h4>
                  <div className="space-y-2">
                    {dominantClassInfo.idealFor.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-200">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accept Button */}
        {showAccept && (
          <div className="animate-slideInUp">
            <button
              onClick={onAccept}
              className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xl font-bold rounded-2xl shadow-2xl shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200"
            >
              <span className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>Begin Your Quest as {dominantClassInfo.name}</span>
                <Sparkles className="w-6 h-6" />
              </span>
            </button>
            
            <p className="text-slate-400 text-sm mt-4">
              Ready to unlock your true potential? Your adventure awaits!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}