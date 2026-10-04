export function generateCuratedGreetings(params: {
  name: string;
  relationship?: string;
  ageTurning?: number;
  tone?: string;
  customNote?: string;
}): string[] {
  const { name, ageTurning, tone = 'heartfelt', customNote } = params;
  const ageStr = ageTurning ? ` turning ${ageTurning}` : '';
  const noteSuffix = customNote ? ` Here's to ${customNote.toLowerCase()}!` : '';

  if (tone === 'funny') {
    return [
      `Happy Birthday, ${name}! You're not getting older, you're just leveling up and becoming a classic.${ageStr ? ` Cheers to ${ageTurning}!` : ''}`,
      `Another year older, wiser, and still looking fabulous! Remember: age is merely the number of years the world has enjoyed you. 🎂`,
      `Happy Birthday, ${name}! I'm just here for the cake and to remind you that I will always be younger at heart.${noteSuffix}`,
      `Cheers to you, ${name}! Don't worry about getting older — you still have that youthful spark (and great taste in friends)! 🎉`,
    ];
  }

  if (tone === 'short') {
    return [
      `Happy Birthday, ${name}! Wishing you the absolute best year ahead! 🎂🎉`,
      `Cheers to you on your special day, ${name}! Hope it's full of good vibes and celebration! ✨`,
      `Warmest birthday wishes, ${name}! May this year bring happiness, success, and lots of joy!`,
      `Happy Birthday, ${name}! Have the sweetest celebration today! 🎈🍰`,
    ];
  }

  if (tone === 'milestone') {
    return [
      `Happy Milestone Birthday, ${name}! Reaching ${ageTurning || 'this chapter'} is a tremendous milestone to celebrate. May this next decade bring unforgettable adventures and proud achievements! 🌟`,
      `To the extraordinary ${name} on your ${ageTurning ? `${ageTurning}th` : ''} birthday — wishing you a milestone celebration as unforgettable as the impact you have on all of us.`,
      `A huge milestone for a truly wonderful human! Happy ${ageTurning ? `${ageTurning}th ` : ''}Birthday, ${name}! May your day be filled with celebration, deep appreciation, and big dreams.`,
      `Cheers to celebrating your milestone, ${name}! May your wisdom continue to grow and your joy multiply in the years ahead! 🥂`,
    ];
  }

  // Default Heartfelt
  return [
    `Happy Birthday, ${name}! Wishing you a year filled with good health, deep laughter, and all your favorite things.${ageStr ? ` Happy ${ageTurning}th!` : ''}${noteSuffix}`,
    `To the wonderful ${name} — thank you for bringing so much warmth, kindness, and positivity into my life. Here's to celebrating you today and all the adventures to come!`,
    `Cheers to another trip around the sun, ${name}! May your day be as remarkable, generous, and bright as you are. Have the sweetest celebration! 🎂🎉`,
    `Sending the warmest birthday love your way, ${name}! Hope your day is spent surrounded by people you love and treats you didn't have to share.`,
  ];
}
