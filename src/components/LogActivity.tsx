import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { showAlert } from '../utils/notifications';
import { Clock, Heart, Battery } from 'lucide-react';
import { format } from 'date-fns';

export function LogActivity() {
  const { state, dispatch, generateId } = useAppContext();
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');
  
  // Quick log form state
  const [quickForm, setQuickForm] = useState({
    date: new Date().toISOString().split('T')[0],
    habitId: '',
    emotionBefore: 'Peaceful',
    emotionAfter: 'Peaceful',
    energyLevel: 3,
    comment: ''
  });

  // Custom log form state
  const [customForm, setCustomForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Personal',
    task: '',
    points: 5,
    emotionBefore: 'Peaceful',
    emotionAfter: 'Peaceful',
    energyLevel: 3,
    comment: ''
  });

  const emotions = ['Anxious', 'Motivated', 'Tired', 'Sad', 'Peaceful', 'Euphoric'];
  const categories = ['Professional', 'Personal', 'Self-Care'];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickForm.habitId) {
      showAlert('Please select a habit', 'warning');
      return;
    }

    const habit = state.habits.find(h => h.id === parseInt(quickForm.habitId));
    if (!habit) return;

    const newTask = {
      id: generateId(),
      date: quickForm.date,
      category: habit.category,
      task: habit.name,
      points: habit.points,
      comment: quickForm.comment,
      emotionBefore: quickForm.emotionBefore,
      emotionAfter: quickForm.emotionAfter,
      energyLevel: quickForm.energyLevel
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    showAlert(`Activity logged: ${habit.name} for ${habit.points} points!`);
    
    // Reset form
    setQuickForm({
      date: new Date().toISOString().split('T')[0],
      habitId: '',
      emotionBefore: 'Peaceful',
      emotionAfter: 'Peaceful',
      energyLevel: 3,
      comment: ''
    });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customForm.task.trim()) {
      showAlert('Please enter an activity description', 'warning');
      return;
    }

    const newTask = {
      id: generateId(),
      date: customForm.date,
      category: customForm.category,
      task: customForm.task,
      points: customForm.points,
      comment: customForm.comment,
      emotionBefore: customForm.emotionBefore,
      emotionAfter: customForm.emotionAfter,
      energyLevel: customForm.energyLevel
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    showAlert(`Custom activity logged: ${customForm.task} for ${customForm.points} points!`);
    
    // Reset form
    setCustomForm({
      date: new Date().toISOString().split('T')[0],
      category: 'Personal',
      task: '',
      points: 5,
      emotionBefore: 'Peaceful',
      emotionAfter: 'Peaceful',
      energyLevel: 3,
      comment: ''
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">📝 Log Your Activity</h2>
        <p className="text-gray-600">
          Track your progress by logging activities. Choose from your preset habits or create a custom entry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'quick'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Quick Log
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'custom'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Custom Activity
        </button>
      </div>

      {/* Quick Log Tab */}
      {activeTab === 'quick' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Log from Habits</h3>
          <form onSubmit={handleQuickSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={quickForm.date}
                  onChange={(e) => setQuickForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habit</label>
                <select
                  value={quickForm.habitId}
                  onChange={(e) => setQuickForm(prev => ({ ...prev, habitId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a habit...</option>
                  {state.habits.map(habit => (
                    <option key={habit.id} value={habit.id}>
                      {habit.name} ({habit.points} pts) - {habit.category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="inline w-4 h-4 mr-1" />
                  How were you feeling before?
                </label>
                <select
                  value={quickForm.emotionBefore}
                  onChange={(e) => setQuickForm(prev => ({ ...prev, emotionBefore: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="inline w-4 h-4 mr-1" />
                  How are you feeling now?
                </label>
                <select
                  value={quickForm.emotionAfter}
                  onChange={(e) => setQuickForm(prev => ({ ...prev, emotionAfter: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Battery className="inline w-4 h-4 mr-1" />
                Energy Level: {quickForm.energyLevel}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={quickForm.energyLevel}
                onChange={(e) => setQuickForm(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
              <textarea
                value={quickForm.comment}
                onChange={(e) => setQuickForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="How did this activity make you feel? Any insights?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
            >
              Log Activity
            </button>
          </form>
        </div>
      )}

      {/* Custom Log Tab */}
      {activeTab === 'custom' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Log Custom Activity</h3>
          <form onSubmit={handleCustomSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={customForm.date}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={customForm.category}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Description</label>
                <input
                  type="text"
                  value={customForm.task}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, task: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="What did you accomplish?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customForm.points}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="inline w-4 h-4 mr-1" />
                  How were you feeling before?
                </label>
                <select
                  value={customForm.emotionBefore}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, emotionBefore: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="inline w-4 h-4 mr-1" />
                  How are you feeling now?
                </label>
                <select
                  value={customForm.emotionAfter}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, emotionAfter: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Battery className="inline w-4 h-4 mr-1" />
                Energy Level: {customForm.energyLevel}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={customForm.energyLevel}
                onChange={(e) => setCustomForm(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
              <textarea
                value={customForm.comment}
                onChange={(e) => setCustomForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="How did this activity make you feel? Any insights?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
            >
              Log Custom Activity
            </button>
          </form>
        </div>
      )}

      {/* Activity History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Activity History</h3>
        <div className="space-y-3">
          {state.tasks.length > 0 ? (
            state.tasks
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-500 hover:bg-gray-100 transition-colors">
                  <div className="font-semibold text-gray-800">{task.task}</div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                    <span>{format(new Date(task.date), 'MMM dd, yyyy')} | {task.category}</span>
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                      +{task.points} pts
                    </span>
                  </div>
                  {task.comment && (
                    <div className="mt-2 text-sm text-gray-600 italic">{task.comment}</div>
                  )}
                  {task.emotionBefore && task.emotionAfter && (
                    <div className="mt-2 text-xs text-gray-500">
                      Emotion: {task.emotionBefore} → {task.emotionAfter} | Energy: {task.energyLevel}/5
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p>No activities logged yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}