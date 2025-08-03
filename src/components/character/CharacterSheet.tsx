import React, { useState } from 'react';
import { Target, Calendar, Clock, CheckCircle, Award, BarChart3, Trophy, Timer, Briefcase, TrendingUp, Brain, Heart, Users, Sparkles, DollarSign, BookOpen, Compass } from 'lucide-react';
import GoalRecommendations from './GoalRecommendations';

// Mock data and functions for demo
const useAppContext = () => ({
  state: {
    character: {
      id: '1',
      name: 'Hero',
      class: 'strategist',
      level: 5,
      experience: 2500,
      streak: 7,
      dailyProgress: { cardsCompleted: 3 },
      skills: {
        planning: { level: 3, experience: 75, totalXP: 375 },
        analysis: { level: 2, experience: 50, totalXP: 250 },
        leadership: { level: 2, experience: 25, totalXP: 225 }
      }
    },
    goals: [
      {
        id: 1,
        title: "Complete Project Management Certification",
        description: "Get PMP certified to advance career prospects",
        domain: 'career',
        category: 'skill-development',
        relatedSkills: ['planning', 'analysis', 'leadership'],
        classAlignment: ['strategist'],
        timeframe: '3 months',
        priority: 'High',
        status: 'Active',
        createdAt: '2024-01-15',
        progress: 35,
        difficulty: 'Hard',
        weeklyProgress: 12,
        milestones: [
          { id: '1', title: 'Complete study materials', targetProgress: 25, completed: true },
          { id: '2', title: 'Pass practice exams', targetProgress: 50, completed: false },
          { id: '3', title: 'Schedule and pass exam', targetProgress: 100, completed: false }
        ]
      },
      {
        id: 2,
        title: "Build Morning Routine",
        description: "Establish consistent morning habits for productivity",
        domain: 'personal-growth',
        category: 'productivity',
        relatedSkills: ['discipline', 'planning'],
        classAlignment: ['strategist', 'warrior'],
        timeframe: '1 month',
        priority: 'Medium',
        status: 'Active',
        createdAt: '2024-01-20',
        progress: 60,
        difficulty: 'Medium',
        weeklyProgress: 15,
        milestones: [
          { id: '1', title: 'Wake up at 6 AM consistently', targetProgress: 33, completed: true },
          { id: '2', title: 'Add exercise routine', targetProgress: 66, completed: true },
          { id: '3', title: 'Add meditation practice', targetProgress: 100, completed: false }
        ]
      },
      {
        id: 3,
        title: "Learn Spanish",
        description: "Achieve conversational fluency in Spanish",
        domain: 'education',
        category: 'languages',
        relatedSkills: ['learning', 'communication'],
        classAlignment: ['sage', 'connector'],
        timeframe: '6 months',
        priority: 'Low',
        status: 'Completed',
        createdAt: '2023-07-01',
        completedAt: '2024-01-10',
        progress: 100,
        difficulty: 'Hard',
        weeklyProgress: 0,
        milestones: []
      }
    ],
    tasks: [
      { id: 1, date: '2024-01-25', category: 'Professional', task: 'Study PMP Chapter 3', points: 10, comment: 'Focused study session' },
      { id: 2, date: '2024-01-24', category: 'Personal', task: 'Morning meditation', points: 5 },
      { id: 3, date: '2024-01-24', category: 'Professional', task: 'LinkedIn networking', points: 8 }
    ],
    cards: { inventory: [1, 2, 3] }
  }
});

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
  const { state } = useAppContext();
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

  // Group goals by domain
  const goalsByDomain = activeGoals.reduce((acc, goal) => {
    if (!acc[goal.domain]) acc[goal.domain] = [];
    acc[goal.domain].push(goal);
    return acc;
  }, {});

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
          {/* Recomendaciones de objetivos */}
          <GoalRecommendations 
            character={character}
            existingGoals={goals}
            onSelectGoal={(goal) => {
              // Manejar la adición de un nuevo objetivo
              dispatch({ type: 'ADD_GOAL', payload: goal });
            }}
          />
          
          {/* Objetivos agrupados por dominio */}
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
          {/* Goal Domain Distribution */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Compass className="w-6 h-6 mr-2" />
              Goal Distribution by Life Domain
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['career', 'health', 'relationships', 'personal-growth', 'education', 'creativity', 'financial', 'spiritual'].map(domain => {
                const domainGoals = goals.filter(g => g.domain === domain);
                const DomainIcon = getDomainIcon(domain);
                return (
                  <div key={domain} className={`text-center p-4 rounded-lg border ${getGoalDomainColor(domain)}`}>
                    <DomainIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold mb-1">{domainGoals.length}</div>
                    <div className="text-xs capitalize">{domain.replace('-', ' ')}</div>
                  </div>
                );
              })}
            </div>
          </div>

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
                <div className="text-3xl font-bold text-amber-300 mb-2">{state.cards?.inventory?.length || 0}</div>
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

          {/* Goal Progress History */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-2xl`}>
            <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Goal Progress History
            </h3>
            
            <div className="space-y-4">
              {goals.slice(0, 5).map((goal) => {
                const DomainIcon = getDomainIcon(goal.domain);
                return (
                  <div key={goal.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <DomainIcon className={`w-5 h-5 ${getGoalDomainColor(goal.domain).split(' ')[0]}`} />
                        <h4 className="font-medium text-slate-200">{goal.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                          goal.status === 'Active' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          goal.status === 'Completed' ? 'bg-green-500' :
                          goal.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Started: {formatDate(goal.createdAt)}</span>
                      <span>{goal.progress}% Complete</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}