import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Heart, Tag, DollarSign, Bell, Sparkles } from 'lucide-react';
import { Birthday, Relationship } from '../types';
import { parseBirthDate, MONTH_NAMES } from '../utils/dateUtils';

interface BirthdayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (birthday: Birthday) => void;
  initialData?: Birthday | null;
}

const RELATIONSHIPS: Relationship[] = [
  'Family',
  'Friend',
  'Partner',
  'Parent',
  'Sibling',
  'Child',
  'Colleague',
  'Mentor',
  'Other',
];

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-rose-500',
  'bg-emerald-600',
  'bg-indigo-600',
  'bg-teal-600',
  'bg-violet-600',
  'bg-sky-600',
  'bg-orange-500',
  'bg-stone-700',
];

const EMOJI_OPTIONS = ['🎂', '✨', '⚡', '🌿', '🎨', '🚀', '☕', '📚', '🍷', '🌸', '👑', '🎉'];

const COMMON_INTERESTS = [
  'Coffee',
  'Reading & Books',
  'Cooking & Baking',
  'Gardening',
  'Travel',
  'Tech & Gadgets',
  'Vinyl & Music',
  'Hiking & Outdoors',
  'Wine & Cocktails',
  'Fitness & Yoga',
  'Board Games',
  'Art & Photography',
];

export const BirthdayFormModal: React.FC<BirthdayFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState<number | ''>(1995);
  const [yearKnown, setYearKnown] = useState(true);
  const [relationship, setRelationship] = useState<Relationship>('Friend');
  const [avatarColor, setAvatarColor] = useState('bg-amber-500');
  const [avatarEmoji, setAvatarEmoji] = useState('🎂');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [notes, setNotes] = useState('');
  const [favoriteCakeOrDrink, setFavoriteCakeOrDrink] = useState('');
  const [budgetGoal, setBudgetGoal] = useState<number | ''>('');
  const [remindDaysBefore, setRemindDaysBefore] = useState<number[]>([0, 1, 3, 7]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      const parsed = parseBirthDate(initialData.birthDate);
      setMonth(parsed.month);
      setDay(parsed.day);
      setYear(parsed.year || '');
      setYearKnown(initialData.birthYearKnown);
      setRelationship(initialData.relationship);
      setAvatarColor(initialData.avatarColor || 'bg-amber-500');
      setAvatarEmoji(initialData.avatarEmoji || '🎂');
      setInterests(initialData.interests || []);
      setNotes(initialData.notes || '');
      setFavoriteCakeOrDrink(initialData.favoriteCakeOrDrink || '');
      setBudgetGoal(initialData.budgetGoal || '');
      setRemindDaysBefore(initialData.remindDaysBefore || [0, 1, 3, 7]);
    } else {
      // Default new form state
      const now = new Date();
      setName('');
      setMonth(now.getMonth() + 1);
      setDay(now.getDate());
      setYear(now.getFullYear() - 25);
      setYearKnown(true);
      setRelationship('Friend');
      setAvatarColor('bg-amber-500');
      setAvatarEmoji('🎂');
      setInterests([]);
      setCustomInterest('');
      setNotes('');
      setFavoriteCakeOrDrink('');
      setBudgetGoal('');
      setRemindDaysBefore([0, 1, 3, 7]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function toggleInterest(item: string) {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  }

  function toggleReminderDay(dayOffset: number) {
    if (remindDaysBefore.includes(dayOffset)) {
      setRemindDaysBefore(remindDaysBefore.filter((d) => d !== dayOffset));
    } else {
      setRemindDaysBefore([...remindDaysBefore, dayOffset].sort((a, b) => a - b));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yyyy = yearKnown && year ? String(year) : '0000';
    const birthDate = `${yyyy}-${mm}-${dd}`;

    const newOrUpdated: Birthday = {
      id: initialData?.id || `b-${Date.now()}`,
      name: name.trim(),
      birthDate,
      birthYearKnown: yearKnown && !!year,
      relationship,
      avatarColor,
      avatarEmoji,
      interests,
      notes: notes.trim(),
      favoriteCakeOrDrink: favoriteCakeOrDrink.trim(),
      budgetGoal: budgetGoal ? Number(budgetGoal) : undefined,
      remindDaysBefore,
      savedGifts: initialData?.savedGifts || [],
      pastGifts: initialData?.pastGifts || [],
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(newOrUpdated);
    onClose();
  }

  // Calculate days in the selected month
  const daysInSelectedMonth = new Date(2024, month, 0).getDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-display font-bold text-stone-50">
              {initialData ? `Edit ${initialData.name}` : 'Add Birthday'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Date of Birth Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-stone-700">
                Date of Birth *
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-stone-500">
                <input
                  type="checkbox"
                  checked={yearKnown}
                  onChange={(e) => setYearKnown(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span>Include birth year (tracks age & milestones)</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {Array.from({ length: daysInSelectedMonth }).map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      Day {idx + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Year (e.g. 1995)"
                  disabled={!yearKnown}
                  value={year}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Relationship & Avatar Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as Relationship)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Avatar Theme & Emoji
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {AVATAR_COLORS.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      className={`w-6 h-6 rounded-full ${color} transition-transform ${
                        avatarColor === color ? 'ring-2 ring-stone-900 scale-110' : ''
                      }`}
                    />
                  ))}
                </div>

                <select
                  value={avatarEmoji}
                  onChange={(e) => setAvatarEmoji(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-2 py-1 text-sm focus:outline-none"
                >
                  {EMOJI_OPTIONS.map((em) => (
                    <option key={em} value={em}>
                      {em}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reminder Notifications Schedule */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Notification Reminders</span>
            </div>
            <p className="text-[11px] text-stone-600">
              When should Celebrately alert you before {name ? name : 'their'} birthday?
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: 'Day of (0d)', days: 0 },
                { label: '1 day before', days: 1 },
                { label: '3 days before', days: 3 },
                { label: '1 week before', days: 7 },
                { label: '2 weeks before', days: 14 },
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => toggleReminderDay(item.days)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    remindDaysBefore.includes(item.days)
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-2xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests & Hobbies (Powers Gift Suggestions) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-stone-700">
                Interests & Hobbies (Powers Smart Gift Suggestions)
              </label>
              <span className="text-stone-400">Click to toggle</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_INTERESTS.map((item) => {
                const selected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      selected
                        ? 'bg-stone-900 text-stone-100 font-medium'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {selected ? `✓ ${item}` : `+ ${item}`}
                  </button>
                );
              })}
            </div>

            {/* Custom interest tag input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Type custom hobby (e.g. Sourdough baking)..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customInterest.trim()) {
                    e.preventDefault();
                    if (!interests.includes(customInterest.trim())) {
                      setInterests([...interests, customInterest.trim()]);
                    }
                    setCustomInterest('');
                  }
                }}
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customInterest.trim() && !interests.includes(customInterest.trim())) {
                    setInterests([...interests, customInterest.trim()]);
                    setCustomInterest('');
                  }
                }}
                className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>

          {/* Target Gift Budget & Favorites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Target Gift Budget ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={budgetGoal}
                onChange={(e) => setBudgetGoal(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Favorite Cake / Drink / Treat
              </label>
              <input
                type="text"
                placeholder="e.g. Matcha Latte / Carrot cake"
                value={favoriteCakeOrDrink}
                onChange={(e) => setFavoriteCakeOrDrink(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Personal Notes & Ideas
            </label>
            <textarea
              placeholder="e.g. Moving into a new studio apartment soon; loves earthy colors and minimal aesthetics."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Add to Tracker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
