export type GameSectionId = 'base' | 'rift_in_time' | 'storybook_vale' | string;

export interface GameSection {
  id: GameSectionId;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  badgeBg: string;
  isCustom?: boolean;
}

export type StandardRole =
  | 'gardening'
  | 'fishing'
  | 'mining'
  | 'foraging'
  | 'digging'
  | 'timebending'
  | 'snippet_catching'
  | 'none';

export interface CharacterRoleInfo {
  id: StandardRole | string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

export type QuestStatus = 'none' | 'available' | 'in_progress' | 'completed';

export interface Character {
  id: string;
  name: string;
  universe: string;
  sectionId: GameSectionId;
  role: StandardRole | string;
  friendshipLevel: number; // 1 to 10
  status: 'locked' | 'unlocked' | 'maxed';
  dailyTalked: boolean;
  dailyGiftsGiven: number; // 0 to 3
  favoriteGifts: string[];
  questStatus: QuestStatus;
  questNote: string;
  houseLocation: string;
  notes: string;
  isCustom?: boolean;
  avatarEmoji?: string;
  avatarImage?: string;
  updatedAt?: number;
}

export interface FilterOptions {
  searchQuery: string;
  sectionId: string; // 'all' or sectionId
  role: string; // 'all' or roleId
  status: string; // 'all' | 'locked' | 'unlocked' | 'maxed'
  sortBy: 'name' | 'level-desc' | 'level-asc' | 'universe' | 'role';
}
