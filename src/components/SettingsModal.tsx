import React, { useRef, useState } from 'react';
import {
  X,
  Bell,
  Volume2,
  Calendar,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { Birthday, UserSettings } from '../types';
import { generateICSContent, downloadICSFile } from '../utils/dateUtils';
import {
  playChime,
  requestNotificationPermission,
  sendBrowserNotification,
  isNotificationSupported,
  getNotificationPermission
} from '../utils/notifications';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthdays: Birthday[];
  userSettings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onRestoreSamples: () => void;
  onImportBirthdays: (imported: Birthday[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  birthdays,
  userSettings,
  onUpdateSettings,
  onRestoreSamples,
  onImportBirthdays,
}) => {
  const [testAlertSent, setTestAlertSent] = useState(false);
  const [permissionState, setPermissionState] = useState(getNotificationPermission());
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  async function handleEnableBrowserNotifications() {
    const perm = await requestNotificationPermission();
    setPermissionState(perm);
    if (perm === 'granted') {
      onUpdateSettings({ enableBrowserNotifications: true });
      playChime();
      sendBrowserNotification('🎉 Celebrately Notifications Enabled!', 'You will receive reminders before birthdays arrive.');
    }
  }

  function handleTestNotification() {
    playChime();
    sendBrowserNotification(
      '🎂 Test Birthday Reminder',
      'Maya Lin turns 29 in 2 days! Tap to view gift ideas.'
    );
    setTestAlertSent(true);
    setTimeout(() => setTestAlertSent(false), 3000);
  }

  function handleExportICS() {
    const icsString = generateICSContent(birthdays);
    downloadICSFile('celebrately-birthdays.ics', icsString);
  }

  function handleExportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(birthdays, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `celebrately-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportBirthdays(parsed);
          alert(`Successfully imported ${parsed.length} birthdays!`);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-display font-bold text-stone-50">
              Notification & App Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-stone-700">
          {/* Section: Notification Reminders */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              Browser Notifications & Audio Chimes
            </h3>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900 block">
                    Browser Push Notifications
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    Status: <span className="font-medium text-stone-700">{permissionState}</span>
                  </span>
                </div>

                {permissionState === 'granted' ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Granted
                  </span>
                ) : (
                  <button
                    onClick={handleEnableBrowserNotifications}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg shadow-2xs transition-colors"
                  >
                    Enable Alerts
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/70">
                <div>
                  <span className="font-semibold text-stone-900 block">
                    Celebratory Audio Chime
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    Harmonic synthesizer chime when birthdays arrive
                  </span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ soundAlerts: !userSettings.soundAlerts })}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    userSettings.soundAlerts
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {userSettings.soundAlerts ? 'On' : 'Muted'}
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleTestNotification}
                  className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {testAlertSent ? 'Chime Played & Alert Triggered!' : 'Test Sound & Notification Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Section: Calendar Export (ICS) */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Calendar Export (.ICS)
            </h3>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
              <p className="text-stone-600 text-xs">
                Export all {birthdays.length} birthdays as annual recurring calendar events. Compatible with Apple Calendar, Google Calendar, and Microsoft Outlook.
              </p>
              <button
                onClick={handleExportICS}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                Download .ICS Calendar File
              </button>
            </div>
          </div>

          {/* Section: Data Backup & Sample Reset */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-stone-600" />
              Backup, Restore & Samples
            </h3>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-medium rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-medium rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Import JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".json"
                  className="hidden"
                />

                <button
                  onClick={() => {
                    if (confirm('Reset tracker to initial sample contacts?')) {
                      onRestoreSamples();
                    }
                  }}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 rounded-xl transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Samples
                </button>
              </div>
            </div>
          </div>
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
