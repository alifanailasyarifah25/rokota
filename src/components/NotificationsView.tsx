import React from 'react';
import {
  Bell,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { ContentItem, NotificationItem } from '../types/kontara';
import { KontaraLogo } from './KontaraBrand';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  contents: ContentItem[];
  onBackHome: () => void;
  onMarkAllRead: () => void;
  onClickNotification: (notif: NotificationItem) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  contents,
  onBackHome,
  onMarkAllRead,
  onClickNotification,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'review':
        return <Clock size={18} className="text-[#875021]" />;
      case 'evaluasi':
        return <RotateCcw size={18} className="text-[#8A657C]" />;
      case 'sukses':
        return <CheckCircle2 size={18} className="text-[#3B5E41]" />;
      default:
        return <CalendarClock size={18} className="text-[#5B7860]" />;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-0 pt-4 pb-8 space-y-5">
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

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#DCE9DD] hover:bg-[#CBE0CD] text-[#3B5E41] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck size={15} />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#6F5164] tracking-tight">
          Notifikasi & Pengingat
        </h1>
        <p className="text-sm text-[#7D6674] mt-0.5">
          Pembaruan jadwal publikasi, antrean review, dan siklus evaluasi kehumasan
        </p>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3 max-w-3xl">
          {notifications.map((notif) => {
            const linked = notif.contentId
              ? contents.find((c) => c.id === notif.contentId)
              : undefined;

            return (
              <button
                key={notif.id}
                type="button"
                onClick={() => onClickNotification(notif)}
                className={`w-full text-left rounded-2xl p-4 border flex items-start gap-3.5 transition-colors cursor-pointer ${
                  notif.read
                    ? 'bg-white/80 border-[#E7CEDB] hover:bg-white'
                    : 'bg-[#F8E7F0] border-[#D8B5C9] hover:bg-[#F3DCE8] shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E7CEDB] flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-[#4A3542]">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="text-[11px] font-bold text-[#8A657C] shrink-0">
                        Baru
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6F5164] mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  {linked && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B7860] mt-2">
                      <span>Buka progres konten</span>
                      <ChevronRight size={13} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/85 rounded-3xl p-8 border border-[#E7CEDB] text-center max-w-xl">
          <Bell size={28} className="mx-auto text-[#9E788F]" />
          <p className="text-sm font-medium text-[#6F5164] mt-3">
            Belum ada notifikasi aktivitas saat ini.
          </p>
        </div>
      )}
    </div>
  );
};
