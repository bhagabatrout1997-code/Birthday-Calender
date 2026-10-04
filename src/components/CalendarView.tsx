import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Send,
  Calendar as CalendarIcon,
  Cake,
  Award
} from 'lucide-react';
import { Birthday } from '../types';
import { MONTH_NAMES, calculateBirthdayStats, parseBirthDate } from '../utils/dateUtils';

interface CalendarViewProps {
  birthdays: Birthday[];
  onOpenGiftModal: (birthday: Birthday) => void;
  onOpenGreetingModal: (birthday: Birthday) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  birthdays,
  onOpenGiftModal,
  onOpenGreetingModal,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);

  // Month navigation
  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function jumpToToday() {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  }

  // Days calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map birthdays that fall in this month
  const birthdaysThisMonth = birthdays.filter(b => {
    const { month } = parseBirthDate(b.birthDate);
    return month === currentMonth + 1;
  });

  // Group by day of month
  const birthdaysByDay: Record<number, Birthday[]> = {};
  birthdaysThisMonth.forEach(b => {
    const { day } = parseBirthDate(b.birthDate);
    if (!birthdaysByDay[day]) birthdaysByDay[day] = [];
    birthdaysByDay[day].push(b);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Calendar Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={jumpToToday}
              className="px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {birthdaysThisMonth.length === 1
              ? '1 birthday celebration this month'
              : `${birthdaysThisMonth.length} birthday celebrations this month`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid: 7 columns (Sun - Sat) */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-400 mb-2 py-1 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty padding cells before first day */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-24 sm:h-28 bg-stone-50/50 rounded-xl" />
          ))}

          {/* Actual days of month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isToday =
              currentYear === today.getFullYear() &&
              currentMonth === today.getMonth() &&
              dayNum === today.getDate();

            const dayBirthdays = birthdaysByDay[dayNum] || [];

            return (
              <div
                key={`day-${dayNum}`}
                className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                  isToday
                    ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300'
                    : dayBirthdays.length > 0
                    ? 'bg-stone-50 border-stone-300/80 hover:border-amber-400'
                    : 'bg-white border-stone-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isToday
                        ? 'w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold'
                        : 'text-stone-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayBirthdays.length > 0 && (
                    <Cake className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>

                {/* Birthdays badge stack */}
                <div className="space-y-1 overflow-y-auto mt-1 flex-1">
                  {dayBirthdays.map((b) => {
                    const stats = calculateBirthdayStats(b);
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBirthday(b)}
                        className="w-full text-left px-1.5 py-1 rounded bg-white hover:bg-amber-100 border border-stone-200/90 hover:border-amber-300 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className={`w-2 h-2 rounded-full ${b.avatarColor || 'bg-amber-500'} shrink-0`} />
                        <span className="text-[11px] font-semibold text-stone-900 truncate">
                          {b.name}
                        </span>
                        {stats.isMilestone && (
                          <span className="text-[10px] text-rose-600 font-bold shrink-0">★</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popover / Spotlight modal on clicked birthday */}
      {selectedBirthday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {(() => {
              const stats = calculateBirthdayStats(selectedBirthday);
              return (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${selectedBirthday.avatarColor || 'bg-amber-600'} text-white flex items-center justify-center text-xl font-bold`}>
                        {selectedBirthday.avatarEmoji || selectedBirthday.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-stone-900 text-lg">
                          {selectedBirthday.name}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {selectedBirthday.relationship} · {stats.formattedNextDate} ({stats.dayOfWeek})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBirthday(null)}
                      className="text-stone-400 hover:text-stone-800 p-1"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs space-y-1.5 text-stone-700">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Turning Age:</span>
                      <span className="font-semibold text-stone-900">{stats.ageTurning ? `${stats.ageTurning} years old` : 'Celebration'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Zodiac Sign:</span>
                      <span className="font-semibold text-stone-900">{stats.zodiac.symbol} {stats.zodiac.name} ({stats.zodiac.element})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Birthstone:</span>
                      <span className="font-semibold text-stone-900">{stats.birthstone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Days Remaining:</span>
                      <span className="font-semibold text-amber-700">{stats.daysUntil === 0 ? 'Today! 🎉' : `${stats.daysUntil} days`}</span>
                    </div>
                  </div>

                  {selectedBirthday.notes && (
                    <p className="text-xs text-stone-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      "{selectedBirthday.notes}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        const b = selectedBirthday;
                        setSelectedBirthday(null);
                        onOpenGiftModal(b);
                      }}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Gift className="w-4 h-4" />
                      Plan Gift
                    </button>
                    <button
                      onClick={() => {
                        const b = selectedBirthday;
                        setSelectedBirthday(null);
                        onOpenGreetingModal(b);
                      }}
                      className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Write Wishes
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
