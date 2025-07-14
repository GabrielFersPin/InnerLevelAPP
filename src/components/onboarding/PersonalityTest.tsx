import React, { useState } from 'react';
import { personalityQuestions, classDescriptions, calculatePersonalityResult } from '../../data/personalityTest';
import { CharacterClass } from '../../types/index';
import { ChevronLeft, ChevronRight, Brain, Sparkles } from 'lucide-react';

interface PersonalityTestProps {
  onComplete: (result: { dominantClass: CharacterClass; secondaryClass: CharacterClass; scores: Record<CharacterClass, number> }) => void;
}

export function PersonalityTest({ onComplete }: PersonalityTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, CharacterClass>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (questionId: number, selectedClass: CharacterClass) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedClass }));
  };

  const nextQuestion = () => {
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Test complete
      const result = calculatePersonalityResult(answers);
      setIsComplete(true);
      setTimeout(() => onComplete(result), 2000); // Show completion animation first
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;
  const question = personalityQuestions[currentQuestion];
  const hasAnswered = answers[question.id] !== undefined;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <Sparkles className="w-24 h-24 text-amber-400 mx-auto mb-8" />
          </div>
          <h1 className="text-4xl font-bold text-amber-200 mb-4">
            ✨ Analyzing Your Results ✨
          </h1>
          <p className="text-xl text-slate-300">
            The mystical energies are revealing your true class...
          </p>
          <div className="mt-8 w-full bg-slate-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Brain className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-amber-200 mb-2">
            LifeQuest Personality Assessment
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Discover your inner class and unlock your true potential
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-400">
            Question {currentQuestion + 1} of {personalityQuestions.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800/90 backdrop-blur-lg border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-amber-200 mb-8 text-center">
            {question.question}
          </h2>
          
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option.class)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                  answers[question.id] === option.class
                    ? 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20'
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700'
                }`}
              >
                <p className="text-slate-200 text-lg leading-relaxed">
                  {option.text}
                </p>
                {answers[question.id] === option.class && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-slate-900">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Selected
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
              currentQuestion === 0
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-500'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              {Object.keys(answers).length} / {personalityQuestions.length} answered
            </p>
          </div>

          <button
            onClick={nextQuestion}
            disabled={!hasAnswered}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
              !hasAnswered
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : currentQuestion === personalityQuestions.length - 1
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:from-amber-600 hover:to-orange-600 shadow-lg'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-500'
            }`}
          >
            {currentQuestion === personalityQuestions.length - 1 ? 'Reveal My Class' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Answer honestly - there are no wrong choices. Each path leads to greatness.
          </p>
        </div>
      </div>
    </div>
  );
}