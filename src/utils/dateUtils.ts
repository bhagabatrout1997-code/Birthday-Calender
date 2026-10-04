import { Birthday, BirthdayStats, ZodiacSign } from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Capricorn', symbol: '♑', element: 'Earth', dates: 'Dec 22 – Jan 19' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', dates: 'Jan 20 – Feb 18' },
  { name: 'Pisces', symbol: '♓', element: 'Water', dates: 'Feb 19 – Mar 20' },
  { name: 'Aries', symbol: '♈', element: 'Fire', dates: 'Mar 21 – Apr 19' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', dates: 'Apr 20 – May 20' },
  { name: 'Gemini', symbol: '♊', element: 'Air', dates: 'May 21 – Jun 20' },
  { name: 'Cancer', symbol: '♋', element: 'Water', dates: 'Jun 21 – Jul 22' },
  { name: 'Leo', symbol: '♌', element: 'Fire', dates: 'Jul 23 – Aug 22' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', dates: 'Aug 23 – Sep 22' },
  { name: 'Libra', symbol: '♎', element: 'Air', dates: 'Sep 23 – Oct 22' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', dates: 'Oct 23 – Nov 21' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', dates: 'Nov 22 – Dec 21' },
];

export const BIRTHSTONES: Record<number, string> = {
  1: 'Garnet',
  2: 'Amethyst',
  3: 'Aquamarine',
  4: 'Diamond',
  5: 'Emerald',
  6: 'Pearl / Alexandrite',
  7: 'Ruby',
  8: 'Peridot',
  9: 'Sapphire',
  10: 'Opal / Tourmaline',
  11: 'Topaz / Citrine',
  12: 'Tanzanite / Turquoise',
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getZodiacSign(month: number, day: number): ZodiacSign {
  // month: 1 - 12
  if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return ZODIAC_SIGNS[0]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[1]; // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_SIGNS[2]; // Pisces
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[3]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[4]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[5]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[6]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[7]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[8]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[9]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[10]; // Scorpio
  return ZODIAC_SIGNS[11]; // Sagittarius
}

export function parseBirthDate(dateStr: string): { year?: number; month: number; day: number } {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const yearNum = parseInt(parts[0], 10);
    const monthNum = parseInt(parts[1], 10);
    const dayNum = parseInt(parts[2], 10);
    return {
      year: yearNum > 1000 ? yearNum : undefined,
      month: monthNum,
      day: dayNum,
    };
  } else if (parts.length === 2) {
    return {
      month: parseInt(parts[0], 10),
      day: parseInt(parts[1], 10),
    };
  }
  return { month: 1, day: 1 };
}

export function calculateBirthdayStats(birthday: Birthday, referenceDate: Date = new Date()): BirthdayStats {
  const { month, day, year } = parseBirthDate(birthday.birthDate);

  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const currentYear = today.getFullYear();

  // Try birthday in current year
  let nextDate = new Date(currentYear, month - 1, day);

  // If today is past the birthday in current year, it happens next year
  if (nextDate.getTime() < today.getTime()) {
    nextDate = new Date(currentYear + 1, month - 1, day);
  }

  // Calculate days difference
  const diffTime = nextDate.getTime() - today.getTime();
  const daysUntil = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;
  const isThisWeek = daysUntil <= 7;

  let ageTurning: number | undefined;
  let currentAge: number | undefined;

  if (birthday.birthYearKnown && year) {
    ageTurning = nextDate.getFullYear() - year;
    currentAge = isToday ? ageTurning : ageTurning - 1;
  }

  // Milestone birthdays: 1, 10, 13, 16, 18, 21, 25, 30, 40, 50, 60, 65, 70, 75, 80, 85, 90, 95, 100
  const milestoneYears = [1, 10, 13, 16, 18, 21, 25, 30, 40, 50, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  const isMilestone = ageTurning !== undefined && milestoneYears.includes(ageTurning);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[nextDate.getDay()];

  const formattedNextDate = `${MONTH_NAMES[month - 1].slice(0, 3)} ${day}`;
  const zodiac = getZodiacSign(month, day);
  const birthstone = BIRTHSTONES[month] || 'Diamond';

  return {
    nextBirthdayDate: nextDate,
    daysUntil,
    isToday,
    isTomorrow,
    isThisWeek,
    isMilestone,
    currentAge,
    ageTurning,
    zodiac,
    dayOfWeek,
    formattedNextDate,
    monthName: MONTH_NAMES[month - 1],
    monthIndex: month - 1,
    dayOfMonth: day,
    birthstone,
  };
}

// Generate an ICS (iCalendar) file string for export to Google/Apple/Outlook calendars
export function generateICSContent(birthdays: Birthday[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Celebrately//Birthday Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Birthdays (Celebrately)',
  ];

  birthdays.forEach((b) => {
    const { month, day, year } = parseBirthDate(b.birthDate);
    const eventYear = year || now.getFullYear();
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');

    // All day recurring event
    const startStr = `${eventYear}${mm}${dd}`;

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:birthday-${b.id}@celebrately.app`);
    icsLines.push(`DTSTAMP:${timestamp}`);
    icsLines.push(`DTSTART;VALUE=DATE:${startStr}`);
    icsLines.push(`RRULE:FREQ=YEARLY`);
    icsLines.push(`SUMMARY:🎂 ${b.name}'s Birthday`);
    icsLines.push(`DESCRIPTION:Birthday reminder for ${b.name} (${b.relationship}). Notes: ${b.notes || 'None'}`);
    icsLines.push('STATUS:CONFIRMED');
    icsLines.push('TRANSP:TRANSPARENT');
    // Alarm 1 day before at 9am
    icsLines.push('BEGIN:VALARM');
    icsLines.push('TRIGGER:-P1D');
    icsLines.push('ACTION:DISPLAY');
    icsLines.push(`DESCRIPTION:${b.name}'s birthday is tomorrow!`);
    icsLines.push('END:VALARM');
    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

export function downloadICSFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Google Calendar URL generator for a single birthday
export function getGoogleCalendarUrl(birthday: Birthday): string {
  const { month, day } = parseBirthDate(birthday.birthDate);
  const nextYear = new Date().getFullYear();
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const dateStr = `${nextYear}${mm}${dd}`;

  const title = encodeURIComponent(`🎂 ${birthday.name}'s Birthday`);
  const details = encodeURIComponent(
    `Birthday for ${birthday.name} (${birthday.relationship}).\nInterests: ${birthday.interests.join(', ') || 'N/A'}\nGift ideas tracked on Celebrately.`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}&recur=RRULE:FREQ=YEARLY`;
}
