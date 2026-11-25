import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, Clock, Save, X } from 'lucide-react';
import {
  ContentFormat,
  ContentFormValues,
  ContentItem,
  MediaPlatform,
} from '../types/kontara';

interface ContentFormModalProps {
  isOpen: boolean;
  editingItem: ContentItem | null;
  defaultDate?: string;
  defaultTime?: string;
  onClose: () => void;
  onSave: (values: ContentFormValues, editingId?: string) => void;
}

const MEDIA_OPTIONS: MediaPlatform[] = [
  'Instagram Post',
  'Instagram Reels',
  'TikTok',
  'YouTube',
  'Siaran Pers',
  'X (Twitter)',
  'LinkedIn',
];

const FORMAT_OPTIONS: ContentFormat[] = [
  'Infografis',
  'Carousel Edukasi',
  'Video Pendek',
  'Siaran Pers',
  'Artikel Berita',
  'Poster Digital',
  'Foto Dokumentasi',
];

export const ContentFormModal: React.FC<ContentFormModalProps> = ({
  isOpen,
  editingItem,
  defaultDate = '2026-11-24',
  defaultTime = '12:00',
  onClose,
  onSave,
}) => {
  const [values, setValues] = useState<ContentFormValues>({
    title: '',
    purpose: '',
    message: '',
    media: 'Instagram Post',
    format: 'Infografis',
    date: defaultDate,
    time: defaultTime,
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContentFormValues, string>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setHasSubmitted(false);
    if (editingItem) {
      setValues({
        title: editingItem.title,
        purpose: editingItem.purpose,
        message: editingItem.message,
        media: editingItem.media,
        format: editingItem.format,
        date: editingItem.date,
        time: editingItem.time,
        description: editingItem.description,
      });
    } else {
      setValues({
        title: '',
        purpose: '',
        message: '',
        media: 'Instagram Post',
        format: 'Infografis',
        date: defaultDate,
        time: defaultTime,
        description: '',
      });
    }
  }, [isOpen, editingItem, defaultDate, defaultTime]);

  if (!isOpen) return null;

  const validate = (form: ContentFormValues) => {
    const nextErrors: Partial<Record<keyof ContentFormValues, string>> = {};
    if (!form.title.trim()) nextErrors.title = 'Judul konten wajib diisi.';
    if (!form.purpose.trim())
      nextErrors.purpose = 'Tujuan komunikasi humas wajib diisi.';
    if (!form.message.trim())
      nextErrors.message = 'Informasi atau pesan utama wajib diisi.';
    if (!form.media) nextErrors.media = 'Pilih media publikasi.';
    if (!form.format) nextErrors.format = 'Pilih format konten.';
    if (!form.date) nextErrors.date = 'Tanggal publikasi wajib ditentukan.';
    if (!form.time) nextErrors.time = 'Jam publikasi wajib ditentukan.';
    if (!form.description.trim())
      nextErrors.description = 'Deskripsi konten wajib diisi.';
    return nextErrors;
  };

  const handleChange = <K extends keyof ContentFormValues>(
    field: K,
    value: ContentFormValues[K]
  ) => {
    const updated = { ...values, [field]: value };
    setValues(updated);
    if (hasSubmitted) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    onSave(
      {
        ...values,
        title: values.title.trim(),
        purpose: values.purpose.trim(),
        message: values.message.trim(),
        description: values.description.trim(),
      },
      editingItem?.id
    );
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#33222C]/45 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-form-title"
    >
      <div className="w-full sm:max-w-xl max-h-[92vh] bg-[#FCF8FA] rounded-t-3xl sm:rounded-3xl border border-[#E6CEDC] shadow-2xl flex flex-col overflow-hidden">
        {/* Grab handle on mobile */}
        <div className="sm:hidden w-12 h-1.5 bg-[#D4BCCB] rounded-full mx-auto mt-3 shrink-0" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EFE1E9] flex items-center justify-between gap-3 bg-white">
          <div>
            <h2
              id="content-form-title"
              className="font-display text-lg font-bold text-[#634558]"
            >
              {editingItem ? 'Edit Konten Kehumasan' : 'Buat Konten Kehumasan'}
            </h2>
            <p className="text-xs text-[#7D6674] mt-0.5">
              Tahap Perencanaan & Penyusunan Kalender Konten
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#7F5B71] hover:bg-[#F6E4EE] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {hasSubmitted && errorCount > 0 && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-[#FDECEC] border border-[#EAB5B5] text-[#8A2B2B] flex items-start gap-2.5 text-xs font-medium"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Data wajib belum lengkap ({errorCount} kolom).</p>
                <p className="mt-0.5">
                  Mohon lengkapi seluruh kolom bertanda wajib sebelum menyimpan ke kalender konten.
                </p>
              </div>
            </div>
          )}

          {/* Judul Konten */}
          <div>
            <label
              htmlFor="kontara-title"
              className="block text-xs font-bold text-[#5D4353] mb-1.5"
            >
              Judul Konten <span className="text-[#B54761]">*</span>
            </label>
            <input
              id="kontara-title"
              type="text"
              value={values.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Contoh: Sosialisasi Layanan Pengaduan Publik 24 Jam"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#4A3542] placeholder:text-[#A892A0] focus:outline-none focus:ring-2 focus:ring-[#8A657C] ${
                errors.title ? 'border-[#C94B4B]' : 'border-[#E0C8D6]'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs font-medium text-[#B03434]">{errors.title}</p>
            )}
          </div>

          {/* Tujuan Komunikasi Humas */}
          <div>
            <label
              htmlFor="kontara-purpose"
              className="block text-xs font-bold text-[#5D4353] mb-1.5"
            >
              Tujuan Komunikasi Humas <span className="text-[#B54761]">*</span>
            </label>
            <textarea
              id="kontara-purpose"
              rows={2}
              value={values.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="Contoh: Meningkatkan pemahaman dan kepercayaan publik terhadap layanan daring."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#4A3542] placeholder:text-[#A892A0] focus:outline-none focus:ring-2 focus:ring-[#8A657C] ${
                errors.purpose ? 'border-[#C94B4B]' : 'border-[#E0C8D6]'
              }`}
            />
            {errors.purpose && (
              <p className="mt-1 text-xs font-medium text-[#B03434]">{errors.purpose}</p>
            )}
          </div>

          {/* Informasi atau Pesan */}
          <div>
            <label
              htmlFor="kontara-message"
              className="block text-xs font-bold text-[#5D4353] mb-1.5"
            >
              Informasi atau Pesan Utama <span className="text-[#B54761]">*</span>
            </label>
            <textarea
              id="kontara-message"
              rows={2}
              value={values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Inti informasi yang ingin diingat oleh audiens..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#4A3542] placeholder:text-[#A892A0] focus:outline-none focus:ring-2 focus:ring-[#8A657C] ${
                errors.message ? 'border-[#C94B4B]' : 'border-[#E0C8D6]'
              }`}
            />
            {errors.message && (
              <p className="mt-1 text-xs font-medium text-[#B03434]">{errors.message}</p>
            )}
          </div>

          {/* Media Publikasi & Format Konten */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="kontara-media"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Media Publikasi <span className="text-[#B54761]">*</span>
              </label>
              <select
                id="kontara-media"
                value={values.media}
                onChange={(e) =>
                  handleChange('media', e.target.value as MediaPlatform)
                }
                className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-white border border-[#E0C8D6] text-sm text-[#4A3542] focus:outline-none focus:ring-2 focus:ring-[#8A657C]"
              >
                {MEDIA_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="kontara-format"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Format Konten <span className="text-[#B54761]">*</span>
              </label>
              <select
                id="kontara-format"
                value={values.format}
                onChange={(e) =>
                  handleChange('format', e.target.value as ContentFormat)
                }
                className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-white border border-[#E0C8D6] text-sm text-[#4A3542] focus:outline-none focus:ring-2 focus:ring-[#8A657C]"
              >
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal & Jam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="kontara-date"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Tanggal Publikasi <span className="text-[#B54761]">*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A657C] pointer-events-none"
                />
                <input
                  id="kontara-date"
                  type="date"
                  value={values.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded-xl bg-white border text-sm text-[#4A3542] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#8A657C] ${
                    errors.date ? 'border-[#C94B4B]' : 'border-[#E0C8D6]'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-xs font-medium text-[#B03434]">{errors.date}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="kontara-time"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Jam Publikasi (WIB) <span className="text-[#B54761]">*</span>
              </label>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A657C] pointer-events-none"
                />
                <input
                  id="kontara-time"
                  type="time"
                  value={values.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className={`w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded-xl bg-white border text-sm text-[#4A3542] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#8A657C] ${
                    errors.time ? 'border-[#C94B4B]' : 'border-[#E0C8D6]'
                  }`}
                />
              </div>
              {errors.time && (
                <p className="mt-1 text-xs font-medium text-[#B03434]">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Deskripsi Konten */}
          <div>
            <label
              htmlFor="kontara-description"
              className="block text-xs font-bold text-[#5D4353] mb-1.5"
            >
              Deskripsi Konten <span className="text-[#B54761]">*</span>
            </label>
            <textarea
              id="kontara-description"
              rows={3}
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Rincian visual, narasi takarir (caption), narasumber, atau catatan produksi..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#4A3542] placeholder:text-[#A892A0] focus:outline-none focus:ring-2 focus:ring-[#8A657C] ${
                errors.description ? 'border-[#C94B4B]' : 'border-[#E0C8D6]'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs font-medium text-[#B03434]">
                {errors.description}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 pb-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#F2E9EE] hover:bg-[#E7DAE2] text-[#5D4353] text-sm font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[1.6] min-h-[46px] px-4 py-2.5 rounded-xl bg-[#7B9980] hover:bg-[#68856D] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Save size={16} />
              <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Konten'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
