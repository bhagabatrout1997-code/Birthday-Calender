import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Cake,
  Calendar,
  Gift,
  Plus,
  ArrowUpDown,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { Birthday, InAppNotification, UserSettings, Relationship, UserProfile, ActivityLogItem } from './types';
import { getInitialBirthdays } from './data/initialBirthdays';
import { calculateBirthdayStats, parseBirthDate, MONTH_NAMES, generateICSContent, downloadICSFile } from './utils/dateUtils';
import {
  evaluateReminders,
  playChime,
  sendBrowserNotification,
  isNotificationSupported
} from './utils/notifications';
import { Header } from './components/Header';
import { TodayHero } from './components/TodayHero';
import { BirthdayCard } from './components/BirthdayCard';
import { CalendarView } from './components/CalendarView';
import { GiftPlannerHub } from './components/GiftPlannerHub';
import { DashboardView } from './components/DashboardView';
import { LoginPage } from './components/LoginPage';
import { GiftSuggestionsModal } from './components/GiftSuggestionsModal';
import { GreetingGeneratorModal } from './components/GreetingGeneratorModal';
import { BirthdayFormModal } from './components/BirthdayFormModal';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_SETTINGS: UserSettings = {
  defaultReminderDays: [0, 1, 3, 7],
  enableBrowserNotifications: false,
  soundAlerts: true,
  currency: '$',
  themePreference: 'warm',
};

const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    type: 'gift_saved',
    title: 'Gift idea saved for Maya Lin',
    description: 'Added Handmade Ceramic Pour-Over Dripper ($48)',
    timestamp: '2 hours ago',
  },
  {
    id: 'log-2',
    type: 'birthday_added',
    title: 'New milestone birthday tracked',
    description: 'Marcus Vance turns 30 on Saturday',
    timestamp: 'Yesterday',
  },
  {
    id: 'log-3',
    type: 'gift_status',
    title: 'Gift marked as planned',
    description: 'Solid Brass Haws Heritage Watering Can for Mom',
    timestamp: '3 days ago',
  },
];

