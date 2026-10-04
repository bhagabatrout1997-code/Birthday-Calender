import React from 'react';
import {
  Cake,
  Gift,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Send,
  Download,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';
import { Birthday, UserProfile, ActivityLogItem } from '../types';
import { calculateBirthdayStats, parseBirthDate, MONTH_NAMES, getZodiacSign } from '../utils/dateUtils';

interface DashboardViewProps {
  user: UserProfile;
  birthdays: Birthday[];
  activityLogs: ActivityLogItem[];
  onOpenAddModal: () => void;
  onOpenGiftModal: (birthday: Birthday) => void;
  onOpenGreetingModal: (birthday: Birthday) => void;
  onNavigateToView: (view: 'timeline' | 'calendar' | 'gifts') => void;
  onExportICS: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  birthdays,
  activityLogs,
  onOpenAddModal,
  onOpenGiftModal,
  onOpenGreetingModal,
  onNavigateToView,
  onExportICS,
}) => {
  const today = new Date();

  // Metrics computation
  const statsList = birthdays.map(b => ({
    birthday: b,
    stats: calculateBirthdayStats(b, today),
  }));

  // Sort by urgency
  statsList.sort((a, b) => a.stats.daysUntil - b.stats.daysUntil);

  const thisWeekList = statsList.filter(item => item.stats.daysUntil <= 7);
  const thisMonthList = statsList.filter(item => item.stats.daysUntil <= 30);
  const nextUp = statsList[0];

  // Gift tracking metrics
  let totalSavedGifts = 0;
  let readyGiftsCount = 0;
  let pendingGiftsCount = 0;
  let totalPlannedBudget = 0;
  let totalSpent = 0;

  birthdays.forEach(b => {
    if (b.budgetGoal) totalPlannedBudget += b.budgetGoal;
    (b.savedGifts || []).forEach(g => {
      totalSavedGifts++;
      if (g.status === 'purchased' || g.status === 'wrapped') {
        readyGiftsCount++;
        const m = g.estimatedPrice?.match(/\d+/);
        if (m) totalSpent += parseInt(m[0], 10);
      } else {
        pendingGiftsCount++;
      }
    });
  });

  // Monthly distribution counts (Jan - Dec)
  const monthlyCounts = Array(12).fill(0);
  birthdays.forEach(b => {
    const { month } = parseBirthDate(b.birthDate);
    if (month >= 1 && month <= 12) monthlyCounts[month - 1]++;
  });
  const maxMonthlyCount = Math.max(...monthlyCounts, 1);

  // Relationship circle counts
  const circleCounts: Record<string, number> = {};
  birthdays.forEach(b => {
    circleCounts[b.relationship] = (circleCounts[b.relationship] || 0) + 1;
  });

  // Current active zodiac sign
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentZodiac = getZodiacSign(currentMonth, currentDay);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 p-6 sm:p-8 border border-stone-800 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebration Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              {thisWeekList.length > 0 ? (
                <>
                  You have <strong className="text-amber-400 font-semibold">{thisWeekList.length} birthdays</strong> approaching this week!{' '}
                  {nextUp && (
                    <span>
                      {nextUp.birthday.name}'s celebration is in{' '}
                      <strong className="text-white">
                        {nextUp.stats.daysUntil === 0 ? 'today!' : `${nextUp.stats.daysUntil} days.`}
                      </strong>
                    </span>
                  )}
                </>
              ) : (
                'All your upcoming celebrations, reminders, and gift plans are up to date.'
              )}
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Birthday</span>
            </button>
            <button
              onClick={() => onNavigateToView('gifts')}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs sm:text-sm rounded-xl border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Gift Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateToView('timeline')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Upcoming This Week
            </span>
            <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-stone-900 tabular-nums">
              {thisWeekList.length}
            </span>
            <span className="text-xs text-amber-600 font-medium">
              {thisWeekList.length === 1 ? 'celebration' : 'celebrations'}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {thisMonthList.length} within the next 30 days
          </span>
        </div>

        <div
          onClick={() => onNavigateToView('timeline')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Tracked Loved Ones
            </span>
            <Users className="w-4 h-4 text-stone-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-stone-900 tabular-nums">
              {birthdays.length}
            </span>
            <span className="text-xs text-stone-500">contacts</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Across {Object.keys(circleCounts).length} circles
          </span>
        </div>

        <div
          onClick={() => onNavigateToView('gifts')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Gifts Ready / Wrapped
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-emerald-600 tabular-nums">
              {readyGiftsCount}
            </span>
            <span className="text-xs text-stone-500">of {totalSavedGifts} saved</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {pendingGiftsCount} gifts still to purchase
          </span>
        </div>

        <div
          onClick={() => onNavigateToView('gifts')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Gift Budget Progress
            </span>
            <TrendingUp className="w-4 h-4 text-stone-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-stone-900 tabular-nums">
              ${totalSpent}
            </span>
            <span className="text-xs text-stone-500">spent</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            ${totalPlannedBudget} total annual goal
          </span>
        </div>
      </div>

      {/* Main 2-Column Section: Immediate Priorities vs Spotlight & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Urgent Upcoming Celebrations & Action Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Urgent Checklist Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-stone-900 text-base">
                  Celebration Action Items
                </h3>
              </div>
              <button
                onClick={() => onNavigateToView('timeline')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 space-y-1">
              {statsList.slice(0, 4).map(({ birthday, stats }) => {
                const unboughtGifts = (birthday.savedGifts || []).filter(
                  g => g.status === 'idea' || g.status === 'planned'
                );
                const hasPurchased = (birthday.savedGifts || []).some(
                  g => g.status === 'purchased' || g.status === 'wrapped'
                );

                return (
                  <div
                    key={birthday.id}
                    className="pt-3 pb-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${birthday.avatarColor || 'bg-amber-500'} text-white flex items-center justify-center text-lg font-bold shrink-0`}>
                        {birthday.avatarEmoji || birthday.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-stone-900 text-sm">
                            {birthday.name}
                          </h4>
                          {stats.isMilestone && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              ★ {stats.ageTurning}th
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">
                          {stats.formattedNextDate} ({stats.daysUntil === 0 ? 'Today!' : `in ${stats.daysUntil} days`}) · {birthday.relationship}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {hasPurchased ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Gift Ready
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenGiftModal(birthday)}
                          className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5 text-amber-700" />
                          Plan Gift
                        </button>
                      )}

                      <button
                        onClick={() => onOpenGreetingModal(birthday)}
                        className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-stone-500" />
                        Wish
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Distribution Chart Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-stone-900 text-base">
                  Annual Birthday Distribution
                </h3>
                <p className="text-xs text-stone-500">
                  Spread of birthdays across the calendar year
                </p>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                Active: {MONTH_NAMES[today.getMonth()]}
              </span>
            </div>

            {/* Vertical Bar Chart */}
            <div className="grid grid-cols-12 gap-1.5 sm:gap-2 items-end h-36 pt-4 border-b border-stone-200/80 pb-2">
              {monthlyCounts.map((count, idx) => {
                const heightPercent = Math.max(12, Math.round((count / maxMonthlyCount) * 100));
                const isCurrentMonth = idx === today.getMonth();

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        isCurrentMonth
                          ? 'bg-amber-500 group-hover:bg-amber-400'
                          : count > 0
                          ? 'bg-stone-800 group-hover:bg-stone-700'
                          : 'bg-stone-100'
                      }`}
                      title={`${MONTH_NAMES[idx]}: ${count} birthdays`}
                    />
                    <span
                      className={`text-[10px] font-semibold tracking-tighter ${
                        isCurrentMonth ? 'text-amber-600 font-bold' : 'text-stone-400'
                      }`}
                    >
                      {MONTH_NAMES[idx].slice(0, 1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Zodiac Season & Celebration Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Zodiac Season Spotlight */}
          <div className="bg-stone-900 text-stone-100 border border-stone-800 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                Current Zodiac Season
              </span>
              <span className="text-xs text-stone-400">{currentZodiac.dates}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl font-bold">
                {currentZodiac.symbol}
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white">
                  {currentZodiac.name}
                </h4>
                <p className="text-xs text-stone-400">
                  Element: <span className="text-stone-200 font-medium">{currentZodiac.element}</span> · Symbol: {currentZodiac.symbol}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              People born in this sign appreciate thoughtful, artistic, or harmonious gifts that bring balance and warmth.
            </p>
          </div>

          {/* Quick Shortcuts Launchpad */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-display font-bold text-stone-900 text-sm">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={onOpenAddModal}
                className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-2xl transition-colors flex items-center justify-between text-stone-800 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Add New Birthday Contact</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={() => onNavigateToView('gifts')}
                className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-2xl transition-colors flex items-center justify-between text-stone-800 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span>Smart Gift Suggestions & Wishlists</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={onExportICS}
                className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-2xl transition-colors flex items-center justify-between text-stone-800 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <span>Sync Calendar (.ICS File)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
