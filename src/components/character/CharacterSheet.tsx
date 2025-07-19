import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { classDescriptions } from '../../data/personalityTest';
import { getClassTheme } from '../../data/characterClasses';
import { Target, Calendar, Clock, CheckCircle, Award, BarChart3, Trophy, Timer, Briefcase, TrendingUp } from 'lucide-react';
import type { Goal, Task } from '../../types/index';

export function CharacterSheet() {
  const { state } = useAppContext();
  const { character, goals, tasks } = state;
  const [activeTab, setActiveTab] = useState<'goals' | 'stats' | 'history'>('goals');
  
  if (!character) return null;

  const classInfo = classDescriptions[character.class];
  const theme = getClassTheme(character.class);

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
          Detailed goals, statistics, and progress tracking for your {classInfo.name} journey
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
        </div>
      )}
    </div>
  );
} 