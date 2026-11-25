import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  GitBranch,
  Home,
  PieChart,
  Plus,
  Settings,
  User,
  X,
} from 'lucide-react';
import {
  AppView,
  ContentFormValues,
  ContentItem,
  ContentLifecycleStatus,
  MonitoringData,
  NotificationItem,
  StageStatus,
  WorkflowStepId,
  WorkspaceProfile,
} from './types/kontara';
import {
  DEFAULT_PROFILE,
  INITIAL_CONTENTS,
  INITIAL_NOTIFICATIONS,
} from './data/seedData';
import {
  loadContents,
  loadNotifications,
  loadProfile,
  saveContents,
  saveNotifications,
  saveProfile,
} from './utils/kontaraStorage';
import { KontaraLogo } from './components/KontaraBrand';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { ContentFormModal } from './components/ContentFormModal';
import { ContentDetailSheet } from './components/ContentDetailSheet';
import { MonitoringView } from './components/MonitoringView';
import { EvaluationView } from './components/EvaluationView';
import { FlowchartView } from './components/FlowchartView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileSettingsView } from './components/ProfileSettingsView';

export default function App() {
  const [contents, setContents] = useState<ContentItem[]>(() => loadContents());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadNotifications()
  );
  const [profile, setProfile] = useState<WorkspaceProfile>(() => loadProfile());

  const [activeView, setActiveView] = useState<AppView>('home');
  const [calendarMode, setCalendarMode] = useState<'kalender' | 'menu'>('kalender');
  const [calendarFilter, setCalendarFilter] = useState<
    'Semua' | ContentLifecycleStatus
  >('Semua');

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formDefaultDate, setFormDefaultDate] = useState('2026-11-24');

  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [focusedMonitoringId, setFocusedMonitoringId] = useState<string | null>(
    null
  );
  const [focusedEvaluationId, setFocusedEvaluationId] = useState<string | null>(
    null
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveContents(contents);
  }, [contents]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const selectedContent =
    contents.find((c) => c.id === selectedContentId) ?? null;

  const pushNotification = (
    notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>
  ) => {
    const entry: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [entry, ...prev]);
  };

  const handleNavigate = (
    view: AppView,
    filter?: 'Semua' | ContentLifecycleStatus
  ) => {
    if (view === 'kalender') {
      if (filter) {
        setCalendarMode('menu');
        setCalendarFilter(filter);
      } else {
        setCalendarMode('kalender');
        setCalendarFilter('Semua');
      }
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreate = (dateStr = '2026-11-24') => {
    setEditingItem(null);
    setFormDefaultDate(dateStr);
    setFormOpen(true);
  };

  const handleOpenEdit = (item: ContentItem) => {
    setSelectedContentId(null);
    setEditingItem(item);
    setFormDefaultDate(item.date);
    setFormOpen(true);
  };

  const handleSaveContent = (values: ContentFormValues, editingId?: string) => {
    const now = new Date().toISOString();

    if (editingId) {
      setContents((prev) =>
        prev.map((item) => {
          if (item.id !== editingId) return item;
          return {
            ...item,
            ...values,
            currentStage: 'kesesuaian',
            stageStatuses: {
              ...item.stageStatuses,
              tujuan: 'Selesai',
              pesan: 'Selesai',
              media: 'Selesai',
              penjadwalan: 'Selesai',
              kesesuaian:
                item.stageStatuses.kesesuaian === 'Selesai'
                  ? 'Selesai'
                  : 'Dalam Proses',
            },
            revisionNote: undefined,
            updatedAt: now,
          };
        })
      );
      setFormOpen(false);
      setEditingItem(null);
      showToast('Perubahan konten berhasil disimpan dan diperbarui di kalender.');
      return;
    }

    const newItem: ContentItem = {
      id: `knt-${Date.now()}`,
      ...values,
      currentStage: 'kesesuaian',
      stageStatuses: {
        tujuan: 'Selesai',
        pesan: 'Selesai',
        media: 'Selesai',
        penjadwalan: 'Selesai',
        kesesuaian: 'Dalam Proses',
        review: 'Belum Dimulai',
        publikasi: 'Belum Dimulai',
        evaluasi: 'Belum Dimulai',
      },
      cycleNumber: 1,
      monitoring: {
        reach: 0,
        interactions: 0,
        sentiment: 'Netral',
        mediaMentions: 0,
        publicNotes: '',
        updatedAt: now,
      },
      evaluation: {
        isPositive: null,
        contentEval: '',
        mediaEval: '',
        strategyEval: '',
        improvementPlan: '',
      },
      iterationLogs: [],
      createdAt: now,
      updatedAt: now,
    };

    setContents((prev) => [newItem, ...prev]);
    pushNotification({
      title: 'Konten Baru Ditambahkan',
      message: `"${newItem.title}" masuk ke kalender dan siap diperiksa kesesuaian jadwalnya.`,
      contentId: newItem.id,
      type: 'jadwal',
    });
    setFormOpen(false);
    showToast('Konten berhasil disimpan dan ditambahkan ke kalender konten.');
  };

  const handleDeleteContent = (id: string) => {
    const target = contents.find((c) => c.id === id);
    setContents((prev) => prev.filter((c) => c.id !== id));
    setNotifications((prev) => prev.filter((n) => n.contentId !== id));
    setSelectedContentId(null);
    showToast(
      target
        ? `Konten "${target.title}" berhasil dihapus.`
        : 'Konten berhasil dihapus.'
    );
  };

  const handleUpdateStageStatus = (
    id: string,
    stepId: WorkflowStepId,
    status: StageStatus
  ) => {
    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          currentStage: stepId,
          stageStatuses: {
            ...item.stageStatuses,
            [stepId]: status,
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Status tahapan diperbarui menjadi "${status}".`);
  };

  const handleAdvanceToSuitabilityCheck = (id: string) => {
    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          currentStage: 'kesesuaian',
          stageStatuses: {
            ...item.stageStatuses,
            tujuan: 'Selesai',
            pesan: 'Selesai',
            media: 'Selesai',
            penjadwalan: 'Selesai',
            kesesuaian: 'Dalam Proses',
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('Konten masuk ke tahap pemeriksaan kesesuaian konten & jadwal.');
  };

  const handleSuitabilityDecision = (
    id: string,
    isSuitable: boolean,
    reason?: string
  ) => {
    const now = new Date().toISOString();
    const target = contents.find((c) => c.id === id);

    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (isSuitable) {
          return {
            ...item,
            currentStage: 'review',
            revisionNote: undefined,
            stageStatuses: {
              ...item.stageStatuses,
              kesesuaian: 'Selesai',
              review: 'Menunggu Review',
            },
            updatedAt: now,
          };
        }
        return {
          ...item,
          currentStage: 'penjadwalan',
          revisionNote:
            reason || 'Konten atau jadwal perlu disesuaikan pada kalender.',
          stageStatuses: {
            ...item.stageStatuses,
            penjadwalan: 'Dalam Proses',
            kesesuaian: 'Belum Dimulai',
            review: 'Belum Dimulai',
          },
          iterationLogs: [
            {
              id: `log-${Date.now()}`,
              cycle: item.cycleNumber,
              timestamp: now,
              type: 'Revisi Konten & Jadwal',
              reason:
                reason || 'Konten dan jadwal belum sesuai saat pengecekan.',
              actionTaken:
                'Dikembalikan ke tahap penyusunan kalender konten untuk perbaikan.',
            },
            ...item.iterationLogs,
          ],
          updatedAt: now,
        };
      })
    );

    if (isSuitable && target) {
      pushNotification({
        title: 'Menunggu Review & Persetujuan',
        message: `"${target.title}" telah lolos cek kesesuaian dan siap direview.`,
        contentId: id,
        type: 'review',
      });
      showToast('Konten & jadwal sesuai! Berlanjut ke tahap Review & Persetujuan.');
    } else {
      showToast(
        'Konten dikembalikan ke penyusunan kalender untuk perbaikan dan pengecekan ulang.'
      );
    }
  };

  const handleApproveReview = (id: string, approved: boolean, note?: string) => {
    const now = new Date().toISOString();
    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (approved) {
          return {
            ...item,
            currentStage: 'publikasi',
            revisionNote: undefined,
            stageStatuses: {
              ...item.stageStatuses,
              review: 'Selesai',
              publikasi: 'Dalam Proses',
            },
            iterationLogs: [
              {
                id: `log-${Date.now()}`,
                cycle: item.cycleNumber,
                timestamp: now,
                type: 'Persetujuan & Publikasi',
                reason: 'Review dan finalisasi sebelum publikasi disetujui.',
                actionTaken: 'Konten dijadwalkan untuk publikasi resmi.',
              },
              ...item.iterationLogs,
            ],
            updatedAt: now,
          };
        }
        return {
          ...item,
          currentStage: 'penjadwalan',
          revisionNote: note || 'Perlu revisi dari tahap review.',
          stageStatuses: {
            ...item.stageStatuses,
            penjadwalan: 'Dalam Proses',
            kesesuaian: 'Belum Dimulai',
            review: 'Belum Dimulai',
          },
          iterationLogs: [
            {
              id: `log-${Date.now()}`,
              cycle: item.cycleNumber,
              timestamp: now,
              type: 'Revisi Konten & Jadwal',
              reason: note || 'Catatan revisi pada tahap review.',
              actionTaken: 'Dikembalikan ke penyusunan kalender konten.',
            },
            ...item.iterationLogs,
          ],
          updatedAt: now,
        };
      })
    );
    showToast(
      approved
        ? 'Konten disetujui dan berstatus Terjadwal untuk publikasi.'
        : 'Konten dikembalikan ke tahap kalender untuk revisi.'
    );
  };

  const handleMarkPublished = (id: string) => {
    const now = new Date().toISOString();
    const target = contents.find((c) => c.id === id);

    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          currentStage: 'evaluasi',
          stageStatuses: {
            ...item.stageStatuses,
            publikasi: 'Selesai',
            evaluasi: 'Dalam Proses',
          },
          updatedAt: now,
        };
      })
    );

    if (target) {
      pushNotification({
        title: 'Konten Telah Terbit',
        message: `"${target.title}" telah terbit. Lakukan media monitoring dan evaluasi respons publik.`,
        contentId: id,
        type: 'evaluasi',
      });
    }
    showToast('Konten ditandai telah terbit! Silakan pantau pada Media Monitoring.');
  };

  const handleUpdateMonitoring = (id: string, data: MonitoringData) => {
    setContents((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, monitoring: data, updatedAt: new Date().toISOString() }
          : item
      )
    );
    showToast('Data media monitoring berhasil disimpan.');
  };

  const handleEvaluateResponse = (
    id: string,
    payload: {
      isPositive: boolean;
      contentEval: string;
      mediaEval: string;
      strategyEval: string;
      improvementPlan: string;
    },
    openEditAfter = false
  ) => {
    const now = new Date().toISOString();
    const target = contents.find((c) => c.id === id);

    setContents((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (payload.isPositive) {
          return {
            ...item,
            currentStage: 'evaluasi',
            revisionNote: undefined,
            stageStatuses: {
              tujuan: 'Selesai',
              pesan: 'Selesai',
              media: 'Selesai',
              penjadwalan: 'Selesai',
              kesesuaian: 'Selesai',
              review: 'Selesai',
              publikasi: 'Selesai',
              evaluasi: 'Selesai',
            },
            evaluation: {
              ...payload,
              evaluatedAt: now,
            },
            iterationLogs: [
              {
                id: `log-${Date.now()}`,
                cycle: item.cycleNumber,
                timestamp: now,
                type: 'Persetujuan & Publikasi',
                reason: 'Respons publik dinilai positif.',
                actionTaken: `Proses selesai pada Siklus #${item.cycleNumber}.`,
              },
              ...item.iterationLogs,
            ],
            updatedAt: now,
          };
        }

        const nextCycle = item.cycleNumber + 1;
        return {
          ...item,
          cycleNumber: nextCycle,
          currentStage: 'tujuan',
          revisionNote: `Perbaikan Siklus #${nextCycle}: ${payload.improvementPlan}`,
          stageStatuses: {
            tujuan: 'Dalam Proses',
            pesan: 'Dalam Proses',
            media: 'Dalam Proses',
            penjadwalan: 'Dalam Proses',
            kesesuaian: 'Belum Dimulai',
            review: 'Belum Dimulai',
            publikasi: 'Belum Dimulai',
            evaluasi: 'Belum Dimulai',
          },
          evaluation: {
            ...payload,
            evaluatedAt: now,
          },
          iterationLogs: [
            {
              id: `log-${Date.now()}`,
              cycle: item.cycleNumber,
              timestamp: now,
              type: 'Siklus Perbaikan Evaluasi',
              reason: `Respons publik belum positif. Konten: ${payload.contentEval} | Media: ${payload.mediaEval} | Strategi: ${payload.strategyEval}`,
              actionTaken: `Kembali ke Perencanaan Konten (Siklus #${nextCycle}): ${payload.improvementPlan}`,
            },
            ...item.iterationLogs,
          ],
          updatedAt: now,
        };
      })
    );

    if (payload.isPositive) {
      if (target) {
        pushNotification({
          title: 'Proses Komunikasi Selesai',
          message: `Respons publik untuk "${target.title}" positif. Siklus dinyatakan selesai.`,
          contentId: id,
          type: 'sukses',
        });
      }
      showToast('Respons publik positif! Proses konten dinyatakan Selesai.');
    } else {
      if (target) {
        pushNotification({
          title: `Siklus Perbaikan #${target.cycleNumber + 1} Dimulai`,
          message: `"${target.title}" dikembalikan ke tahap perencanaan berdasarkan evaluasi publik.`,
          contentId: id,
          type: 'evaluasi',
        });
      }
      showToast(
        'Evaluasi tersimpan. Konten kembali ke tahap Perencanaan untuk siklus perbaikan.'
      );
      if (openEditAfter && target) {
        setSelectedContentId(null);
        setEditingItem(target);
        setFormDefaultDate(target.date);
        setFormOpen(true);
      }
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const desktopNavItems: {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Beranda', icon: <Home size={18} /> },
    { id: 'kalender', label: 'Kalender Konten', icon: <CalendarDays size={18} /> },
    { id: 'monitoring', label: 'Media Monitoring', icon: <BarChart3 size={18} /> },
    { id: 'evaluasi', label: 'Evaluasi Publik', icon: <PieChart size={18} /> },
    { id: 'alur', label: 'Siklus Iteratif', icon: <GitBranch size={18} /> },
    {
      id: 'notifikasi',
      label: 'Notifikasi',
      icon: <Bell size={18} />,
      badge: unreadNotifications,
    },
    { id: 'profil', label: 'Profil Tim', icon: <User size={18} /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen kontara-gradient-canvas text-[#4A3542] flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-white/92 backdrop-blur-md border-r border-[#E9D7E2] p-5 justify-between z-30">
        <div className="space-y-6">
          <KontaraLogo showText />

          <button
            type="button"
            onClick={() => handleOpenCreate()}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#7B9980] hover:bg-[#69866E] text-white font-display text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Buat Konten</span>
          </button>

          <nav aria-label="Navigasi Utama" className="space-y-1">
            {desktopNavItems.map((nav) => {
              const active = activeView === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => handleNavigate(nav.id)}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#F6E4EE] text-[#5D4353] font-bold'
                      : 'text-[#6F5164] hover:bg-[#FAF3F7] hover:text-[#4A3542]'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className={
                        active ? 'text-[#7B9980]' : 'text-[#8A657C]'
                      }
                    >
                      {nav.icon}
                    </span>
                    <span>{nav.label}</span>
                  </span>
                  {nav.badge && nav.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#8A657C] text-white text-[11px] font-bold tabular-nums">
                      {nav.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#EFE1E9] text-xs text-[#7D6674]">
          <div className="font-bold text-[#5D4353] truncate">
            {profile.leadName}
          </div>
          <div className="truncate">{profile.orgName}</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 pb-24 lg:pb-10">
        <div className="max-w-5xl mx-auto lg:px-8 lg:pt-6">
          {activeView === 'home' && (
            <DashboardView
              contents={contents}
              profile={profile}
              onNavigate={handleNavigate}
              onOpenCreate={() => handleOpenCreate()}
              onSelectContent={(item) => setSelectedContentId(item.id)}
            />
          )}

          {activeView === 'kalender' && (
            <CalendarView
              contents={contents}
              initialMode={calendarMode}
              initialFilter={calendarFilter}
              onBackHome={() => handleNavigate('home')}
              onSelectContent={(item) => setSelectedContentId(item.id)}
              onOpenCreateForDate={(dateStr) => handleOpenCreate(dateStr)}
            />
          )}

          {activeView === 'monitoring' && (
            <MonitoringView
              contents={contents}
              focusedContentId={focusedMonitoringId}
              onBackHome={() => handleNavigate('home')}
              onUpdateMonitoring={handleUpdateMonitoring}
              onGoToEvaluation={(id) => {
                setFocusedEvaluationId(id);
                handleNavigate('evaluasi');
              }}
            />
          )}

          {activeView === 'evaluasi' && (
            <EvaluationView
              contents={contents}
              focusedContentId={focusedEvaluationId}
              onBackHome={() => handleNavigate('home')}
              onEvaluateResponse={handleEvaluateResponse}
              onOpenFlowchart={() => handleNavigate('alur')}
              onSelectContent={(item) => setSelectedContentId(item.id)}
            />
          )}

          {activeView === 'alur' && (
            <FlowchartView
              contents={contents}
              onBackHome={() => handleNavigate('home')}
              onOpenCalendarMenu={() => handleNavigate('kalender', 'Semua')}
            />
          )}

          {activeView === 'notifikasi' && (
            <NotificationsView
              notifications={notifications}
              contents={contents}
              onBackHome={() => handleNavigate('home')}
              onMarkAllRead={() => {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, read: true }))
                );
                showToast('Semua notifikasi ditandai telah dibaca.');
              }}
              onClickNotification={(notif) => {
                setNotifications((prev) =>
                  prev.map((n) =>
                    n.id === notif.id ? { ...n, read: true } : n
                  )
                );
                if (notif.contentId) {
                  const found = contents.find((c) => c.id === notif.contentId);
                  if (found) {
                    setSelectedContentId(found.id);
                  }
                }
              }}
            />
          )}

          {(activeView === 'profil' || activeView === 'pengaturan') && (
            <ProfileSettingsView
              mode={activeView}
              profile={profile}
              contents={contents}
              onBackHome={() => handleNavigate('home')}
              onSaveProfile={(updated) => {
                setProfile(updated);
                showToast('Profil & pengaturan ruang kerja berhasil disimpan.');
              }}
              onResetSeedData={() => {
                setContents(INITIAL_CONTENTS);
                setNotifications(INITIAL_NOTIFICATIONS);
                setProfile(DEFAULT_PROFILE);
                showToast('Data contoh kehumasan berhasil dipulihkan.');
              }}
              onClearAllContents={() => {
                setContents([]);
                setNotifications([]);
                showToast('Daftar konten berhasil dikosongkan.');
              }}
            />
          )}
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar matching Sketches 2 & 3 (<=15% viewport height) */}
      <nav
        aria-label="Navigasi Bawah"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE0E6] shadow-[0_-6px_20px_-10px_rgba(74,53,66,0.16)] px-2 h-16 grid grid-cols-5 items-center"
      >
        <button
          type="button"
          onClick={() => handleNavigate('home')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeView === 'home'
              ? 'text-[#5B7860] font-bold'
              : 'text-[#7D6674]'
          }`}
        >
          <Home size={20} strokeWidth={activeView === 'home' ? 2.4 : 1.9} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate('kalender')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeView === 'kalender'
              ? 'text-[#5B7860] font-bold'
              : 'text-[#7D6674]'
          }`}
        >
          <CalendarDays
            size={20}
            strokeWidth={activeView === 'kalender' ? 2.4 : 1.9}
          />
          <span className="text-[10px] tracking-tight">Kalender</span>
        </button>

        {/* Center protruding circular Sage Green + button */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleOpenCreate()}
            aria-label="Buat Konten Baru"
            className="-mt-6 w-14 h-14 rounded-full bg-[#7B9980] hover:bg-[#68856D] active:scale-95 text-white border-4 border-white shadow-lg flex items-center justify-center transition-transform cursor-pointer"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleNavigate('notifikasi')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 relative cursor-pointer ${
            activeView === 'notifikasi'
              ? 'text-[#5B7860] font-bold'
              : 'text-[#7D6674]'
          }`}
        >
          <div className="relative">
            <Bell
              size={20}
              strokeWidth={activeView === 'notifikasi' ? 2.4 : 1.9}
            />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#8A657C] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                {unreadNotifications}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Notifikasi</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate('profil')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeView === 'profil'
              ? 'text-[#5B7860] font-bold'
              : 'text-[#7D6674]'
          }`}
        >
          <User size={20} strokeWidth={activeView === 'profil' ? 2.4 : 1.9} />
          <span className="text-[10px] tracking-tight">Profil</span>
        </button>
      </nav>

      {/* Content Create / Edit Modal */}
      <ContentFormModal
        isOpen={formOpen}
        editingItem={editingItem}
        defaultDate={formDefaultDate}
        defaultTime={profile.defaultTime}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveContent}
      />

      {/* Content Progress Detail Bottom Sheet */}
      <ContentDetailSheet
        item={selectedContent}
        onClose={() => setSelectedContentId(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteContent}
        onUpdateStageStatus={handleUpdateStageStatus}
        onAdvanceToSuitabilityCheck={handleAdvanceToSuitabilityCheck}
        onSuitabilityDecision={handleSuitabilityDecision}
        onApproveReview={handleApproveReview}
        onMarkPublished={handleMarkPublished}
        onEvaluateResponse={handleEvaluateResponse}
        onOpenMonitoring={(id) => {
          setSelectedContentId(null);
          setFocusedMonitoringId(id);
          handleNavigate('monitoring');
        }}
      />

      {/* Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] max-w-md w-[calc(100%-2rem)] bg-[#4A3542] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#9FD1A7] shrink-0" />
            <span>{toastMessage}</span>
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Tutup notifikasi konfirmasi"
            className="p-1 rounded-lg hover:bg-white/10 cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
