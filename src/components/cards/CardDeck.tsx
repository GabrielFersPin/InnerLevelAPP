import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getAvailableCards, rarityColors, typeIcons } from '../../data/baseCards';
import { getClassTheme } from '../../data/characterClasses';
import { Filter, Search, Zap, Clock, Star, Sparkles, Brain } from 'lucide-react';
import { Card } from '../../types/index';

interface CardDeckProps {
  onNavigateToAI?: () => void;
}

export function CardDeck({ onNavigateToAI }: CardDeckProps = {}) {
  const { state, dispatch } = useAppContext();
  const { character } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  if (!character) return null;

  const availableCards = state.cards.inventory;
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

  const CardComponent = ({ card }: { card: Card }) => {
    const canAfford = character.energy.current >= card.energyCost;
    const isOnCooldown = card.isOnCooldown;
    const typeIcon = typeIcons[card.type] || '🎴';
    
    return (
      <div className={`${rarityColors[card.rarity]} bg-slate-800/90 rounded-xl p-6 border-2 transition-all duration-200 hover:scale-105 hover:shadow-2xl relative overflow-hidden`}>
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-200 mb-1">{card.name}</h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-2xl">{typeIcon}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                card.rarity === 'common' ? 'bg-slate-600 text-slate-200' :
                card.rarity === 'uncommon' ? 'bg-green-600 text-green-100' :
                card.rarity === 'rare' ? 'bg-blue-600 text-blue-100' :
                card.rarity === 'epic' ? 'bg-purple-600 text-purple-100' :
                'bg-amber-600 text-amber-100'
              }`}>
                {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
              </span>
            </div>
          </div>
          
          {card.rarity === 'legendary' && (
            <div className="absolute top-2 right-2">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Card Description */}
        <p className="text-slate-200 text-sm mb-4 leading-relaxed">
          {card.description}
        </p>

        {/* Card Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="flex items-center space-x-1 text-blue-300">
            <Zap className="w-4 h-4" />
            <span>{card.energyCost}</span>
          </div>
          <div className="flex items-center space-x-1 text-amber-300">
            <Clock className="w-4 h-4" />
            <span>{card.duration}h</span>
          </div>
          <div className="flex items-center space-x-1 text-green-300">
            <Star className="w-4 h-4" />
            <span>+{card.impact} XP</span>
          </div>
        </div>

        {/* Skill Bonuses */}
        {card.skillBonus.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-slate-300 mb-2">Skill Bonuses:</h4>
            <div className="space-y-1">
              {card.skillBonus.map((bonus, index) => (
                <div key={index} className="text-xs text-slate-400">
                  <span className="text-amber-300">{bonus.skillName}</span>: +{bonus.xpBonus} XP
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {(card.requirements.level || card.requirements.skills) && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-slate-300 mb-2">Requirements:</h4>
            <div className="text-xs text-slate-400 space-y-1">
              {card.requirements.level && (
                <div>Level {card.requirements.level}+</div>
              )}
              {card.requirements.skills && Object.entries(card.requirements.skills).map(([skill, level]) => (
                <div key={skill}>{skill} Level {level}+</div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => handleAddToInventory(card)}
          disabled={!canAfford || isOnCooldown}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            !canAfford || isOnCooldown
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg'
          }`}
        >
          {isOnCooldown ? 'On Cooldown' : 
           !canAfford ? 'Not Enough Energy' : 
           'Add to Deck'}
        </button>

        {/* Cooldown indicator */}
        {card.cooldown && (
          <div className="absolute top-2 left-2 text-xs text-slate-400">
            <Clock className="w-3 h-3 inline mr-1" />
            {card.cooldown}h cooldown
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-200 mb-2">
          🎴 Card Deck
        </h1>
        <p className="text-xl text-slate-300 mb-4">
          Discover and collect powerful cards for your {character.class} journey
        </p>
        
        {/* AI Generator CTA */}
        <div className="mb-6">
          <button
            onClick={onNavigateToAI}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Brain className="w-5 h-5 mr-2 inline" />
            Generate AI-Powered Cards
          </button>
          <p className="text-sm text-slate-400 mt-2">
            Create personalized cards using AI based on your goals and situation
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={`${theme.panel} rounded-2xl p-6 shadow-2xl`}>
        <div className="grid md:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search Cards
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Rarity
            </label>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
            <label className="block text-sm font-medium text-amber-200 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-300">{filteredCards.length}</div>
            <div className="text-sm text-slate-400">Available Cards</div>
          </div>
        </div>
      </div>

      {/* Energy Status */}
      <div className={`${theme.panel} rounded-xl p-4 shadow-xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Zap className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-lg font-semibold text-blue-300">
                {Math.round(character.energy.current)} / {character.energy.maximum} Energy
              </div>
              <div className="text-sm text-slate-400">
                Regenerates {character.energy.regenerationRate}/hour
              </div>
            </div>
          </div>
          <div className="w-48 bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(character.energy.current / character.energy.maximum) * 100}%` }}
            ></div>
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
        <div className={`${theme.panel} rounded-2xl p-12 text-center shadow-2xl`}>
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-amber-200 mb-2">No Cards Found</h3>
          <p className="text-slate-300">
            {searchTerm || filterRarity !== 'all' || filterType !== 'all' 
              ? 'Try adjusting your search filters to find more cards.'
              : 'Complete quests and level up to unlock new cards!'}
          </p>
        </div>
      )}

      {/* Quick Info */}
      <div className={`${theme.panel} rounded-2xl p-6 shadow-2xl`}>
        <h3 className="text-xl font-bold text-amber-200 mb-4">How Cards Work</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Card Types:</h4>
            <ul className="space-y-1">
              <li>⚔️ <strong>Action</strong>: Active tasks and activities</li>
              <li>✨ <strong>Power</strong>: Major achievements and challenges</li>
              <li>💚 <strong>Recovery</strong>: Restore energy and balance</li>
              <li>📅 <strong>Event</strong>: Special time-based activities</li>
              <li>🛡️ <strong>Equipment</strong>: Passive bonuses and tools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Rarity Levels:</h4>
            <ul className="space-y-1">
              <li><span className="text-slate-400">⚪ Common</span>: Basic cards available early</li>
              <li><span className="text-green-400">🟢 Uncommon</span>: Improved effectiveness</li>
              <li><span className="text-blue-400">🔵 Rare</span>: Significant challenges</li>
              <li><span className="text-purple-400">🟣 Epic</span>: Major achievements</li>
              <li><span className="text-amber-400">🟡 Legendary</span>: Ultimate mastery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}