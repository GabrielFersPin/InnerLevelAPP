import React, { useState, useEffect } from 'react';
import { Card } from '../../types';

const typeOptions = [
  { value: 'action', label: 'Action' },
  { value: 'power', label: 'Power' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'event', label: 'Event' },
  { value: 'equipment', label: 'Equipment' },
];
const rarityOptions = [
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' },
];

export function EditCardModal({ card, isOpen, onClose, onSave }: {
  card: Card | null,
  isOpen: boolean,
  onClose: () => void,
  onSave: (updatedCard: Card) => void
}) {
  const [form, setForm] = useState<Card | null>(card);

  useEffect(() => {
    setForm(card);
  }, [card]);

  if (!isOpen || !form) return null;

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => prev ? { ...prev, [name]: type === 'number' ? Number(value) : value } : prev);
  };

  // Skill Bonus editing
  const handleSkillBonusChange = (idx: number, field: 'skillName' | 'xpBonus', value: string | number) => {
    setForm(prev => {
      if (!prev) return prev;
      const updated = [...prev.skillBonus];
      updated[idx] = { ...updated[idx], [field]: field === 'xpBonus' ? Number(value) : value };
      return { ...prev, skillBonus: updated };
    });
  };
  const addSkillBonus = () => {
    setForm(prev => prev ? { ...prev, skillBonus: [...prev.skillBonus, { skillName: '', xpBonus: 0 }] } : prev);
  };
  const removeSkillBonus = (idx: number) => {
    setForm(prev => prev ? { ...prev, skillBonus: prev.skillBonus.filter((_, i) => i !== idx) } : prev);
  };

  // Tags editing
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setForm(prev => prev ? { ...prev, tags } : prev);
  };

  // Requirements
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => prev ? { ...prev, requirements: { ...prev.requirements, level: Number(e.target.value) } } : prev);
  };

  const handleSave = () => {
    if (form) {
      onSave(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 border-2 border-amber-400 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
        <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center tracking-wide">Edit Card</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400 focus:ring-amber-400"
              placeholder="Name"
            />
            <label className="block text-amber-200 font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400 focus:ring-amber-400"
              placeholder="Description"
              rows={3}
            />
            <label className="block text-amber-200 font-semibold mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
            >
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <label className="block text-amber-200 font-semibold mb-1">Rarity</label>
            <select
              name="rarity"
              value={form.rarity}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
            >
              {rarityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <label className="block text-amber-200 font-semibold mb-1">Tags (comma separated)</label>
            <input
              name="tags"
              value={form.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
              placeholder="e.g. focus, productivity, daily"
            />
          </div>
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Energy Cost</label>
            <input
              name="energyCost"
              type="number"
              value={form.energyCost}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
              min={0}
            />
            <label className="block text-amber-200 font-semibold mb-1">Duration (hours)</label>
            <input
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
              min={0}
              step={0.1}
            />
            <label className="block text-amber-200 font-semibold mb-1">Impact (XP)</label>
            <input
              name="impact"
              type="number"
              value={form.impact}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
              min={0}
            />
            <label className="block text-amber-200 font-semibold mb-1">Required Level</label>
            <input
              name="level"
              type="number"
              value={form.requirements.level || 1}
              onChange={handleLevelChange}
              className="w-full mb-3 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
              min={1}
            />
          </div>
        </div>
        {/* Skill Bonus Section */}
        <div className="mt-6 mb-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-amber-200 font-semibold">Skill Bonuses</label>
            <button onClick={addSkillBonus} className="bg-indigo-700 text-white px-3 py-1 rounded hover:bg-indigo-800 text-sm">+ Add</button>
          </div>
          {form.skillBonus.map((bonus, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={bonus.skillName}
                onChange={e => handleSkillBonusChange(idx, 'skillName', e.target.value)}
                placeholder="Skill Name"
                className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
              />
              <input
                type="number"
                value={bonus.xpBonus}
                onChange={e => handleSkillBonusChange(idx, 'xpBonus', e.target.value)}
                placeholder="XP Bonus"
                className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-slate-100 focus:border-amber-400"
                min={0}
              />
              <button onClick={() => removeSkillBonus(idx)} className="text-red-400 hover:text-red-600 text-lg font-bold">×</button>
            </div>
          ))}
        </div>
        {/* Save/Cancel Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button onClick={handleSave} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold px-8 py-3 rounded-2xl shadow-lg hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200">Save</button>
          <button onClick={onClose} className="bg-slate-700 text-slate-200 px-8 py-3 rounded-2xl shadow hover:bg-slate-600">Cancel</button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-300 hover:text-amber-400 text-2xl font-bold">×</button>
      </div>
    </div>
  );
} 