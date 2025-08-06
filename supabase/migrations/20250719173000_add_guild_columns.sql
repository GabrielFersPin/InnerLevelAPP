/*
  # Add Guild System Columns to user_data table

  This migration adds the guild-related columns that are needed for the GuildSettings functionality:
  - character (jsonb) - Character data
  - cards (jsonb) - Card inventory and data
  - quests (jsonb) - Quest data
  - energy (jsonb) - Energy system data
  - recommendations (jsonb) - AI recommendations
  - guild (jsonb) - Guild system data (friends, privacy, notifications)
  - is_onboarded (boolean) - Onboarding status
*/

-- Add missing columns to user_data table
ALTER TABLE user_data 
ADD COLUMN IF NOT EXISTS character jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cards jsonb DEFAULT '{"inventory": [], "activeCards": [], "cooldowns": {}}'::jsonb,
ADD COLUMN IF NOT EXISTS quests jsonb DEFAULT '{"active": [], "completed": []}'::jsonb,
ADD COLUMN IF NOT EXISTS energy jsonb DEFAULT '{"current": 100, "maximum": 100, "regenerationRate": 4.17, "lastUpdate": null, "dailyUsage": []}'::jsonb,
ADD COLUMN IF NOT EXISTS recommendations jsonb DEFAULT '{"daily": [], "lastGenerated": null}'::jsonb,
ADD COLUMN IF NOT EXISTS guild jsonb DEFAULT '{"currentGuild": null, "friends": [], "friendRequests": [], "privacy": {"profileVisibility": "friends", "showStreak": true, "showLevel": true, "showGoals": "friends", "showAchievements": true, "allowFriendRequests": true, "allowGuildInvites": true}, "notifications": {"friendRequests": true, "guildInvites": true, "goalReminders": true, "achievementUnlocks": true, "weeklyReport": true, "friendActivity": false}}'::jsonb,
ADD COLUMN IF NOT EXISTS is_onboarded boolean DEFAULT false;

-- Update existing rows to have default values for new columns
UPDATE user_data 
SET 
  character = COALESCE(character, '{}'::jsonb),
  cards = COALESCE(cards, '{"inventory": [], "activeCards": [], "cooldowns": {}}'::jsonb),
  quests = COALESCE(quests, '{"active": [], "completed": []}'::jsonb),
  energy = COALESCE(energy, '{"current": 100, "maximum": 100, "regenerationRate": 4.17, "lastUpdate": null, "dailyUsage": []}'::jsonb),
  recommendations = COALESCE(recommendations, '{"daily": [], "lastGenerated": null}'::jsonb),
  guild = COALESCE(guild, '{"currentGuild": null, "friends": [], "friendRequests": [], "privacy": {"profileVisibility": "friends", "showStreak": true, "showLevel": true, "showGoals": "friends", "showAchievements": true, "allowFriendRequests": true, "allowGuildInvites": true}, "notifications": {"friendRequests": true, "guildInvites": true, "goalReminders": true, "achievementUnlocks": true, "weeklyReport": true, "friendActivity": false}}'::jsonb),
  is_onboarded = COALESCE(is_onboarded, false)
WHERE character IS NULL 
   OR cards IS NULL 
   OR quests IS NULL 
   OR energy IS NULL 
   OR recommendations IS NULL 
   OR guild IS NULL 
   OR is_onboarded IS NULL; 