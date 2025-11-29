import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getClassTheme } from '../../data/characterClasses';
import { Filter, Search, Zap, Clock, Star, Sparkles, Brain } from 'lucide-react';
import { Card } from '../../types/index';
import { EditCardModal } from './EditCardModal';
import techOrb from '../../assets/tech_orb.png';

interface CardDeckProps {
  onNavigateToAI?: () => void;
}

export function CardDeck({ onNavigateToAI }: CardDeckProps = {}) {
  const { state, dispatch } = useAppContext();
  const { character } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [editCard, setEditCard] = useState<Card | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditCard = (card: Card) => {
    setEditCard(card);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (updatedCard: Card) => {
    dispatch({ type: 'UPDATE_CARD', payload: updatedCard });
  };

  // ✅ ARREGLO: Verificar que character y cards existan antes de continuar
  if (!character || !state.cards || !state.cards.inventory) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gold-200 mb-2 font-cinzel text-glow-sm">
            🎴 Card Deck
          </h1>
          <p className="text-xl text-slate-300 mb-4 font-cinzel">
            Loading your cards...
          </p>
          <div className="w-16 h-16 bg-gradient-to-r from-tech-gold to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-spin-slow">
            <div className="w-8 h-8 bg-void-950 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ ARREGLO: Usar optional chaining y fallback
  const availableCards = state.cards?.inventory || [];
  const theme = getClassTheme(character.class);

  // Filter cards based on search and filters
  const filteredCards = availableCards.filter(card => {
    const matchesSearch = (card.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (card.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity;
    const matchesType = filterType === 'all' || card.type === filterType;

    return matchesSearch && matchesRarity && matchesType;
  });

  const handleAddToInventory = (card: Card) => {
    dispatch({ type: 'ADD_CARD', payload: card });
  };

  const rarityColors: any = {
    common: 'border-slate-500/50 shadow-[0_0_10px_rgba(148,163,184,0.1)]',
    uncommon: 'border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    rare: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    epic: 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    legendary: 'border-tech-gold/50 shadow-[0_0_25px_rgba(255,215,0,0.5)]',
  };

  const rarityBg: any = {
    common: 'bg-slate-900/80',
    uncommon: 'bg-emerald-950/40',
    rare: 'bg-blue-950/40',
    epic: 'bg-purple-950/40',
    legendary: 'bg-yellow-950/40',
  };

  const typeIcons: any = {
    action: '🎯',
    power: '⚡',
    recovery: '💤',
    event: '🎲',
    equipment: '🛡️',
  };

  const CardComponent = ({ card }: { card: Card }) => {
    const canAfford = character.energy.current >= card.energyCost;
    const isOnCooldown = card.isOnCooldown;
    const typeIcon = typeIcons[card.type] || '🎴';

    return (
      <div className={`${rarityColors[card.rarity]} ${rarityBg[card.rarity]} backdrop-blur-md rounded-xl p-6 border transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden group`}>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 font-cinzel tracking-wide ${card.rarity === 'legendary' ? 'text-tech-gold text-glow-sm' :
                card.rarity === 'epic' ? 'text-purple-300' :
                  card.rarity === 'rare' ? 'text-blue-300' :
                    card.rarity === 'uncommon' ? 'text-emerald-300' : 'text-slate-300'
              }`}>{card.name}</h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-2xl drop-shadow-md">{typeIcon}</span>
              <span className={`px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider border ${card.rarity === 'common' ? 'bg-slate-900/50 text-slate-400 border-slate-700' :
                  card.rarity === 'uncommon' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-700' :
                    card.rarity === 'rare' ? 'bg-blue-900/50 text-blue-400 border-blue-700' :
                      card.rarity === 'epic' ? 'bg-purple-900/50 text-purple-400 border-purple-700' :
                        'bg-yellow-900/50 text-tech-gold border-tech-gold'
                }`}>
                {card.rarity}
              </span>
            </div>
          </div>

          {card.rarity === 'legendary' && (
            <div className="absolute top-0 right-0">
              <Sparkles className="w-6 h-6 text-tech-gold animate-pulse drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]" />
            </div>
          )}
        </div>

        {/* Card Description */}
        <p className="text-slate-300 text-sm mb-4 leading-relaxed font-inter relative z-10 min-h-[3rem]">
          {card.description}
        </p>

        {/* Card Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs relative z-10">
          <div className="flex items-center space-x-1 text-blue-300 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/30">
            <Zap className="w-3 h-3" />
            <span className="font-mono font-bold">{card.energyCost}</span>
          </div>
          <div className="flex items-center space-x-1 text-amber-300 bg-amber-900/20 px-2 py-1 rounded border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span className="font-mono font-bold">{card.duration}h</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-300 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/30">
            <Star className="w-3 h-3" />
            <span className="font-mono font-bold">+{card.impact} XP</span>
          </div>
        </div>

        {/* Skill Bonuses */}
        {card.skillBonus && card.skillBonus.length > 0 && (
          <div className="mb-4 relative z-10">
            <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Skill Bonuses:</h4>
            <div className="space-y-1">
              {card.skillBonus.map((bonus, index) => (
                <div key={index} className="text-xs text-slate-400 flex justify-between bg-void-950/30 px-2 py-0.5 rounded border border-white/5">
                  <span className="text-tech-gold">{bonus.skillName}</span>
                  <span className="font-mono text-emerald-400">+{bonus.xpBonus} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {(card.requirements?.level || card.requirements?.skills) && (
          <div className="mb-4 relative z-10">
            <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Requirements:</h4>
            <div className="text-xs text-slate-500 space-y-1">
              {card.requirements.level && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-tech-cyan rounded-full"></span>
                  Level {card.requirements.level}+
                </div>
              )}
              {card.requirements.skills && Object.entries(card.requirements.skills).map(([skill, level]) => (
                <div key={skill} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-tech-magenta rounded-full"></span>
                  {skill} Level {level}+
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => handleEditCard(card)}
          className="w-full py-2 px-4 rounded-lg font-bold font-cinzel tracking-wide bg-gradient-to-r from-tech-cyan/20 to-blue-600/20 text-tech-cyan border border-tech-cyan/50 hover:bg-tech-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all relative z-10"
        >
          Edit Card
        </button>

        {/* Cooldown indicator */}
        {card.cooldown && (
          <div className="absolute top-2 left-2 text-xs text-slate-400 bg-void-950/80 px-2 py-0.5 rounded-full border border-slate-700 backdrop-blur-sm z-20">
            <Clock className="w-3 h-3 inline mr-1" />
            {card.cooldown}h cooldown
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center relative mb-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-tech-gold/5 blur-3xl rounded-full pointer-events-none"></div>
        <h1 className="text-4xl font-bold text-gold-200 mb-2 font-cinzel text-glow-sm flex items-center justify-center gap-3 relative z-10">
          <img src={techOrb} alt="Orb" className="w-8 h-8 animate-pulse" />
          Card Deck
          <img src={techOrb} alt="Orb" className="w-8 h-8 animate-pulse" />
        </h1>
        <p className="text-xl text-slate-300 mb-6 font-cinzel relative z-10">
          Discover and collect powerful cards for your <span className="text-tech-cyan font-bold">{character.class}</span> journey
        </p>

        {/* Mystic Forge Button */}
        <div className="mb-6 relative z-10">
          <button
            onClick={onNavigateToAI}
            className="px-8 py-3 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-purple-100 font-bold font-cinzel rounded-xl border border-purple-500/50 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 transition-all group"
          >
            <Brain className="w-5 h-5 mr-2 inline group-hover:animate-pulse" />
            Open Mystic Forge
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-void-950/40 border border-tech-gold/30 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-gold/50 to-transparent"></div>

        <div className="grid md:grid-cols-4 gap-6 items-end">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2 font-cinzel">
              <Search className="w-4 h-4 inline mr-1 text-tech-gold" />
              Search Cards
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-4 py-2.5 bg-void-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-tech-gold focus:ring-1 focus:ring-tech-gold transition-all font-inter"
            />
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2 font-cinzel">
              <Sparkles className="w-4 h-4 inline mr-1 text-tech-magenta" />
              Rarity
            </label>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="w-full px-4 py-2.5 bg-void-900/50 border border-white/10 rounded-lg text-white focus:border-tech-magenta focus:ring-1 focus:ring-tech-magenta transition-all font-inter"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-bold text-gold-100 mb-2 font-cinzel">
              <Filter className="w-4 h-4 inline mr-1 text-tech-cyan" />
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 bg-void-900/50 border border-white/10 rounded-lg text-white focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all font-inter"
            >
              <option value="all">All Types</option>
              <option value="action">Action</option>
              <option value="power">Power</option>
              <option value="recovery">Recovery</option>
              <option value="event">Event</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          {/* Stats */}
          <div className="text-center bg-void-900/30 rounded-lg p-2 border border-white/5">
            <div className="text-3xl font-bold text-gold-200 font-cinzel text-glow-sm">{filteredCards.length}</div>
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Available Cards</div>
          </div>
        </div>
      </div>

      {/* Energy Status */}
      <div className="bg-void-950/40 border border-tech-cyan/30 backdrop-blur-md rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-tech-cyan/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-tech-cyan/20 flex items-center justify-center border border-tech-cyan/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <Zap className="w-6 h-6 text-tech-cyan" />
            </div>
            <div>
              <div className="text-xl font-bold text-tech-cyan font-cinzel">
                {Math.round(character.energy.current)} / {character.energy.maximum} Energy
              </div>
              <div className="text-sm text-slate-400 font-mono">
                Regenerates {character.energy.regenerationRate}/hour
              </div>
            </div>
          </div>
          <div className="w-1/3 bg-void-900 rounded-full h-4 border border-void-800 relative overflow-hidden">
            <div
              className="bg-gradient-to-r from-tech-cyan to-blue-600 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,240,255,0.5)] relative"
              style={{ width: `${(character.energy.current / character.energy.maximum) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map(card => (
            <CardComponent key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="bg-void-950/40 border border-dashed border-slate-700 rounded-2xl p-12 text-center shadow-xl backdrop-blur-sm">
          <div className="text-6xl mb-4 opacity-50 grayscale">🔍</div>
          <h3 className="text-xl font-bold text-slate-400 mb-2 font-cinzel">No Cards Found</h3>
          <p className="text-slate-500 font-inter">
            {searchTerm || filterRarity !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search filters to find more cards.'
              : 'Complete quests and level up to unlock new cards!'}
          </p>
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-void-950/40 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
          <Brain className="w-5 h-5 text-tech-magenta" />
          Card Knowledge Base
        </h3>
        <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-300">
          <div>
            <h4 className="font-bold text-tech-cyan mb-3 font-cinzel uppercase tracking-wider border-b border-tech-cyan/30 pb-1">Card Types</h4>
            <ul className="space-y-2 font-inter">
              <li className="flex items-center gap-2"><span className="text-xl">🎯</span> <span><strong>Action</strong>: Active tasks and activities</span></li>
              <li className="flex items-center gap-2"><span className="text-xl">⚡</span> <span><strong>Power</strong>: Major achievements and challenges</span></li>
              <li className="flex items-center gap-2"><span className="text-xl">💤</span> <span><strong>Recovery</strong>: Restore energy and balance</span></li>
              <li className="flex items-center gap-2"><span className="text-xl">🎲</span> <span><strong>Event</strong>: Special time-based activities</span></li>
              <li className="flex items-center gap-2"><span className="text-xl">🛡️</span> <span><strong>Equipment</strong>: Passive bonuses and tools</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-tech-magenta mb-3 font-cinzel uppercase tracking-wider border-b border-tech-magenta/30 pb-1">Rarity Levels</h4>
            <ul className="space-y-2 font-inter">
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-500"></span> <span className="text-slate-400">Common: Basic cards available early</span></li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span> <span className="text-emerald-400">Uncommon: Improved effectiveness</span></li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span> <span className="text-blue-400">Rare: Significant challenges</span></li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></span> <span className="text-purple-400">Epic: Major achievements</span></li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-tech-gold shadow-[0_0_5px_rgba(255,215,0,0.5)] animate-pulse"></span> <span className="text-tech-gold font-bold">Legendary: Ultimate mastery</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Card Modal */}
      <EditCardModal
        card={editCard}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}