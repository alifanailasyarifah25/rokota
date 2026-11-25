import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Edit3,
  GitBranch,
  RotateCcw,
} from 'lucide-react';
import { ContentItem } from '../types/kontara';
import {
  formatIndonesianDate,
  getContentLifecycleStatus,
} from '../utils/kontaraStorage';
import {
  KontaraLogo,
  LifecycleStatusBadge,
  MediaPlatformIcon,
} from './KontaraBrand';

interface EvaluationViewProps {
  contents: ContentItem[];
  focusedContentId?: string | null;
  onBackHome: () => void;
  onEvaluateResponse: (
    id: string,
    payload: {
      isPositive: boolean;
      contentEval: string;
      mediaEval: string;
      strategyEval: string;
      improvementPlan: string;
    },
    openEditAfter?: boolean
  ) => void;
  onOpenFlowchart: () => void;
  onSelectContent: (item: ContentItem) => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  contents,
  focusedContentId,
  onBackHome,
  onEvaluateResponse,
  onOpenFlowchart,
  onSelectContent,
}) => {
  const ordered = useMemo(() => {
    return [...contents].sort((a, b) => {
      const aScore =
        a.stageStatuses.publikasi === 'Selesai' &&
        a.stageStatuses.evaluasi !== 'Selesai'
          ? 0
          : a.stageStatuses.evaluasi === 'Selesai'
          ? 2
          : 1;
      const bScore =
        b.stageStatuses.publikasi === 'Selesai' &&
        b.stageStatuses.evaluasi !== 'Selesai'
          ? 0
          : b.stageStatuses.evaluasi === 'Selesai'
          ? 2
          : 1;
      return aScore - bScore;
    });
  }, [contents]);

  const [selectedId, setSelectedId] = useState<string>(
    focusedContentId || ordered[0]?.id || ''
  );

  useEffect(() => {
    if (focusedContentId) setSelectedId(focusedContentId);
    else if (!selectedId && ordered[0]) setSelectedId(ordered[0].id);
  }, [focusedContentId, ordered, selectedId]);

  const selected =
    contents.find((c) => c.id === selectedId) ?? ordered[0] ?? null;

  const [contentEval, setContentEval] = useState('');
  const [mediaEval, setMediaEval] = useState('');
  const [strategyEval, setStrategyEval] = useState('');
  const [improvementPlan, setImprovementPlan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    if (selected) {
      setContentEval(selected.evaluation.contentEval || '');
      setMediaEval(selected.evaluation.mediaEval || '');
      setStrategyEval(selected.evaluation.strategyEval || '');
      setImprovementPlan(selected.evaluation.improvementPlan || '');
    }
  }, [selected?.id]);

  const handleDecision = (isPositive: boolean, openEditAfter = false) => {
    if (!selected) return;
    if (
      !isPositive &&
      (!contentEval.trim() ||
        !mediaEval.trim() ||
        !strategyEval.trim() ||
        !improvementPlan.trim())
    ) {
      setErrorMsg(
        'Untuk siklus perbaikan, mohon lengkapi evaluasi konten, media, strategi komunikasi, dan rencana perbaikan.'
      );
      return;
    }

    setErrorMsg('');
    onEvaluateResponse(
      selected.id,
      {
        isPositive,
        contentEval:
          contentEval.trim() ||
          'Pesan dan visual konten dipahami dengan baik oleh audiens.',
        mediaEval:
          mediaEval.trim() ||
          'Pemilihan kanal media publikasi dan jam tayang sudah tepat sasaran.',
        strategyEval:
          strategyEval.trim() ||
          'Strategi komunikasi kehumasan berhasil membangun respons positif.',
        improvementPlan:
          improvementPlan.trim() ||
          'Pertahankan standar kualitas pada kampanye berikutnya.',
      },
      openEditAfter
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-0 pt-4 pb-8 space-y-5">
      <div className="flex items-center justify-between gap-2">
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
        <button
          type="button"
          onClick={onOpenFlowchart}
          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#DCE9DD] hover:bg-[#CBE0CD] text-[#3B5E41] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <GitBranch size={14} />
          <span>Lihat Flowchart</span>
        </button>
      </div>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#6F5164] tracking-tight">
          Evaluasi Respons Publik
        </h1>
        <p className="text-sm text-[#7D6674] mt-0.5">
          Nilai hasil publikasi: nyatakan selesai jika respons positif, atau lakukan siklus perbaikan menuju tahap perencanaan
        </p>
      </div>

      {/* Inti Siklus Iteratif summary */}
      <div className="bg-[#F6E4EE] border border-[#E7C9DA] rounded-3xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-white/80 rounded-2xl p-3 border border-[#EBD6E2]">
          <span className="font-bold text-[#634558] block">
            1. Kesesuaian Konten & Jadwal
          </span>
          <span className="text-[#6F5164] mt-1 block">
            Jika belum sesuai, perbaiki konten/jadwal dan kembali ke kalender konten.
          </span>
        </div>
        <div className="bg-white/80 rounded-2xl p-3 border border-[#EBD6E2]">
          <span className="font-bold text-[#875021] block">
            2. Respons Belum Positif
          </span>
          <span className="text-[#6F5164] mt-1 block">
            Evaluasi konten, media, & strategi komunikasi lalu kembali ke tahap perencanaan.
          </span>
        </div>
        <div className="bg-white/80 rounded-2xl p-3 border border-[#EBD6E2]">
          <span className="font-bold text-[#3B5E41] block">
            3. Respons Publik Positif
          </span>
          <span className="text-[#6F5164] mt-1 block">
            Proses penyusunan & komunikasi dinyatakan Selesai.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Content List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h2 className="font-display text-sm font-bold text-[#634558]">
            Daftar Konten & Status Evaluasi
          </h2>
          {ordered.map((item) => {
            const active = selected?.id === item.id;
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
                    Siklus #{item.cycleNumber} · Sentimen: {item.monitoring.sentiment} ·{' '}
                    {formatIndonesianDate(item.date)}
                  </div>
                </div>
                <LifecycleStatusBadge status={st} />
              </button>
            );
          })}
        </div>

        {/* Evaluation Panel */}
        {selected && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E6CEDC] shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1E4EC]">
              <div>
                <span className="text-xs font-bold text-[#8A657C]">
                  Siklus #{selected.cycleNumber} · Sentimen Monitoring:{' '}
                  {selected.monitoring.sentiment}
                </span>
                <h2 className="font-display text-lg font-bold text-[#5D4353] mt-0.5">
                  {selected.title}
                </h2>
                <p className="text-xs text-[#7D6674] mt-1">
                  Catatan monitoring: {selected.monitoring.publicNotes || 'Belum ada catatan.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectContent(selected)}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#FAF5F8] hover:bg-[#F3E5ED] border border-[#E2CAD8] text-xs font-bold text-[#634558] shrink-0 cursor-pointer"
              >
                Lihat Timeline
              </button>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-2xl bg-[#FDECEC] border border-[#EAB5B5] text-[#8A2B2B] text-xs font-medium flex items-start gap-2"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="eval-content"
                  className="block text-xs font-bold text-[#5D4353] mb-1"
                >
                  Evaluasi Konten (Pesan, Narasi & Visual)
                </label>
                <textarea
                  id="eval-content"
                  rows={2}
                  value={contentEval}
                  onChange={(e) => setContentEval(e.target.value)}
                  placeholder="Apakah informasi mudah dipahami dan menjawab kebutuhan publik?"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-xs sm:text-sm text-[#4A3542]"
                />
              </div>

              <div>
                <label
                  htmlFor="eval-media"
                  className="block text-xs font-bold text-[#5D4353] mb-1"
                >
                  Evaluasi Media Publikasi (Kanal & Jam Tayang)
                </label>
                <textarea
                  id="eval-media"
                  rows={2}
                  value={mediaEval}
                  onChange={(e) => setMediaEval(e.target.value)}
                  placeholder="Apakah kanal dan waktu tayang efektif menjangkau audiens target?"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-xs sm:text-sm text-[#4A3542]"
                />
              </div>

              <div>
                <label
                  htmlFor="eval-strategy"
                  className="block text-xs font-bold text-[#5D4353] mb-1"
                >
                  Evaluasi Strategi Komunikasi
                </label>
                <textarea
                  id="eval-strategy"
                  rows={2}
                  value={strategyEval}
                  onChange={(e) => setStrategyEval(e.target.value)}
                  placeholder="Apakah pendekatan komunikasi membangun kepercayaan dan tanggapan konstruktif?"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-xs sm:text-sm text-[#4A3542]"
                />
              </div>

              <div>
                <label
                  htmlFor="eval-plan"
                  className="block text-xs font-bold text-[#5D4353] mb-1"
                >
                  Rencana Perbaikan / Tindak Lanjut
                </label>
                <textarea
                  id="eval-plan"
                  rows={2}
                  value={improvementPlan}
                  onChange={(e) => setImprovementPlan(e.target.value)}
                  placeholder="Langkah perbaikan konkret untuk siklus berikutnya atau catatan praktik baik..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-xs sm:text-sm text-[#4A3542]"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => handleDecision(true, false)}
                className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#7B9980] hover:bg-[#68856D] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <CheckCircle2 size={16} />
                <span>Respons Positif · Selesai</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision(false, true)}
                className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FBEAD8] hover:bg-[#F5DEC4] text-[#875021] border border-[#EED0B0] text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Belum Positif · Perbaiki</span>
                <Edit3 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
