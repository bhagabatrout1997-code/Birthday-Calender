import { Birthday, InAppNotification, UserSettings } from '../types';
import { calculateBirthdayStats } from './dateUtils';

// Gentle acoustic synthesizer chime using Web Audio API
export function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 celebratory harmonic arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
    });
  } catch (e) {
    console.warn('Audio chime playback suppressed:', e);
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

export function sendBrowserNotification(title: string, body: string, onClick?: () => void) {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  try {
    const notif = new Notification(title, {
      body,
      icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h2a4 4 0 0 1 4 4v1H5v-1a4 4 0 0 1 4-4h2V5.72A2 2 0 0 1 12 2zM3 14h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6zm3 2v4h12v-4H6z"/></svg>',
      tag: 'celebrately-reminder',
    });

    if (onClick) {
      notif.onclick = () => {
        window.focus();
        onClick();
        notif.close();
      };
    }
  } catch (err) {
    console.warn('Browser notification send error:', err);
  }
}

// Evaluate reminders for all birthdays and generate in-app notifications
export function evaluateReminders(
  birthdays: Birthday[],
  settings: UserSettings
): InAppNotification[] {
  const notifications: InAppNotification[] = [];
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  birthdays.forEach((b) => {
    const stats = calculateBirthdayStats(b, today);
    const thresholds = b.remindDaysBefore && b.remindDaysBefore.length > 0
      ? b.remindDaysBefore
      : settings.defaultReminderDays;

    if (thresholds.includes(stats.daysUntil)) {
      const notifId = `reminder-${b.id}-${dateKey}-${stats.daysUntil}d`;
      notifications.push({
        id: notifId,
        birthdayId: b.id,
        personName: b.name,
        daysUntil: stats.daysUntil,
        ageTurning: stats.ageTurning,
        dateStr: stats.formattedNextDate,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Sort by urgency: 0 days (today) first, then 1 day, then 3, etc.
  return notifications.sort((a, b) => a.daysUntil - b.daysUntil);
}
