import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Search,
} from 'lucide-react';
import { ContentItem, ContentLifecycleStatus } from '../types/kontara';
import {
  BULAN_INDONESIA,
  HARI_SINGKAT,
  formatIndonesianDate,
  formatWibTime,
  getContentLifecycleStatus,
} from '../utils/kontaraStorage';
import {
  KontaraLogo,
  LifecycleStatusBadge,
  MediaPlatformIcon,
} from './KontaraBrand';

interface CalendarViewProps {
  contents: ContentItem[];
  initialMode?: 'kalender' | 'menu';
  initialFilter?: 'Semua' | ContentLifecycleStatus;
  onBackHome: () => void;
  onSelectContent: (item: ContentItem) => void;
  onOpenCreateForDate: (dateStr: string) => void;
}

const FILTER_OPTIONS: ('Semua' | ContentLifecycleStatus)[] = [
  'Semua',
  'Dalam Proses',
  'Menunggu Review',
  'Terjadwal',
  'Terbit',
  'Selesai',
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  contents,
  initialMode = 'kalender',
  initialFilter = 'Semua',
  onBackHome,
  onSelectContent,
  onOpenCreateForDate,
}) => {
  const [mode, setMode] = useState<'kalender' | 'menu'>(initialMode);
  const [statusFilter, setStatusFilter] = useState<'Semua' | ContentLifecycleStatus>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  // Default to November 2026 (current date: 2026-11-24)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedDate, setSelectedDate] = useState('2026-11-24');

  // Sync external initialFilter if passed
  React.useEffect(() => {
    setStatusFilter(initialFilter);
  }, [initialFilter]);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: { day: number | null; dateStr: string | null }[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, dateStr: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(viewMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      cells.push({ day: d, dateStr: `${viewYear}-${mm}-${dd}` });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, dateStr: null });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const contentsByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const item of contents) {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    }
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.time.localeCompare(b.time))
    );
    return map;
  }, [contents]);

  const selectedDayContents = contentsByDate[selectedDate] ?? [];

  const filteredMenuContents = useMemo(() => {
    return [...contents]
      .filter((item) => {
        const st = getContentLifecycleStatus(item);
        const matchesStatus = statusFilter === 'Semua' || st === statusFilter;
        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.media.toLowerCase().includes(q) ||
          item.format.toLowerCase().includes(q) ||
          item.purpose.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [contents, statusFilter, searchQuery]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-0 pt-4 pb-8 space-y-5">
      {/* Top Bar matching Sketch 3 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackHome}
            aria-label="Kembali ke Beranda"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#5B7860] hover:bg-[#DCE9DD]/60 transition-colors cursor-pointer"
          >
            <ChevronLeft size={26} strokeWidth={2.5} />
          </button>
          <KontaraLogo compact showText />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#6F5164] tracking-tight">
          Kalender Konten
        </h1>
        <p className="text-sm font-light text-[#6E5766] mt-0.5">
          Atur dan pantau jadwal publikasi konten kamu
        </p>
      </div>

      {/* Segmented Toggle: Kalender | Menu (Sketch 3 & 4) */}
      <div
        role="tablist"
        aria-label="Tampilan Kalender atau Menu"
        className="grid grid-cols-2 p-1 rounded-full bg-[#DCE6DC] border-2 border-[#A67F96] max-w-md"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'kalender'}
          onClick={() => setMode('kalender')}
          className={`min-h-[40px] rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            mode === 'kalender'
              ? 'bg-white text-[#634558] shadow-sm border border-[#A67F96]/40'
              : 'text-[#5A4B54] hover:text-[#4A3542]'
          }`}
        >
          Kalender
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'menu'}
          onClick={() => setMode('menu')}
          className={`min-h-[40px] rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            mode === 'menu'
              ? 'bg-white text-[#634558] shadow-sm border border-[#A67F96]/40'
              : 'text-[#5A4B54] hover:text-[#4A3542]'
          }`}
        >
          Menu
        </button>
      </div>

      {mode === 'kalender' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar Grid Column */}
          <div className="lg:col-span-7 bg-white/85 rounded-3xl p-4 sm:p-5 border border-[#E7CEDB] shadow-[0_6px_20px_-10px_rgba(127,91,113,0.16)]">
            {/* Month Switcher */}
            <div className="flex items-center justify-between mb-4 px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#9F6A8C] hover:bg-[#F6E4EE] transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#6F5164]">
                {BULAN_INDONESIA[viewMonth]} {viewYear}
              </h2>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#9F6A8C] hover:bg-[#F6E4EE] transition-colors cursor-pointer"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </div>

            {/* Day Headers + Grid */}
            <div className="rounded-xl overflow-hidden border border-[#C3A7B8]">
              <div className="grid grid-cols-7 bg-[#DCE6DC] border-b border-[#C3A7B8]">
                {HARI_SINGKAT.map((hari) => (
                  <div
                    key={hari}
                    className="py-2 text-center text-[11px] font-bold text-[#4A3542] border-r last:border-r-0 border-[#C3A7B8]"
                  >
                    {hari}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {calendarCells.map((cell, idx) => {
                  if (!cell.day || !cell.dateStr) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="h-12 sm:h-14 bg-[#FBF4F8] border-r border-b border-[#D5BAC9] last:border-r-0"
                      />
                    );
                  }

                  const dayItems = contentsByDate[cell.dateStr] ?? [];
                  const isSelected = cell.dateStr === selectedDate;
                  const isToday = cell.dateStr === '2026-11-24';

                  return (
                    <button
                      key={cell.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(cell.dateStr!)}
                      className={`h-12 sm:h-14 p-1.5 flex flex-col justify-between items-start border-r border-b border-[#D5BAC9] transition-colors cursor-pointer relative text-left ${
                        isSelected
                          ? 'bg-[#D3CFD4] ring-2 ring-inset ring-[#8A657C]'
                          : 'bg-[#F8E7F0] hover:bg-[#F2DCE8]'
                      }`}
                    >
                      <span
                        className={`text-[11px] font-semibold tabular-nums leading-none ${
                          isToday
                            ? 'text-[#3F5743] font-extrabold underline decoration-[#7B9980] decoration-2 underline-offset-2'
                            : 'text-[#5D4353]'
                        }`}
                      >
                        {cell.day}
                      </span>

                      {dayItems.length > 0 && (
                        <div className="w-full flex items-center justify-end gap-1">
                          <span className="px-1.5 py-0.5 rounded-md bg-[#8A657C] text-white text-[9px] font-bold tabular-nums leading-none">
                            {dayItems.length}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Day Content Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#634558]">
                {selectedDate === '2026-11-24'
                  ? 'Konten Hari Ini'
                  : `Konten · ${formatIndonesianDate(selectedDate)}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('Semua');
                  setMode('menu');
                }}
                className="inline-flex items-center gap-1 min-h-[40px] px-2 text-xs font-semibold text-[#6F5164] hover:text-[#4A3542] cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {selectedDayContents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayContents.map((item) => {
                  const status = getContentLifecycleStatus(item);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectContent(item)}
                      className="w-full text-left bg-[#F5E6EE] hover:bg-[#F0DAE6] border border-[#E5CAD9] rounded-2xl p-3.5 flex items-center gap-3.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <MediaPlatformIcon media={item.media} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#5D4353] truncate">
                          {item.media}
                        </div>
                        <div className="text-sm font-semibold text-[#8A657C] truncate">
                          “{item.title}”
                        </div>
                        <div className="text-[11px] font-medium text-[#7D6674] mt-0.5 tabular-nums">
                          {formatWibTime(item.time)} · {item.format}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <LifecycleStatusBadge status={status} />
                        <Clock size={14} className="text-[#9E788F]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/80 border border-[#E7CEDB] rounded-2xl p-5 text-center">
                <p className="text-sm text-[#7D6674]">
                  Belum ada jadwal konten pada {formatIndonesianDate(selectedDate)}.
                </p>
              </div>
            )}

            {/* Full-width sage green button matching Sketch 3 */}
            <button
              type="button"
              onClick={() => onOpenCreateForDate(selectedDate)}
              className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-[#D6E3D7] hover:bg-[#C6D8C8] border border-[#B2C9B5] text-[#4A3542] flex items-center justify-between transition-colors cursor-pointer shadow-sm"
            >
              <span className="inline-flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#DFB4CA] text-white flex items-center justify-center shrink-0">
                  <Plus size={16} strokeWidth={2.8} />
                </span>
                <span className="font-display text-sm font-bold text-[#8A657C]">
                  Tambahkan Konten Baru
                </span>
              </span>
              <ChevronRight size={20} className="text-[#9F6A8C]" />
            </button>
          </div>
        </div>
      ) : (
        /* Mode Menu / Daftar Konten matching Sketch 4 */
        <div className="space-y-4">
          {/* Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {FILTER_OPTIONS.map((opt) => {
                const active = statusFilter === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStatusFilter(opt)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                      active
                        ? 'bg-[#8A657C] text-white border-[#8A657C]'
                        : 'bg-[#DCE6DC] text-[#4A3542] border-[#C1D2C2] hover:bg-[#CFDDCF]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="relative sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A657C]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau media..."
                aria-label="Cari konten"
                className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E0C8D6] text-xs text-[#4A3542] placeholder:text-[#9E8795] focus:outline-none focus:ring-2 focus:ring-[#8A657C]"
              />
            </div>
          </div>

          {filteredMenuContents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMenuContents.map((item) => {
                const status = getContentLifecycleStatus(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectContent(item)}
                    className="w-full text-left bg-[#F5E6EE] hover:bg-[#EED9E5] border border-[#E5CAD9] rounded-2xl p-4 flex items-center gap-3.5 transition-colors cursor-pointer shadow-sm group"
                  >
                    <MediaPlatformIcon media={item.media} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#5D4353] truncate">
                        {item.media} · {item.format}
                      </div>
                      <div className="font-display text-sm font-bold text-[#7F5B71] truncate mt-0.5">
                        “{item.title}”
                      </div>
                      <div className="text-[11px] font-medium text-[#7D6674] mt-0.5 tabular-nums">
                        {formatIndonesianDate(item.date)} · {formatWibTime(item.time)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <LifecycleStatusBadge status={status} />
                      <ChevronRight
                        size={18}
                        className="text-[#9F6A8C] group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/85 border border-[#E7CEDB] rounded-3xl p-8 text-center">
              <p className="text-sm font-medium text-[#6F5164]">
                Tidak ada konten yang cocok dengan filter “{statusFilter}”.
              </p>
              <button
                type="button"
                onClick={() => onOpenCreateForDate(selectedDate)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7B9980] hover:bg-[#6A8870] text-white text-xs font-bold cursor-pointer"
              >
                <Plus size={15} />
                <span>Buat Konten Baru</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
