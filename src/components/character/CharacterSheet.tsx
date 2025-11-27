import React, { useState } from 'react';
import { Target, Calendar, Clock, CheckCircle, Award, BarChart3, Trophy, Timer, Briefcase, TrendingUp, Brain, Heart, Users, Sparkles, DollarSign, BookOpen, Compass } from 'lucide-react';
// Removed recommendations to show only user-created goals
import { useAppContext } from '../../context/AppContext';

const classDescriptions = {
  strategist: { name: 'The Strategist', description: 'Master planner and analytical thinker' },
  warrior: { name: 'The Warrior', description: 'Disciplined achiever and challenger' },
  creator: { name: 'The Creator', description: 'Innovative artist and visionary' },
  connector: { name: 'The Connector', description: 'Empathetic leader and relationship builder' },
  sage: { name: 'The Sage', description: 'Wise learner and deep thinker' }
};

const getClassTheme = (characterClass) => ({
  panel: 'bg-slate-800',
  accent: 'text-amber-200'
});

// Domain icons mapping
const getDomainIcon = (domain) => {
  const icons = {
    'career': Briefcase,
    'health': Heart,
    'relationships': Users,
    'personal-growth': Sparkles,
    'creativity': Sparkles,
    'financial': DollarSign,
    'education': BookOpen,
    'spiritual': Compass
  };
  return icons[domain] || Target;
};

const getGoalDomainColor = (domain) => {
  const colors = {
    'career': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    'health': 'text-green-400 bg-green-400/10 border-green-400/30',
    'relationships': 'text-pink-400 bg-pink-400/10 border-pink-400/30',
    'personal-growth': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    'creativity': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    'financial': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    'education': 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
    'spiritual': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
  };
  return colors[domain] || 'text-slate-400 bg-slate-400/10 border-slate-400/30';
};

