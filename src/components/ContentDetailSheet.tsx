import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Edit3,
  History,
  RotateCcw,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import {
  ContentItem,
  StageStatus,
  WorkflowStepId,
} from '../types/kontara';
import { WORKFLOW_STEPS } from '../data/seedData';
import {
  formatIndonesianDate,
  formatWibTime,
  getContentLifecycleStatus,
} from '../utils/kontaraStorage';
import {
  LifecycleStatusBadge,
  MediaPlatformIcon,
  StageStatusBadge,
} from './KontaraBrand';

interface ContentDetailSheetProps {
  item: ContentItem | null;
  onClose: () => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onUpdateStageStatus: (
    id: string,
    stepId: WorkflowStepId,
    status: StageStatus
  ) => void;
  onAdvanceToSuitabilityCheck: (id: string) => void;
  onSuitabilityDecision: (
    id: string,
    isSuitable: boolean,
    reason?: string
  ) => void;
  onApproveReview: (id: string, approved: boolean, note?: string) => void;
  onMarkPublished: (id: string) => void;
  onEvaluateResponse: (
    id: string,
    payload: {
      isPositive: boolean;
      contentEval: string;
      mediaEval: string;
      strategyEval: string;
      improvementPlan: string;
    }
  ) => void;
  onOpenMonitoring: (id: string) => void;
}

const STAGE_STATUS_CHOICES: StageStatus[] = [
  'Belum Dimulai',
  'Dalam Proses',
  'Menunggu Review',
  'Selesai',
];

