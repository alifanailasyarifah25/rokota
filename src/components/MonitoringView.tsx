import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  ChevronLeft,
  Eye,
  HeartHandshake,
  Newspaper,
  Save,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { ContentItem, MonitoringData, SentimentType } from '../types/kontara';
import {
  formatIndonesianDate,
  getContentLifecycleStatus,
} from '../utils/kontaraStorage';
import {
  KontaraLogo,
  LifecycleStatusBadge,
  MediaPlatformIcon,
} from './KontaraBrand';

interface MonitoringViewProps {
  contents: ContentItem[];
  focusedContentId?: string | null;
  onBackHome: () => void;
  onUpdateMonitoring: (id: string, data: MonitoringData) => void;
  onGoToEvaluation: (id: string) => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  contents,
  focusedContentId,
  onBackHome,
  onUpdateMonitoring,
  onGoToEvaluation,
}) => {
  const monitorableItems = useMemo(() => {
    return [...contents].sort((a, b) => {
      const aPub = a.stageStatuses.publikasi === 'Selesai' ? 0 : 1;
      const bPub = b.stageStatuses.publikasi === 'Selesai' ? 0 : 1;
      if (aPub !== bPub) return aPub - bPub;
      return b.date.localeCompare(a.date);
    });
  }, [contents]);

  const [selectedId, setSelectedId] = useState<string>(
    focusedContentId || monitorableItems[0]?.id || ''
  );

  useEffect(() => {
    if (focusedContentId) {
      setSelectedId(focusedContentId);
    } else if (!selectedId && monitorableItems[0]) {
      setSelectedId(monitorableItems[0].id);
    }
  }, [focusedContentId, monitorableItems, selectedId]);

  const selectedItem =
    contents.find((c) => c.id === selectedId) ?? monitorableItems[0] ?? null;

  const [reach, setReach] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [mediaMentions, setMediaMentions] = useState(0);
  const [sentiment, setSentiment] = useState<SentimentType>('Netral');
  const [publicNotes, setPublicNotes] = useState('');

  useEffect(() => {
    if (selectedItem) {
      setReach(selectedItem.monitoring.reach);
      setInteractions(selectedItem.monitoring.interactions);
      setMediaMentions(selectedItem.monitoring.mediaMentions);
      setSentiment(selectedItem.monitoring.sentiment);
      setPublicNotes(selectedItem.monitoring.publicNotes);
    }
  }, [selectedItem]);

  const totals = useMemo(() => {
    return contents.reduce(
      (acc, c) => {
        acc.reach += c.monitoring.reach || 0;
        acc.interactions += c.monitoring.interactions || 0;
        acc.mentions += c.monitoring.mediaMentions || 0;
        if (c.stageStatuses.publikasi === 'Selesai') {
          acc.published += 1;
        }
        return acc;
      },
      { reach: 0, interactions: 0, mentions: 0, published: 0 }
    );
  }, [contents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    onUpdateMonitoring(selectedItem.id, {
      reach: Math.max(0, Number(reach) || 0),
      interactions: Math.max(0, Number(interactions) || 0),
      mediaMentions: Math.max(0, Number(mediaMentions) || 0),
      sentiment,
      publicNotes: publicNotes.trim(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-0 pt-4 pb-8 space-y-5">
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

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#6F5164] tracking-tight">
          Media Monitoring
        </h1>
        <p className="text-sm text-[#7D6674] mt-0.5">
          Pantau jangkauan, liputan media, dan sentimen respons publik secara real-time
        </p>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white/90 rounded-2xl p-4 border border-[#E7CEDB] shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7D6674]">
            <Eye size={15} className="text-[#7B9980]" />
            <span>Total Jangkauan</span>
          </div>
          <div className="font-display text-2xl font-bold text-[#634558] tabular-nums mt-1.5">
            {totals.reach.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 border border-[#E7CEDB] shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7D6674]">
            <HeartHandshake size={15} className="text-[#8A657C]" />
            <span>Total Interaksi</span>
          </div>
          <div className="font-display text-2xl font-bold text-[#634558] tabular-nums mt-1.5">
            {totals.interactions.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 border border-[#E7CEDB] shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7D6674]">
            <Newspaper size={15} className="text-[#7B9980]" />
            <span>Liputan Media</span>
          </div>
          <div className="font-display text-2xl font-bold text-[#634558] tabular-nums mt-1.5">
            {totals.mentions.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 border border-[#E7CEDB] shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7D6674]">
            <BarChart3 size={15} className="text-[#8A657C]" />
            <span>Konten Dimonitor</span>
          </div>
          <div className="font-display text-2xl font-bold text-[#634558] tabular-nums mt-1.5">
            {totals.published}
          </div>
        </div>
      </div>

      {/* Main Split: Content List & Monitoring Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Content Selector List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h2 className="font-display text-sm font-bold text-[#634558]">
            Pilih Konten untuk Dimonitor
          </h2>
          {monitorableItems.map((item) => {
            const active = selectedItem?.id === item.id;
            const st = getContentLifecycleStatus(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left rounded-2xl p-3.5 border flex items-center gap-3 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#F6E4EE] border-[#8A657C] shadow-sm'
                    : 'bg-white/85 hover:bg-white border-[#E7CEDB]'
                }`}
              >
                <MediaPlatformIcon media={item.media} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-xs sm:text-sm font-bold text-[#4A3542] truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#7D6674] mt-0.5 tabular-nums">
                    {item.media} · {formatIndonesianDate(item.date)}
                  </div>
                </div>
                <LifecycleStatusBadge status={st} />
              </button>
            );
          })}
        </div>

        {/* Monitoring Form */}
        {selectedItem ? (
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E6CEDC] shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1E4EC]">
              <div>
                <span className="text-xs font-bold text-[#7B9980]">
                  Pencatatan Media Monitoring
                </span>
                <h2 className="font-display text-lg font-bold text-[#5D4353] mt-0.5">
                  {selectedItem.title}
                </h2>
              </div>
              <LifecycleStatusBadge
                status={getContentLifecycleStatus(selectedItem)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label
                  htmlFor="mon-reach"
                  className="block text-xs font-bold text-[#5D4353] mb-1.5"
                >
                  Jangkauan (Reach)
                </label>
                <input
                  id="mon-reach"
                  type="number"
                  min={0}
                  value={reach}
                  onChange={(e) => setReach(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm font-semibold text-[#4A3542] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#8A657C]"
                />
              </div>

              <div>
                <label
                  htmlFor="mon-interactions"
                  className="block text-xs font-bold text-[#5D4353] mb-1.5"
                >
                  Interaksi Publik
                </label>
                <input
                  id="mon-interactions"
                  type="number"
                  min={0}
                  value={interactions}
                  onChange={(e) => setInteractions(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm font-semibold text-[#4A3542] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#8A657C]"
                />
              </div>

              <div>
                <label
                  htmlFor="mon-mentions"
                  className="block text-xs font-bold text-[#5D4353] mb-1.5"
                >
                  Liputan / Sebutan Media
                </label>
                <input
                  id="mon-mentions"
                  type="number"
                  min={0}
                  value={mediaMentions}
                  onChange={(e) => setMediaMentions(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm font-semibold text-[#4A3542] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#8A657C]"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#5D4353] mb-2">
                Sentimen Respons Publik
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    {
                      val: 'Positif',
                      icon: <Smile size={16} />,
                      activeClass: 'bg-[#DCE9DD] border-[#5B7860] text-[#3B5E41]',
                    },
                    {
                      val: 'Netral',
                      icon: <Meh size={16} />,
                      activeClass: 'bg-[#E3EEF7] border-[#4A7599] text-[#315D80]',
                    },
                    {
                      val: 'Negatif',
                      icon: <Frown size={16} />,
                      activeClass: 'bg-[#FBEAD8] border-[#B87439] text-[#875021]',
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setSentiment(opt.val)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      sentiment === opt.val
                        ? opt.activeClass
                        : 'bg-[#FAF6F8] border-[#E0C8D6] text-[#6F5164] hover:bg-[#F3E6EE]'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.val}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="mon-notes"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Ringkasan Tanggapan Media & Komentar Publik
              </label>
              <textarea
                id="mon-notes"
                rows={3}
                value={publicNotes}
                onChange={(e) => setPublicNotes(e.target.value)}
                placeholder="Catat pertanyaan yang sering muncul, kritik audiens, atau rangkuman pemberitaan media..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm text-[#4A3542] focus:outline-none focus:ring-2 focus:ring-[#8A657C]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => onGoToEvaluation(selectedItem.id)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#F6E4EE] hover:bg-[#EED0E1] text-[#634558] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut ke Evaluasi Publik</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#7B9980] hover:bg-[#68856D] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save size={15} />
                <span>Simpan Data Monitoring</span>
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};
