import {
  ContentItem,
  ContentLifecycleStatus,
  NotificationItem,
  WorkspaceProfile,
} from '../types/kontara';
import { DEFAULT_PROFILE, INITIAL_CONTENTS, INITIAL_NOTIFICATIONS } from '../data/seedData';

const CONTENTS_KEY = 'kontara_contents_v1';
const NOTIFICATIONS_KEY = 'kontara_notifications_v1';
const PROFILE_KEY = 'kontara_profile_v1';

export function loadContents(): ContentItem[] {
  try {
    const raw = localStorage.getItem(CONTENTS_KEY);
    if (!raw) {
      localStorage.setItem(CONTENTS_KEY, JSON.stringify(INITIAL_CONTENTS));
      return INITIAL_CONTENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CONTENTS;
  } catch {
    return INITIAL_CONTENTS;
  }
}

export function saveContents(items: ContentItem[]): void {
  try {
    localStorage.setItem(CONTENTS_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(items: NotificationItem[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadProfile(): WorkspaceProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: WorkspaceProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function getContentLifecycleStatus(item: ContentItem): ContentLifecycleStatus {
  const s = item.stageStatuses;
  if (s.evaluasi === 'Selesai') return 'Selesai';
  if (s.publikasi === 'Selesai') return 'Terbit';
  if (s.review === 'Menunggu Review') return 'Menunggu Review';
  if (s.kesesuaian === 'Selesai' && s.review === 'Selesai') return 'Terjadwal';
  return 'Dalam Proses';
}

export const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const BULAN_SINGKAT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export const HARI_SINGKAT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function formatIndonesianDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${d} ${BULAN_INDONESIA[m - 1]} ${y}`;
}

export function formatShortDateBadge(dateStr: string): { day: string; month: string } {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return { day: '--', month: '' };
  return {
    day: String(d),
    month: BULAN_SINGKAT[m - 1] ?? '',
  };
}

export function formatWibTime(timeStr: string): string {
  if (!timeStr) return '12.00 WIB';
  return `${timeStr.replace(':', '.')} WIB`;
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat Pagi!';
  if (hour >= 11 && hour < 15) return 'Selamat Siang!';
  if (hour >= 15 && hour < 18) return 'Selamat Sore!';
  return 'Selamat Malam!';
}
