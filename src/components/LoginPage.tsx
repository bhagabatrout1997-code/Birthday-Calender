import React, { useState } from 'react';
import {
  Cake,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Gift,
  Bell,
  Calendar,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  defaultEmail?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  defaultEmail = 'bhagabatrout1997@gmail.com',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('Bhagabat Rout');
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('celebrate2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const displayName = mode === 'signup' ? name.trim() || 'Celebrator' : (name.trim() || 'Bhagabat Rout');
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: displayName,
      email: email.trim().toLowerCase(),
      avatarEmoji: '🎂',
      avatarColor: 'bg-amber-500',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    onLogin(user);
  }

  function handleQuickDemoLogin() {
    const user: UserProfile = {
      id: 'demo-user-1',
      name: 'Bhagabat Rout',
      email: defaultEmail,
      avatarEmoji: '✨',
      avatarColor: 'bg-amber-500',
      joinedDate: 'Oct 2026',
    };
    onLogin(user);
  }

  function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setResetSent(false);
    }, 2500);
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Brand Story & Value Proposition */}
        <div className="lg:col-span-5 space-y-6 text-stone-200">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Birthday Tracker & Gift Planner</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
                <Cake className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Celebrately
              </h1>
            </div>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Never forget a loved one's special day again. Get thoughtful reminders, smart gift suggestions, and milestone tracking.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0 border border-stone-700/60 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-200">
                  Custom Reminder Intervals
                </h4>
                <p className="text-[11px] text-stone-400">
                  Browser push alerts and chime reminders 14 days, 3 days, or the morning of.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0 border border-stone-700/60 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-200">
                  Intelligent Gift Suggestions
                </h4>
                <p className="text-[11px] text-stone-400">
                  Curated recommendations matched to relationship, age, hobbies, and budget tiers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0 border border-stone-700/60 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-200">
                  Recurring Calendar Sync
                </h4>
                <p className="text-[11px] text-stone-400">
                  1-click export to Apple Calendar, Google Calendar, and Microsoft Outlook.
                </p>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="pt-3 border-t border-stone-800/80 flex items-center gap-2 text-stone-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Private & secure · Local offline persistence</span>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-7">
          <div className="bg-stone-800/90 border border-stone-700/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Quick Demo Access Bar */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-amber-300 block">
                  Quick Access Demo
                </span>
                <span className="text-[11px] text-stone-300">
                  Sign in instantly with <strong className="text-amber-200">{defaultEmail}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
              >
                <span>Instant Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-700 w-full" />
              <span className="bg-stone-800 px-3 text-[11px] text-stone-400 uppercase tracking-wider shrink-0">
                Or continue with credentials
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-stone-900/80 p-1 rounded-xl border border-stone-700/60">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Bhagabat Rout"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-3 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-300 font-semibold">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-amber-400 hover:text-amber-300 transition-colors text-[11px]"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-10 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-stone-900 border-stone-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
              >
                <span>{mode === 'signin' ? 'Sign In to Tracker' : 'Create My Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-stone-100">
            <h3 className="font-display font-bold text-lg text-white">
              Reset Your Password
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Enter your registered email address and we'll send you an instant recovery link.
            </p>

            {resetSent ? (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password reset link sent to {email}!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
