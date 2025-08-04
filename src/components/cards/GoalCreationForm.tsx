// filepath: /workspaces/InnerLevelAPP/src/components/cards/GoalCreationForm.tsx
import React, { useState } from 'react';

export default function GoalCreationForm({ characterClass, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState(7);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      id: Date.now(),
      title,
      description,
      timeframe,
      classAlignment: [characterClass],
      createdAt: new Date().toISOString(),
      progress: 0,
      status: 'Active',
    };
    onSubmit(newGoal);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-amber-200 mb-4">Create New Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-amber-200 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200"
            placeholder="Enter goal title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-amber-200 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200"
            placeholder="Enter goal description"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-amber-200 mb-2">Timeframe (days)</label>
          <input
            type="number"
            value={timeframe}
            onChange={(e) => setTimeframe(parseInt(e.target.value) || 7)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200"
            min="1"
            max="365"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-600"
          >
            Create Goal
          </button>
        </div>
      </form>
    </div>
  );
}