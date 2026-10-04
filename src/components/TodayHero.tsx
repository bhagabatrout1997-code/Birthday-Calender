import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Send, Calendar, Clock, Award, Heart } from 'lucide-react';
import { Birthday } from '../types';
import { calculateBirthdayStats, getGoogleCalendarUrl } from '../utils/dateUtils';
import { playChime } from '../utils/notifications';

interface TodayHeroProps {
  birthdays: Birthday[];
  onOpenGiftModal: (birthday: Birthday) => void;
  onOpenGreetingModal: (birthday: Birthday) => void;
}

export const TodayHero: React.FC<TodayHeroProps> = ({
  birthdays,
  onOpenGiftModal,
  onOpenGreetingModal,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Find anyone with birthday today
  const todayBirthdays = birthdays.filter(b => calculateBirthdayStats(b).isToday);

  // Otherwise, find the next closest birthday
  const sorted = [...birthdays].sort((a, b) => {
    return calculateBirthdayStats(a).daysUntil - calculateBirthdayStats(b).daysUntil;
  });
  const nextBirthday = sorted[0];
  const nextStats = nextBirthday ? calculateBirthdayStats(nextBirthday) : null;

  // Countdown clock to midnight of next birthday
  useEffect(() => {
    if (!nextStats) return;

    function updateCounter() {
      const now = new Date();
      const target = nextStats!.nextBirthdayDate;
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    }

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [nextBirthday]);

  const triggerConfetti = () => {
    playChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
    });
  };

  if (todayBirthdays.length > 0) {
    const person = todayBirthdays[0];
    const stats = calculateBirthdayStats(person);

    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-rose-500 to-amber-600 text-white p-6 sm:p-8 shadow-xl mb-8">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Birthday Today!
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-inner">
                {person.avatarEmoji || '🎂'}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {person.name}
                </h2>
                <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                  <span>{person.relationship}</span>
                  {stats.ageTurning && (
                    <>
                      <span>·</span>
                      <span className="font-semibold">Turning {stats.ageTurning} today!</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{stats.zodiac.symbol} {stats.zodiac.name}</span>
                </div>
              </div>
            </div>

            {person.notes && (
              <p className="text-white/80 text-sm max-w-xl italic">
                "{person.notes}"
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={triggerConfetti}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-stone-950 hover:bg-amber-100 font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              Celebrate!
            </button>
            <button
              onClick={() => onOpenGreetingModal(person)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send Wishes
            </button>
            <button
              onClick={() => onOpenGiftModal(person)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              Gift Planner
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Next upcoming birthday spotlight
  if (!nextBirthday || !nextStats) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 p-6 sm:p-7 shadow-lg mb-8">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Next Upcoming Birthday
            </span>
            {nextStats.isMilestone && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 bg-rose-500/15 px-2.5 py-1 rounded-md border border-rose-500/20">
                <Award className="w-3.5 h-3.5" /> Milestone {nextStats.ageTurning}th!
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${nextBirthday.avatarColor || 'bg-amber-600'} text-white flex items-center justify-center text-2xl font-bold shadow-md`}>
              {nextBirthday.avatarEmoji || nextBirthday.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-50">
                {nextBirthday.name}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-400 mt-0.5">
                <span>{nextBirthday.relationship}</span>
                <span>·</span>
                <span className="text-stone-300">{nextStats.dayOfWeek}, {nextStats.formattedNextDate}</span>
                {nextStats.ageTurning && (
                  <>
                    <span>·</span>
                    <span className="text-amber-400 font-medium">Turning {nextStats.ageTurning}</span>
                  </>
                )}
                <span>·</span>
                <span>{nextStats.zodiac.symbol} {nextStats.zodiac.name}</span>
              </div>
            </div>
          </div>

          {nextBirthday.interests && nextBirthday.interests.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="text-stone-500">Interests:</span>
              <span className="text-stone-300">{nextBirthday.interests.slice(0, 4).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Countdown & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t lg:border-t-0 lg:border-l border-stone-800 pt-4 lg:pt-0 lg:pl-6">
          {/* Days / Hours Countdown Card */}
          <div className="flex items-center gap-3">
            <div className="text-center px-3 py-2 bg-stone-800/80 rounded-xl border border-stone-700/60 min-w-16">
              <span className="block text-2xl sm:text-3xl font-display font-bold text-amber-400 tabular-nums">
                {nextStats.daysUntil}
              </span>
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                {nextStats.daysUntil === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <div className="text-center px-3 py-2 bg-stone-800/80 rounded-xl border border-stone-700/60 min-w-16">
              <span className="block text-2xl sm:text-3xl font-display font-bold text-stone-200 tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Hours
              </span>
            </div>
            <div className="text-center px-3 py-2 bg-stone-800/80 rounded-xl border border-stone-700/60 min-w-16">
              <span className="block text-2xl sm:text-3xl font-display font-bold text-stone-300 tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Mins
              </span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenGiftModal(nextBirthday)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              Gift Ideas
            </button>
            <button
              onClick={() => onOpenGreetingModal(nextBirthday)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs sm:text-sm rounded-xl border border-stone-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Wishes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
