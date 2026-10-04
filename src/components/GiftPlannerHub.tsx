import React, { useState } from 'react';
import {
  Gift,
  CheckCircle2,
  Package,
  ExternalLink,
  Plus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Birthday, SavedGiftIdea, GiftStatus } from '../types';
import { calculateBirthdayStats } from '../utils/dateUtils';

interface GiftPlannerHubProps {
  birthdays: Birthday[];
  onOpenGiftModal: (birthday: Birthday) => void;
  onUpdateBirthday: (birthday: Birthday) => void;
}

export const GiftPlannerHub: React.FC<GiftPlannerHubProps> = ({
  birthdays,
  onOpenGiftModal,
  onUpdateBirthday,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all gifts across all contacts
  const allGiftsWithContact: {
    gift: SavedGiftIdea;
    birthday: Birthday;
    daysUntil: number;
    formattedDate: string;
  }[] = [];

  let totalBudgetGoals = 0;
  let totalPurchasedCost = 0;
  let itemsToBuyCount = 0;
  let purchasedCount = 0;

  birthdays.forEach((b) => {
    if (b.budgetGoal) totalBudgetGoals += b.budgetGoal;
    const stats = calculateBirthdayStats(b);

    (b.savedGifts || []).forEach((g) => {
      allGiftsWithContact.push({
        gift: g,
        birthday: b,
        daysUntil: stats.daysUntil,
        formattedDate: stats.formattedNextDate,
      });

      if (g.status === 'purchased' || g.status === 'wrapped') {
        purchasedCount++;
        // Attempt to parse price if available
        const match = g.estimatedPrice?.match(/\d+/);
        if (match) totalPurchasedCost += parseInt(match[0], 10);
      } else {
        itemsToBuyCount++;
      }
    });
  });

  // Sort chronologically by closest birthday
  allGiftsWithContact.sort((a, b) => a.daysUntil - b.daysUntil);

  // Filter list
  const filteredGifts = allGiftsWithContact.filter(({ gift, birthday }) => {
    if (filterStatus === 'to-buy' && (gift.status === 'purchased' || gift.status === 'wrapped' || gift.status === 'given')) {
      return false;
    }
    if (filterStatus === 'ready' && (gift.status !== 'purchased' && gift.status !== 'wrapped')) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        gift.title.toLowerCase().includes(q) ||
        birthday.name.toLowerCase().includes(q) ||
        gift.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleQuickStatusChange(birthdayId: string, giftId: string, newStatus: GiftStatus) {
    const birthday = birthdays.find(b => b.id === birthdayId);
    if (!birthday) return;

    const updatedGifts = (birthday.savedGifts || []).map(g => {
      if (g.id === giftId) return { ...g, status: newStatus };
      return g;
    });

    onUpdateBirthday({ ...birthday, savedGifts: updatedGifts });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Items to Purchase
          </span>
          <span className="text-2xl font-display font-bold text-amber-600 mt-1 block tabular-nums">
            {itemsToBuyCount}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            Ideas & planned gifts
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Ready & Wrapped
          </span>
          <span className="text-2xl font-display font-bold text-emerald-600 mt-1 block tabular-nums">
            {purchasedCount}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            Purchased or wrapped
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Estimated Spent
          </span>
          <span className="text-2xl font-display font-bold text-stone-900 mt-1 block tabular-nums">
            ${totalPurchasedCost}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            On ready gifts
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Annual Budget Target
          </span>
          <span className="text-2xl font-display font-bold text-stone-700 mt-1 block tabular-nums">
            ${totalBudgetGoals}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            Sum of contact targets
          </span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-stone-900 font-semibold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Gifts ({allGiftsWithContact.length})
          </button>
          <button
            onClick={() => setFilterStatus('to-buy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'to-buy'
                ? 'bg-white text-stone-900 font-semibold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            To Buy ({itemsToBuyCount})
          </button>
          <button
            onClick={() => setFilterStatus('ready')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'ready'
                ? 'bg-white text-stone-900 font-semibold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ready / Wrapped ({purchasedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search gifts or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Gift Items Table / Cards */}
      <div className="space-y-3">
        {filteredGifts.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center text-stone-500">
            <Gift className="w-10 h-10 mx-auto mb-3 text-stone-400" />
            <h3 className="font-display font-semibold text-stone-800 text-base">
              No gifts match the current filter
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Select any contact from the timeline to generate tailored gift suggestions or add personal gift ideas!
            </p>
          </div>
        ) : (
          filteredGifts.map(({ gift, birthday, daysUntil, formattedDate }) => {
            const isReady = gift.status === 'purchased' || gift.status === 'wrapped';
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
              gift.searchQuery || gift.title
            )}`;

            return (
              <div
                key={gift.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                {/* Gift & Person Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      For {birthday.name} ({birthday.relationship})
                    </span>
                    <span className="text-xs text-amber-700 font-medium">
                      · {formattedDate} ({daysUntil === 0 ? 'Today!' : `in ${daysUntil}d`})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-semibold text-stone-900 text-sm sm:text-base truncate">
                      {gift.title}
                    </h4>
                    {gift.estimatedPrice && (
                      <span className="text-xs font-bold text-stone-700 tabular-nums">
                        · {gift.estimatedPrice}
                      </span>
                    )}
                  </div>

                  {gift.note && (
                    <p className="text-xs text-stone-500 italic line-clamp-1">
                      "{gift.note}"
                    </p>
                  )}
                </div>

                {/* Status Switcher & External Search */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <select
                    value={gift.status}
                    onChange={(e) => handleQuickStatusChange(birthday.id, gift.id, e.target.value as GiftStatus)}
                    className={`text-xs font-semibold rounded-xl px-3 py-2 border transition-colors focus:outline-none cursor-pointer ${
                      isReady
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : gift.status === 'planned'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                  >
                    <option value="idea">💡 Idea</option>
                    <option value="planned">📝 Planned</option>
                    <option value="purchased">🛍️ Purchased</option>
                    <option value="wrapped">🎁 Wrapped</option>
                    <option value="given">🎉 Given</option>
                  </select>

                  <a
                    href={googleSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors"
                    title="Find online"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onOpenGiftModal(birthday)}
                    className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
