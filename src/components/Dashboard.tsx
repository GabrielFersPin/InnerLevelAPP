import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Trophy, Calendar, Flame, PlusCircle, CheckSquare, Gift } from 'lucide-react';
import { format } from 'date-fns';

export function Dashboard() {
  const { state } = useAppContext();

  // Calculate metrics
  const totalPoints = state.tasks.reduce((sum, task) => sum + task.points, 0);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekPoints = state.tasks
    .filter(task => new Date(task.date) >= weekAgo)
    .reduce((sum, task) => sum + task.points, 0);

  // Calculate streak
  const sortedDates = [...new Set(state.tasks.map(task => task.date))].sort();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  if (sortedDates.includes(today)) {
    streak = 1;
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i + 1]);
      const prevDate = new Date(sortedDates[i]);
      const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Get recent activities and pending tasks
  const recentActivities = state.tasks
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const pendingTasks = state.todos
    .filter(todo => todo.status !== 'Completed')
    .sort((a, b) => {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  const metrics = [
    { icon: Trophy, label: 'Total Points', value: totalPoints, color: 'text-purple-600' },
    { icon: Calendar, label: 'Points This Week', value: weekPoints, color: 'text-blue-600' },
    { icon: Flame, label: 'Current Streak', value: streak, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Transform Your Emotional Well-being Into A Journey of Growth
        </h2>
        <p className="text-purple-100 text-lg leading-relaxed max-w-4xl mx-auto">
          "The greatest glory in living lies not in never falling, but in rising every time we fall. 
          The journey of self-discovery and emotional growth is not about being perfect, but about 
          being present and learning from each moment." — Nelson Mandela
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                  {metric.value}
                </div>
                <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                  {metric.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities and Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            📝 Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-500 hover:bg-gray-100 transition-colors">
                  <div className="font-semibold text-gray-800">{activity.task}</div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                    <span>{format(new Date(activity.date), 'MMM dd, yyyy')}</span>
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                      +{activity.points} pts
                    </span>
                  </div>
                  {activity.comment && (
                    <div className="mt-2 text-sm text-gray-600 italic">{activity.comment}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PlusCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No activities logged yet. Start by adding some in the 'Log Activity' section!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            📋 Pending Tasks
          </h3>
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => {
                const priorityColors = {
                  High: 'border-red-500 bg-red-50',
                  Medium: 'border-yellow-500 bg-yellow-50',
                  Low: 'border-green-500 bg-green-50'
                };
                const priorityTextColors = {
                  High: 'text-red-600 bg-red-100',
                  Medium: 'text-yellow-600 bg-yellow-100',
                  Low: 'text-green-600 bg-green-100'
                };
                
                return (
                  <div key={task.id} className={`${priorityColors[task.priority]} rounded-xl p-4 border-l-4 hover:shadow-md transition-all`}>
                    <div className="font-semibold text-gray-800">{task.task}</div>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-600">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                      <span className={`${priorityTextColors[task.priority]} px-2 py-1 rounded-full text-xs font-medium`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No pending tasks! You're all caught up.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
          ⚡ Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <PlusCircle size={20} />
            <span className="font-medium">Log Activity</span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CheckSquare size={20} />
            <span className="font-medium">Add Task</span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Gift size={20} />
            <span className="font-medium">View Rewards</span>
          </button>
        </div>
      </div>
    </div>
  );
}