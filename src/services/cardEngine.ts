import { Card, CardResult, Quest, EnergyState } from '../types';

export class CardEngine {
  /**
   * Execute a card and return the result
   */
  static executeCard(card: Card, userState: {
    energy: EnergyState;
    activeQuests: Quest[];
    currentTime: Date;
  }): CardResult {
    // Check if card is on cooldown
    if (card.isOnCooldown) {
      return {
        success: false,
        energyConsumed: 0,
        progressGained: 0,
        effects: [],
        message: '⏰ Card is on cooldown!'
      };
    }

    // Check energy requirements
    if (userState.energy.current < card.energyCost) {
      return {
        success: false,
        energyConsumed: 0,
        progressGained: 0,
        effects: [],
        message: '⚡ Insufficient energy to execute this card!'
      };
    }

    // Check conditions
    const conditionCheck = this.checkConditions(card, userState);
    if (!conditionCheck.success) {
      return {
        success: false,
        energyConsumed: 0,
        progressGained: 0,
        effects: [],
        message: conditionCheck.message
      };
    }

    // Calculate base progress gain
    let progressGained = card.impact;

    // Apply multipliers based on card effects
    const effects: string[] = [];
    if (card.effects) {
      for (const effect of card.effects) {
        if (effect.type === 'multiplier') {
          progressGained *= effect.value;
          effects.push(`✨ ${effect.target} multiplier: x${effect.value}`);
        }
      }
    }

    // Apply rarity bonus
    const rarityMultiplier = this.getRarityMultiplier(card.rarity);
    progressGained *= rarityMultiplier;
    if (rarityMultiplier > 1) {
      effects.push(`🌟 ${card.rarity} rarity bonus: x${rarityMultiplier}`);
    }

    // Apply time-of-day bonus
    const timeBonus = this.getTimeBonus(userState.currentTime);
    progressGained *= timeBonus.multiplier;
    if (timeBonus.multiplier !== 1) {
      effects.push(`🕐 ${timeBonus.message}`);
    }

    const finalProgress = Math.round(progressGained);

    return {
      success: true,
      energyConsumed: card.energyCost,
      progressGained: finalProgress,
      effects,
      message: `✅ Successfully executed "${card.name}"! Gained ${finalProgress} progress points.`
    };
  }

  /**
   * Check if card conditions are met
   */
  private static checkConditions(card: Card, userState: any): { success: boolean; message: string } {
    if (!card.conditions) {
      return { success: true, message: '' };
    }

    // Check energy level requirement
    if (card.conditions.requiredEnergyLevel) {
      const requirement = card.conditions.requiredEnergyLevel;
      const currentPercentage = (userState.energy.current / userState.energy.maximum) * 100;
      
      if (requirement.includes('>')) {
        const threshold = parseInt(requirement.replace('>', '').replace('%', ''));
        if (currentPercentage <= threshold) {
          return { 
            success: false, 
            message: `💪 Requires energy level > ${threshold}% (currently ${Math.round(currentPercentage)}%)` 
          };
        }
      }
    }

    // Check time requirements
    if (card.conditions.timeRequired) {
      const now = new Date();
      const currentHour = now.getHours();
      
      if (card.conditions.timeRequired === 'morning' && (currentHour < 6 || currentHour >= 12)) {
        return { success: false, message: '🌅 This card can only be used in the morning (6 AM - 12 PM)' };
      }
      if (card.conditions.timeRequired === 'afternoon' && (currentHour < 12 || currentHour >= 18)) {
        return { success: false, message: '☀️ This card can only be used in the afternoon (12 PM - 6 PM)' };
      }
      if (card.conditions.timeRequired === 'evening' && (currentHour < 18 || currentHour >= 22)) {
        return { success: false, message: '🌙 This card can only be used in the evening (6 PM - 10 PM)' };
      }
    }

    return { success: true, message: '' };
  }

  /**
   * Get multiplier based on card rarity
   */
  private static getRarityMultiplier(rarity: Card['rarity']): number {
    switch (rarity) {
      case 'common': return 1.0;
      case 'uncommon': return 1.1;
      case 'rare': return 1.25;
      case 'epic': return 1.5;
      case 'legendary': return 2.0;
      default: return 1.0;
    }
  }

