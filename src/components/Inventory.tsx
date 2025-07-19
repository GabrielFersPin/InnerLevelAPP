 import React, { useEffect, useState } from 'react';
import { getUserGifts, addGift, updateGift, deleteGift, claimGift, Gift } from '../services/giftService';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../context/AppContext';
import { Edit, Trash2, Sparkles, CalendarHeart, Gift as GiftIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ArcaneEngine } from '../services/arcaneEngine';

// Extend Gift type locally
interface UIRPGGift extends Gift {
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  icon?: string;
}

const RARITY_OPTIONS: { value: 'common' | 'rare' | 'epic' | 'legendary'; label: string; color: string; icon: JSX.Element }[] = [
  { value: 'common', label: 'Common', color: 'gray', icon: <Sparkles className="w-5 h-5 text-gray-400" /> },
  { value: 'rare', label: 'Rare', color: 'blue', icon: <Sparkles className="w-5 h-5 text-blue-400" /> },
  { value: 'epic', label: 'Epic', color: 'purple', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
  { value: 'legendary', label: 'Legendary', color: 'amber', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
];

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const { state } = useAppContext();
  const character = state.character;
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  // Streak and daily bonus state
  const [streak, setStreak] = useState<number>(0);
  const [lastClaim, setLastClaim] = useState<string | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);
  const [chestMsg, setChestMsg] = useState<string | null>(null);
  const [chestLoading, setChestLoading] = useState(false);

  // Progress calculation for next level
  const currentLevel = character?.level || 1;
  const currentXP = character?.experience || 0;
  const nextLevel = currentLevel + 1;
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
  const progress = Math.min(1, (currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel));

  // --- Streak logic ---
  useEffect(() => {
    // Get streak and last claim from localStorage
    const streakVal = parseInt(localStorage.getItem('il_streak') || '0', 10);
    const lastClaimVal = localStorage.getItem('il_last_claim');
    setStreak(streakVal);
    setLastClaim(lastClaimVal);
    // Check if can claim today
    const today = new Date().toISOString().split('T')[0];
    setCanClaim(lastClaimVal !== today);
  }, []);

  const handleClaimDaily = () => {
    const today = new Date().toISOString().split('T')[0];
    let newStreak = streak;
    if (lastClaim) {
      const last = new Date(lastClaim);
      const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    setStreak(newStreak);
    setLastClaim(today);
    setCanClaim(false);
    localStorage.setItem('il_streak', newStreak.toString());
    localStorage.setItem('il_last_claim', today);
    // Optionally: Give a bonus reward (e.g., XP, or add a special gift)
    // For now, just show a notification
    alert(`Daily bonus claimed! Streak: ${newStreak} days`);
  };

  // Mystery Chest logic (AI-powered)
  const handleOpenChest = async () => {
    setChestOpen(true);
    setChestMsg(null);
    setChestLoading(true);
    try {
      // Use ArcaneEngine to generate AI rewards
      const aiResult = await ArcaneEngine.generateDailyCards({
        character,
        energy: character.energy.current,
        availableTime: 2,
        currentMood: 'neutral',
        recentActivity: [],
        activeQuests: character.currentGoals,
        preferences: [],
      });
      setChestOpen(false);
      setChestLoading(false);
      if (aiResult.cards && aiResult.cards.length > 0) {
        const card = aiResult.cards[Math.floor(Math.random() * aiResult.cards.length)];
        // Add as a reward
        const newGift = {
          name: card.name,
          description: card.description,
          level_required: 1,
          status: 'unlocked' as const,
          rarity: card.rarity || 'common',
          icon: '🎁',
        };
        setGifts(prev => [...prev, { ...newGift, id: `chest_${Date.now()}`, user_id: user?.id || '', created_at: new Date().toISOString() }]);
        setChestMsg(`AI Chest: You found "${card.name}" (${card.rarity})! 🎁`);
      } else {
        setChestMsg('The chest was empty... Try again tomorrow!');
      }
    } catch (err) {
      setChestOpen(false);
      setChestLoading(false);
      setChestMsg('The chest fizzled... AI is sleeping.');
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserGifts(user.id)
        .then(setGifts)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAddGift = async (gift: Omit<Gift, 'id' | 'user_id' | 'created_at' | 'used_at'>) => {
    if (!user) return;
    const newGift = await addGift(user.id, gift);
    setGifts((prev) => [...prev, newGift]);
    setShowModal(false);
  };

  const handleEditGift = async (giftId: string, updates: Partial<Omit<Gift, 'id' | 'user_id' | 'created_at'>>) => {
    const updated = await updateGift(giftId, updates);
    setGifts((prev) => prev.map(g => g.id === giftId ? updated : g));
    setShowModal(false);
    setEditingGift(null);
  };

  const handleDeleteGift = async (giftId: string) => {
    await deleteGift(giftId);
    setGifts((prev) => prev.filter(g => g.id !== giftId));
  };

  const handleClaimGift = async (giftId: string) => {
    const claimed = await claimGift(giftId);
    setGifts((prev) => prev.map(g => g.id === giftId ? claimed : g));
    // Confetti burst!
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#fbbf24', '#a78bfa', '#f472b6', '#f59e42', '#fef08a', '#818cf8', '#f472b6', '#facc15'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });
  };

  if (loading) return <div>Loading inventory...</div>;

  // Add rarity icons and color map
  const rarityStyles: Record<string, string> = {
    common: 'border-gray-400 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800',
    rare: 'border-blue-400 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-800',
    epic: 'border-purple-500 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-800',
    legendary: 'border-amber-400 bg-gradient-to-br from-amber-700 via-amber-900 to-slate-800 animate-pulse-slow',
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Streak & Daily Bonus + Mystery Chest */}
      <div className="mb-6 flex items-center gap-6">
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-700 via-amber-900 to-indigo-900 px-4 py-2 rounded-xl border-2 border-amber-500 shadow-lg">
          <CalendarHeart className="w-6 h-6 text-amber-300" />
          <span className="text-lg font-bold text-amber-200">Streak: {streak} day{streak === 1 ? '' : 's'}</span>
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold border-2 shadow-lg transition-all duration-200
            ${canClaim
              ? 'bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 text-white border-green-300 hover:from-green-400 hover:to-teal-600 scale-105'
              : 'bg-slate-700 text-slate-400 border-slate-600 opacity-60 cursor-not-allowed'}`}
          onClick={handleClaimDaily}
          disabled={!canClaim}
          title={canClaim ? 'Claim your daily bonus!' : 'Already claimed today'}
        >
          <GiftIcon className="w-5 h-5 mr-1 -ml-1" /> Claim Daily Bonus
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold border-2 shadow-lg transition-all duration-200 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-600 text-amber-900 border-amber-300 hover:from-yellow-300 hover:to-orange-400 hover:scale-105 ${chestOpen ? 'animate-bounce' : ''}`}
          onClick={handleOpenChest}
          disabled={chestOpen || chestLoading}
          title="Open the Mystery Chest!"
        >
          <GiftIcon className={`w-6 h-6 ${chestOpen ? 'animate-spin-slow' : ''}`} />
          {chestLoading ? 'Summoning...' : 'Mystery Chest'}
        </button>
      </div>
      {chestMsg && (
        <div className="mb-4 text-center text-lg font-bold text-amber-300 animate-fadeIn drop-shadow-glow">
          {chestMsg}
        </div>
      )}
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <div className="text-lg font-bold text-amber-300">Level {currentLevel}</div>
          <div className="text-xs text-slate-400">XP: {currentXP} / {xpForNextLevel}</div>
        </div>
        <div className="w-full h-5 bg-slate-700 rounded-full shadow-inner border border-amber-700 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900/80">
            {Math.round(progress * 100)}% to Level {nextLevel}
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-amber-200">Your Rewards & Inventory</h2>
      <button
        className="mb-4 px-6 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-amber-400 hover:to-indigo-500 hover:scale-105 transition-all duration-200 border-2 border-amber-400"
        onClick={() => { setShowModal(true); setEditingGift(null); }}
      >
        + Forge Reward
      </button>
      <ul className="space-y-6">
        {gifts.map(gift => {
          const g = gift as UIRPGGift;
          const rarity = g.rarity || 'common';
          const rarityOption = RARITY_OPTIONS.find(r => r.value === rarity);
          const icon = g.icon || '🪙';
          return (
            <li
              key={g.id}
              className={`relative border-2 rounded-2xl p-5 flex justify-between items-center shadow-xl hover:shadow-amber-400/30 transition group ${rarityStyles[rarity]}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl drop-shadow-glow">
                  {icon}
                </span>
                <div>
                  <div className="font-extrabold text-lg tracking-wide flex items-center gap-2 text-amber-200">
                    {g.name}
                    <span className={`text-xs font-bold uppercase ml-2 px-2 py-0.5 rounded-full border ${rarity === 'legendary' ? 'border-amber-400 bg-amber-900 text-amber-200 animate-pulse' : rarity === 'epic' ? 'border-purple-400 bg-purple-900 text-purple-200' : rarity === 'rare' ? 'border-blue-400 bg-blue-900 text-blue-200' : 'border-gray-400 bg-slate-800 text-gray-300'}`}>{rarityOption?.label}</span>
                  </div>
                  <div className="text-sm text-indigo-200 italic">{g.description}</div>
                  <div className="text-xs mt-1 text-slate-400">Level: {g.level_required} | Status: {g.status}</div>
                </div>
              </div>
              <div className="flex gap-2 items-center ml-4">
                <button
                  className={`flex items-center gap-1 px-3 py-1 rounded-full shadow-lg border-2 font-semibold text-sm transition-all duration-150
                    ${g.status === 'unlocked'
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-700 to-indigo-900 text-white border-indigo-500 hover:from-purple-400 hover:to-indigo-500'
                      : 'bg-slate-700 text-slate-400 border-slate-600 opacity-60 cursor-not-allowed'}
                  `}
                  title={g.status === 'unlocked' ? 'Use Reward' : g.status === 'locked' ? 'Reward is locked' : 'Reward already used'}
                  onClick={() => g.status === 'unlocked' && handleClaimGift(g.id)}
                  disabled={g.status !== 'unlocked'}
                >
                  <Sparkles className="w-4 h-4 mr-1 -ml-1 text-amber-300" /> Use
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-slate-900 rounded-full shadow-lg border-2 border-yellow-300 hover:from-yellow-300 hover:to-amber-400 font-semibold text-sm transition-all duration-150"
                  title="Edit Reward"
                  onClick={() => { setEditingGift(g); setShowModal(true); }}
                >
                  <Edit className="w-4 h-4 mr-1 -ml-1" /> Edit
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 via-rose-600 to-rose-800 text-white rounded-full shadow-lg border-2 border-red-400 hover:from-red-400 hover:to-rose-600 font-semibold text-sm transition-all duration-150"
                  title="Delete Reward"
                  onClick={() => handleDeleteGift(g.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1 -ml-1" /> Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <div className="mb-4 font-bold text-lg">{editingGift ? 'Edit Gift' : 'Add Gift'}</div>
            <GiftForm
              initialGift={editingGift}
              onSave={async (gift) => {
                if (editingGift) {
                  await handleEditGift(editingGift.id, gift);
                } else {
                  await handleAddGift(gift);
                }
              }}
              onCancel={() => { setShowModal(false); setEditingGift(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

type GiftFormProps = {
  initialGift: Partial<UIRPGGift> | null;
  onSave: (gift: { name: string; description?: string; level_required: number; status: 'locked' | 'unlocked' | 'used'; rarity: 'common' | 'rare' | 'epic' | 'legendary'; icon: string }) => void;
  onCancel: () => void;
};

const GiftForm: React.FC<GiftFormProps> = ({ initialGift, onSave, onCancel }) => {
  const [name, setName] = useState(initialGift?.name || '');
  const [description, setDescription] = useState(initialGift?.description || '');
  const [level, setLevel] = useState(initialGift?.level_required || 1);
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'used'>(initialGift?.status || 'locked');
  const [rarity, setRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>(initialGift?.rarity || 'common');
  const [icon, setIcon] = useState<string>(initialGift?.icon || '🪙');
  const [error, setError] = useState('');
  const isEdit = Boolean(initialGift && initialGift.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!level || level < 1) {
      setError('Level must be at least 1');
      return;
    }
    setError('');
    onSave({ name: name.trim(), description: description.trim(), level_required: level, status, rarity, icon });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900 rounded-xl p-4 shadow-xl border border-amber-700">
      <div>
        <label className="block text-sm font-semibold text-amber-300 mb-1">Icon</label>
        <input
          className="w-16 border-2 border-indigo-400 bg-slate-800 text-2xl text-center rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          maxLength={2}
          placeholder="🪙"
        />
        <span className="text-xs text-slate-400 ml-2">(Emoji or 1-2 chars)</span>
      </div>
      <div>
        <label className="block text-sm font-semibold text-amber-300 mb-1">Name *</label>
        <input
          className="w-full border-2 border-amber-400 bg-slate-800 text-amber-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-amber-300 mb-1">Description</label>
        <input
          className="w-full border-2 border-indigo-400 bg-slate-800 text-amber-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-amber-300 mb-1">Level Required *</label>
        <input
          type="number"
          min={1}
          className="w-full border-2 border-amber-400 bg-slate-800 text-amber-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          value={level}
          onChange={e => setLevel(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-amber-300 mb-1">Rarity</label>
        <select
          className="w-full border-2 border-purple-400 bg-slate-800 text-amber-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={rarity}
          onChange={e => setRarity(e.target.value as 'common' | 'rare' | 'epic' | 'legendary')}
        >
          {RARITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {isEdit && (
        <div>
          <label className="block text-sm font-semibold text-amber-300 mb-1">Status</label>
          <select
            className="w-full border-2 border-indigo-400 bg-slate-800 text-amber-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={status}
            onChange={e => setStatus(e.target.value as 'locked' | 'unlocked' | 'used')}
          >
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
            <option value="used">Used</option>
          </select>
        </div>
      )}
      {error && <div className="text-red-400 text-sm mb-2 font-semibold">{error}</div>}
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="px-4 py-2 bg-slate-700 text-amber-200 rounded-lg border border-slate-600 hover:bg-slate-600 transition" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg border-2 border-amber-400 hover:from-amber-400 hover:to-indigo-500 hover:scale-105 transition-all duration-200">{isEdit ? 'Save' : 'Add'}</button>
      </div>
    </form>
  );
}; 