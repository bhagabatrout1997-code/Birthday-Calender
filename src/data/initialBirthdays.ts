import { Birthday } from '../types';

// Helper to generate a date string that falls X days from today, with a specified birth year
function getDateOffset(daysFromNow: number, birthYear: number): { dateStr: string; yearKnown: boolean } {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return {
    dateStr: `${birthYear}-${mm}-${dd}`,
    yearKnown: true,
  };
}

export function getInitialBirthdays(): Birthday[] {
  const currentYear = new Date().getFullYear();

  // Create sample entries calibrated relative to current date
  const partnerDate = getDateOffset(2, currentYear - 29); // In 2 days, turning 29
  const bestFriendDate = getDateOffset(6, currentYear - 30); // In 6 days, milestone 30th!
  const momDate = getDateOffset(18, currentYear - 58); // In 18 days
  const sisterDate = getDateOffset(35, currentYear - 26); // Next month
  const colleagueDate = getDateOffset(48, currentYear - 34); // Next month

  return [
    {
      id: 'b-partner-1',
      name: 'Maya Lin',
      birthDate: partnerDate.dateStr,
      birthYearKnown: true,
      relationship: 'Partner',
      avatarColor: 'bg-rose-500',
      avatarEmoji: '✨',
      interests: ['Ceramics', 'Pour-over Coffee', 'Hiking', 'Architecture', 'Indie Vinyl'],
      notes: 'Loves earthy ceramic mugs and minimalist decor. Planning a weekend cabin getaway!',
      favoriteCakeOrDrink: 'Earl Grey Lavender Sponge / Oat Flat White',
      clothingSize: 'M / Shoes 8',
      budgetGoal: 150,
      remindDaysBefore: [0, 1, 3, 7, 14],
      savedGifts: [
        {
          id: 'gift-1',
          title: 'Handmade Wheel-Thrown Ceramic Pour-Over Dripper',
          category: 'Artisan Culinary',
          estimatedPrice: '$48',
          priceNumeric: 48,
          status: 'purchased',
          note: 'Ordered from local potter studio; wrapped in craft paper.',
          whereToFind: 'Local pottery studio',
          searchQuery: 'handmade wheel thrown ceramic pour over dripper',
          addedAt: new Date().toISOString(),
        },
        {
          id: 'gift-2',
          title: 'Weekend Cabin Stay in Forest',
          category: 'Experience',
          estimatedPrice: '$180',
          priceNumeric: 180,
          status: 'planned',
          note: 'Booked the treehouse cabin for next Saturday.',
          whereToFind: 'Getaway.house',
          searchQuery: 'cozy woodland cabin rental weekend',
          addedAt: new Date().toISOString(),
        },
      ],
      pastGifts: [
        {
          id: 'past-1',
          year: currentYear - 1,
          item: 'Audio-Technica LP60X Turntable + Japanese Jazz Vinyl',
          cost: 160,
          reactionOrNote: 'She loved it, plays it every Sunday morning!',
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b-friend-2',
      name: 'Marcus Vance',
      birthDate: bestFriendDate.dateStr,
      birthYearKnown: true,
      relationship: 'Friend',
      avatarColor: 'bg-amber-500',
      avatarEmoji: '⚡',
      interests: ['Sourdough Baking', 'Cycling', 'Specialty Coffee', 'Mechanical Keyboards'],
      notes: 'Turning the big 3-0! Group dinner organized at Osteria.',
      favoriteCakeOrDrink: 'Dark Chocolate Salted Caramel / Cold Brew',
      clothingSize: 'L',
      budgetGoal: 60,
      remindDaysBefore: [0, 1, 3, 7],
      savedGifts: [
        {
          id: 'gift-3',
          title: 'Challenger Bread Pan Cast Iron Sourdough Cloche',
          category: 'Culinary Passion',
          estimatedPrice: '$65',
          priceNumeric: 65,
          status: 'idea',
          note: 'Would elevate his weekend boules significantly.',
          whereToFind: 'Baking boutique',
          searchQuery: 'heavy cast iron bread baking cloche',
          addedAt: new Date().toISOString(),
        },
      ],
      pastGifts: [
        {
          id: 'past-2',
          year: currentYear - 1,
          item: 'Specialty Gesha Coffee Beans & Timemore Hand Grinder',
          cost: 55,
          reactionOrNote: 'Used it every single camping trip.',
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b-mom-3',
      name: 'Eleanor (Mom)',
      birthDate: momDate.dateStr,
      birthYearKnown: true,
      relationship: 'Parent',
      avatarColor: 'bg-emerald-600',
      avatarEmoji: '🌿',
      interests: ['Gardening', 'Historical Fiction', 'Watercolor Painting', 'Herbal Teas'],
      notes: 'Remind brother to chip in for framed family portrait. She loves pastel flowers.',
      favoriteCakeOrDrink: 'Lemon Poppyseed Drizzle Cake / Chamomile with Honey',
      budgetGoal: 100,
      remindDaysBefore: [0, 1, 3, 7, 14],
      savedGifts: [
        {
          id: 'gift-4',
          title: 'Solid Brass Haws Heritage Watering Can & Botanical Seeds',
          category: 'Garden Keepsake',
          estimatedPrice: '$75',
          priceNumeric: 75,
          status: 'planned',
          whereToFind: 'Haws England / Botanical Garden shop',
          searchQuery: 'Haws indoor brass watering can heirloom',
          addedAt: new Date().toISOString(),
        },
      ],
      pastGifts: [
        {
          id: 'past-3',
          year: currentYear - 1,
          item: 'Winsor & Newton Artist Watercolor Travel Palette',
          cost: 65,
          reactionOrNote: 'Painted her garden blossoms with it all summer.',
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b-sister-4',
      name: 'Chloe Rivera',
      birthDate: sisterDate.dateStr,
      birthYearKnown: true,
      relationship: 'Sibling',
      avatarColor: 'bg-indigo-500',
      avatarEmoji: '🎨',
      interests: ['Film Photography', 'Thrifting', 'Yoga', 'Matcha'],
      notes: 'Moving into her new studio apartment soon, housewarming items welcome.',
      favoriteCakeOrDrink: 'Matcha Mille Crêpe Cake / Iced Oat Matcha Latte',
      clothingSize: 'S',
      budgetGoal: 50,
      remindDaysBefore: [0, 1, 3],
      savedGifts: [
        {
          id: 'gift-5',
          title: 'Ippodo Ummon Matcha & Handcrafted Chasen Bamboo Whisk',
          category: 'Tea Ritual',
          estimatedPrice: '$42',
          priceNumeric: 42,
          status: 'idea',
          whereToFind: 'Ippodo Tea Co',
          searchQuery: 'ceremonial grade matcha and bamboo whisk set',
          addedAt: new Date().toISOString(),
        },
      ],
      pastGifts: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b-colleague-5',
      name: 'Liam Chen',
      birthDate: colleagueDate.dateStr,
      birthYearKnown: true,
      relationship: 'Colleague',
      avatarColor: 'bg-teal-600',
      avatarEmoji: '🚀',
      interests: ['Board Games', 'Productivity', 'Espresso', 'Sci-Fi'],
      notes: 'Desk buddy at work. Organize office card and treat.',
      favoriteCakeOrDrink: 'Carrot Cake / Espresso Macchiato',
      budgetGoal: 25,
      remindDaysBefore: [0, 1],
      savedGifts: [
        {
          id: 'gift-6',
          title: 'Wingspan Board Game or Cascadia Strategy Game',
          category: 'Games & Fun',
          estimatedPrice: '$35',
          priceNumeric: 35,
          status: 'idea',
          whereToFind: 'Local Board Game shop',
          searchQuery: 'Cascadia nature strategy board game',
          addedAt: new Date().toISOString(),
        },
      ],
      pastGifts: [],
      createdAt: new Date().toISOString(),
    },
  ];
}
