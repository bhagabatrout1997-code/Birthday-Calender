import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Gift,
  ExternalLink,
  Plus,
  Check,
  CheckCircle2,
  Package,
  History,
  Tag,
  DollarSign,
  Loader2,
  Trash2
} from 'lucide-react';
import { Birthday, SavedGiftIdea, GiftStatus } from '../types';
import { calculateBirthdayStats } from '../utils/dateUtils';
import { generateCuratedGiftSuggestions } from '../utils/giftCurator';

interface GiftSuggestionsModalProps {
  birthday: Birthday;
  isOpen: boolean;
  onClose: () => void;
  onUpdateBirthday: (updated: Birthday) => void;
}

export const GiftSuggestionsModal: React.FC<GiftSuggestionsModalProps> = ({
  birthday,
  isOpen,
  onClose,
  onUpdateBirthday,
}) => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'saved' | 'history'>('suggestions');
  const [budget, setBudget] = useState('$25 - $50');
  const [vibe, setVibe] = useState('Thoughtful & Memorable');
  const [loading, setLoading] = useState(false);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<any[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [interestTags, setInterestTags] = useState<string[]>(birthday.interests || []);

  // New manual gift state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newNote, setNewNote] = useState('');

  // New past gift state
  const [pastYear, setPastYear] = useState(new Date().getFullYear() - 1);
  const [pastItem, setPastItem] = useState('');
  const [pastCost, setPastCost] = useState('');
  const [pastReaction, setPastReaction] = useState('');

  const stats = calculateBirthdayStats(birthday);

  // Sync interest tags when birthday changes
  useEffect(() => {
    setInterestTags(birthday.interests || []);
  }, [birthday]);

  // Auto-fetch initial recommendations on open if empty
  useEffect(() => {
    if (isOpen && generatedSuggestions.length === 0) {
      fetchSuggestions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function fetchSuggestions() {
    setLoading(true);
    try {
      const response = await fetch('/api/gift-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birthday.name,
          relationship: birthday.relationship,
          age: stats.ageTurning || stats.currentAge,
          interests: interestTags,
          budget,
          vibe,
          notes: birthday.notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setGeneratedSuggestions(data.suggestions);
        return;
      }
    } catch (err) {
      // Graceful fallback for static hosting like GitHub Pages where /api/ endpoints do not exist
      const localCurated = generateCuratedGiftSuggestions({
        name: birthday.name,
        relationship: birthday.relationship,
        age: stats.ageTurning || stats.currentAge,
        interests: interestTags,
        budget,
        vibe,
      });
      setGeneratedSuggestions(localCurated);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveSuggestion(item: any) {
    const newGift: SavedGiftIdea = {
      id: `gift-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: item.title,
      category: item.category || 'Curated Gift',
      estimatedPrice: item.estimatedPrice || budget,
      status: 'idea',
      note: item.whyTheyWillLoveIt,
      whereToFind: item.whereToFind,
      searchQuery: item.searchQuery || item.title,
      addedAt: new Date().toISOString(),
    };

    const updated = {
      ...birthday,
      savedGifts: [newGift, ...(birthday.savedGifts || [])],
    };
    onUpdateBirthday(updated);
  }

  function handleUpdateGiftStatus(giftId: string, status: GiftStatus) {
    const updatedGifts = (birthday.savedGifts || []).map(g => {
      if (g.id === giftId) return { ...g, status };
      return g;
    });
    onUpdateBirthday({ ...birthday, savedGifts: updatedGifts });
  }

  function handleDeleteGift(giftId: string) {
    const updatedGifts = (birthday.savedGifts || []).filter(g => g.id !== giftId);
    onUpdateBirthday({ ...birthday, savedGifts: updatedGifts });
  }

  function handleAddManualGift(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGift: SavedGiftIdea = {
      id: `gift-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || 'General',
      estimatedPrice: newPrice.trim() || 'Flexible',
      status: 'planned',
      note: newNote.trim(),
      addedAt: new Date().toISOString(),
    };

    onUpdateBirthday({
      ...birthday,
      savedGifts: [newGift, ...(birthday.savedGifts || [])],
    });

    setNewTitle('');
    setNewPrice('');
    setNewNote('');
  }

  function handleAddPastGift(e: React.FormEvent) {
    e.preventDefault();
    if (!pastItem.trim()) return;

    const newPast = {
      id: `past-${Date.now()}`,
      year: Number(pastYear),
      item: pastItem.trim(),
      cost: pastCost ? Number(pastCost) : undefined,
      reactionOrNote: pastReaction.trim(),
    };

    onUpdateBirthday({
      ...birthday,
      pastGifts: [newPast, ...(birthday.pastGifts || [])],
    });

    setPastItem('');
    setPastCost('');
    setPastReaction('');
  }

  function handleDeletePastGift(id: string) {
    onUpdateBirthday({
      ...birthday,
      pastGifts: (birthday.pastGifts || []).filter(p => p.id !== id),
    });
  }

  function isGiftAlreadySaved(title: string): boolean {
    return (birthday.savedGifts || []).some(
      g => g.title.toLowerCase() === title.toLowerCase()
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${birthday.avatarColor || 'bg-amber-600'} text-white flex items-center justify-center text-lg font-bold`}>
              {birthday.avatarEmoji || birthday.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-stone-50">
                  Gift Planner for {birthday.name}
                </h2>
                <span className="text-xs text-amber-400 font-medium bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/20">
                  {birthday.relationship}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {stats.formattedNextDate} ({stats.daysUntil === 0 ? 'Today!' : `in ${stats.daysUntil} days`})
                {stats.ageTurning ? ` · Turning ${stats.ageTurning}` : ''}
                {birthday.budgetGoal ? ` · Target Budget: $${birthday.budgetGoal}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-stone-50 border-b border-stone-200 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'suggestions'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gift Suggestions
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              Saved Gifts ({(birthday.savedGifts || []).length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Past Gifts Given ({(birthday.pastGifts || []).length})
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              {/* Controls & Prompt Customizer */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Budget Range
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Under $25">Under $25 (Thoughtful budget)</option>
                      <option value="$25 - $50">$25 – $50 (Standard sweet spot)</option>
                      <option value="$50 - $100">$50 – $100 (Substantial gift)</option>
                      <option value="$100 - $200">$100 – $200 (Special milestone)</option>
                      <option value="$200+">$200+ (Luxury / High-end)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Gift Personality / Vibe
                    </label>
                    <select
                      value={vibe}
                      onChange={(e) => setVibe(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Thoughtful & Memorable">Thoughtful & Memorable</option>
                      <option value="Practical & Daily Essential">Practical & Daily Essential</option>
                      <option value="Experiential & Fun">Experiential & Activity</option>
                      <option value="Artisan & Handcrafted">Artisan & Handcrafted</option>
                      <option value="Cozy & Relaxing">Cozy & Relaxing</option>
                      <option value="Modern Tech & Clever">Modern Tech & Gadgets</option>
                    </select>
                  </div>
                </div>

                {/* Tags modifier */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Interests & Hobbies Considered
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {interestTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-stone-200 text-stone-700 px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => setInterestTags(interestTags.filter((_, i) => i !== idx))}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="+ Add interest"
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customInterest.trim()) {
                            e.preventDefault();
                            setInterestTags([...interestTags, customInterest.trim()]);
                            setCustomInterest('');
                          }
                        }}
                        className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 w-28 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Suggestions analyze relationship, age, personality, and curated products.
                  </span>
                  <button
                    onClick={fetchSuggestions}
                    disabled={loading}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-60 cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Curating Ideas...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate New Ideas
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestions Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold uppercase tracking-wider">
                    Recommended Ideas ({generatedSuggestions.length})
                  </span>
                  <span>Click to save to {birthday.name}'s plan</span>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-stone-500 space-y-2">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-amber-500" />
                    <p className="text-sm font-medium text-stone-700">
                      Generating tailored gifts for {birthday.name}...
                    </p>
                    <p className="text-xs text-stone-400">
                      Matching specific hobbies, price targets, and high-rated items.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {generatedSuggestions.map((item, index) => {
                      const alreadySaved = isGiftAlreadySaved(item.title);
                      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
                        item.searchQuery || item.title
                      )}`;

                      return (
                        <div
                          key={index}
                          className="bg-white border border-stone-200/90 rounded-2xl p-4 hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                {item.category || 'Gift Idea'}
                              </span>
                              <span className="text-xs font-bold text-stone-900 tabular-nums">
                                {item.estimatedPrice}
                              </span>
                            </div>

                            <h4 className="font-display font-semibold text-stone-900 text-sm sm:text-base">
                              {item.title}
                            </h4>

                            <p className="text-xs text-stone-600 leading-relaxed">
                              {item.whyTheyWillLoveIt}
                            </p>

                            {item.whereToFind && (
                              <p className="text-[11px] text-stone-400">
                                Where to find: <span className="text-stone-600">{item.whereToFind}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex sm:flex-col items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleSaveSuggestion(item)}
                              disabled={alreadySaved}
                              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                                alreadySaved
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm active:scale-95 cursor-pointer'
                              }`}
                            >
                              {alreadySaved ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Saved
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" /> Save Gift
                                </>
                              )}
                            </button>

                            <a
                              href={googleSearchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                              Search Online
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-6">
              {/* Add Custom Gift Section */}
              <form onSubmit={handleAddManualGift} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Add Your Own Gift Idea
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Gift title (e.g., Merino wool sweater)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="sm:col-span-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Price (e.g. $45)"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Quick note or link..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl transition-all shrink-0 cursor-pointer"
                  >
                    Add Gift
                  </button>
                </div>
              </form>

              {/* Saved gifts list */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Active Gift List ({(birthday.savedGifts || []).length})
                </span>

                {(birthday.savedGifts || []).length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-stone-400">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                    <p className="text-sm font-medium text-stone-700">No gifts saved yet</p>
                    <p className="text-xs text-stone-500 mt-1">
                      Check out the "Gift Suggestions" tab or type your own idea above!
                    </p>
                  </div>
                ) : (
                  (birthday.savedGifts || []).map((gift) => (
                    <div
                      key={gift.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-semibold text-stone-900 text-sm">
                            {gift.title}
                          </h4>
                          {gift.estimatedPrice && (
                            <span className="text-xs font-bold text-stone-700 tabular-nums">
                              · {gift.estimatedPrice}
                            </span>
                          )}
                        </div>
                        {gift.note && (
                          <p className="text-xs text-stone-500 italic">
                            {gift.note}
                          </p>
                        )}
                        <span className="text-[11px] text-stone-400 block">
                          Category: {gift.category}
                        </span>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={gift.status}
                          onChange={(e) => handleUpdateGiftStatus(gift.id, e.target.value as GiftStatus)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                            gift.status === 'purchased' || gift.status === 'wrapped'
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

                        <button
                          onClick={() => handleDeleteGift(gift.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete gift"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Add Past Gift form */}
              <form onSubmit={handleAddPastGift} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Log Past Gift Given (Prevents Repeat Gifts)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Year"
                    value={pastYear}
                    onChange={(e) => setPastYear(Number(e.target.value))}
                    required
                    className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="What did you give?"
                    value={pastItem}
                    onChange={(e) => setPastItem(e.target.value)}
                    required
                    className="sm:col-span-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="number"
                    placeholder="Cost ($)"
                    value={pastCost}
                    onChange={(e) => setPastCost(e.target.value)}
                    className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Their reaction or notes (e.g., 'Loved the blue shade, wears it weekly')"
                    value={pastReaction}
                    onChange={(e) => setPastReaction(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold rounded-xl transition-all shrink-0 cursor-pointer"
                  >
                    Save to Archive
                  </button>
                </div>
              </form>

              {/* Past gifts list */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Past Gifts Archive ({(birthday.pastGifts || []).length})
                </span>

                {(birthday.pastGifts || []).length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-stone-400 text-xs">
                    No past gifts recorded for {birthday.name} yet.
                  </div>
                ) : (
                  (birthday.pastGifts || []).map((past) => (
                    <div
                      key={past.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-medium">
                          <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {past.year}
                          </span>
                          <span className="text-stone-900 font-semibold text-sm">
                            {past.item}
                          </span>
                          {past.cost && (
                            <span className="text-stone-500 tabular-nums">
                              · ${past.cost}
                            </span>
                          )}
                        </div>
                        {past.reactionOrNote && (
                          <p className="text-stone-600 italic">
                            "{past.reactionOrNote}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeletePastGift(past.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Delete past record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
