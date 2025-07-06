import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { showAlert, showConfetti } from '../utils/notifications';
import { Gift, Plus, Star } from 'lucide-react';
import { format } from 'date-fns';

export function Rewards() {
  const { state, dispatch, generateId } = useAppContext();
  const [activeTab, setActiveTab] = useState<'available' | 'add' | 'history'>('available');
  const [form, setForm] = useState({
    name: '',
    description: '',
    points: 50,
    category: 'Small Treat'
  });

  const categories = [
    'Small Treat', 'Entertainment', 'Learning', 'Self-Care', 'Gaming',
    'Shopping', 'Social', 'Excursion', 'Lazy Day', 'Custom'
  ];

  const calculateAvailablePoints = () => {
    const totalEarned = state.tasks.reduce((sum, task) => sum + task.points, 0);
    const totalRedeemed = state.redeemedRewards.reduce((sum, reward) => sum + reward.points, 0);
    return totalEarned - totalRedeemed;
  };

  const availablePoints = calculateAvailablePoints();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.description.trim()) {
      showAlert('Please fill in all required fields', 'warning');
      return;
    }

    const newReward = {
      id: generateId(),
      name: form.name,
      description: form.description,
      points: form.points,
      category: form.category,
      redeemed: false
    };

    dispatch({ type: 'ADD_REWARD', payload: newReward });
    showAlert(`New reward added: ${form.name}`);
    
    // Reset form
    setForm({
      name: '',
      description: '',
      points: 50,
      category: 'Small Treat'
    });
    
    setActiveTab('available');
  };

  const handleRedeem = (rewardId: number) => {
    const reward = state.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (availablePoints >= reward.points) {
      if (confirm(`Are you sure you want to redeem "${reward.name}" for ${reward.points} points?`)) {
        const redeemedReward = {
          id: reward.id,
          name: reward.name,
          points: reward.points,
          redeemedOn: new Date().toISOString().split('T')[0]
        };

        dispatch({ type: 'REDEEM_REWARD', payload: { rewardId, redeemedReward } });
        showConfetti();
        showAlert(`Reward redeemed: ${reward.name}!`);
      }
    } else {
      showAlert('Not enough points to redeem this reward', 'warning');
    }
  };

  const availableRewards = state.rewards.filter(reward => !reward.redeemed);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎁 Rewards</h2>
        <p className="text-gray-600 mb-4">
          Turn your hard work into rewards! Create custom rewards or choose from presets.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <Star className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-yellow-800 font-semibold">Tip</h4>
              <p className="text-yellow-700 text-sm">
                Set up small rewards for short-term motivation and bigger ones for long-term goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Points */}
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
        <div className="text-4xl font-bold text-purple-600 mb-2">{availablePoints}</div>
        <div className="text-gray-600 font-medium">Available Points</div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'available'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Available Rewards
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'add'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Add New Reward
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Redemption History
        </button>
      </div>

      {/* Available Rewards Tab */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRewards.length > 0 ? (
            availableRewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{reward.name}</h4>
                  <p className="text-gray-600 text-sm mb-3 italic">{reward.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm"><strong>Category:</strong> {reward.category}</p>
                    <p className="text-sm"><strong>Points Required:</strong> {reward.points}</p>
                  </div>
                  {availablePoints >= reward.points ? (
                    <button
                      onClick={() => handleRedeem(reward.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
                    >
                      Redeem Reward
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed font-medium"
                    >
                      Need {reward.points - availablePoints} more points
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No rewards available. Add some in the 'Add New Reward' tab!</p>
            </div>
          )}
        </div>
      )}

      {/* Add New Reward Tab */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <Plus className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Create a New Reward</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reward Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Coffee Shop Visit, Movie Night"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Describe what this reward involves..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points Required</label>
                <input
                  type="number"
                  min="1"
                  value={form.points}
                  onChange={(e) => setForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Reward
            </button>
          </form>
        </div>
      )}

      {/* Redemption History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Redemption History</h3>
          <div className="space-y-3">
            {state.redeemedRewards.length > 0 ? (
              state.redeemedRewards
                .sort((a, b) => new Date(b.redeemedOn).getTime() - new Date(a.redeemedOn).getTime())
                .map((reward) => (
                  <div key={`${reward.id}-${reward.redeemedOn}`} className="bg-gray-50 rounded-xl p-4 border-l-4 border-red-500">
                    <div className="font-semibold text-gray-800">{reward.name}</div>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                      <span>Redeemed: {format(new Date(reward.redeemedOn), 'MMM dd, yyyy')}</span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        -{reward.points} pts
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No rewards have been redeemed yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}