import { Quest, Card, Character, CharacterClass } from '../types';
import { classDescriptions } from '../data/personalityTest';

interface UserContext {
  character: Character;
  energy: number;
  availableTime: number; // hours
  currentMood: string;
  recentActivity: string[];
  activeQuests: Quest[];
  preferences: string[];
}

interface AICardRecommendation {
  cards: Card[];
  reasoning: string;
  energyForecast: {
    totalCost: number;
    remainingAfter: number;
    regenerationTime: number;
  };
}

/**
 * Call OpenAI API via local backend server
 */
async function callOpenAI(prompt: string, options: any = {}): Promise<string> {
  const backendURL = 'http://localhost:5000'; // Tu servidor local
  
  try {
    console.log('🔄 Calling local OpenAI backend...');
    
    const response = await fetch(`${backendURL}/api/openai`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini', // Modelo más económico
        messages: [
          { 
            role: 'system', 
            content: options.systemPrompt || 'You are a helpful AI assistant for a gamified productivity RPG called LifeQuest. Generate engaging, actionable content that helps users improve their real lives through RPG mechanics.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 500,
        userId: options.userId || 'anonymous'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      // Handle quota exceeded specifically
      if (response.status === 402 && data?.error?.code === 'quota_exceeded') {
        const error = new Error(data?.error?.message || 'Quota exceeded');
        (error as any).code = 'quota_exceeded';
        (error as any).status = 402;
        throw error;
      }
      throw new Error(data?.error?.message || `Backend error: ${response.status}`);
    }
    console.log('✅ OpenAI response received successfully');
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('❌ Backend API call failed:', error);
    
    // Verificar si el servidor está corriendo
    if (error.message.includes('fetch')) {
      console.error('💡 Tip: Make sure your backend server is running on http://localhost:5000');
      console.error('💡 Run: npm run dev in your server directory');
    }
    
    throw error;
  }
}

export class ArcaneEngine {
  /**
   * Generate a structured quest plan based on user objective
   */
  static async generateQuest(
    objective: string, 
    timeline: number, 
    availability: number,
    userPreferences: string[] = []
  ): Promise<Quest> {
    const prompt = this.buildQuestPrompt(objective, timeline, availability, userPreferences);
    
    try {
      const response = await callOpenAI(prompt, {
        systemPrompt: 'You are an expert quest designer for a gamified productivity RPG. Create engaging, realistic, and achievable quests.'
      });
      return this.parseQuestResponse(response, objective);
    } catch (error) {
      console.error('Failed to generate quest with AI:', error);
      return this.generateFallbackQuest(objective, timeline);
    }
  }

  /**
   * Generate daily cards based on character class and context
   */
  static async generateDailyCards(userContext: UserContext): Promise<AICardRecommendation> {
    const prompt = this.buildDailyCardsPrompt(userContext);
    
    try {
      const response = await callOpenAI(prompt, {
        systemPrompt: 'You are an expert card designer for the LifeQuest RPG system. Create personalized, engaging activity cards that match the user\'s character class and current context.'
      });
      const cards = this.parseCardsResponse(response);
      return this.buildRecommendation(cards, userContext);
    } catch (error) {
      console.error('Failed to generate cards with AI:', error);
      return this.generateFallbackRecommendation(userContext);
    }
  }

  /**
   * Generate class-specific card recommendations
   */
  static async generateClassSpecificCards(
    character: Character,
    situation: string = 'general'
  ): Promise<AICardRecommendation> {
    const prompt = this.buildClassSpecificPrompt(character, situation);
    
    try {
      const response = await callOpenAI(prompt, {
        systemPrompt: 'You are an expert character development specialist for the LifeQuest RPG. Create advanced cards that help users master their character class.'
      });
      const cards = this.parseCardsResponse(response);
      return this.buildRecommendation(cards, { 
        character, 
        energy: character.energy.current, 
        availableTime: 4, 
        currentMood: 'neutral', 
        recentActivity: [], 
        activeQuests: [], 
        preferences: [] 
      });
    } catch (error) {
      console.error('Failed to generate class-specific cards:', error);
      return this.generateClassFallbackRecommendation(character, situation);
    }
  }

  /**
   * Generate goal-oriented card sequence
   */
  static async generateGoalCards(
    character: Character,
    goalDescription: string,
    timeframe: number,
    userId?: string
  ): Promise<Card[]> {
    const prompt = this.buildGoalCardsPrompt(character, goalDescription, timeframe);
    
    try {
      const response = await callOpenAI(prompt, {
        systemPrompt: 'You are a goal achievement strategist for the LifeQuest RPG. Create card sequences that help users achieve their specific goals using their character class strengths.'
        , userId
      });
      return this.parseCardsResponse(response);
    } catch (error) {
      console.error('Failed to generate goal cards:', error);
      return this.generateGoalFallbackCards(character, goalDescription);
    }
  }

  /**
   * Generate contextual card suggestions
   */
  static async generateContextualCards(
    situation: string,
    goals: string[],
    constraints: string[]
  ): Promise<Card[]> {
    const prompt = this.buildContextualCardsPrompt(situation, goals, constraints);
    
    try {
      const response = await callOpenAI(prompt, {
        systemPrompt: 'You are a contextual activity advisor for the LifeQuest RPG. Create cards that are perfectly suited to the user\'s current situation and constraints.'
      });
      return this.parseCardsResponse(response);
    } catch (error) {
      console.error('Failed to generate contextual cards:', error);
      return this.generateBasicCards();
    }
  }

  /**
   * Get smart recommendations based on character and context
   */
  static async getSmartRecommendations(character: Character): Promise<AICardRecommendation> {
    const timeOfDay = new Date().getHours();
    const energyPercentage = (character.energy.current / character.energy.maximum) * 100;
    
    const userContext: UserContext = {
      character,
      energy: character.energy.current,
      availableTime: this.estimateAvailableTime(timeOfDay),
      currentMood: this.estimateMood(energyPercentage, character.dailyProgress),
      recentActivity: [],
      activeQuests: character.currentGoals || [],
      preferences: this.inferPreferences(character)
    };

    return this.generateDailyCards(userContext);
  }

  /**
   * Test OpenAI backend connection
   */
  static async testConnection(): Promise<void> {
    try {
      console.log('🧪 Testing OpenAI backend connection...');
      
      // Primero probar el health check
      const healthResponse = await fetch('http://localhost:5000/health');
      if (!healthResponse.ok) {
        throw new Error('Backend server not responding');
      }
      const healthData = await healthResponse.json();
      console.log('✅ Backend server health:', healthData.status);

      // Luego probar la funcionalidad OpenAI
      const result = await callOpenAI('Hello, respond with just "API working"');
      console.log('✅ OpenAI API test successful:', result);
    } catch (error) {
      console.error('❌ OpenAI backend test failed:', error);
      console.error('💡 Make sure to:');
      console.error('   1. Run "npm install" in your server directory');
      console.error('   2. Check your .env file has OPENAI_API_KEY');
      console.error('   3. Start the server with "npm run dev"');
    }
  }

  // Private methods
  private static buildQuestPrompt(
    objective: string, 
    timeline: number, 
    availability: number,
    preferences: string[]
  ): string {
    return `
Create a detailed quest plan for this objective: "${objective}"

Timeline: ${timeline} days
Daily availability: ${availability} hours
User preferences: ${preferences.join(', ')}

Generate a JSON response with this structure:
{
  "name": "Quest title",
  "description": "Detailed description",
  "type": "career|health|relationships|skills|creative",
  "difficulty": "easy|medium|hard|epic|legendary",
  "estimatedDuration": ${timeline},
  "milestones": [
    {
      "name": "Milestone name",
      "requiredProgress": 25,
      "rewards": [{"type": "experience", "value": 100}]
    }
  ],
  "rewards": {
    "experience": 500,
    "cards": ["card-id-1", "card-id-2"],
    "unlocks": ["feature-1"]
  }
}

Make it engaging, realistic, and achievable within the given timeline.
    `;
  }

  /**
   * Improved prompt for better structured responses with creative RPG names
   */
  private static buildDailyCardsPrompt(userContext: UserContext): string {
    const { character } = userContext;
    const classInfo = classDescriptions[character.class];
    
    return `
You are generating personalized activity cards for a ${classInfo.name} in the LifeQuest RPG system.

CHARACTER PROFILE:
- Class: ${classInfo.name} - "${classInfo.tagline}"
- Level: ${character.level}
- Primary Skills: ${classInfo.primarySkills.join(', ')}
- Current Energy: ${character.energy.current}/${character.energy.maximum}
- Available Time: ${userContext.availableTime} hours

IMPORTANT: Create creative, RPG-style names for each card. Think of these as magical abilities or epic quests that a ${character.class} would undertake.

Examples of good RPG card names:
- "Mind Palace Construction" (for focus work)
- "Social Network Weaving" (for networking)
- "Creative Storm Summoning" (for brainstorming)
- "Warrior's Dawn Ritual" (for morning exercise)
- "Sage's Meditation Circle" (for mindfulness)

Generate exactly 3 cards with UNIQUE, creative names and detailed descriptions.

REQUIRED JSON FORMAT:
{
  "recommendations": [
    {
      "name": "Epic RPG-style name (NOT 'Card 1' or 'Generated Card')",
      "description": "Detailed 2-3 sentence description of exactly what to do. Be specific and actionable.",
      "type": "action",
      "rarity": "common",
      "classTypes": ["${character.class}"],
      "energyCost": 25,
      "duration": 1.5,
      "impact": 20,
      "skillBonus": [
        {
          "skillName": "${classInfo.primarySkills[0]}",
          "xpBonus": 15
        }
      ],
      "requirements": {
        "level": ${character.level}
      },
      "tags": ["${character.class}", "productive"]
    },
    {
      "name": "Another unique RPG-style name",
      "description": "Different detailed description for a completely different activity",
      "type": "power",
      "rarity": "uncommon",
      "classTypes": ["${character.class}"],
      "energyCost": 35,
      "duration": 2,
      "impact": 30,
      "skillBonus": [
        {
          "skillName": "${classInfo.primarySkills[1] || classInfo.primarySkills[0]}",
          "xpBonus": 25
        }
      ],
      "requirements": {
        "level": ${character.level}
      },
      "tags": ["${character.class}", "growth"]
    },
    {
      "name": "Third unique RPG-style name",
      "description": "Third detailed description for yet another different activity",
      "type": "recovery",
      "rarity": "rare",
      "classTypes": ["${character.class}"],
      "energyCost": 15,
      "duration": 1,
      "impact": 40,
      "skillBonus": [
        {
          "skillName": "Wellness",
          "xpBonus": 20
        }
      ],
      "requirements": {
        "level": ${character.level}
      },
      "tags": ["${character.class}", "recovery"]
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Each "name" must be a creative, RPG-style title that sounds like a magical ability or epic quest
2. Each "description" must be 2-3 sentences explaining exactly what the user should do
3. NO generic names like "Card 1", "Generated Card", "Basic Task", etc.
4. Make names relevant to ${character.class} abilities and personality
5. Vary the energyCost (15-50), duration (0.5-3), impact (15-50), and rarity
6. Return ONLY the JSON object, no other text

Focus on creating names that would make a ${character.class} feel epic and motivated!
  `;
  }

  private static buildClassSpecificPrompt(character: Character, situation: string): string {
    const classInfo = classDescriptions[character.class];
    
    return `
Generate 4-5 advanced cards for a Level ${character.level} ${classInfo.name} in situation: "${situation}"

Same JSON format as daily cards but with higher impact and skill focus.
    `;
  }

  private static buildGoalCardsPrompt(
    character: Character,
    goalDescription: string,
    timeframe: number
  ): string {
    const classInfo = classDescriptions[character.class];
    
    return `
Create a strategic card sequence for a ${classInfo.name} to achieve: "${goalDescription}"

Timeframe: ${timeframe} days
Character Level: ${character.level}

Generate 5-7 cards that form a logical progression toward the goal.
Same JSON format as before.
    `;
  }

  private static buildContextualCardsPrompt(
    situation: string,
    goals: string[],
    constraints: string[]
  ): string {
    return `
Generate 3-4 activity cards for this specific situation:

Situation: ${situation}
Goals: ${goals.join(', ')}
Constraints: ${constraints.join(', ')}

Return JSON array of cards optimized for this context.
    `;
  }

  private static parseQuestResponse(response: string, objective: string): Quest {
    try {
      let jsonString = response.trim();
      if (jsonString.includes('```json')) {
        const startIndex = jsonString.indexOf('```json') + 7;
        const endIndex = jsonString.indexOf('```', startIndex);
        jsonString = jsonString.substring(startIndex, endIndex).trim();
      }

      const parsed = JSON.parse(jsonString);
      return {
        id: `quest-${Date.now()}`,
        name: parsed.name || objective,
        description: parsed.description || `Quest to achieve: ${objective}`,
        type: parsed.type || 'skills',
        difficulty: parsed.difficulty || 'medium',
        estimatedDuration: parsed.estimatedDuration || 30,
        progress: 0,
        status: 'active',
        milestones: parsed.milestones || [],
        rewards: parsed.rewards || { experience: 100, cards: [], unlocks: [] },
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing quest response:', error);
      return this.generateFallbackQuest(objective, 30);
    }
  }

  /**
   * Parse cards response from OpenAI with improved debugging
   */
  private static parseCardsResponse(response: string): Card[] {
    try {
      console.log('🔍 Raw OpenAI response:', response);
      
      let jsonString = response.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        const startIndex = jsonString.indexOf('```json') + 7;
        const endIndex = jsonString.indexOf('```', startIndex);
        jsonString = jsonString.substring(startIndex, endIndex).trim();
      } else if (jsonString.includes('```')) {
        const startIndex = jsonString.indexOf('```') + 3;
        const endIndex = jsonString.lastIndexOf('```');
        jsonString = jsonString.substring(startIndex, endIndex).trim();
      }

      console.log('🧹 Cleaned JSON string:', jsonString);

      // Find the first complete JSON object
      const firstCurly = jsonString.indexOf('{');
      const lastCurly = jsonString.lastIndexOf('}');
      if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
        jsonString = jsonString.substring(firstCurly, lastCurly + 1);
      }

      console.log('🎯 Final JSON to parse:', jsonString);

      const parsed = JSON.parse(jsonString);
      console.log('📊 Parsed object:', parsed);
      
      // Try different possible array locations
      let cardsArray = parsed.recommendations || parsed.cards || parsed.card_sequence || parsed.data || parsed;
      
      console.log('🎴 Cards array found:', cardsArray);
      
      if (cardsArray && typeof cardsArray === 'object' && !Array.isArray(cardsArray)) {
        cardsArray = Object.values(cardsArray);
      }
      
      if (!Array.isArray(cardsArray)) {
        console.error('❌ Expected an array in the AI response, but received:', cardsArray);
        return this.generateBasicFallbackCards();
      }

      console.log(`🎯 Processing ${cardsArray.length} cards...`);

      const processedCards = cardsArray.map((cardData: any, index: number) => {
        console.log(`🎴 Processing card ${index + 1}:`, cardData);
        
        const card = {
          id: `ai-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: cardData.name || cardData.title || `Generated Card ${index + 1}`,
          description: cardData.description || cardData.desc || cardData.details || 'AI-generated activity card.',
          type: cardData.type || 'action',
          rarity: cardData.rarity || 'common',
          classTypes: cardData.classTypes || cardData.class_types || ['strategist', 'warrior', 'creator', 'connector', 'sage'],
          energyCost: cardData.energyCost || cardData.energy_cost || cardData.cost || 20,
          duration: cardData.duration || 1,
          impact: cardData.impact || cardData.xp || cardData.experience || 10,
          cooldown: cardData.cooldown || undefined,
          skillBonus: cardData.skillBonus || cardData.skill_bonus || [],
          requirements: cardData.requirements || {},
          conditions: cardData.conditions || {},
          tags: cardData.tags || [],
          createdAt: new Date(),
          forged: true,
          usageCount: 0,
          isOnCooldown: false
        };
        
        console.log(`✅ Processed card:`, card);
        return card;
      });

      console.log(`🎉 Successfully processed ${processedCards.length} cards`);
      return processedCards;
      
    } catch (error) {
      console.error('❌ Failed to parse AI response:', error);
      console.error('📝 Raw response that failed:', response);
      return this.generateBasicFallbackCards();
    }
  }

  private static generateFallbackQuest(objective: string, timeline: number): Quest {
    return {
      id: `quest-${Date.now()}`,
      name: `Quest: ${objective}`,
      description: `Complete this important objective: ${objective}`,
      type: 'skills',
      difficulty: 'medium',
      estimatedDuration: timeline,
      progress: 0,
      status: 'active',
      milestones: [],
      rewards: { experience: 500, cards: [], unlocks: [] },
      createdAt: new Date()
    };
  }

  /**
   * Generate basic fallback cards when AI fails
   */
  private static generateBasicFallbackCards(): Card[] {
    console.log('🔄 Generating fallback cards...');
    
    return [
      {
        id: `fallback-card-${Date.now()}-1`,
        name: "Quick Focus Session",
        description: "Take 25 minutes to focus on your most important task of the day using the Pomodoro technique.",
        type: "action",
        rarity: "common",
        classTypes: ["strategist", "warrior", "creator", "connector", "sage"],
        energyCost: 20,
        duration: 0.5,
        impact: 15,
        skillBonus: [{ skillName: "Focus", xpBonus: 10 }],
        requirements: {},
        conditions: {},
        tags: ["productivity", "focus"],
        createdAt: new Date(),
        forged: false,
        usageCount: 0,
        isOnCooldown: false
      },
      {
        id: `fallback-card-${Date.now()}-2`,
        name: "Skill Building Hour",
        description: "Dedicate one hour to learning something new in your field of interest.",
        type: "power",
        rarity: "uncommon",
        classTypes: ["strategist", "warrior", "creator", "connector", "sage"],
        energyCost: 30,
        duration: 1,
        impact: 25,
        skillBonus: [{ skillName: "Learning", xpBonus: 20 }],
        requirements: {},
        conditions: {},
        tags: ["learning", "growth"],
        createdAt: new Date(),
        forged: false,
        usageCount: 0,
        isOnCooldown: false
      }
    ];
  }

  private static buildRecommendation(cards: Card[], userContext: UserContext): AICardRecommendation {
    const totalCost = cards.reduce((sum, card) => sum + card.energyCost, 0);
    const remainingAfter = userContext.character.energy.current - totalCost;
    const regenerationTime = Math.max(0, -remainingAfter / userContext.character.energy.regenerationRate);
    
    return {
      cards,
      reasoning: `Optimized for ${userContext.character.class} with ${userContext.availableTime}h available`,
      energyForecast: {
        totalCost,
        remainingAfter,
        regenerationTime
      }
    };
  }

  private static generateFallbackRecommendation(userContext: UserContext): AICardRecommendation {
    return this.buildRecommendation([], userContext);
  }

  private static generateClassFallbackRecommendation(character: Character, situation: string): AICardRecommendation {
    const userContext = {
      character,
      energy: character.energy.current,
      availableTime: 4,
      currentMood: 'neutral',
      recentActivity: [],
      activeQuests: [],
      preferences: []
    };
    return {
      cards: [],
      reasoning: `Fallback ${character.class} cards for ${situation}`,
      energyForecast: {
        totalCost: 0,
        remainingAfter: character.energy.current,
        regenerationTime: 0
      }
    };
  }

  private static generateGoalFallbackCards(character: Character, goalDescription: string): Card[] {
    return [];
  }

  private static generateBasicCards(): Card[] {
    return [];
  }

  private static estimateAvailableTime(hour: number): number {
    if (hour >= 6 && hour < 9) return 2;
    if (hour >= 9 && hour < 12) return 3;
    if (hour >= 12 && hour < 14) return 1;
    if (hour >= 14 && hour < 18) return 4;
    if (hour >= 18 && hour < 21) return 3;
    return 1;
  }

  private static estimateMood(energyPercentage: number, dailyProgress: any): string {
    if (energyPercentage > 75 && dailyProgress?.cardsCompleted > 2) return 'excellent';
    if (energyPercentage > 50 && dailyProgress?.cardsCompleted > 0) return 'good';
    if (energyPercentage > 25) return 'neutral';
    return 'low-energy';
  }

  private static inferPreferences(character: Character): string[] {
    const classPrefs = {
      strategist: ['data-driven', 'analytical', 'optimization'],
      warrior: ['discipline', 'consistency', 'challenges'],
      creator: ['creative', 'innovative', 'experimental'],
      connector: ['social', 'collaborative', 'networking'],
      sage: ['mindful', 'balanced', 'reflective']
    };
    
    return classPrefs[character.class] || [];
  }
}