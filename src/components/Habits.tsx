import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { showAlert } from '../utils/notifications';
import { Zap, Trash2, Plus } from 'lucide-react';

export function Habits() {
  const { state, dispatch, generateId } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    category: 'Personal',
    points: 5
  });

  const categories = ['Professional', 'Personal', 'Self-Care'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      showAlert('Please enter a habit name', 'warning');
      return;
    }

    const newHabit = {
      id: generateId(),
      name: form.name,
      category: form.category,
      points: form.points
    };

    dispatch({ type: 'ADD_HABIT', payload: newHabit });
    showAlert(`New habit added: ${form.name}`);
    
    // Reset form
    setForm({
      name: '',
      category: 'Personal',
      points: 5
    });
  };

  const handleDelete = (habitId: number) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      dispatch({ type: 'DELETE_HABIT', payload: habitId });
      showAlert('Habit deleted successfully!');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Professional': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Personal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Self-Care': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">⚡ Manage Your Habits</h2>
        <p className="text-gray-600 mb-4">
          Create and manage your recurring activities. Good habits are the foundation of progress!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                💡
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-blue-800 font-semibold">Tip</h4>
              <p className="text-blue-700 text-sm">
                Start with 2-3 key habits and gradually add more as you build consistency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Habits */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Your Current Habits</h3>
        <div className="space-y-4">
          {state.habits.length > 0 ? (
            state.habits.map((habit) => (
              <div key={habit.id} className="bg-gray-50 rounded-xl p-4 border hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{habit.name}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(habit.category)}`}>
                          {habit.category}
                        </span>
                        <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {habit.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Zap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No habits created yet. Add your first habit below!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Habit */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <Plus className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Add New Habit</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Morning Meditation, Daily Exercise"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
            <input
              type="number"
              min="1"
              max="100"
              value={form.points}
              onChange={(e) => setForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-sm text-gray-500 mt-1">
              Higher points for more challenging or important habits
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Habit
          </button>
        </form>
      </div>
    </div>
  );
}