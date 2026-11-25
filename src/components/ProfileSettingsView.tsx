import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  RotateCcw,
  Save,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { ContentItem, WorkspaceProfile } from '../types/kontara';
import { getContentLifecycleStatus } from '../utils/kontaraStorage';
import { KontaraLogo } from './KontaraBrand';

interface ProfileSettingsViewProps {
  mode: 'profil' | 'pengaturan';
  profile: WorkspaceProfile;
  contents: ContentItem[];
  onBackHome: () => void;
  onSaveProfile: (profile: WorkspaceProfile) => void;
  onResetSeedData: () => void;
  onClearAllContents: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  mode,
  profile,
  contents,
  onBackHome,
  onSaveProfile,
  onResetSeedData,
  onClearAllContents,
}) => {
  const [form, setForm] = useState<WorkspaceProfile>(profile);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setForm(profile);
    setConfirmClear(false);
  }, [profile, mode]);

  const completedCycles = contents.filter(
    (c) => getContentLifecycleStatus(c) === 'Selesai'
  ).length;
  const totalIterations = contents.reduce((sum, c) => sum + c.cycleNumber, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      orgName: form.orgName.trim() || 'Biro Komunikasi & Kehumasan',
      teamName: form.teamName.trim() || 'Tim Konten Humas',
      leadName: form.leadName.trim() || 'Koordinator Humas',
      roleTitle: form.roleTitle.trim() || 'Humas',
      defaultTime: form.defaultTime || '12:00',
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
          {mode === 'profil' ? 'Profil Tim Kehumasan' : 'Pengaturan Ruang Kerja'}
        </h1>
        <p className="text-sm text-[#7D6674] mt-0.5">
          {mode === 'profil'
            ? 'Identitas unit komunikasi publik dan ringkasan capaian siklus konten'
            : 'Preferensi jadwal bawaan dan pengelolaan penyimpanan lokal aplikasi'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Profile Identity Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#F6E4EE] border border-[#E7C9DA] rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#8A657C] text-white flex items-center justify-center shrink-0 shadow-sm">
                <UserCheck size={26} />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold text-[#4A3542] truncate">
                  {profile.leadName}
                </h2>
                <p className="text-xs font-semibold text-[#7F5B71] truncate">
                  {profile.roleTitle} · {profile.teamName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#5D4353] bg-white/75 rounded-2xl p-3 border border-[#EBD6E2]">
              <Building2 size={16} className="text-[#7B9980] shrink-0" />
              <span>{profile.orgName}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/85 rounded-2xl p-3 border border-[#EBD6E2]">
                <div className="font-display text-xl font-bold text-[#3B5E41] tabular-nums">
                  {completedCycles}
                </div>
                <div className="text-[11px] font-semibold text-[#6F5164] mt-0.5">
                  Konten Selesai
                </div>
              </div>
              <div className="bg-white/85 rounded-2xl p-3 border border-[#EBD6E2]">
                <div className="font-display text-xl font-bold text-[#634558] tabular-nums">
                  {totalIterations}
                </div>
                <div className="text-[11px] font-semibold text-[#6F5164] mt-0.5">
                  Total Siklus Dijalankan
                </div>
              </div>
            </div>
          </div>

          {/* Local Storage Controls */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6CEDC] space-y-3">
            <h3 className="font-display text-sm font-bold text-[#634558]">
              Penyimpanan Lokal Perangkat
            </h3>
            <p className="text-xs text-[#7D6674] leading-relaxed">
              Seluruh konten, progres timeline, hasil monitoring, dan catatan evaluasi tersimpan otomatis di peramban ini tanpa perlu login.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={onResetSeedData}
                className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#DCE9DD] hover:bg-[#CBE0CD] text-[#3B5E41] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Pulihkan Data Contoh</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FDECEC] hover:bg-[#FADADA] text-[#9E3845] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Kosongkan Daftar Konten</span>
              </button>
            </div>

            {confirmClear && (
              <div className="p-3 rounded-2xl bg-[#FDECEC] border border-[#EAB5B5] space-y-2">
                <p className="text-xs font-bold text-[#8A2B2B]">
                  Yakin ingin menghapus seluruh konten tersimpan?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="min-h-[36px] px-3 py-1 rounded-xl bg-white text-xs font-bold text-[#5D4353] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAllContents();
                      setConfirmClear(false);
                    }}
                    className="min-h-[36px] px-3 py-1 rounded-xl bg-[#B33949] text-white text-xs font-bold cursor-pointer"
                  >
                    Ya, Kosongkan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile / Preferences Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#E6CEDC] shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1E4EC]">
            <CheckCircle2 size={18} className="text-[#7B9980]" />
            <h2 className="font-display text-base font-bold text-[#634558]">
              Sesuaikan Identitas & Preferensi Humas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="prof-lead"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Nama Koordinator / Penyusun
              </label>
              <input
                id="prof-lead"
                type="text"
                value={form.leadName}
                onChange={(e) => setForm({ ...form, leadName: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm text-[#4A3542]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-role"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Jabatan / Peran
              </label>
              <input
                id="prof-role"
                type="text"
                value={form.roleTitle}
                onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm text-[#4A3542]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="prof-org"
              className="block text-xs font-bold text-[#5D4353] mb-1.5"
            >
              Nama Instansi / Lembaga
            </label>
            <input
              id="prof-org"
              type="text"
              value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm text-[#4A3542]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="prof-team"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Nama Tim Kerja
              </label>
              <input
                id="prof-team"
                type="text"
                value={form.teamName}
                onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm text-[#4A3542]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-time"
                className="block text-xs font-bold text-[#5D4353] mb-1.5"
              >
                Jam Publikasi Bawaan (WIB)
              </label>
              <input
                id="prof-time"
                type="time"
                value={form.defaultTime}
                onChange={(e) =>
                  setForm({ ...form, defaultTime: e.target.value })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF6F8] border border-[#E0C8D6] text-sm text-[#4A3542] tabular-nums"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#7B9980] hover:bg-[#68856D] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save size={15} />
              <span>Simpan Profil & Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
