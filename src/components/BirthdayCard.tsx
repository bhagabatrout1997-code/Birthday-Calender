import React from 'react';
import { Gift, Send, Calendar, MoreHorizontal, Edit, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Birthday } from '../types';
import { calculateBirthdayStats, getGoogleCalendarUrl } from '../utils/dateUtils';

interface BirthdayCardProps {
  birthday: Birthday;
  onEdit: (birthday: Birthday) => void;
  onDelete: (id: string) => void;
  onOpenGifts: (birthday: Birthday) => void;
  onOpenWishes: (birthday: Birthday) => void;
}

export const BirthdayCard: React.FC<BirthdayCardProps> = ({
  birthday,
  onEdit,
  onDelete,
  onOpenGifts,
  onOpenWishes,
}) => {
  const stats = calculateBirthdayStats(birthday);
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gift status summary
  const purchasedGifts = birthday.savedGifts.filter(g => g.status === 'purchased' || g.status === 'wrapped');
  const plannedGifts = birthday.savedGifts.filter(g => g.status === 'planned');
  const ideaGifts = birthday.savedGifts.filter(g => g.status === 'idea');

  // Days until text styling
  let urgencyColor = 'text-stone-600 bg-stone-100';
  let badgeBorder = 'border-stone-200';
  if (stats.isToday) {
    urgencyColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (stats.isTomorrow) {
    urgencyColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (stats.daysUntil <= 7) {
    urgencyColor = 'text-amber-800 bg-amber-50/70 border-amber-200/60';
  }

  return (
    <div className="group relative bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-amber-400/60 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Contact Avatar & Identity */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl ${birthday.avatarColor || 'bg-amber-600'} text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-sm`}
          >
            {birthday.avatarEmoji || birthday.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-stone-900 text-base sm:text-lg truncate group-hover:text-amber-600 transition-colors">
                {birthday.name}
              </h3>
              {stats.isMilestone && (
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60">
                  ★ {stats.ageTurning}th
                </span>
              )}
            </div>

            {/* Zero-pill metadata text with subtle typographic separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mt-0.5">
              <span>{birthday.relationship}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-700 font-medium">{stats.formattedNextDate} ({stats.dayOfWeek})</span>
              {stats.ageTurning && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-700 font-medium">Turns {stats.ageTurning}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span title={`${stats.zodiac.name} (${stats.zodiac.dates})`}>
                {stats.zodiac.symbol} {stats.zodiac.name}
              </span>
            </div>
          </div>
        </div>

        {/* Days remaining badge & menu */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold tabular-nums border ${urgencyColor} ${badgeBorder}`}>
            {stats.isToday ? (
              <span className="font-bold text-rose-600 animate-pulse">Today! 🎉</span>
            ) : stats.isTomorrow ? (
              'Tomorrow'
            ) : (
              `In ${stats.daysUntil} days`
            )}
          </div>

          {/* More Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-20 text-xs">
                <a
                  href={getGoogleCalendarUrl(birthday)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  Add to Google Cal
                </a>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(birthday);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-stone-700 hover:bg-stone-50 transition-colors text-left"
                >
                  <Edit className="w-3.5 h-3.5 text-stone-500" />
                  Edit Details
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(birthday.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interests and Notes Snippet */}
      {birthday.interests && birthday.interests.length > 0 && (
        <div className="mt-3 text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-400 font-medium">Interests:</span>
          {birthday.interests.map((interest, idx) => (
            <span key={idx} className="text-stone-700">
              {interest}{idx < birthday.interests.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      )}

      {birthday.notes && (
        <p className="mt-2 text-xs text-stone-600 italic line-clamp-2 bg-stone-50/80 p-2 rounded-lg border border-stone-100">
          "{birthday.notes}"
        </p>
      )}

      {/* Gift Status & Card Actions Bottom Bar */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
        {/* Gift status summary */}
        <div className="text-xs flex items-center gap-1.5">
          {purchasedGifts.length > 0 ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {purchasedGifts.length} gift{purchasedGifts.length > 1 ? 's' : ''} ready
            </span>
          ) : plannedGifts.length > 0 ? (
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {plannedGifts.length} gift planned
            </span>
          ) : ideaGifts.length > 0 ? (
            <span className="text-stone-600">
              {ideaGifts.length} gift idea{ideaGifts.length > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-stone-400">
              No gifts saved yet
            </span>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenGifts(birthday)}
            className="px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200/80 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-700" />
            <span>Gift Ideas</span>
          </button>
          <button
            onClick={() => onOpenWishes(birthday)}
            className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-stone-500" />
            <span>Wishes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
