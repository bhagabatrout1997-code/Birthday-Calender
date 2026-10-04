export type Relationship =
  | 'Family'
  | 'Friend'
  | 'Partner'
  | 'Parent'
  | 'Sibling'
  | 'Child'
  | 'Colleague'
  | 'Mentor'
  | 'Other';

export type GiftStatus = 'idea' | 'planned' | 'purchased' | 'wrapped' | 'given';

export interface SavedGiftIdea {
  id: string;
  title: string;
  category: string;
  estimatedPrice: string;
  priceNumeric?: number;
  status: GiftStatus;
  url?: string;
  note?: string;
  whereToFind?: string;
  searchQuery?: string;
  addedAt: string;
}

export interface PastGift {
  id: string;
  year: number;
  item: string;
  cost?: number;
  reactionOrNote?: string;
}

export interface Birthday {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD or MM-DD (if year unknown: 0000-MM-DD or format with flag)
  birthYearKnown: boolean;
  relationship: Relationship;
  avatarColor: string;
  avatarEmoji?: string;
  interests: string[];
  notes?: string;
  favoriteCakeOrDrink?: string;
  clothingSize?: string;
  budgetGoal?: number;
  remindDaysBefore: number[]; // e.g. [0, 1, 3, 7]
  savedGifts: SavedGiftIdea[];
  pastGifts: PastGift[];
  createdAt: string;
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dates: string;
}

export interface BirthdayStats {
  nextBirthdayDate: Date;
  daysUntil: number; // 0 = today
  isToday: boolean;
  isTomorrow: boolean;
  isThisWeek: boolean;
  isMilestone: boolean;
  currentAge?: number;
  ageTurning?: number;
  zodiac: ZodiacSign;
  dayOfWeek: string;
  formattedNextDate: string;
  monthName: string;
  monthIndex: number; // 0-11
  dayOfMonth: number;
  birthstone: string;
}

export interface InAppNotification {
  id: string;
  birthdayId: string;
  personName: string;
  daysUntil: number;
  ageTurning?: number;
  dateStr: string;
  read: boolean;
  createdAt: string;
}

export interface UserSettings {
  defaultReminderDays: number[];
  enableBrowserNotifications: boolean;
  soundAlerts: boolean;
  currency: string;
  themePreference: 'warm' | 'clean';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarEmoji?: string;
  avatarColor?: string;
  joinedDate: string;
}

export interface ActivityLogItem {
  id: string;
  type: 'birthday_added' | 'gift_saved' | 'gift_status' | 'wish_generated' | 'birthday_edited';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

