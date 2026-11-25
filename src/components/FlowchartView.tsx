import React from 'react';
import { ArrowDown, ArrowRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { ContentItem } from '../types/kontara';
import { KontaraLogo } from './KontaraBrand';

interface FlowchartViewProps {
  contents: ContentItem[];
  onBackHome: () => void;
  onOpenCalendarMenu: () => void;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({
  contents,
  onBackHome,
  onOpenCalendarMenu,
}) => {
  const planningCount = contents.filter(
    (c) =>
      c.stageStatuses.tujuan !== 'Selesai' ||
      c.stageStatuses.pesan !== 'Selesai' ||
      c.stageStatuses.media !== 'Selesai'
  ).length;
  const calendarCount = contents.filter(
    (c) =>
      c.stageStatuses.media === 'Selesai' &&
      c.stageStatuses.penjadwalan !== 'Selesai'
  ).length;
  const suitabilityCount = contents.filter(
    (c) =>
      c.stageStatuses.penjadwalan === 'Selesai' &&
      c.stageStatuses.kesesuaian !== 'Selesai'
  ).length;
  const reviewCount = contents.filter(
    (c) =>
      c.stageStatuses.kesesuaian === 'Selesai' &&
      c.stageStatuses.review !== 'Selesai'
  ).length;
  const publishCount = contents.filter(
    (c) =>
      c.stageStatuses.review === 'Selesai' &&
      c.stageStatuses.publikasi !== 'Selesai'
  ).length;
  const evalCount = contents.filter(
    (c) =>
      c.stageStatuses.publikasi === 'Selesai' &&
      c.stageStatuses.evaluasi !== 'Selesai'
  ).length;
  const doneCount = contents.filter(
    (c) => c.stageStatuses.evaluasi === 'Selesai'
  ).length;

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
          onClick={onOpenCalendarMenu}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#8A657C] hover:bg-[#755268] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Kelola Konten</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#6F5164] tracking-tight">
          SIKLUS ITERATIF KONTARA
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#7D6674] mt-1">
          Penyusunan • Publikasi • Evaluasi • Perbaikan
        </p>
      </div>

      {/* Flowchart diagram matching Sketch 1 */}
      <div className="max-w-3xl mx-auto bg-white/80 rounded-3xl p-5 sm:p-7 border border-[#E7CEDB] shadow-sm flex flex-col items-center space-y-2.5">
        {/* MULAI */}
        <div className="w-64 sm:w-72 py-2.5 px-4 rounded-2xl bg-[#DCE9DD] border border-[#AFC8B2] text-center font-display text-sm font-bold text-[#4A3542]">
          MULAI
        </div>
        <ArrowDown size={18} className="text-[#8A657C]" />

        {/* PERENCANAAN KONTEN */}
        <div className="w-full max-w-md py-3 px-4 rounded-2xl bg-[#F8E2EE] border border-[#DFB9CE] text-center">
          <div className="font-display text-sm font-bold text-[#4A3542]">
            PERENCANAAN KONTEN ({planningCount})
          </div>
          <div className="text-xs text-[#6F5164] mt-0.5">
            Tujuan komunikasi • Pesan • Media • Jadwal
          </div>
        </div>
        <ArrowDown size={18} className="text-[#8A657C]" />

        {/* MENYUSUN KALENDER KONTEN */}
        <div className="w-full max-w-md py-3 px-4 rounded-2xl bg-[#DCE9DD] border border-[#AFC8B2] text-center">
          <div className="font-display text-sm font-bold text-[#4A3542]">
            MENYUSUN KALENDER KONTEN ({calendarCount})
          </div>
        </div>
        <ArrowDown size={18} className="text-[#8A657C]" />

        {/* DECISION 1 + LOOP 1 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 order-2 md:order-1 bg-[#F8E7F0] border-2 border-[#9E788F] rounded-2xl p-3 text-center">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8A657C]">
              <RotateCcw size={12} />
              <span>TIDAK · ULANGI PENGECEKAN</span>
            </div>
            <div className="font-display text-xs font-bold text-[#4A3542] mt-1">
              PERBAIKAN KONTEN / JADWAL
            </div>
            <div className="text-[11px] text-[#6F5164] mt-0.5">
              Kembali ke Menyusun Kalender Konten
            </div>
          </div>

          <div className="md:col-span-8 order-1 md:order-2 bg-white border-2 border-[#8A657C] rounded-2xl p-3.5 text-center shadow-sm">
            <div className="font-display text-sm font-bold text-[#5D4353]">
              KONTEN DAN JADWAL SUDAH SESUAI? ({suitabilityCount})
            </div>
            <div className="text-[11px] text-[#5B7860] font-bold mt-1">
              YA → Lanjut ke Review & Persetujuan
            </div>
          </div>
        </div>
        <ArrowDown size={18} className="text-[#5B7860]" />

        {/* REVIEW & PERSETUJUAN */}
        <div className="w-full max-w-md py-3 px-4 rounded-2xl bg-[#DCE9DD] border border-[#AFC8B2] text-center">
          <div className="font-display text-sm font-bold text-[#4A3542]">
            REVIEW & PERSETUJUAN ({reviewCount})
          </div>
          <div className="text-xs text-[#5A6E5E] mt-0.5">
            Finalisasi sebelum publikasi
          </div>
        </div>
        <ArrowDown size={18} className="text-[#8A657C]" />

        {/* PUBLIKASI & MEDIA MONITORING */}
        <div className="w-full max-w-md py-3 px-4 rounded-2xl bg-[#F8E2EE] border border-[#DFB9CE] text-center">
          <div className="font-display text-sm font-bold text-[#4A3542]">
            PUBLIKASI & MEDIA MONITORING ({publishCount})
          </div>
        </div>
        <ArrowDown size={18} className="text-[#8A657C]" />

        {/* DECISION 2 + LOOP 2 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-7 bg-white border-2 border-[#8A657C] rounded-2xl p-3.5 text-center shadow-sm">
            <div className="font-display text-sm font-bold text-[#5D4353]">
              RESPONS PUBLIK POSITIF? ({evalCount})
            </div>
            <div className="text-[11px] text-[#5B7860] font-bold mt-1">
              YA → Proses Dinyatakan Selesai
            </div>
          </div>

          <div className="md:col-span-5 bg-[#F8E7F0] border-2 border-[#9E788F] rounded-2xl p-3 text-center space-y-1.5">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8A657C]">
              <RotateCcw size={12} />
              <span>TIDAK · SIKLUS PERBAIKAN</span>
            </div>
            <div className="font-display text-xs font-bold text-[#4A3542]">
              EVALUASI (Konten • Media • Strategi)
            </div>
            <div className="text-[11px] text-[#6F5164]">
              Melakukan perbaikan → Kembali ke Perencanaan Konten
            </div>
          </div>
        </div>
        <ArrowDown size={18} className="text-[#5B7860]" />

        {/* SELESAI */}
        <div className="w-64 sm:w-72 py-2.5 px-4 rounded-2xl bg-[#DCE9DD] border border-[#AFC8B2] text-center font-display text-sm font-bold text-[#3B5E41]">
          SELESAI ({doneCount})
        </div>

        {/* Bottom Summary matching Sketch 1 */}
        <div className="w-full pt-4 mt-2 border-t border-[#EFE1E9] text-center space-y-1 text-xs text-[#6F5164]">
          <div className="font-display font-bold text-[#634558]">
            INTI SIKLUS ITERATIF
          </div>
          <p>1. Jika konten/jadwal belum sesuai → revisi → kembali ke kalender konten.</p>
          <p>2. Jika respons publik belum positif → evaluasi & perbaikan → kembali ke perencanaan.</p>
          <p>3. Jika respons publik positif → proses selesai.</p>
        </div>
      </div>
    </div>
  );
};
