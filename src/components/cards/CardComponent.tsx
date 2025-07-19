import React from 'react';
import { Card } from '../../types';
import { Clock, Zap, Target, Shield, Sparkles } from 'lucide-react';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large' | 'minimal';
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function CardComponent({ 
  card, 
  onClick, 
  isSelected = false, 
  isDisabled = false, 
  showDetails = true,
  size = 'medium',
  draggable = false,
  onDragStart
}: CardComponentProps) {
  const getRarityClass = (rarity: Card['rarity']) => {
    switch (rarity) {
      case 'common': return 'card-common';
      case 'uncommon': return 'card-uncommon';
      case 'rare': return 'card-rare';
      case 'epic': return 'card-epic';
      case 'legendary': return 'card-legendary';
      default: return 'card-common';
    }
  };

  const getTypeIcon = (type: Card['type']) => {
    switch (type) {
      case 'action': return <Target size={16} className="text-amber-400" />;
      case 'power': return <Sparkles size={16} className="text-purple-400" />;
      case 'recovery': return <Shield size={16} className="text-emerald-400" />;
      case 'event': return <Zap size={16} className="text-blue-400" />;
      case 'equipment': return <Shield size={16} className="text-slate-400" />;
      default: return <Target size={16} className="text-amber-400" />;
    }
  };

  const getRarityBadge = (rarity: Card['rarity']) => {
    const rarityColors = {
      common: 'bg-slate-600 text-slate-200',
      uncommon: 'bg-emerald-600 text-emerald-100',
      rare: 'bg-blue-600 text-blue-100',
      epic: 'bg-purple-600 text-purple-100',
      legendary: 'bg-amber-600 text-amber-100'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${rarityColors[rarity]}`}>
        {rarity}
      </span>
    );
  };

  const sizeClasses = {
    small: 'p-3 min-h-[120px]',
    medium: 'p-4 min-h-[160px]',
    large: 'p-6 min-h-[200px]'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  if (size === 'minimal') {
    return (
      <div
        className={`bg-slate-800 border-2 border-amber-400 rounded-lg px-3 py-2 flex items-center gap-3 cursor-pointer min-w-[220px] min-h-[48px] shadow-md hover:bg-slate-700 transition-all ${isSelected ? 'ring-2 ring-amber-400 scale-105' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={isDisabled ? undefined : onClick}
        draggable={draggable}
        onDragStart={onDragStart}
      >
        <span className="mr-1">{getTypeIcon(card.type)}</span>
        <span className="font-bold text-amber-200 text-sm flex-1">{card.name}</span>
        <span className="text-emerald-300 font-bold ml-2">+{card.impact} XP</span>
        <span className="text-blue-300 font-bold ml-2">⚡{card.energyCost}</span>
      </div>
    );
  }

  return (
    <div
      className={`
        ${getRarityClass(card.rarity)}
        ${sizeClasses[size]}
        rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${isSelected ? 'ring-2 ring-amber-400 scale-105' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
        ${onClick ? 'hover:brightness-110' : ''}
        relative overflow-hidden group
      `}
      onClick={isDisabled ? undefined : onClick}
    >
      {/* Rarity Sparkle Effect */}
      {card.rarity === 'legendary' && (
        <div className="absolute top-2 right-2 sparkle">
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getTypeIcon(card.type)}
          <span className={`font-bold ${textSizeClasses[size]} text-amber-200`}>
            {card.name}
          </span>
        </div>
        
        {showDetails && (
          <div className="flex flex-col items-end gap-1">
            {getRarityBadge(card.rarity)}
          </div>
        )}
      </div>

      {/* Card Description */}
      <p className={`text-slate-300 ${size === 'small' ? 'text-xs' : 'text-sm'} mb-3 line-clamp-2`}>
        {card.description}
      </p>

      {/* Card Stats */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Zap size={14} className="text-blue-400" />
            <span className="text-xs text-slate-300">{card.energyCost}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-300">{card.duration}h</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Target size={14} className="text-amber-400" />
            <span className="text-xs text-slate-300">{card.impact}</span>
          </div>
        </div>
      )}

      {/* Card Effects */}
      {showDetails && card.effects && card.effects.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-amber-300 font-semibold mb-1">Effects:</div>
          {card.effects.slice(0, 2).map((effect, index) => (
            <div key={index} className="text-xs text-slate-400">
              {effect.type === 'energy' && '⚡'} 
              {effect.type === 'multiplier' && '✨'} 
              {effect.type === 'unlock' && '🔓'} 
              {effect.type === 'bonus' && '🎯'} 
              {effect.target}: {effect.value > 1 ? `x${effect.value}` : `+${effect.value}`}
            </div>
          ))}
        </div>
      )}

      {/* Card Tags */}
      {showDetails && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Cooldown Indicator */}
      {card.isOnCooldown && (
        <div className="absolute inset-0 bg-slate-900/80 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Clock size={24} className="text-slate-400 mx-auto mb-2" />
            <div className="text-slate-400 text-sm font-semibold">On Cooldown</div>
          </div>
        </div>
      )}

      {/* Usage Count */}
      {showDetails && card.usageCount > 0 && (
        <div className="absolute bottom-2 right-2 bg-slate-700/80 text-slate-300 text-xs px-2 py-1 rounded-full">
          Used: {card.usageCount}
        </div>
      )}

      {/* AI Generated Badge */}
      {card.forged && showDetails && (
        <div className="absolute top-2 left-2 bg-purple-600/80 text-purple-100 text-xs px-2 py-1 rounded-full font-semibold">
          AI
        </div>
      )}

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-amber-400/20 rounded-xl border-2 border-amber-400 pointer-events-none" />
      )}
    </div>
  );
}