export const ContentDetailSheet: React.FC<ContentDetailSheetProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
  onUpdateStageStatus,
  onAdvanceToSuitabilityCheck,
  onSuitabilityDecision,
  onApproveReview,
  onMarkPublished,
  onEvaluateResponse,
  onOpenMonitoring,
}) => {
  const [activeTab, setActiveTab] = useState<'progres' | 'rincian' | 'riwayat'>(
    'progres'
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Interactive decision forms inside sheet
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');
  const [showEvalNegativeForm, setShowEvalNegativeForm] = useState(false);
  const [contentEval, setContentEval] = useState('');
  const [mediaEval, setMediaEval] = useState('');
  const [strategyEval, setStrategyEval] = useState('');
  const [improvementPlan, setImprovementPlan] = useState('');
  const [evalError, setEvalError] = useState('');

  React.useEffect(() => {
    setConfirmDelete(false);
    setShowRevisionForm(false);
    setRevisionReason('');
    setShowEvalNegativeForm(false);
    setEvalError('');
    if (item) {
      setContentEval(item.evaluation.contentEval || '');
      setMediaEval(item.evaluation.mediaEval || '');
      setStrategyEval(item.evaluation.strategyEval || '');
      setImprovementPlan(item.evaluation.improvementPlan || '');
    }
  }, [item?.id]);

  if (!item) return null;

  const lifecycleStatus = getContentLifecycleStatus(item);
  const s = item.stageStatuses;

  // Determine which interactive decision gate is active
  const isPlanningPending =
    s.tujuan !== 'Selesai' ||
    s.pesan !== 'Selesai' ||
    s.media !== 'Selesai' ||
    s.penjadwalan !== 'Selesai';
  const isAtSuitabilityGate = !isPlanningPending && s.kesesuaian !== 'Selesai';
  const isAtReviewGate =
    !isPlanningPending && s.kesesuaian === 'Selesai' && s.review !== 'Selesai';
  const isAtPublishGate =
    s.review === 'Selesai' && s.publikasi !== 'Selesai';
  const isAtEvaluationGate =
    s.publikasi === 'Selesai' && s.evaluasi !== 'Selesai';
  const isCompleted = s.evaluasi === 'Selesai';

  const handleNegativeEvalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contentEval.trim() ||
      !mediaEval.trim() ||
      !strategyEval.trim() ||
      !improvementPlan.trim()
    ) {
      setEvalError(
        'Lengkapi evaluasi konten, media, strategi komunikasi, dan rencana perbaikan.'
      );
      return;
    }
    setEvalError('');
    onEvaluateResponse(item.id, {
      isPositive: false,
      contentEval: contentEval.trim(),
      mediaEval: mediaEval.trim(),
      strategyEval: strategyEval.trim(),
      improvementPlan: improvementPlan.trim(),
    });
    setShowEvalNegativeForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#33222C]/45 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-sheet-title"
    >
      <div className="w-full sm:max-w-2xl max-h-[92vh] bg-[#FAF6F8] rounded-t-[32px] sm:rounded-3xl border border-[#E6CEDC] shadow-2xl flex flex-col overflow-hidden">
        {/* Grab Handle matching Sketch 4 */}
        <div className="pt-3 pb-1 flex items-center justify-between px-5 shrink-0">
          <div className="w-9" />
          <div className="w-16 h-1.5 bg-[#B8A9B2] rounded-full" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail konten"
            className="min-h-[38px] min-w-[38px] rounded-xl flex items-center justify-center text-[#7F5B71] hover:bg-[#F2E4EC] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
          {/* Highlighted Header Card matching Sketch 4 */}
          <div className="bg-[#F6E4EE] border border-[#E7C9DA] rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <MediaPlatformIcon media={item.media} size="lg" />
                <div className="min-w-0">
                  <h2
                    id="detail-sheet-title"
                    className="font-display text-base sm:text-lg font-extrabold text-[#5D4353] leading-snug"
                  >
                    {item.title}
                  </h2>
                  <p className="text-xs font-semibold text-[#8A657C] mt-0.5 tabular-nums">
                    {item.media} · {formatIndonesianDate(item.date)} ·{' '}
                    {formatWibTime(item.time)}
                  </p>
                </div>
              </div>
              <LifecycleStatusBadge status={lifecycleStatus} />
            </div>

            {/* Action bar: Edit, Monitoring, Hapus */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E6CADA]">
              <span className="text-xs font-semibold text-[#6F5164]">
                {item.format} · Siklus Iterasi #{item.cycleNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenMonitoring(item.id)}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-[#FBF6F9] border border-[#DFC3D3] text-[#634558] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <BarChart3 size={14} />
                  <span>Monitoring</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-[#FBF6F9] border border-[#DFC3D3] text-[#5B7860] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-[#FDECEC] border border-[#DFC3D3] text-[#9E3845] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

            {confirmDelete && (
              <div className="p-3 rounded-2xl bg-[#FDECEC] border border-[#EAB5B5] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#8A2B2B]">
                  Hapus konten ini secara permanen?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="min-h-[36px] px-3 py-1 rounded-xl bg-white text-[#5D4353] text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="min-h-[36px] px-3 py-1 rounded-xl bg-[#B33949] text-white text-xs font-bold cursor-pointer"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sub-tabs: Progres Konten | Rincian | Riwayat Siklus */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#EAE0E6]">
            <button
              type="button"
              onClick={() => setActiveTab('progres')}
              className={`min-h-[38px] rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'progres'
                  ? 'bg-white text-[#634558] shadow-sm'
                  : 'text-[#6F5164]'
              }`}
            >
              Progres Konten
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rincian')}
              className={`min-h-[38px] rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'rincian'
                  ? 'bg-white text-[#634558] shadow-sm'
                  : 'text-[#6F5164]'
              }`}
            >
              Rincian Pesan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('riwayat')}
              className={`min-h-[38px] rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'riwayat'
                  ? 'bg-white text-[#634558] shadow-sm'
                  : 'text-[#6F5164]'
              }`}
            >
              Riwayat ({item.iterationLogs.length})
            </button>
          </div>

          {activeTab === 'progres' && (
            <div className="space-y-5">
              {/* Revision Alert if returned from check or evaluation */}
              {item.revisionNote && !isCompleted && (
                <div className="p-3.5 rounded-2xl bg-[#FFF4E8] border border-[#ECCEA9] flex items-start gap-2.5 text-xs text-[#7D4B1E]">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Catatan Siklus Perbaikan:</p>
                    <p className="mt-0.5">{item.revisionNote}</p>
                  </div>
                </div>
              )}

              {/* Interactive Iterative Flowchart Action Box */}
              <div className="bg-white rounded-3xl p-4 border border-[#E6CEDC] shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-bold text-[#634558]">
                    Tahap Aktif Siklus Kehumasan
                  </h3>
                  <span className="text-xs font-semibold text-[#7B9980]">
                    Siklus #{item.cycleNumber}
                  </span>
                </div>

                {isPlanningPending && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#6F5164]">
                      Pastikan tujuan komunikasi, pesan utama, media publikasi, dan jadwal di kalender sudah siap sebelum dilakukan pengecekan kesesuaian.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#F6E4EE] hover:bg-[#EED0E1] text-[#634558] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 size={14} />
                        <span>Perbarui Konten / Jadwal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onAdvanceToSuitabilityCheck(item.id)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#7B9980] hover:bg-[#69866E] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Lanjut Cek Kesesuaian</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {isAtSuitabilityGate && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#5D4353]">
                      Pemeriksaan: Apakah konten dan jadwal publikasi sudah sesuai?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onSuitabilityDecision(item.id, true)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#7B9980] hover:bg-[#69866E] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={15} />
                        <span>Ya, Sudah Sesuai</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRevisionForm((v) => !v)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#FBEAD8] hover:bg-[#F5DEC4] text-[#875021] border border-[#EED0B0] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Belum Sesuai (Revisi)</span>
                      </button>
                    </div>

                    {showRevisionForm && (
                      <div className="p-3 rounded-2xl bg-[#FAF5F8] border border-[#E5CAD9] space-y-2.5">
                        <label
                          htmlFor="revision-reason"
                          className="block text-xs font-bold text-[#5D4353]"
                        >
                          Catatan Perbaikan Konten / Jadwal
                        </label>
                        <textarea
                          id="revision-reason"
                          rows={2}
                          value={revisionReason}
                          onChange={(e) => setRevisionReason(e.target.value)}
                          placeholder="Contoh: Jam tayang bentrok dengan rilis lain, geser ke pukul 16.00 WIB..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFC3D3] text-xs text-[#4A3542]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onSuitabilityDecision(
                                item.id,
                                false,
                                revisionReason.trim() ||
                                  'Konten atau jadwal perlu disesuaikan ulang pada kalender.'
                              );
                              setShowRevisionForm(false);
                              onEdit(item);
                            }}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#8A657C] text-white text-xs font-bold cursor-pointer"
                          >
                            Kembalikan ke Kalender & Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isAtReviewGate && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#6F5164]">
                      Finalisasi sebelum publikasi: setujui konten untuk masuk ke jadwal tayang resmi, atau kembalikan untuk revisi.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onApproveReview(item.id, true)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#7B9980] hover:bg-[#69866E] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 size={15} />
                        <span>Setujui & Jadwalkan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onApproveReview(
                            item.id,
                            false,
                            'Perlu penyesuaian redaksional saat review pimpinan.'
                          )
                        }
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#F6E4EE] hover:bg-[#EED0E1] text-[#634558] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Kembalikan ke Revisi</span>
                      </button>
                    </div>
                  </div>
                )}

                {isAtPublishGate && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#6F5164]">
                      Konten telah disetujui dan terjadwal. Tandai telah terbit setelah diunggah ke kanal publikasi agar dapat dimonitor.
                    </p>
                    <button
                      type="button"
                      onClick={() => onMarkPublished(item.id)}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-[#8A657C] hover:bg-[#755268] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={14} />
                      <span>Tandai Sudah Terbit & Mulai Monitoring</span>
                    </button>
                  </div>
                )}

                {isAtEvaluationGate && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#5D4353]">
                      Evaluasi Akhir: Apakah respons publik terhadap konten ini sudah positif?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEvaluateResponse(item.id, {
                            isPositive: true,
                            contentEval:
                              contentEval || 'Konten diterima baik oleh audiens.',
                            mediaEval:
                              mediaEval || 'Media publikasi menjangkau target sasaran.',
                            strategyEval:
                              strategyEval || 'Strategi komunikasi berjalan efektif.',
                            improvementPlan:
                              improvementPlan || 'Dokumentasikan sebagai praktik baik.',
                          })
                        }
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#7B9980] hover:bg-[#69866E] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 size={15} />
                        <span>Ya, Respons Positif (Selesai)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEvalNegativeForm((v) => !v)}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[#FBEAD8] hover:bg-[#F5DEC4] text-[#875021] border border-[#EED0B0] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Belum Positif (Siklus Perbaikan)</span>
                      </button>
                    </div>

                    {showEvalNegativeForm && (
                      <form
                        onSubmit={handleNegativeEvalSubmit}
                        className="p-3.5 rounded-2xl bg-[#FAF5F8] border border-[#E5CAD9] space-y-2.5"
                      >
                        <p className="text-xs font-bold text-[#634558]">
                          Evaluasi 3 Aspek & Rencana Perbaikan (Siklus #{item.cycleNumber + 1})
                        </p>
                        {evalError && (
                          <p className="text-xs font-semibold text-[#B03434]">
                            {evalError}
                          </p>
                        )}
                        <input
                          type="text"
                          value={contentEval}
                          onChange={(e) => setContentEval(e.target.value)}
                          placeholder="Evaluasi Konten (narasi, visual, kejelasan pesan)"
                          className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-[#DFC3D3] text-xs"
                        />
                        <input
                          type="text"
                          value={mediaEval}
                          onChange={(e) => setMediaEval(e.target.value)}
                          placeholder="Evaluasi Media (kesesuaian kanal & jam tayang)"
                          className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-[#DFC3D3] text-xs"
                        />
                        <input
                          type="text"
                          value={strategyEval}
                          onChange={(e) => setStrategyEval(e.target.value)}
                          placeholder="Evaluasi Strategi Komunikasi (pendekatan audiens)"
                          className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-[#DFC3D3] text-xs"
                        />
                        <textarea
                          rows={2}
                          value={improvementPlan}
                          onChange={(e) => setImprovementPlan(e.target.value)}
                          placeholder="Rencana perbaikan untuk kembali ke tahap perencanaan..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#DFC3D3] text-xs"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#8A657C] text-white text-xs font-bold cursor-pointer"
                          >
                            Simpan Evaluasi & Kembali ke Perencanaan
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="p-3 rounded-2xl bg-[#DCE9DD] text-[#3B5E41] text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>
                      Seluruh tahapan telah selesai dengan respons publik positif pada Siklus #{item.cycleNumber}.
                    </span>
                  </div>
                )}
              </div>

              {/* Vertical Timeline matching Sketch 4 */}
              <div>
                <h3 className="font-display text-base font-bold text-[#634558] mb-3">
                  Progres Konten
                </h3>

                <div className="space-y-0">
                  {WORKFLOW_STEPS.map((step, index) => {
                    const st = item.stageStatuses[step.id];
                    const isLast = index === WORKFLOW_STEPS.length - 1;
                    const isDone = st === 'Selesai';
                    const isActive =
                      st === 'Dalam Proses' || st === 'Menunggu Review';

                    return (
                      <div key={step.id} className="flex items-stretch gap-3.5">
                        {/* Timeline node & dotted connector */}
                        <div className="flex flex-col items-center pt-1">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isDone
                                ? 'bg-[#EED0E1] border-[#8A657C] text-[#5D4353]'
                                : isActive
                                ? 'bg-[#DCE9DD] border-[#5B7860] text-[#3B5E41]'
                                : 'bg-white border-[#B9A4B0] text-transparent'
                            }`}
                          >
                            {isDone ? (
                              <Check size={13} strokeWidth={3} />
                            ) : isActive ? (
                              <Send size={11} />
                            ) : null}
                          </div>
                          {!isLast && (
                            <div
                              className="w-0.5 flex-1 min-h-[26px] my-1 border-l-2 border-dotted border-[#7D6674]"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {/* Stage label + Interactive Stage Status selector */}
                        <div className="flex-1 pb-4 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-display text-sm font-bold text-[#5D4353]">
                              {step.title}
                            </div>
                            <div className="text-xs text-[#9E788F] mt-0.5">
                              {step.subtitle}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <StageStatusBadge status={st} />
                            <select
                              aria-label={`Ubah status tahap ${step.title}`}
                              value={st}
                              onChange={(e) =>
                                onUpdateStageStatus(
                                  item.id,
                                  step.id,
                                  e.target.value as StageStatus
                                )
                              }
                              className="text-[11px] font-medium text-[#7D6674] bg-transparent border border-transparent hover:border-[#DFC3D3] rounded-lg px-1 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8A657C]"
                            >
                              {STAGE_STATUS_CHOICES.map((opt) => (
                                <option key={opt} value={opt}>
                                  Set: {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rincian' && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E6CEDC] space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#8A657C]">
                  Tujuan Komunikasi Humas
                </h4>
                <p className="text-sm text-[#4A3542] mt-1 leading-relaxed">
                  {item.purpose}
                </p>
              </div>
              <div className="border-t border-[#F1E4EC] pt-3">
                <h4 className="text-xs font-bold text-[#8A657C]">
                  Informasi atau Pesan Utama
                </h4>
                <p className="text-sm text-[#4A3542] mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>
              <div className="border-t border-[#F1E4EC] pt-3">
                <h4 className="text-xs font-bold text-[#8A657C]">
                  Deskripsi Konten
                </h4>
                <p className="text-sm text-[#4A3542] mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="border-t border-[#F1E4EC] pt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-[#8A657C] block">
                    Media & Format
                  </span>
                  <span className="text-[#4A3542] font-medium mt-0.5 block">
                    {item.media} · {item.format}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#8A657C] block">
                    Jadwal Publikasi
                  </span>
                  <span className="text-[#4A3542] font-medium mt-0.5 block tabular-nums">
                    {formatIndonesianDate(item.date)} · {formatWibTime(item.time)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'riwayat' && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E6CEDC] space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#634558]">
                <History size={16} />
                <span>Riwayat Siklus Iteratif ({item.iterationLogs.length})</span>
              </div>

              {item.iterationLogs.length > 0 ? (
                <div className="space-y-3">
                  {item.iterationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-[#FAF5F8] border border-[#E7CEDB] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#634558]">
                          Siklus #{log.cycle} · {log.type}
                        </span>
                        <span className="text-[#8A657C] tabular-nums">
                          {new Date(log.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-[#5D4353]">
                        <span className="font-semibold">Alasan:</span> {log.reason}
                      </p>
                      <p className="text-[#5B7860]">
                        <span className="font-semibold">Tindakan:</span>{' '}
                        {log.actionTaken}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#7D6674]">
                  Belum ada catatan iterasi atau revisi pada konten ini.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
