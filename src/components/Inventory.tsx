import React, { useEffect, useState } from 'react';
import { getUserGifts, addGift, updateGift, deleteGift, claimGift, Gift } from '../services/giftService';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../context/AppContext';
import { Edit, Trash2, Sparkles, CalendarHeart, Gift as GiftIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ArcaneEngine } from '../services/arcaneEngine';
import techOrb from '../assets/tech_orb.png';
import techLantern from '../assets/tech_lantern.png';

// Extend Gift type locally
interface UIRPGGift extends Gift {
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  icon?: string;
}

const RARITY_OPTIONS: { value: 'common' | 'rare' | 'epic' | 'legendary'; label: string; color: string; icon: JSX.Element }[] = [
  { value: 'common', label: 'Common', color: 'gray', icon: <Sparkles className="w-5 h-5 text-slate-400" /> },
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

  if (loading) return <div className="text-center text-gold-200 font-cinzel p-8">Accessing Vault...</div>;

  // Add rarity icons and color map
  const rarityStyles: Record<string, string> = {
    common: 'border-slate-600 bg-void-900/50 shadow-[0_0_10px_rgba(148,163,184,0.1)]',
    rare: 'border-blue-500/50 bg-blue-950/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    epic: 'border-purple-500/50 bg-purple-950/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    legendary: 'border-amber-500/50 bg-amber-950/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse-slow',
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gold-200 mb-4 font-cinzel text-glow-sm flex items-center justify-center gap-3">
          <img src={techLantern} alt="Lantern" className="w-8 h-8 pixelated" />
          Treasure Vault
          <img src={techLantern} alt="Lantern" className="w-8 h-8 pixelated transform scale-x-[-1]" />
        </h2>
        <p className="text-slate-300 font-inter">Manage your rewards and track your progress.</p>
      </div>

      {/* Streak & Daily Bonus + Mystery Chest */}
      <div className="flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-3 bg-void-950/60 px-6 py-4 rounded-xl border border-tech-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.1)] backdrop-blur-md">
          <CalendarHeart className="w-8 h-8 text-tech-gold" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-cinzel">Current Streak</span>
            <span className="text-2xl font-bold text-gold-100 font-cinzel">{streak} Day{streak === 1 ? '' : 's'}</span>
          </div>
        </div>

        <button
          className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold border transition-all duration-300 font-cinzel
            ${canClaim
              ? 'bg-gradient-to-r from-emerald-900/80 to-teal-900/80 text-emerald-100 border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105'
              : 'bg-void-900/50 text-slate-500 border-slate-700 cursor-not-allowed'}`}
          onClick={handleClaimDaily}
          disabled={!canClaim}
        >
          <GiftIcon className={`w-6 h-6 ${canClaim ? 'animate-bounce text-emerald-400' : ''}`} />
          {canClaim ? 'Claim Daily Reward' : 'Reward Claimed'}
        </button>

        <button
          className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold border transition-all duration-300 font-cinzel bg-gradient-to-r from-tech-gold/20 to-orange-900/40 text-gold-200 border-tech-gold/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 ${chestOpen ? 'animate-pulse' : ''}`}
          onClick={handleOpenChest}
          disabled={chestOpen || chestLoading}
        >
          <img src={techOrb} className={`w-6 h-6 pixelated ${chestOpen ? 'animate-spin-slow' : ''}`} alt="Orb" />
          {chestLoading ? 'Summoning...' : 'Mystery Chest'}
        </button>
      </div>

      {chestMsg && (
        <div className="text-center p-4 bg-void-900/80 border border-tech-gold/30 rounded-xl animate-fadeIn shadow-lg max-w-md mx-auto">
          <p className="text-lg font-bold text-gold-300 font-cinzel">{chestMsg}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-void-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex justify-between items-end mb-3">
          <div className="text-xl font-bold text-gold-200 font-cinzel">Level {currentLevel}</div>
          <div className="text-sm text-tech-cyan font-mono">XP: {currentXP} / {xpForNextLevel}</div>
        </div>
        <div className="w-full h-6 bg-void-900 rounded-full shadow-inner border border-void-700 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-tech-gold via-orange-500 to-tech-gold bg-[length:200%_100%] animate-shimmer rounded-full shadow-[0_0_10px_rgba(255,215,0,0.3)] transition-all duration-1000"
            style={{ width: `${progress * 100}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-void-950 uppercase tracking-widest z-10 mix-blend-screen">
            {Math.round(progress * 100)}% to Level {nextLevel}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gold-100 font-cinzel flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-tech-magenta" />
          Inventory
        </h2>
        <button
          className="px-6 py-2 bg-tech-cyan/20 text-tech-cyan font-bold rounded-lg border border-tech-cyan/50 hover:bg-tech-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-cinzel text-sm"
          onClick={() => { setShowModal(true); setEditingGift(null); }}
        >
          + Forge Reward
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gifts.map(gift => {
          const g = gift as UIRPGGift;
          const rarity = g.rarity || 'common';
          const rarityOption = RARITY_OPTIONS.find(r => r.value === rarity);
          const icon = g.icon || '🪙';

          return (
            <div
              key={g.id}
              className={`relative border rounded-xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 ${rarityStyles[rarity]}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl filter drop-shadow-md bg-void-950/30 w-16 h-16 flex items-center justify-center rounded-lg border border-white/5">
                  {icon}
                </div>
                <div>
                  <div className="font-bold text-lg tracking-wide flex items-center gap-2 text-gold-100 font-cinzel">
                    {g.name}
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border inline-block mb-2 ${rarity === 'legendary' ? 'border-amber-500 text-amber-400' : rarity === 'epic' ? 'border-purple-500 text-purple-400' : rarity === 'rare' ? 'border-blue-500 text-blue-400' : 'border-slate-500 text-slate-400'}`}>
                    {rarityOption?.label}
                  </span>
                  <div className="text-sm text-slate-300 font-inter leading-relaxed">{g.description}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="text-xs text-slate-500 font-mono">Lvl {g.level_required} • {g.status}</div>
                <div className="flex gap-2">
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-xs transition-all
                      ${g.status === 'unlocked'
                        ? 'bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/50 hover:bg-tech-cyan/30 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}
                    `}
                    title={g.status === 'unlocked' ? 'Use Reward' : 'Locked'}
                    onClick={() => g.status === 'unlocked' && handleClaimGift(g.id)}
                    disabled={g.status !== 'unlocked'}
                  >
                    <Sparkles className="w-3 h-3" /> Use
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-gold-400 transition-colors"
                    onClick={() => { setEditingGift(g); setShowModal(true); }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    onClick={() => handleDeleteGift(g.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-void-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-void-900 border border-tech-gold/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-96 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-gold to-transparent opacity-50"></div>
            <div className="mb-6 font-bold text-xl text-gold-100 font-cinzel text-center">{editingGift ? 'Reforge Artifact' : 'Forge New Artifact'}</div>
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-tech-cyan mb-1 uppercase tracking-wider">Icon</label>
        <div className="flex gap-2">
          <input
            className="w-16 bg-void-950 border border-slate-700 text-2xl text-center rounded-lg px-2 py-1 focus:outline-none focus:border-tech-cyan transition text-white"
            value={icon}
            onChange={e => setIcon(e.target.value)}
            maxLength={2}
            placeholder="🪙"
          />
          <div className="text-xs text-slate-500 flex items-center">(Emoji)</div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-tech-cyan mb-1 uppercase tracking-wider">Artifact Name</label>
        <input
          className="w-full bg-void-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-tech-cyan transition font-cinzel"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-tech-cyan mb-1 uppercase tracking-wider">Description</label>
        <input
          className="w-full bg-void-950 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-tech-cyan transition font-inter text-sm"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-tech-cyan mb-1 uppercase tracking-wider">Level Req.</label>
          <input
            type="number"
            min={1}
            className="w-full bg-void-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-tech-cyan transition"
            value={level}
            onChange={e => setLevel(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-tech-cyan mb-1 uppercase tracking-wider">Rarity</label>
          <select
            className="w-full bg-void-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-tech-cyan transition"
            value={rarity}
            onChange={e => setRarity(e.target.value as 'common' | 'rare' | 'epic' | 'legendary')}
          >
            {RARITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isEdit && (
        <div>
          <label className="block text-xs font-bold text-tech-cyan mb-1 uppercase tracking-wider">Status</label>
          <select
            className="w-full bg-void-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-tech-cyan transition"
            value={status}
            onChange={e => setStatus(e.target.value as 'locked' | 'unlocked' | 'used')}
          >
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
            <option value="used">Used</option>
          </select>
        </div>
      )}

      {error && <div className="text-red-400 text-sm mb-2 font-bold">{error}</div>}

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
        <button type="button" className="px-4 py-2 text-slate-400 hover:text-white transition font-cinzel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-tech-gold to-orange-600 text-void-950 font-bold rounded-lg shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all duration-200 font-cinzel">{isEdit ? 'Save Changes' : 'Forge Item'}</button>
      </div>
    </form>
  );
}; 