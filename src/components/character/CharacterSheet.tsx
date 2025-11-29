import React, { useState } from 'react';
import { Target, Calendar, Clock, CheckCircle, Award, BarChart3, Trophy, Timer, Briefcase, TrendingUp, Brain, Heart, Users, Sparkles, DollarSign, BookOpen, Compass } from 'lucide-react';
// Removed recommendations to show only user-created goals
import { useAppContext } from '../../context/AppContext';
import techOrb from '../../assets/tech_orb.png';

const classDescriptions = {
  strategist: { name: 'The Strategist', description: 'Master planner and analytical thinker' },
  warrior: { name: 'The Warrior', description: 'Disciplined achiever and challenger' },
  creator: { name: 'The Creator', description: 'Innovative artist and visionary' },
  connector: { name: 'The Connector', description: 'Empathetic leader and relationship builder' },
  sage: { name: 'The Sage', description: 'Wise learner and deep thinker' }
};

const getClassTheme = (characterClass: string) => ({
  panel: 'bg-void-950/40 border border-white/10 backdrop-blur-md',
  accent: 'text-gold-200'
});

// Domain icons mapping
const getDomainIcon = (domain: string) => {
  const icons: Record<string, any> = {
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

const getGoalDomainColor = (domain: string) => {
  const colors: Record<string, string> = {
    'career': 'text-blue-400 bg-blue-900/20 border-blue-500/30',
    'health': 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30',
    'relationships': 'text-pink-400 bg-pink-900/20 border-pink-500/30',
    'personal-growth': 'text-purple-400 bg-purple-900/20 border-purple-500/30',
    'creativity': 'text-orange-400 bg-orange-900/20 border-orange-500/30',
    'financial': 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    'education': 'text-indigo-400 bg-indigo-900/20 border-indigo-500/30',
    'spiritual': 'text-cyan-400 bg-cyan-900/20 border-cyan-500/30'
  };
  return colors[domain] || 'text-slate-400 bg-slate-900/20 border-slate-500/30';
};

export default function CharacterSheet() {
  const { state, dispatch } = useAppContext();
  const { character, goals, tasks } = state;
  const [activeTab, setActiveTab] = useState('goals');

  if (!character) return null;

  const classInfo = classDescriptions[character.class as keyof typeof classDescriptions] || classDescriptions.warrior;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRemaining = (goal: any) => {
    if (!goal.timeframe) return 'No deadline';

    const deadline = new Date(goal.createdAt);
    const timeframeStr = String(goal.timeframe);
    const timeframeDays = timeframeStr.includes('week') ? 7 :
      timeframeStr.includes('month') ? 30 :
        timeframeStr.includes('year') ? 365 : 1;

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
      case 'Low': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      'Easy': 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30',
      'Medium': 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
      'Hard': 'bg-orange-900/30 text-orange-300 border-orange-500/30',
      'Epic': 'bg-purple-900/30 text-purple-300 border-purple-500/30'
    };
    return `${colors[difficulty] || colors['Medium']} px-2 py-0.5 rounded-sm text-xs border font-cinzel font-bold tracking-wider`;
  };

  // Group goals by domain (only real goals from state)
  const goalsByDomain = activeGoals.reduce((acc: any, goal) => {
    if (!acc[goal.domain]) acc[goal.domain] = [];
    acc[goal.domain].push(goal);
    return acc;
  }, {});

  // Removed recommendation-based adding; only show existing goals

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-tech-cyan/5 blur-3xl rounded-full pointer-events-none"></div>
        <h1 className="text-4xl font-bold text-gold-200 mb-2 font-cinzel text-glow-sm flex items-center justify-center gap-3 relative z-10">
          <img src={techOrb} alt="Orb" className="w-8 h-8 animate-pulse" />
          Character Sheet
          <img src={techOrb} alt="Orb" className="w-8 h-8 animate-pulse" />
        </h1>
        <p className="text-xl text-slate-300 font-cinzel relative z-10">
          <span className="text-tech-cyan font-bold">Level {character.level}</span> <span className="text-slate-500 mx-2">|</span> {classInfo.name}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-void-950/60 rounded-xl p-1 border border-white/10 backdrop-blur-md">
        {[
          { id: 'goals', label: 'Goals & Quests', icon: Target },
          { id: 'stats', label: 'Statistics', icon: BarChart3 },
          { id: 'history', label: 'History', icon: Calendar }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-bold transition-all font-cinzel tracking-wide ${activeTab === id
              ? 'bg-gradient-to-r from-tech-gold/20 to-orange-900/20 text-gold-100 border border-tech-gold/30 shadow-[0_0_10px_rgba(255,215,0,0.1)]'
              : 'text-slate-400 hover:text-gold-200 hover:bg-white/5'
              }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Goals based solely on user-created data */}
          {Object.entries(goalsByDomain).map(([domain, domainGoals]: [string, any]) => {
            const DomainIcon = getDomainIcon(domain);
            return (
              <div key={domain} className={`${theme.panel} rounded-2xl p-8 shadow-xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-75"></div>

                <h3 className={`text-2xl font-bold mb-6 flex items-center font-cinzel ${getGoalDomainColor(domain).split(' ')[0]}`}>
                  <DomainIcon className="w-6 h-6 mr-2" />
                  {domain.charAt(0).toUpperCase() + domain.slice(1).replace('-', ' ')} Goals
                </h3>

                <div className="space-y-6">
                  {domainGoals.map((goal: any) => (
                    <div key={goal.id} className="bg-void-900/60 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gold-100 font-cinzel tracking-wide">{goal.title}</h4>
                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-sm border border-current/30 ${getPriorityColor(goal.priority)}`}>
                              {goal.priority}
                            </span>
                            <span className={getDifficultyBadge(goal.difficulty)}>
                              {goal.difficulty}
                            </span>
                          </div>

                          <p className="text-slate-300 mb-4 font-inter leading-relaxed">{goal.description}</p>

                          {/* Domain and Category Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm border ${getGoalDomainColor(goal.domain)}`}>
                              {(goal.category || 'uncategorized').replace('-', ' ')}
                            </span>
                            {(goal.relatedSkills || []).map((skill: string) => (
                              <span key={skill} className="text-xs font-bold px-3 py-1 rounded-sm bg-void-950 text-slate-400 border border-slate-700 flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-6 text-xs text-slate-500 font-mono uppercase tracking-wider">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1.5" />
                              Created: {formatDate(goal.createdAt)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1.5" />
                              {getTimeRemaining(goal)}
                            </span>
                            <span className="flex items-center text-tech-cyan">
                              <TrendingUp className="w-3 h-3 mr-1.5" />
                              +{goal.weeklyProgress}% this week
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2 bg-void-950/50 p-4 rounded-lg border border-white/5">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>Overall Progress</span>
                          <span className="text-gold-200">{goal.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-void-900 rounded-full h-2 border border-void-800">
                          <div
                            className="bg-gradient-to-r from-tech-cyan to-blue-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,240,255,0.3)] relative overflow-hidden"
                            style={{ width: `${goal.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                          </div>
                        </div>
                      </div>

                      {/* Milestones */}
                      {goal.milestones && goal.milestones.length > 0 && (
                        <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
                          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Milestones</h5>
                          {goal.milestones.map((milestone: any) => (
                            <div key={milestone.id} className="flex items-center space-x-3 text-sm group/milestone">
                              {milestone.completed ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.3)]">
                                  <CheckCircle className="w-3 h-3" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-700 group-hover/milestone:border-slate-500 transition-colors" />
                              )}
                              <span className={`font-inter transition-colors ${milestone.completed ? 'text-slate-500 line-through decoration-slate-700' : 'text-slate-300 group-hover/milestone:text-white'}`}>
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
            <div className={`${theme.panel} rounded-2xl p-12 shadow-xl text-center border-dashed border-2 border-slate-700`}>
              <div className="w-20 h-20 bg-void-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Target className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 font-cinzel mb-2">No Active Quests</h3>
              <p className="text-slate-500 font-inter">Your quest log is empty. Visit the Quest Board to accept new challenges!</p>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className={`${theme.panel} rounded-2xl p-8 shadow-xl border-l-4 border-l-emerald-500/50`}>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center font-cinzel">
                <Trophy className="w-6 h-6 mr-2" />
                Completed Quests ({completedGoals.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => {
                  const DomainIcon = getDomainIcon(goal.domain);
                  return (
                    <div key={goal.id} className="bg-emerald-950/20 rounded-xl p-5 border border-emerald-500/20 hover:bg-emerald-950/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <DomainIcon className={`w-5 h-5 ${getGoalDomainColor(goal.domain).split(' ')[0]}`} />
                          <h4 className="font-bold text-emerald-200 font-cinzel">{goal.title}</h4>
                        </div>
                        <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                      </div>
                      <p className="text-sm text-emerald-100/60 mb-3 font-inter line-clamp-2">{goal.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-emerald-500/70 font-mono uppercase">
                        <span>Completed: {formatDate(goal.completedAt || goal.createdAt)}</span>
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
            <div className={`${theme.panel} rounded-2xl p-8 shadow-xl opacity-75 hover:opacity-100 transition-opacity`}>
              <h3 className="text-2xl font-bold text-slate-400 mb-6 flex items-center font-cinzel">
                <Clock className="w-6 h-6 mr-2" />
                Paused Quests ({pausedGoals.length})
              </h3>

              <div className="space-y-4">
                {pausedGoals.map((goal) => (
                  <div key={goal.id} className="bg-void-950/40 rounded-lg p-4 border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-400 font-cinzel mb-1">{goal.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-slate-600 font-mono">
                        <span>Created: {formatDate(goal.createdAt)}</span>
                        <span>Progress: {goal.progress}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-800 text-slate-500 border border-slate-700">Paused</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Overall Statistics */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-xl`}>
            <h3 className="text-2xl font-bold text-gold-200 mb-6 flex items-center font-cinzel">
              <BarChart3 className="w-6 h-6 mr-2 text-tech-cyan" />
              Overall Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-void-900/50 rounded-xl p-6 border border-white/5 hover:border-tech-gold/30 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 font-cinzel font-bold text-sm uppercase tracking-wider">Total Tasks</span>
                  <Trophy className="w-5 h-5 text-tech-gold group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-gold-100 font-cinzel text-glow-sm">{totalTasks}</div>
                <div className="text-xs text-slate-500 mt-2 font-mono">{totalPoints} total points earned</div>
              </div>

              <div className="bg-void-900/50 rounded-xl p-6 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 font-cinzel font-bold text-sm uppercase tracking-wider">Cards Completed</span>
                  <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-emerald-200 font-cinzel text-glow-sm">{character.completedCards?.length || 0}</div>
                <div className="text-xs text-slate-500 mt-2 font-mono">
                  {character.completedCards?.reduce((sum: number, c: any) => sum + c.xpGained, 0) || 0} XP earned
                </div>
              </div>

              <div className="bg-void-900/50 rounded-xl p-6 border border-white/5 hover:border-blue-500/30 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 font-cinzel font-bold text-sm uppercase tracking-wider">Active Goals</span>
                  <Target className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-blue-200 font-cinzel text-glow-sm">{activeGoals.length}</div>
                <div className="text-xs text-slate-500 mt-2 font-mono">{completedGoals.length} completed</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`${theme.panel} rounded-2xl p-8 shadow-xl`}>
            <h3 className="text-2xl font-bold text-gold-200 mb-6 flex items-center font-cinzel">
              <Timer className="w-6 h-6 mr-2 text-tech-magenta" />
              Recent Activity
            </h3>

            <div className="space-y-3">
              <div className="bg-void-900/30 rounded-lg p-4 border border-white/5 flex items-center justify-between hover:bg-void-900/50 transition-colors">
                <span className="text-slate-300 font-inter">This Week</span>
                <span className="text-tech-cyan font-bold font-mono">{thisWeek.length} tasks</span>
              </div>
              <div className="bg-void-900/30 rounded-lg p-4 border border-white/5 flex items-center justify-between hover:bg-void-900/50 transition-colors">
                <span className="text-slate-300 font-inter">This Month</span>
                <span className="text-tech-cyan font-bold font-mono">{thisMonth.length} tasks</span>
              </div>
              <div className="bg-void-900/30 rounded-lg p-4 border border-white/5 flex items-center justify-between hover:bg-void-900/50 transition-colors">
                <span className="text-slate-300 font-inter">Average Points/Task</span>
                <span className="text-tech-gold font-bold font-mono">{averagePoints} pts</span>
              </div>
            </div>
          </div>

          {/* Completed Cards History */}
          {character.completedCards && character.completedCards.length > 0 && (
            <div className={`${theme.panel} rounded-2xl p-8 shadow-xl`}>
              <h3 className="text-2xl font-bold text-gold-200 mb-6 flex items-center font-cinzel">
                <Award className="w-6 h-6 mr-2 text-purple-400" />
                Completed Cards ({character.completedCards.length})
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {character.completedCards.slice().reverse().map((completion: any, index: number) => (
                  <div key={index} className="bg-void-900/40 rounded-xl p-5 border border-white/5 hover:border-purple-500/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-purple-200 font-cinzel">Card Completed</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
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
                        <div className="text-tech-gold font-bold font-mono">+{completion.xpGained} XP</div>
                        <div className="text-xs text-slate-500 font-mono">-{completion.energyUsed} energy</div>
                      </div>
                    </div>
                    {completion.feedback && (
                      <div className="mt-3 p-3 bg-void-950/50 rounded-lg border border-white/5 text-sm text-slate-300 italic font-inter">
                        "{completion.feedback}"
                      </div>
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
        <div className="space-y-8 animate-fadeIn">
          <div className={`${theme.panel} rounded-2xl p-12 shadow-xl text-center border-dashed border-2 border-slate-700`}>
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 font-cinzel mb-2">History Archives</h3>
            <p className="text-slate-500 font-inter">Your past deeds are recorded here. (Feature coming soon)</p>
          </div>
        </div>
      )}
    </div>
  );
}