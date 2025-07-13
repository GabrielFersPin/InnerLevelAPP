import React, { useEffect, useState } from 'react';
import { Zap, Clock, TrendingUp } from 'lucide-react';
import { EnergyState } from '../types';
import { EnergyManager } from '../services/energyManager';

interface EnergyMeterProps {
  energy: EnergyState;
  onEnergyUpdate?: (newEnergy: EnergyState) => void;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export function EnergyMeter({ 
  energy, 
  onEnergyUpdate, 
  size = 'medium', 
  showDetails = true 
}: EnergyMeterProps) {
  const [currentEnergy, setCurrentEnergy] = useState(energy);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update energy from time passage
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEnergy = EnergyManager.updateEnergy(currentEnergy);
      if (updatedEnergy.current !== currentEnergy.current) {
        setCurrentEnergy(updatedEnergy);
        if (onEnergyUpdate) {
          onEnergyUpdate(updatedEnergy);
        }
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentEnergy, onEnergyUpdate]);

  const energyStatus = EnergyManager.getEnergyStatus(currentEnergy);
  const timeToFull = EnergyManager.getTimeToFullEnergy(currentEnergy);
  const percentage = energyStatus.percentage;

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6'
  };

  const containerClasses = {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  };

  const textClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const getEnergyBarGradient = () => {
    if (percentage >= 80) {
      return 'bg-gradient-to-r from-emerald-500 to-green-400';
    } else if (percentage >= 50) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-400';
    } else if (percentage >= 20) {
      return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    } else {
      return 'bg-gradient-to-r from-red-500 to-red-400';
    }
  };

  return (
    <div className={`rpg-panel ${containerClasses[size]}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} className="text-blue-400" />
          <span className={`font-bold text-rpg-title ${textClasses[size]}`}>
            Energy
          </span>
        </div>
        <div className={`font-bold ${energyStatus.color} ${textClasses[size]}`}>
          {Math.round(currentEnergy.current)}/{currentEnergy.maximum}
        </div>
      </div>

      {/* Energy Bar */}
      <div className="relative mb-3">
        <div className={`w-full bg-slate-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
          <div 
            className={`
              ${getEnergyBarGradient()} 
              ${sizeClasses[size]} 
              rounded-full transition-all duration-1000 ease-out relative
              ${isAnimating ? 'animate-pulse' : ''}
            `}
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect for legendary energy */}
            {percentage >= 90 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Percentage indicator */}
        <div className="absolute right-0 -top-6 text-xs text-slate-400">
          {percentage}%
        </div>
      </div>

      {/* Energy Status Message */}
      <div className={`${energyStatus.color} font-medium mb-2 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
        {energyStatus.message}
      </div>

      {/* Details */}
      {showDetails && size !== 'small' && (
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span>Regen: {currentEnergy.regenerationRate.toFixed(1)}/hr</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{timeToFull.message}</span>
          </div>
        </div>
      )}

      {/* Energy Tips */}
      {showDetails && size === 'large' && percentage < 30 && (
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
          <div className="text-amber-300 font-semibold text-sm mb-1">⚡ Energy Tips:</div>
          <ul className="text-xs text-amber-200 space-y-1">
            <li>• Use recovery cards to restore energy faster</li>
            <li>• Take breaks between intense activities</li>
            <li>• Consider easier tasks when energy is low</li>
          </ul>
        </div>
      )}

      {/* High Energy Celebration */}
      {showDetails && size === 'large' && percentage >= 90 && (
        <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
          <div className="text-emerald-300 font-semibold text-sm mb-1">🌟 Peak Energy!</div>
          <p className="text-xs text-emerald-200">
            Perfect time for challenging quests and epic cards!
          </p>
        </div>
      )}

      {/* Today's Energy Usage */}
      {showDetails && size === 'large' && currentEnergy.dailyUsage.length > 0 && (
        <div className="mt-4">
          <div className="text-slate-300 font-semibold text-sm mb-2">Today's Usage:</div>
          <div className="space-y-1">
            {currentEnergy.dailyUsage
              .filter(usage => new Date(usage.date).toDateString() === new Date().toDateString())
              .slice(-3)
              .map((usage, index) => (
                <div key={index} className="flex justify-between text-xs text-slate-400">
                  <span>{usage.usage[usage.usage.length - 1]?.activity || 'Activity'}</span>
                  <span>-{usage.usage[usage.usage.length - 1]?.amount || 0} energy</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}