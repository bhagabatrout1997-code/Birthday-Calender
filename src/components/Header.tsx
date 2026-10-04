import React, { useState, useRef, useEffect } from 'react';
import {
  Cake,
  Bell,
  Calendar as CalendarIcon,
  Gift,
  Plus,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle,
  ExternalLink,
  Clock,
  LayoutDashboard,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Birthday, InAppNotification, UserSettings, UserProfile } from '../types';
import { calculateBirthdayStats } from '../utils/dateUtils';
import { playChime, requestNotificationPermission, isNotificationSupported } from '../utils/notifications';

interface HeaderProps {
  user: UserProfile | null;
  birthdays: Birthday[];
  notifications: InAppNotification[];
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenGiftHub: () => void;
  onSelectBirthday: (birthday: Birthday, openTab?: 'gifts' | 'wishes') => void;
  activeView: 'dashboard' | 'timeline' | 'calendar' | 'gifts';
  setActiveView: (view: 'dashboard' | 'timeline' | 'calendar' | 'gifts') => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  birthdays,
  notifications,
  onOpenAddModal,
  onOpenSettingsModal,
  onSelectBirthday,
  activeView,
  setActiveView,
  userSettings,
  onUpdateSettings,
  onMarkNotificationRead,
  onClearAllNotifications,
  onLogout,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Count upcoming within 7 days
  const upcomingThisWeek = birthdays.filter(b => {
    const stats = calculateBirthdayStats(b);
    return stats.daysUntil <= 7;
  }).length;

  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner group-hover:scale-105 transition-transform">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-lg tracking-tight text-stone-50 group-hover:text-amber-400 transition-colors">
                Celebrately
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Sparkles className="w-3 h-3" /> Birthday Tracker
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              {birthdays.length} birthdays tracked · {upcomingThisWeek > 0 ? `${upcomingThisWeek} upcoming this week` : 'All clear this week'}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center bg-stone-800/90 p-1 rounded-xl border border-stone-700/60" aria-label="View selector">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-700/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeView === 'timeline'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-700/50'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'calendar'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-700/50'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Calendar</span>
          </button>
          <button
            onClick={() => setActiveView('gifts')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'gifts'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-700/50'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Gift Hub</span>
          </button>
        </nav>

        {/* Actions Right */}
        <div className="flex items-center gap-2">
          {/* Notification Center Bell */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-stone-300 hover:text-stone-50 hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-700"
              title="Notifications & Reminders"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 text-stone-200 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 bg-stone-800/80 border-b border-stone-700/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-display font-semibold text-sm text-stone-100">
                      Reminders & Alerts
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => {
                        onUpdateSettings({ soundAlerts: !userSettings.soundAlerts });
                        if (!userSettings.soundAlerts) playChime();
                      }}
                      className="p-1 text-stone-400 hover:text-stone-200 transition-colors"
                      title={userSettings.soundAlerts ? 'Sound chime enabled' : 'Sound chime muted'}
                    >
                      {userSettings.soundAlerts ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearAllNotifications}
                        className="text-stone-400 hover:text-amber-400 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Browser permission status strip */}
                {isNotificationSupported() && Notification.permission !== 'granted' && (
                  <div className="px-3.5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs">
                    <span className="text-amber-200">Enable browser alerts for birthdays?</span>
                    <button
                      onClick={async () => {
                        const status = await requestNotificationPermission();
                        if (status === 'granted') {
                          onUpdateSettings({ enableBrowserNotifications: true });
                          playChime();
                        }
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-md transition-colors"
                    >
                      Enable
                    </button>
                  </div>
                )}

                {/* Notification Items List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-stone-800/70">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-stone-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                      <p className="text-sm font-medium text-stone-300">All caught up!</p>
                      <p className="text-xs text-stone-500 mt-1">
                        Active alerts will appear here according to your reminder intervals.
                      </p>
                    </div>
                  ) : (
                    notifications.map(n => {
                      const birthday = birthdays.find(b => b.id === n.birthdayId);
                      const isToday = n.daysUntil === 0;

                      return (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-stone-800/50 transition-colors flex items-start justify-between gap-3 ${
                            !n.read ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isToday ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
                              <p className="text-sm font-semibold text-stone-100 truncate">
                                {n.personName}
                              </p>
                              {n.ageTurning && (
                                <span className="text-xs text-stone-400">
                                  turning {n.ageTurning}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-300 mt-0.5">
                              {isToday
                                ? '🎉 Birthday is today! Send your wishes!'
                                : n.daysUntil === 1
                                ? '🎈 Birthday is tomorrow!'
                                : `🎂 Birthday in ${n.daysUntil} days (${n.dateStr})`}
                            </p>
                            {birthday && (
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <button
                                  onClick={() => {
                                    onSelectBirthday(birthday, 'gifts');
                                    setShowNotifMenu(false);
                                  }}
                                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                                >
                                  <Gift className="w-3.5 h-3.5" /> Plan Gift
                                </button>
                                <button
                                  onClick={() => {
                                    onSelectBirthday(birthday, 'wishes');
                                    setShowNotifMenu(false);
                                  }}
                                  className="text-stone-300 hover:text-stone-100 font-medium flex items-center gap-1"
                                >
                                  💌 Write Wish
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => onMarkNotificationRead(n.id)}
                            className="text-stone-500 hover:text-stone-300 p-1"
                            title="Dismiss notification"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2.5 bg-stone-800/50 border-t border-stone-800 text-center">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      onOpenSettingsModal();
                    }}
                    className="text-xs text-stone-400 hover:text-stone-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" /> Configure reminder schedules
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl text-stone-300 hover:text-stone-50 hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-700"
            title="Settings & Calendar Export"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Add Birthday CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-3 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Birthday</span>
          </button>

          {/* User Profile Dropdown Menu */}
          {user && (
            <div className="relative ml-1" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-800 transition-colors border border-stone-700/60"
                title={`${user.name} (${user.email})`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  {user.avatarEmoji || user.name.charAt(0)}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl py-2 z-50 text-stone-200 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-stone-800">
                    <p className="font-semibold text-stone-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                    <span className="text-[10px] text-amber-400/80 block mt-0.5">Member since {user.joinedDate}</span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveView('dashboard');
                      }}
                      className="w-full px-3.5 py-2 hover:bg-stone-800 text-left flex items-center gap-2 text-stone-300 hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4 text-stone-500" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenSettingsModal();
                      }}
                      className="w-full px-3.5 py-2 hover:bg-stone-800 text-left flex items-center gap-2 text-stone-300 hover:text-white"
                    >
                      <Settings className="w-4 h-4 text-stone-500" />
                      Preferences & Sync
                    </button>
                  </div>

                  <div className="border-t border-stone-800 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-3.5 py-2 hover:bg-rose-500/10 text-left flex items-center gap-2 text-rose-400 hover:text-rose-300 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