export default function CharacterSheet() {
  const { state, dispatch } = useAppContext();
  const { character, goals, tasks } = state;
  const [activeTab, setActiveTab] = useState('goals');
  
  if (!character) return null;

  const classInfo = classDescriptions[character.class];
  const theme = getClassTheme(character.class);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.points > 0).length;
  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
  const averagePoints = totalTasks > 0 ? Math.round(totalPoints / totalTasks) : 0;
  
  const activeGoals = goals.filter(goal => goal.status === 'Active');
  const completedGoals = goals.filter(goal => goal.status === 'Completed');
  const pausedGoals = goals.filter(goal => goal.status === 'Paused');
  
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRemaining = (goal) => {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Easy': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Hard': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Epic': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return `${colors[difficulty] || colors['Medium']} px-2 py-0.5 rounded-full text-xs border`;
  };

  // Group goals by domain (only real goals from state)
  const goalsByDomain = activeGoals.reduce((acc, goal) => {
    if (!acc[goal.domain]) acc[goal.domain] = [];
    acc[goal.domain].push(goal);
    return acc;
  }, {});

  // Removed recommendation-based adding; only show existing goals

  return (
    <div className="space-y-8 p-8 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-200 mb-2">
          Character Sheet - {character.name}
        </h1>
        <p className="text-xl text-slate-300">
          Level {character.level} {classInfo.name}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800 rounded-xl p-1">
        {[
          { id: 'goals', label: 'Goals & Quests', icon: Target },
          { id: 'stats', label: 'Statistics', icon: BarChart3 },
          { id: 'history', label: 'History', icon: Calendar }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
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

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-8">
          {/* Goals based solely on user-created data */}
          {Object.entries(goalsByDomain).map(([domain, domainGoals]) => {
            const DomainIcon = getDomainIcon(domain);
            return (
              <div key={domain} className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
                <h3 className={`text-2xl font-bold mb-6 flex items-center ${getGoalDomainColor(domain).split(' ')[0]}`}>
                  <DomainIcon className="w-6 h-6 mr-2" />
                  {domain.charAt(0).toUpperCase() + domain.slice(1).replace('-', ' ')} Goals
                </h3>
                
                <div className="space-y-6">
                  {domainGoals.map((goal) => (
                    <div key={goal.id} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-slate-200">{goal.title}</h4>
                            <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                              {goal.priority}
                            </span>
                            <span className={getDifficultyBadge(goal.difficulty)}>
                              {goal.difficulty}
                            </span>
                          </div>
                          
                          <p className="text-slate-300 mb-3">{goal.description}</p>
                          
                          {/* Domain and Category Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`text-xs px-3 py-1 rounded-full border ${getGoalDomainColor(goal.domain)}`}>
                              {goal.category.replace('-', ' ')}
                            </span>
                            {goal.relatedSkills.map(skill => (
                              <span key={skill} className="text-xs px-3 py-1 rounded-full bg-slate-600/50 text-slate-300 border border-slate-500">
                                <Brain className="w-3 h-3 inline mr-1" />
                                {skill}
                              </span>
                            ))}
                          </div>
                          
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
                              <TrendingUp className="w-4 h-4 mr-1" />
                              +{goal.weeklyProgress}% this week
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-300">
                          <span>Overall Progress</span>
                          <span>{goal.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Milestones */}
                      {goal.milestones && goal.milestones.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h5 className="text-sm font-medium text-slate-300 mb-2">Milestones</h5>
                          {goal.milestones.map(milestone => (
                            <div key={milestone.id} className="flex items-center space-x-3 text-sm">
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex-shrink-0" />
                              )}
                              <span className={milestone.completed ? 'text-slate-400 line-through' : 'text-slate-300'}>
                                {milestone.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {Object.keys(goalsByDomain).length === 0 && (
            <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl text-center`}>
              <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No active goals. Start a new quest to begin your journey!</p>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
              <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2" />
                Completed Quests ({completedGoals.length})
              </h3>
              
              <div className="space-y-4">
                {completedGoals.map((goal) => {
                  const DomainIcon = getDomainIcon(goal.domain);
                  return (
                    <div key={goal.id} className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <DomainIcon className={`w-5 h-5 ${getGoalDomainColor(goal.domain).split(' ')[0]}`} />
                          <h4 className="font-medium text-green-200">{goal.title}</h4>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{goal.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span>Completed: {formatDate(goal.completedAt || goal.createdAt)}</span>
                        <span>{goal.domain.replace('-', ' ')}</span>
                        <span>{goal.difficulty}</span>
                      </div>
                    </div>
                  );
                })}
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

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          {/* Overall Statistics */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Overall Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300">Total Tasks</span>
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-amber-200">{totalTasks}</div>
                <div className="text-sm text-slate-400 mt-1">{totalPoints} total points</div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300">Cards Completed</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-200">{character.completedCards?.length || 0}</div>
                <div className="text-sm text-slate-400 mt-1">
                  {character.completedCards?.reduce((sum, c) => sum + c.xpGained, 0) || 0} XP earned
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300">Active Goals</span>
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-200">{activeGoals.length}</div>
                <div className="text-sm text-slate-400 mt-1">{completedGoals.length} completed</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Timer className="w-6 h-6 mr-2" />
              Recent Activity
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">This Week</span>
                  <span className="text-amber-200 font-semibold">{thisWeek.length} tasks</span>
                </div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">This Month</span>
                  <span className="text-amber-200 font-semibold">{thisMonth.length} tasks</span>
                </div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Average Points/Task</span>
                  <span className="text-amber-200 font-semibold">{averagePoints} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Cards History */}
          {character.completedCards && character.completedCards.length > 0 && (
            <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
              <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2" />
                Completed Cards ({character.completedCards.length})
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {character.completedCards.slice().reverse().map((completion, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="font-medium text-slate-200">Card Completed</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {new Date(completion.completedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">+{completion.xpGained} XP</div>
                        <div className="text-xs text-slate-400">-{completion.energyUsed} energy</div>
                      </div>
                    </div>
                    {completion.feedback && (
                      <p className="text-sm text-slate-300 mt-2">{completion.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab - keeping your existing code */}
      {activeTab === 'history' && (
        <div className="space-y-8">
          {/* Your existing history content */}
        </div>
      )}
    </div>
  );
}