  /**
   * Get time-based bonus
   */
  private static getTimeBonus(currentTime: Date): { multiplier: number; message: string } {
    const hour = currentTime.getHours();
    
    // Morning bonus (6-10 AM)
    if (hour >= 6 && hour < 10) {
      return { multiplier: 1.2, message: 'Morning productivity bonus: x1.2' };
    }
    
    // Evening reflection bonus (6-9 PM)
    if (hour >= 18 && hour < 21) {
      return { multiplier: 1.1, message: 'Evening reflection bonus: x1.1' };
    }
    
    return { multiplier: 1.0, message: '' };
  }

  /**
   * Check if a card is available (not on cooldown)
   */
  static isCardAvailable(card: Card, cooldowns: Record<string, Date>): boolean {
    if (!card.cooldown) return true;
    
    const cooldownEnd = cooldowns[card.id];
    if (!cooldownEnd) return true;
    
    return new Date() >= cooldownEnd;
  }

  /**
   * Calculate remaining cooldown time for a card
   */
  static getCooldownRemaining(card: Card, cooldowns: Record<string, Date>): {
    isOnCooldown: boolean;
    remainingHours: number;
    remainingMinutes: number;
    message: string;
  } {
    if (!card.cooldown) {
      return { isOnCooldown: false, remainingHours: 0, remainingMinutes: 0, message: 'Ready' };
    }

    const cooldownEnd = cooldowns[card.id];
    if (!cooldownEnd) {
      return { isOnCooldown: false, remainingHours: 0, remainingMinutes: 0, message: 'Ready' };
    }

    const now = new Date();
    const remainingMs = cooldownEnd.getTime() - now.getTime();
    
    if (remainingMs <= 0) {
      return { isOnCooldown: false, remainingHours: 0, remainingMinutes: 0, message: 'Ready' };
    }

    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    let message = 'On cooldown';
    if (remainingHours > 0) {
      message = `${remainingHours}h ${remainingMinutes}m`;
    } else {
      message = `${remainingMinutes}m`;
    }

    return {
      isOnCooldown: true,
      remainingHours,
      remainingMinutes,
      message
    };
  }

  /**
   * Calculate daily card recommendations based on user context
   */
  static calculateRecommendations(userState: {
    energy: EnergyState;
    activeQuests: Quest[];
    availableCards: Card[];
    currentTime: Date;
    recentActivity: string[];
  }): Card[] {
    const { energy, activeQuests, availableCards, currentTime } = userState;
    const recommendations: { card: Card; score: number }[] = [];

    for (const card of availableCards) {
      let score = 0;

      // Base score from card impact
      score += card.impact * 10;

      // Energy efficiency score
      if (card.energyCost <= energy.current) {
        score += (card.impact / card.energyCost) * 20; // Impact per energy point
      } else {
        score -= 50; // Penalize if not enough energy
      }

      // Time relevance
      const timeRelevance = this.getTimeRelevanceScore(card, currentTime);
      score += timeRelevance;

      // Quest alignment
      const questAlignment = this.getQuestAlignmentScore(card, activeQuests);
      score += questAlignment;

      // Rarity bonus
      score += this.getRarityScore(card.rarity);

      // Cooldown penalty
      if (card.isOnCooldown) {
        score -= 100;
      }

      recommendations.push({ card, score });
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(rec => rec.card);
  }

  private static getTimeRelevanceScore(card: Card, currentTime: Date): number {
    const hour = currentTime.getHours();
    
    // Morning cards (6-12)
    if (card.tags.includes('morning') && hour >= 6 && hour < 12) return 15;
    
    // Work/productivity cards (9-17)
    if (card.tags.includes('productivity') && hour >= 9 && hour < 17) return 15;
    
    // Evening/reflection cards (18-22)
    if (card.tags.includes('evening') && hour >= 18 && hour < 22) return 15;
    
    return 0;
  }

  private static getQuestAlignmentScore(card: Card, activeQuests: Quest[]): number {
    let alignmentScore = 0;
    
    for (const quest of activeQuests) {
      // Check if card tags match quest type
      if (card.tags.includes(quest.type)) {
        alignmentScore += 20;
      }
      
      // Bonus for quests that need progress
      if (quest.progress < 100) {
        alignmentScore += 10;
      }
    }
    
    return alignmentScore;
  }

  private static getRarityScore(rarity: Card['rarity']): number {
    switch (rarity) {
      case 'common': return 0;
      case 'uncommon': return 5;
      case 'rare': return 10;
      case 'epic': return 15;
      case 'legendary': return 25;
      default: return 0;
    }
  }
}