export default function App() {
  // Auth user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('celebrately_auth_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {}
    // Default to authenticated demo user so experience is immediate, or user can sign out to test Login page!
    return {
      id: 'demo-user-1',
      name: 'Bhagabat Rout',
      email: 'bhagabatrout1997@gmail.com',
      avatarEmoji: '✨',
      avatarColor: 'bg-amber-500',
      joinedDate: 'Oct 2026',
    };
  });

  // Load birthdays from localStorage or seed
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    try {
      const saved = localStorage.getItem('celebrately_birthdays');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved birthdays:', e);
    }
    return getInitialBirthdays();
  });

  // Load user settings from localStorage
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('celebrately_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  // Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('celebrately_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ACTIVITY_LOGS;
  });

  // In-app notifications list
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  // Navigation & filtering state (Default to 'dashboard')
  const [activeView, setActiveView] = useState<'dashboard' | 'timeline' | 'calendar' | 'gifts'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'upcoming' | 'name' | 'age'>('upcoming');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [giftModalBirthday, setGiftModalBirthday] = useState<Birthday | null>(null);
  const [greetingModalBirthday, setGreetingModalBirthday] = useState<Birthday | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync auth user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('celebrately_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('celebrately_auth_user');
    }
  }, [currentUser]);

  // Sync birthdays on change
  useEffect(() => {
    localStorage.setItem('celebrately_birthdays', JSON.stringify(birthdays));
  }, [birthdays]);

  // Sync settings on change
  useEffect(() => {
    localStorage.setItem('celebrately_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Sync activity logs
  useEffect(() => {
    localStorage.setItem('celebrately_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Evaluate reminders and trigger notifications
  useEffect(() => {
    const alerts = evaluateReminders(birthdays, userSettings);
    setNotifications(alerts);

    // If there is a birthday today and browser notifications are enabled, trigger alert
    const todayAlert = alerts.find(a => a.daysUntil === 0);
    if (todayAlert && userSettings.enableBrowserNotifications && isNotificationSupported()) {
      const alertedKey = `celebrately_alerted_${todayAlert.id}`;
      if (!sessionStorage.getItem(alertedKey)) {
        sessionStorage.setItem(alertedKey, 'true');
        sendBrowserNotification(
          `🎂 ${todayAlert.personName}'s Birthday is Today!`,
          `Don't forget to celebrate and send your warm wishes!`
        );
        if (userSettings.soundAlerts) {
          playChime();
        }
      }
    }
  }, [birthdays, userSettings]);

  function logActivity(item: Omit<ActivityLogItem, 'id' | 'timestamp'>) {
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      ...item,
    };
    setActivityLogs([newLog, ...activityLogs.slice(0, 15)]);
  }

  function handleLogin(user: UserProfile) {
    setCurrentUser(user);
    setActiveView('dashboard');
    playChime();
  }

  function handleLogout() {
    setCurrentUser(null);
  }

  function handleSaveBirthday(saved: Birthday) {
    if (editingBirthday) {
      setBirthdays(birthdays.map(b => (b.id === saved.id ? saved : b)));
      logActivity({
        type: 'birthday_edited',
        title: `Updated details for ${saved.name}`,
        description: `Circle: ${saved.relationship}`,
      });
    } else {
      setBirthdays([saved, ...birthdays]);
      logActivity({
        type: 'birthday_added',
        title: `Added ${saved.name} to tracker`,
        description: `${saved.relationship} · Birthday: ${saved.birthDate}`,
      });
    }
    setEditingBirthday(null);
  }

  function handleDeleteBirthday(id: string) {
    if (confirm('Are you sure you want to remove this birthday?')) {
      const target = birthdays.find(b => b.id === id);
      setBirthdays(birthdays.filter(b => b.id !== id));
      if (target) {
        logActivity({
          type: 'birthday_edited',
          title: `Removed ${target.name} from tracker`,
          description: 'Contact celebration deleted',
        });
      }
    }
  }

  function handleUpdateBirthday(updated: Birthday) {
    setBirthdays(birthdays.map(b => (b.id === updated.id ? updated : b)));
    // Keep active modal updated
    if (giftModalBirthday && giftModalBirthday.id === updated.id) {
      setGiftModalBirthday(updated);
    }
    logActivity({
      type: 'gift_saved',
      title: `Updated gifts for ${updated.name}`,
      description: `${(updated.savedGifts || []).length} gifts tracked`,
    });
  }

  function handleExportICS() {
    const ics = generateICSContent(birthdays);
    downloadICSFile('celebrately-birthdays.ics', ics);
  }

  function handleRestoreSamples() {
    const samples = getInitialBirthdays();
    setBirthdays(samples);
  }

  function handleImportBirthdays(imported: Birthday[]) {
    setBirthdays(imported);
  }

  function handleMarkNotificationRead(id: string) {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  }

  function handleClearAllNotifications() {
    setNotifications([]);
  }

  // If not logged in, render Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        defaultEmail="bhagabatrout1997@gmail.com"
      />
    );
  }

  // Filter & sort birthdays for timeline
  const filteredBirthdays = birthdays.filter((b) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = b.name.toLowerCase().includes(q);
      const matchesNotes = b.notes?.toLowerCase().includes(q);
      const matchesInterests = b.interests?.some(i => i.toLowerCase().includes(q));
      if (!matchesName && !matchesNotes && !matchesInterests) return false;
    }

    // Relationship filter
    if (selectedRelationship !== 'all') {
      if (b.relationship.toLowerCase() !== selectedRelationship.toLowerCase()) {
        return false;
      }
    }

    // Month filter
    if (selectedMonth !== 'all') {
      const { month } = parseBirthDate(b.birthDate);
      if (month !== parseInt(selectedMonth, 10)) {
        return false;
      }
    }

    return true;
  });

  // Sort
  filteredBirthdays.sort((a, b) => {
    const statsA = calculateBirthdayStats(a);
    const statsB = calculateBirthdayStats(b);

    if (sortBy === 'upcoming') {
      return statsA.daysUntil - statsB.daysUntil;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'age') {
      const ageA = statsA.ageTurning || 0;
      const ageB = statsB.ageTurning || 0;
      return ageB - ageA;
    }
    return 0;
  });

  // Group filtered into buckets for structured visual rhythm
  const thisWeekBirthdays = filteredBirthdays.filter(b => calculateBirthdayStats(b).daysUntil <= 7);
  const thisMonthBirthdays = filteredBirthdays.filter(b => {
    const d = calculateBirthdayStats(b).daysUntil;
    return d > 7 && d <= 30;
  });
  const laterBirthdays = filteredBirthdays.filter(b => calculateBirthdayStats(b).daysUntil > 30);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Header */}
      <Header
        user={currentUser}
        birthdays={birthdays}
        notifications={notifications}
        onOpenAddModal={() => {
          setEditingBirthday(null);
          setIsFormModalOpen(true);
        }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenGiftHub={() => setActiveView('gifts')}
        onSelectBirthday={(b, tab) => {
          if (tab === 'gifts') setGiftModalBirthday(b);
          else if (tab === 'wishes') setGreetingModalBirthday(b);
        }}
        activeView={activeView}
        setActiveView={setActiveView}
        userSettings={userSettings}
        onUpdateSettings={(updated) => setUserSettings({ ...userSettings, ...updated })}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* VIEW: DASHBOARD */}
        {activeView === 'dashboard' && (
          <DashboardView
            user={currentUser}
            birthdays={birthdays}
            activityLogs={activityLogs}
            onOpenAddModal={() => {
              setEditingBirthday(null);
              setIsFormModalOpen(true);
            }}
            onOpenGiftModal={(b) => setGiftModalBirthday(b)}
            onOpenGreetingModal={(b) => setGreetingModalBirthday(b)}
            onNavigateToView={(view) => setActiveView(view)}
            onExportICS={handleExportICS}
          />
        )}

        {/* VIEW: TIMELINE / DIRECTORY */}
        {activeView === 'timeline' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Spotlight Countdown / Today Banner */}
            <TodayHero
              birthdays={birthdays}
              onOpenGiftModal={(b) => setGiftModalBirthday(b)}
              onOpenGreetingModal={(b) => setGreetingModalBirthday(b)}
            />

            {/* Filter Toolbar */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name, interests, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Month Dropdown & Sort */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 font-medium focus:outline-none"
                  >
                    <option value="all">All Months</option>
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 font-medium focus:outline-none"
                  >
                    <option value="upcoming">Sort: Next Upcoming</option>
                    <option value="name">Sort: Name (A-Z)</option>
                    <option value="age">Sort: Age Turning</option>
                  </select>
                </div>
              </div>

              {/* Relationship Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
                {[
                  { id: 'all', label: 'All Circles' },
                  { id: 'family', label: 'Family' },
                  { id: 'friend', label: 'Friends' },
                  { id: 'partner', label: 'Partner' },
                  { id: 'colleague', label: 'Colleagues' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedRelationship(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedRelationship === item.id
                        ? 'bg-stone-900 text-stone-100 font-semibold shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Birthday Cards Section */}
            {filteredBirthdays.length === 0 ? (
              <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center text-stone-500">
                <Cake className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                <h3 className="font-display font-semibold text-stone-800 text-lg">
                  No birthdays match your search
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your circle filters or add a new birthday to start tracking!
                </p>
                <button
                  onClick={() => {
                    setEditingBirthday(null);
                    setIsFormModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  + Add New Birthday
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Group: Coming up this week */}
                {thisWeekBirthdays.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span>This Week ({thisWeekBirthdays.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {thisWeekBirthdays.map((b) => (
                        <BirthdayCard
                          key={b.id}
                          birthday={b}
                          onEdit={(item) => {
                            setEditingBirthday(item);
                            setIsFormModalOpen(true);
                          }}
                          onDelete={handleDeleteBirthday}
                          onOpenGifts={(item) => setGiftModalBirthday(item)}
                          onOpenWishes={(item) => setGreetingModalBirthday(item)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Group: Next 30 Days */}
                {thisMonthBirthdays.length > 0 && (
                  <section className="space-y-3">
                    <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      <span>Next 30 Days ({thisMonthBirthdays.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {thisMonthBirthdays.map((b) => (
                        <BirthdayCard
                          key={b.id}
                          birthday={b}
                          onEdit={(item) => {
                            setEditingBirthday(item);
                            setIsFormModalOpen(true);
                          }}
                          onDelete={handleDeleteBirthday}
                          onOpenGifts={(item) => setGiftModalBirthday(item)}
                          onOpenWishes={(item) => setGreetingModalBirthday(item)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Group: Later This Year */}
                {laterBirthdays.length > 0 && (
                  <section className="space-y-3">
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      <span>Later in the Year ({laterBirthdays.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {laterBirthdays.map((b) => (
                        <BirthdayCard
                          key={b.id}
                          birthday={b}
                          onEdit={(item) => {
                            setEditingBirthday(item);
                            setIsFormModalOpen(true);
                          }}
                          onDelete={handleDeleteBirthday}
                          onOpenGifts={(item) => setGiftModalBirthday(item)}
                          onOpenWishes={(item) => setGreetingModalBirthday(item)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW: CALENDAR */}
        {activeView === 'calendar' && (
          <CalendarView
            birthdays={birthdays}
            onOpenGiftModal={(b) => setGiftModalBirthday(b)}
            onOpenGreetingModal={(b) => setGreetingModalBirthday(b)}
          />
        )}

        {/* VIEW: GIFT HUB */}
        {activeView === 'gifts' && (
          <GiftPlannerHub
            birthdays={birthdays}
            onOpenGiftModal={(b) => setGiftModalBirthday(b)}
            onUpdateBirthday={handleUpdateBirthday}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cake className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-stone-800">Celebrately</span>
            <span>· Signed in as {currentUser.email}</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setActiveView('dashboard')}
              className="hover:text-stone-700 transition-colors"
            >
              Dashboard
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('gifts')}
              className="hover:text-stone-700 transition-colors"
            >
              Gift Hub
            </button>
            <span>·</span>
            <button
              onClick={handleLogout}
              className="hover:text-rose-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isFormModalOpen && (
        <BirthdayFormModal
          isOpen={isFormModalOpen}
          initialData={editingBirthday}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingBirthday(null);
          }}
          onSave={handleSaveBirthday}
        />
      )}

      {giftModalBirthday && (
        <GiftSuggestionsModal
          birthday={giftModalBirthday}
          isOpen={!!giftModalBirthday}
          onClose={() => setGiftModalBirthday(null)}
          onUpdateBirthday={handleUpdateBirthday}
        />
      )}

      {greetingModalBirthday && (
        <GreetingGeneratorModal
          birthday={greetingModalBirthday}
          isOpen={!!greetingModalBirthday}
          onClose={() => setGreetingModalBirthday(null)}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          birthdays={birthdays}
          userSettings={userSettings}
          onClose={() => setIsSettingsModalOpen(false)}
          onUpdateSettings={(updated) => setUserSettings({ ...userSettings, ...updated })}
          onRestoreSamples={handleRestoreSamples}
          onImportBirthdays={handleImportBirthdays}
        />
      )}
    </div>
  );
}
