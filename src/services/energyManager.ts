import { EnergyState, EnergyForecast, Card } from '../types';

export class EnergyManager {
  /**
   * Calculate energy regenerated since last update
   */
  static updateEnergy(energy: EnergyState): EnergyState {
    const now = new Date();
    const timeDiff = (now.getTime() - energy.lastUpdate.getTime()) / (1000 * 60 * 60); // hours
    const energyGained = Math.min(
      energy.maximum - energy.current,
      timeDiff * energy.regenerationRate
    );

    return {
      ...energy,
      current: Math.min(energy.maximum, energy.current + energyGained),
      lastUpdate: now
    };
  }

  /**
   * Consume energy and validate availability
   */
  static consumeEnergy(energy: EnergyState, amount: number): { success: boolean; newEnergy: EnergyState } {
    if (energy.current < amount) {
      return { success: false, newEnergy: energy };
    }

    const now = new Date();
    const newEnergy: EnergyState = {
      ...energy,
      current: Math.max(0, energy.current - amount),
      lastUpdate: now,
      dailyUsage: [
        ...energy.dailyUsage.filter(usage => 
          new Date(usage.date).toDateString() === now.toDateString()
        ),
        {
          date: now.toDateString(),
          usage: [
            ...(energy.dailyUsage.find(u => u.date === now.toDateString())?.usage || []),
            {
              time: now.toTimeString(),
              amount,
              activity: 'Card Execution'
            }
          ]
        }
      ]
    };

    return { success: true, newEnergy };
  }

  /**
   * Predict energy usage for selected cards
   */
  static predictEnergyUsage(cards: Card[], currentEnergy: number): EnergyForecast {
    const totalConsumption = cards.reduce((sum, card) => sum + card.energyCost, 0);
    const remainingEnergy = currentEnergy - totalConsumption;
    
    // Calculate regeneration time needed if energy is insufficient
    const regenerationTime = remainingEnergy < 0 
      ? Math.abs(remainingEnergy) / 4.17 // hours at default regen rate
      : 0;

    const recommendations: string[] = [];
    
    if (remainingEnergy < 0) {
      recommendations.push('⚠️ Insufficient energy for all selected cards');
      recommendations.push(`🕐 Wait ${Math.ceil(regenerationTime)} hours for full energy`);
    } else if (remainingEnergy < 20) {
      recommendations.push('⚡ Low energy warning - consider energy recovery cards');
    }

    if (cards.length > 3) {
      recommendations.push('📋 Consider spreading cards throughout the day');
    }

    return {
      estimatedConsumption: totalConsumption,
      remainingEnergy,
      regenerationTime,
      recommendations
    };
  }

  /**
   * Get energy level percentage and status
   */
  static getEnergyStatus(energy: EnergyState): {
    percentage: number;
    status: 'high' | 'medium' | 'low' | 'critical';
    color: string;
    message: string;
  } {
    const percentage = Math.round((energy.current / energy.maximum) * 100);
    
    if (percentage >= 80) {
      return {
        percentage,
        status: 'high',
        color: 'text-emerald-400',
        message: 'Full energy! Ready for epic quests!'
      };
    } else if (percentage >= 50) {
      return {
        percentage,
        status: 'medium',
        color: 'text-blue-400',
        message: 'Good energy levels for activities'
      };
    } else if (percentage >= 20) {
      return {
        percentage,
        status: 'low',
        color: 'text-amber-400',
        message: 'Energy getting low - consider rest'
      };
    } else {
      return {
        percentage,
        status: 'critical',
        color: 'text-red-400',
        message: 'Critical energy! Rest required'
      };
    }
  }

  /**
   * Calculate time until full energy regeneration
   */
  static getTimeToFullEnergy(energy: EnergyState): {
    hours: number;
    minutes: number;
    message: string;
  } {
    const energyNeeded = energy.maximum - energy.current;
    const hoursNeeded = energyNeeded / energy.regenerationRate;
    const hours = Math.floor(hoursNeeded);
    const minutes = Math.round((hoursNeeded - hours) * 60);

    let message = 'Energy is full!';
    if (energyNeeded > 0) {
      if (hours > 0) {
        message = `${hours}h ${minutes}m until full energy`;
      } else {
        message = `${minutes}m until full energy`;
      }
    }

    return { hours, minutes, message };
  }
}