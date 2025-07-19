import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { classDescriptions } from '../../data/personalityTest';
import { getClassTheme, calculateLevelFromXP, getXPRequiredForNextLevel } from '../../data/characterClasses';
import { ArcaneEngine } from "../../services/arcaneEngine";
import { Crown, Zap, Target, Star, TrendingUp, Calendar, Sparkles, Brain, RefreshCw, Clock, CheckCircle, Award, BarChart3, Trophy, CalendarDays, Timer, Users, BookOpen, Heart, Briefcase } from 'lucide-react';
import type { Card, Goal, Task } from '../../types/index';

export function CharacterSheet() {
  const { state, dispatch } = useAppContext();
  const { character, goals, tasks } = state;
  const [oracleGuidance, setAiRecommendations] = useState<Card[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [showAICards, setShowAICards] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'stats' | 'history'>('overview');
  
  if (!character) return null;

  const classInfo = classDescriptions[character.class];
  const theme = getClassTheme(character.class);
  const currentLevel = calculateLevelFromXP(character.experience);
  const xpForNextLevel = getXPRequiredForNextLevel(currentLevel);
  const xpProgress = character.experience - getXPRequiredForNextLevel(currentLevel - 1);
  const xpNeeded = xpForNextLevel - getXPRequiredForNextLevel(currentLevel - 1);
  const progressPercent = Math.min(100, (xpProgress / xpNeeded) * 100);
  
  const availableCards = state.cards?.inventory || [];
  const energyPercent = (character.energy.current / character.energy.maximum) * 100;

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.points > 0).length;
  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
  const averagePoints = totalTasks > 0 ? Math.round(totalPoints / totalTasks) : 0;
  
  // Calculate goal statistics
  const activeGoals = goals.filter(goal => goal.status === 'Active');
  const completedGoals = goals.filter(goal => goal.status === 'Completed');
  const pausedGoals = goals.filter(goal => goal.status === 'Paused');
  
  // Calculate time statistics
  const today = new Date();
  const thisWeek = tasks.filter(task => {
    const taskDate = new Date(task.date);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return taskDate >= weekAgo;
  });
  const thisMonth = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
  });

  // Load AI recommendations on component mount
  useEffect(() => {
    loadAIRecommendations();
  }, [character.class, character.level, character.energy.current]);

  const loadAIRecommendations = async () => {
    setIsLoadingAI(true);
    try {
      const recommendation = await ArcaneEngine.getSmartRecommendations(character);
      setAiRecommendations(recommendation.cards);
      setAiInsight(recommendation.reasoning);
    } catch (error) {
      console.log('Using fallback recommendations:', error);
      setAiRecommendations(availableCards.slice(0, 3));
      setAiInsight(`Curated ${character.class} cards based on your current level and energy`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const refreshAIRecommendations = async () => {
    await loadAIRecommendations();
  };

  const handleExecuteCard = (card: Card) => {
    // Add card to inventory for execution
    dispatch({ type: 'ADD_CARD', payload: card });
    // Could also directly execute the card here
  };

  const displayedRecommendations = showAICards ? oracleGuidance : availableCards.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRemaining = (goal: Goal) => {
    if (!goal.timeframe) return 'No deadline';
    
    const deadline = new Date(goal.createdAt);
    const timeframeDays = goal.timeframe.includes('week') ? 7 : 
                         goal.timeframe.includes('month') ? 30 : 
                         goal.timeframe.includes('year') ? 365 : 1;
    
    deadline.setDate(deadline.getDate() + timeframeDays);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days remaining`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-200 mb-2">
          Character Sheet - {character.name}
        </h1>
        <p className="text-xl text-slate-300">
          Complete overview of your {classInfo.name} journey
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Crown },
          { id: 'goals', label: 'Goals & Quests', icon: Target },
          { id: 'stats', label: 'Statistics', icon: BarChart3 },
          { id: 'history', label: 'History', icon: Calendar }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Character Overview */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Avatar & Class Info */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Crown className="w-16 h-16 text-slate-900" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                      Level {character.level}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-amber-200 mb-2">
                  {classInfo.name}
                </h2>
                <p className="text-amber-300 italic mb-4">
                  "{classInfo.tagline}"
                </p>
                
                {/* XP Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Experience</span>
                    <span>{character.experience} / {xpForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  {character.level < 50 && (
                    <p className="text-xs text-slate-400">
                      {xpForNextLevel - character.experience} XP to level {currentLevel + 1}
                    </p>
                  )}
                </div>
              </div>

              {/* Energy Meter */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-200 flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  {classInfo.energyType}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Current</span>
                    <span>{Math.round(character.energy.current)} / {character.energy.maximum}</span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-300 ${
                        energyPercent > 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        energyPercent > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        energyPercent > 25 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        'bg-gradient-to-r from-red-600 to-red-700'
                      }`}
                      style={{ width: `${energyPercent}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-slate-400 text-center">
                    Regenerates {character.energy.regenerationRate}/hour
                  </div>
                </div>

                {/* Energy Status */}
                <div className={`p-3 rounded-lg ${
                  energyPercent > 75 ? 'bg-green-900/30 border border-green-500/30' :
                  energyPercent > 50 ? 'bg-yellow-900/30 border border-yellow-500/30' :
                  energyPercent > 25 ? 'bg-orange-900/30 border border-orange-500/30' :
                  'bg-red-900/30 border border-red-500/30'
                }`}>
                  <p className="text-sm text-center">
                    {energyPercent > 75 ? '⚡ Fully Energized - Perfect for challenging cards!' :
                     energyPercent > 50 ? '💪 Good Energy - Ready for most activities' :
                     energyPercent > 25 ? '😴 Low Energy - Consider lighter tasks or rest' :
                     '🛌 Very Low Energy - Time for recovery'}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-200 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Today's Progress
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-300">
                      {character.dailyProgress.cardsCompleted}
                    </div>
                    <div className="text-xs text-slate-400">Cards Completed</div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-300">
                      {character.dailyProgress.xpGained}
                    </div>
                    <div className="text-xs text-slate-400">XP Gained</div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-300">
                      {character.streak}
                    </div>
                    <div className="text-xs text-slate-400">Day Streak</div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-300">
                      {availableCards.length}
                    </div>
                    <div className="text-xs text-slate-400">Available Cards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Overview */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2" />
              Class Skills
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(character.skills).map(([skillName, skill]) => {
                const progressPercent = (skill.experience / 100) * 100;
                
                return (
                  <div key={skillName} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-200">{skillName}</span>
                      <span className="text-sm text-amber-300 font-bold">Level {skill.level}</span>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-xs text-slate-400 text-center">
                      {skill.experience}/100 XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI-Powered Daily Recommendations */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-amber-200 flex items-center">
                {showAICards ? (
                  <>
                    <Brain className="w-6 h-6 mr-2" />
                    AI Recommendations
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-2" />
                    Class Cards
                  </>
                )}
              </h3>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAICards(!showAICards)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    showAICards 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {showAICards ? 'Show Class Cards' : 'AI Powered'}
                </button>
                
                {showAICards && (
                  <button
                    onClick={refreshAIRecommendations}
                    disabled={isLoadingAI}
                    className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50"
                    title="Refresh AI recommendations"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingAI ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* AI Insight Banner */}
            {showAICards && aiInsight && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-purple-300 mb-1">AI Insight</h4>
                    <p className="text-sm text-slate-300">{aiInsight}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoadingAI && showAICards ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Generating personalized recommendations...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  {displayedRecommendations.map((card) => {
                    const canAfford = character.energy.current >= card.energyCost;
                    const typeIcon = card.type === 'action' ? '⚔️' : 
                                   card.type === 'power' ? '✨' : 
                                   card.type === 'recovery' ? '💚' : 
                                   card.type === 'event' ? '📅' : '🛡️';
                    
                    return (
                      <div key={card.id} className={`rounded-xl p-6 border transition-all hover:scale-105 ${
                        showAICards 
                          ? 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30 hover:border-purple-400/50'
                          : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-medium text-slate-200">{card.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{typeIcon}</span>
                            {showAICards && card.forged && (
                              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">AI</span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                          {card.description}
                        </p>

                        {/* Skill Bonuses for AI cards */}
                        {showAICards && card.skillBonus && card.skillBonus.length > 0 && (
                          <div className="mb-3 text-xs">
                            <div className="text-purple-300 font-medium mb-1">Skill Bonuses:</div>
                            <div className="space-x-2">
                              {card.skillBonus.map((bonus, i) => (
                                <span key={i} className="text-purple-400">
                                  {bonus.skillName} +{bonus.xpBonus}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                          <span>⚡ {card.energyCost} Energy</span>
                          <span>⏱️ {card.duration}h</span>
                          <span>✨ +{card.impact} XP</span>
                        </div>
                        
                        <button 
                          onClick={() => handleExecuteCard(card)}
                          disabled={!canAfford}
                          className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                            !canAfford
                              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                              : showAICards
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                              : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700'
                          }`}
                        >
                          {!canAfford ? 'Not Enough Energy' : 'Add to Deck'}
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-center mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all">
                    View All Available Cards
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-8">
          {/* Active Goals */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Active Quests ({activeGoals.length})
            </h3>
            
            {activeGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No active goals. Start a new quest to begin your journey!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-200">{goal.title}</h4>
                          <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                            {getPriorityIcon(goal.priority)} {goal.priority}
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">{goal.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created: {formatDate(goal.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {getTimeRemaining(goal)}
                          </span>
                          <span className="flex items-center">
                            <Timer className="w-4 h-4 mr-1" />
                            {goal.timeframe || 'No timeframe'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Progress</span>
                        <span>{goal.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
              <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2" />
                Completed Quests ({completedGoals.length})
              </h3>
              
              <div className="space-y-4">
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-200">{goal.title}</h4>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Completed: {formatDate(goal.createdAt)}</span>
                      <span>Timeframe: {goal.timeframe || 'No timeframe'}</span>
                      <span>Priority: {goal.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paused Goals */}
          {pausedGoals.length > 0 && (
            <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
              <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                Paused Quests ({pausedGoals.length})
              </h3>
              
              <div className="space-y-4">
                {pausedGoals.map((goal) => (
                  <div key={goal.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-300">{goal.title}</h4>
                      <span className="text-sm text-slate-400">Paused</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Created: {formatDate(goal.createdAt)}</span>
                      <span>Progress: {goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          {/* Task Statistics */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Task Statistics
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-amber-300 mb-2">{totalTasks}</div>
                <div className="text-sm text-slate-400">Total Tasks</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-green-400 mb-2">{completedTasks}</div>
                <div className="text-sm text-slate-400">Completed</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-blue-400 mb-2">{totalPoints}</div>
                <div className="text-sm text-slate-400">Total Points</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-purple-400 mb-2">{averagePoints}</div>
                <div className="text-sm text-slate-400">Avg Points/Task</div>
              </div>
            </div>

            {/* Time-based Statistics */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-2xl font-bold text-amber-300 mb-2">{thisWeek.length}</div>
                <div className="text-sm text-slate-400">Tasks This Week</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-2xl font-bold text-amber-300 mb-2">{thisMonth.length}</div>
                <div className="text-sm text-slate-400">Tasks This Month</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-2xl font-bold text-amber-300 mb-2">{character.streak}</div>
                <div className="text-sm text-slate-400">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Goal Statistics */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Goal Statistics
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-blue-400 mb-2">{activeGoals.length}</div>
                <div className="text-sm text-slate-400">Active Goals</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-green-400 mb-2">{completedGoals.length}</div>
                <div className="text-sm text-slate-400">Completed</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{pausedGoals.length}</div>
                <div className="text-sm text-slate-400">Paused</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-purple-400 mb-2">{goals.length}</div>
                <div className="text-sm text-slate-400">Total Goals</div>
              </div>
            </div>

            {/* Goal Completion Rate */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-300 font-medium">Goal Completion Rate</span>
                <span className="text-amber-300 font-bold">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Character Achievement Stats */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2" />
              Character Achievements
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-amber-300 mb-2">{character.level}</div>
                <div className="text-sm text-slate-400">Current Level</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-amber-300 mb-2">{character.experience}</div>
                <div className="text-sm text-slate-400">Total XP</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-amber-300 mb-2">{character.dailyProgress.cardsCompleted}</div>
                <div className="text-sm text-slate-400">Cards Completed Today</div>
              </div>
              
              <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-amber-300 mb-2">{availableCards.length}</div>
                <div className="text-sm text-slate-400">Available Cards</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-8">
          {/* Recent Tasks */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Recent Task History
            </h3>
            
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No tasks completed yet. Start your journey!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tasks.slice(-10).reverse().map((task) => (
                  <div key={task.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-slate-200">{task.task}</h4>
                          <span className="text-sm text-amber-300 font-bold">+{task.points} pts</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(task.date)}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {task.category}
                          </span>
                          {task.comment && (
                            <span className="text-slate-300 italic">"{task.comment}"</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Character Progress Timeline */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Character Progress Timeline
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">Character Created</h4>
                  <p className="text-sm text-slate-400">Began journey as {classInfo.name}</p>
                </div>
                <span className="text-sm text-slate-500">Level 1</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">Current Status</h4>
                  <p className="text-sm text-slate-400">Level {character.level} with {character.experience} XP</p>
                </div>
                <span className="text-sm text-slate-500">Level {character.level}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">Daily Streak</h4>
                  <p className="text-sm text-slate-400">{character.streak} consecutive days of activity</p>
                </div>
                <span className="text-sm text-slate-500">{character.streak} days</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">Cards Mastered</h4>
                  <p className="text-sm text-slate-400">{character.dailyProgress.cardsCompleted} cards completed today</p>
                </div>
                <span className="text-sm text-slate-500">{character.dailyProgress.cardsCompleted} cards</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 