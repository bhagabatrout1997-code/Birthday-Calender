import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Birthday } from '../types';
import { calculateBirthdayStats } from '../utils/dateUtils';

interface GreetingGeneratorModalProps {
  birthday: Birthday;
  isOpen: boolean;
  onClose: () => void;
}

export const GreetingGeneratorModal: React.FC<GreetingGeneratorModalProps> = ({
  birthday,
  isOpen,
  onClose,
}) => {
  const [tone, setTone] = useState<string>('heartfelt');
  const [customMemory, setCustomMemory] = useState<string>('');
  const [greetings, setGreetings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const stats = calculateBirthdayStats(birthday);

  useEffect(() => {
    if (isOpen) {
      generateGreetings();
    }
  }, [isOpen, tone]);

  if (!isOpen) return null;

  async function generateGreetings() {
    setLoading(true);
    try {
      const response = await fetch('/api/greetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birthday.name,
          relationship: birthday.relationship,
          ageTurning: stats.ageTurning,
          tone,
          customNote: customMemory || birthday.notes,
        }),
      });

      const data = await response.json();
      if (data.greetings && Array.isArray(data.greetings)) {
        setGreetings(data.greetings);
      }
    } catch (err) {
      console.error('Error fetching greetings:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function getWhatsAppUrl(text: string) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  function getMailToUrl(text: string) {
    const subject = encodeURIComponent(`Happy Birthday, ${birthday.name}! 🎂🎉`);
    const body = encodeURIComponent(text);
    return `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${birthday.avatarColor || 'bg-amber-600'} text-white flex items-center justify-center text-lg font-bold`}>
              {birthday.avatarEmoji || birthday.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-stone-50">
                Birthday Wishes for {birthday.name}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {birthday.relationship}
                {stats.ageTurning ? ` · Turning ${stats.ageTurning}` : ''}
                {stats.daysUntil === 0 ? ' · Celebrating today!' : ` · In ${stats.daysUntil} days`}
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

        {/* Tone Selector & Controls */}
        <div className="p-6 bg-stone-50 border-b border-stone-200/80 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wider">
              Choose Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'heartfelt', label: 'Heartfelt & Warm' },
                { id: 'funny', label: 'Playful & Funny' },
                { id: 'short', label: 'Short & Sweet (Text)' },
                { id: 'poetic', label: 'Poetic & Thoughtful' },
                { id: 'milestone', label: 'Milestone Tribute' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    tone === t.id
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add personal detail or inside joke (optional)..."
              value={customMemory}
              onChange={(e) => setCustomMemory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') generateGreetings();
              }}
              className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={generateGreetings}
              disabled={loading}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Wishes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-amber-500" />
              <p className="text-sm font-medium text-stone-700">
                Crafting personalized messages...
              </p>
            </div>
          ) : (
            greetings.map((msg, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 hover:border-amber-400/80 transition-all space-y-3 group shadow-2xs"
              >
                <p className="text-sm text-stone-800 leading-relaxed font-serif sm:font-sans">
                  "{msg}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-[11px] text-stone-400">
                    Option {idx + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(msg, idx)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getWhatsAppUrl(msg)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                      title="Send via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <a
                      href={getMailToUrl(msg)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                      title="Send via Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
