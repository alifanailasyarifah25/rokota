import React from 'react';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  MoreHorizontal,
  PieChart,
  Plus,
  Send,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { AppView, ContentItem, ContentLifecycleStatus, WorkspaceProfile } from '../types/kontara';
import {
  formatShortDateBadge,
  formatWibTime,
  getContentLifecycleStatus,
  getTimeGreeting,
} from '../utils/kontaraStorage';
import { KontaraLogo, MediaPlatformIcon } from './KontaraBrand';

interface DashboardViewProps {
  contents: ContentItem[];
  profile: WorkspaceProfile;
  onNavigate: (view: AppView, filter?: 'Semua' | ContentLifecycleStatus) => void;
  onOpenCreate: () => void;
  onSelectContent: (item: ContentItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contents,
  profile,
  onNavigate,
  onOpenCreate,
  onSelectContent,
}) => {
  const greeting = getTimeGreeting();

  const totalCount = contents.length;
  const scheduledCount = contents.filter(
    (c) => getContentLifecycleStatus(c) === 'Terjadwal'
  ).length;
  const publishedCount = contents.filter((c) => {
    const st = getContentLifecycleStatus(c);
    return st === 'Terbit' || st === 'Selesai';
  }).length;
  const waitingReviewCount = contents.filter(
    (c) =>
      getContentLifecycleStatus(c) === 'Menunggu Review' ||
      c.stageStatuses.kesesuaian === 'Dalam Proses'
  ).length;

  // Pick nearest upcoming/today item for "Kalender Singkat"
  const sortedUpcoming = [...contents].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  );
  const highlightItem =
    sortedUpcoming.find((c) => c.date >= '2026-11-24') ?? sortedUpcoming[0];

  const mainMenuItems: {
    id: string;
    label: string;
    tone: 'pink' | 'sage';
    icon: React.ReactNode;
    onClick: () => void;
  }[] = [
    {
      id: 'buat',
      label: 'Buat Konten',
      tone: 'pink',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#7B9980] text-white flex items-center justify-center shadow-sm">
          <Plus size={20} strokeWidth={2.5} />
        </div>
      ),
      onClick: onOpenCreate,
    },
    {
      id: 'kalender',
      label: 'Kalender Konten',
      tone: 'sage',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-white/85 text-[#6E8B73] flex items-center justify-center shadow-sm">
          <CalendarDays size={20} />
        </div>
      ),
      onClick: () => onNavigate('kalender'),
    },
    {
      id: 'monitoring',
      label: 'Media Monitoring',
      tone: 'pink',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-white/85 text-[#7F5B71] flex items-center justify-center shadow-sm">
          <BarChart3 size={20} />
        </div>
      ),
      onClick: () => onNavigate('monitoring'),
    },
    {
      id: 'evaluasi',
      label: 'Evaluasi',
      tone: 'sage',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-white/85 text-[#6E8B73] flex items-center justify-center shadow-sm">
          <PieChart size={20} />
        </div>
      ),
      onClick: () => onNavigate('evaluasi'),
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      tone: 'pink',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-white/85 text-[#7F5B71] flex items-center justify-center shadow-sm">
          <Settings size={20} />
        </div>
      ),
      onClick: () => onNavigate('pengaturan'),
    },
    {
      id: 'lainnya',
      label: 'Alur & Lainnya',
      tone: 'sage',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-white/85 text-[#6E8B73] flex items-center justify-center shadow-sm">
          <MoreHorizontal size={20} />
        </div>
      ),
      onClick: () => onNavigate('alur'),
    },
  ];

  return (
    <div className="pb-6">
      {/* Top White Dome Header matching Sketch 2 */}
      <section className="bg-white rounded-b-[32px] lg:rounded-3xl px-5 pt-5 pb-7 shadow-[0_8px_24px_-12px_rgba(127,91,113,0.18)] border-b border-[#EFE3EA] lg:border">
        <div className="flex items-center justify-between mb-4">
          <KontaraLogo showText />
          <button
            type="button"
            onClick={() => onNavigate('alur')}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#F6E4EE] hover:bg-[#EED0E1] text-[#634558] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Siklus Iteratif
          </button>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#6F5164] leading-tight">
          {greeting}
        </h1>
        <p className="mt-1.5 text-sm font-light text-[#6E5766] max-w-xl">
          Mari rencanakan strategi komunikasi berikutnya untuk{' '}
          <span className="font-medium text-[#5D4353]">{profile.orgName}</span>.
        </p>
      </section>

      {/* Main Gradient Canvas Body */}
      <div className="px-4 sm:px-6 lg:px-0 mt-5 space-y-6">
        {/* 2x2 / 4-column Stat Cards */}
        <section aria-label="Ringkasan Status Konten">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate('kalender', 'Semua')}
              className="text-left bg-white/85 hover:bg-white rounded-2xl p-4 shadow-[0_4px_16px_-6px_rgba(127,91,113,0.16)] border border-[#EEDCE6] transition-transform active:scale-[0.98] cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#DCE9DD] text-[#5B7860] flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold text-[#634558] tabular-nums leading-none">
                  {totalCount}
                </div>
                <div className="text-xs font-medium text-[#7D6674] mt-1 truncate">
                  Total Konten
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('kalender', 'Terjadwal')}
              className="text-left bg-white/85 hover:bg-white rounded-2xl p-4 shadow-[0_4px_16px_-6px_rgba(127,91,113,0.16)] border border-[#EEDCE6] transition-transform active:scale-[0.98] cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#DCE9DD] text-[#5B7860] flex items-center justify-center shrink-0">
                <Send size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold text-[#634558] tabular-nums leading-none">
                  {scheduledCount}
                </div>
                <div className="text-xs font-medium text-[#7D6674] mt-1 truncate">
                  Terjadwal
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('kalender', 'Terbit')}
              className="text-left bg-white/85 hover:bg-white rounded-2xl p-4 shadow-[0_4px_16px_-6px_rgba(127,91,113,0.16)] border border-[#EEDCE6] transition-transform active:scale-[0.98] cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#DCE9DD] text-[#5B7860] flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold text-[#634558] tabular-nums leading-none">
                  {publishedCount}
                </div>
                <div className="text-xs font-medium text-[#7D6674] mt-1 truncate">
                  Telah Terbit
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('kalender', 'Menunggu Review')}
              className="text-left bg-white/85 hover:bg-white rounded-2xl p-4 shadow-[0_4px_16px_-6px_rgba(127,91,113,0.16)] border border-[#EEDCE6] transition-transform active:scale-[0.98] cursor-pointer flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#DCE9DD] text-[#5B7860] flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold text-[#634558] tabular-nums leading-none">
                  {waitingReviewCount}
                </div>
                <div className="text-xs font-medium text-[#7D6674] mt-1 truncate">
                  Menunggu Review
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Kalender Singkat */}
        <section aria-labelledby="kalender-singkat-heading">
          <div className="flex items-center justify-between mb-3">
            <h2
              id="kalender-singkat-heading"
              className="font-display text-lg font-bold text-[#634558]"
            >
              Kalender Singkat
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('kalender')}
              className="inline-flex items-center gap-1 min-h-[40px] px-2 text-xs font-semibold text-[#6F5164] hover:text-[#4A3542] transition-colors cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {highlightItem ? (
            <button
              type="button"
              onClick={() => onSelectContent(highlightItem)}
              className="w-full text-left bg-[#F7E9F1] hover:bg-[#F3DFEB] border border-[#E6CEDC] rounded-3xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-colors shadow-[0_4px_14px_-6px_rgba(127,91,113,0.14)] cursor-pointer group"
            >
              {/* Dusty purple date square */}
              <div className="w-16 h-16 rounded-2xl bg-[#9F6A8C] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="font-display text-xl font-bold leading-none tabular-nums">
                  {formatShortDateBadge(highlightItem.date).day}
                </span>
                <span className="text-xs font-medium mt-1 opacity-95">
                  {formatShortDateBadge(highlightItem.date).month}
                </span>
              </div>

              <MediaPlatformIcon media={highlightItem.media} size="md" />

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#7B6271] truncate">
                  {highlightItem.media} · {formatWibTime(highlightItem.time)}
                </div>
                <div className="font-display text-sm sm:text-base font-bold text-[#4A3542] truncate mt-0.5">
                  {highlightItem.title}
                </div>
                <div className="text-xs text-[#7D6674] truncate mt-0.5">
                  {getContentLifecycleStatus(highlightItem)} · Siklus #{highlightItem.cycleNumber}
                </div>
              </div>

              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#9F6A8C] group-hover:translate-x-0.5 transition-transform shrink-0">
                <ChevronRight size={22} strokeWidth={2.5} />
              </div>
            </button>
          ) : (
            <div className="bg-white/80 border border-[#EEDCE6] rounded-3xl p-5 text-center">
              <p className="text-sm text-[#7D6674]">
                Belum ada jadwal konten yang tersimpan.
              </p>
              <button
                type="button"
                onClick={onOpenCreate}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7B9980] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus size={14} />
                <span>Buat Konten Pertama</span>
              </button>
            </div>
          )}
        </section>

        {/* Menu Utama (3x2 grid matching Sketch 2) */}
        <section aria-labelledby="menu-utama-heading">
          <h2
            id="menu-utama-heading"
            className="font-display text-lg font-bold text-[#634558] mb-3"
          >
            Menu Utama
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {mainMenuItems.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={tile.onClick}
                className={`min-h-[104px] rounded-2xl p-3 flex flex-col items-center justify-center gap-2.5 border transition-transform active:scale-[0.97] cursor-pointer shadow-[0_4px_14px_-8px_rgba(74,53,66,0.18)] ${
                  tile.tone === 'pink'
                    ? 'bg-[#F8E7F0] hover:bg-[#F3DCE8] border-[#E7CEDB] text-[#5D4353]'
                    : 'bg-[#C9DACB] hover:bg-[#BCD1BF] border-[#B4CBB7] text-[#3F5743]'
                }`}
              >
                {tile.icon}
                <span className="text-xs font-semibold text-center leading-tight">
                  {tile.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
