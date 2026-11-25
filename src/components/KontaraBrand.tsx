import React from 'react';
import {
  Camera,
  CheckCircle2,
  Clock,
  Film,
  Globe,
  Linkedin,
  MessageSquareText,
  Newspaper,
  PlaySquare,
  Sparkles,
  CircleDashed,
  Loader2,
  CalendarCheck2,
  Send,
} from 'lucide-react';
import { ContentLifecycleStatus, MediaPlatform, StageStatus } from '../types/kontara';

interface KontaraLogoProps {
  compact?: boolean;
  showText?: boolean;
}

export const KontaraLogo: React.FC<KontaraLogoProps> = ({
  compact = false,
  showText = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2.5 shrink-0">
      <svg
        width={compact ? 42 : 54}
        height={compact ? 34 : 44}
        viewBox="0 0 88 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Diagonal sage-green elliptical orbit */}
        <path
          d="M19 52C10 50 7 41 13 31C19 21 34 14 51 13C66 12 76 18 75 27C74 36 62 45 45 48C33 50 24 51 19 52Z"
          stroke="#95A492"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Inner cutout mask feeling via clean overlapping shapes */}
        {/* Sage-green vertical stem with graceful top serif flare */}
        <path
          d="M27 11C31 11 35 12.5 36.5 16V49C34.5 52 30.5 53 28 53V18C28 14.5 26 12.5 24 11.5L27 11Z"
          fill="#99A895"
        />
        {/* Botanical leaves sprouting from lower left of stem */}
        <path
          d="M28 51C24.5 46 21.5 40 22 33C26.5 36.5 29 43 28 51Z"
          fill="#A7B5A3"
        />
        <path
          d="M27.5 51.5C21 49.5 16.5 44.5 15.5 39C20.5 40 25 44.5 27.5 51.5Z"
          fill="#8B9B87"
        />
        {/* Dusty mauve upper-right sweeping petal arm of K */}
        <path
          d="M32 34C38 25 47 17 58 14C59.5 21.5 55 29 45 34.5L32 34Z"
          fill="#C290AD"
        />
        {/* Dusty mauve lower-right flowing serif leg of K */}
        <path
          d="M30 36.5C37 32.5 45 33 50 40C54.5 46.5 59.5 54 67.5 56.5C61.5 59.5 53 58 47 51C42.5 45.8 39 39.5 30 38.5V36.5Z"
          fill="#B3809E"
        />
        {/* 4-point sparkle above the K monogram */}
        <path
          d="M64 4L66 10L72 12L66 14L64 20L62 14L56 12L62 10L64 4Z"
          fill="#B3809E"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="inline-flex items-start gap-0.5">
            <span
              className={`font-logo font-semibold tracking-tight text-[#9B6B88] whitespace-nowrap ${
                compact ? 'text-[22px]' : 'text-[26px]'
              }`}
            >
              Kontara
            </span>
            <svg
              width={compact ? 11 : 13}
              height={compact ? 11 : 13}
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            >
              <path
                d="M10 1L12.2 7.8L19 10L12.2 12.2L10 19L7.8 12.2L1 10L7.8 7.8L10 1Z"
                fill="#B3809E"
              />
            </svg>
          </div>
          <span className="text-[10px] font-light tracking-[0.04em] text-[#6B7E68] whitespace-nowrap mt-0.5">
            Plan • Manage • Communicate
          </span>
        </div>
      )}
    </div>
  );
};

export const MediaPlatformIcon: React.FC<{
  media: MediaPlatform;
  size?: 'sm' | 'md' | 'lg';
}> = ({ media, size = 'md' }) => {
  const boxClass =
    size === 'lg'
      ? 'w-12 h-12 rounded-2xl'
      : size === 'sm'
      ? 'w-8 h-8 rounded-xl'
      : 'w-10 h-10 rounded-xl';
  const iconSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 19;

  switch (media) {
    case 'Instagram Post':
      return (
        <div
          className={`${boxClass} flex items-center justify-center text-white shrink-0 shadow-sm`}
          style={{
            background:
              'linear-gradient(135deg, #F58529 0%, #DD2A7B 52%, #8134AF 100%)',
          }}
        >
          <Camera size={iconSize} />
        </div>
      );
    case 'Instagram Reels':
      return (
        <div
          className={`${boxClass} flex items-center justify-center text-white shrink-0 shadow-sm`}
          style={{
            background:
              'linear-gradient(135deg, #C13584 0%, #E1306C 55%, #F77737 100%)',
          }}
        >
          <Film size={iconSize} />
        </div>
      );
    case 'TikTok':
      return (
        <div
          className={`${boxClass} bg-[#4A3542] flex items-center justify-center text-white shrink-0 shadow-sm`}
        >
          <PlaySquare size={iconSize} />
        </div>
      );
    case 'YouTube':
      return (
        <div
          className={`${boxClass} bg-[#C85A6B] flex items-center justify-center text-white shrink-0 shadow-sm`}
        >
          <PlaySquare size={iconSize} />
        </div>
      );
    case 'Siaran Pers':
      return (
        <div
          className={`${boxClass} bg-[#6E8B73] flex items-center justify-center text-white shrink-0 shadow-sm`}
        >
          <Newspaper size={iconSize} />
        </div>
      );
    case 'X (Twitter)':
      return (
        <div
          className={`${boxClass} bg-[#6E5466] flex items-center justify-center text-white shrink-0 shadow-sm`}
        >
          <MessageSquareText size={iconSize} />
        </div>
      );
    case 'LinkedIn':
      return (
        <div
          className={`${boxClass} bg-[#5C7A89] flex items-center justify-center text-white shrink-0 shadow-sm`}
        >
          <Linkedin size={iconSize} />
        </div>
      );
    default:
      return (
        <div
          className={`${boxClass} bg-[#8A657C] flex items-center justify-center text-white shrink-0 shadow-sm`}
        >
          <Globe size={iconSize} />
        </div>
      );
  }
};

export const LifecycleStatusBadge: React.FC<{
  status: ContentLifecycleStatus;
}> = ({ status }) => {
  const styles: Record<
    ContentLifecycleStatus,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    'Dalam Proses': {
      bg: 'bg-[#E3EEF7]',
      text: 'text-[#315D80]',
      border: 'border-[#C7DDF0]',
      icon: <Loader2 size={12} className="shrink-0" />,
    },
    'Menunggu Review': {
      bg: 'bg-[#FBEAD8]',
      text: 'text-[#875021]',
      border: 'border-[#F0D3B4]',
      icon: <Clock size={12} className="shrink-0" />,
    },
    Terjadwal: {
      bg: 'bg-white',
      text: 'text-[#55705A]',
      border: 'border-[#C9DEC9]',
      icon: <CalendarCheck2 size={12} className="shrink-0" />,
    },
    Terbit: {
      bg: 'bg-[#F3E2EC]',
      text: 'text-[#744862]',
      border: 'border-[#DFC2D4]',
      icon: <Send size={12} className="shrink-0" />,
    },
    Selesai: {
      bg: 'bg-[#DCE9DD]',
      text: 'text-[#3B5E41]',
      border: 'border-[#B8D1BA]',
      icon: <CheckCircle2 size={12} className="shrink-0" />,
    },
  };

  const current = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold whitespace-nowrap shrink-0 ${current.bg} ${current.text} ${current.border}`}
    >
      {current.icon}
      <span>{status}</span>
    </span>
  );
};

export const StageStatusBadge: React.FC<{
  status: StageStatus;
}> = ({ status }) => {
  const styles: Record<
    StageStatus,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    'Belum Dimulai': {
      bg: 'bg-[#F5F2F4]',
      text: 'text-[#6D5B66]',
      border: 'border-[#E3DAE0]',
      icon: <CircleDashed size={11} className="shrink-0" />,
    },
    'Dalam Proses': {
      bg: 'bg-[#E3EEF7]',
      text: 'text-[#315D80]',
      border: 'border-[#C7DDF0]',
      icon: <Sparkles size={11} className="shrink-0" />,
    },
    'Menunggu Review': {
      bg: 'bg-[#FBEAD8]',
      text: 'text-[#875021]',
      border: 'border-[#F0D3B4]',
      icon: <Clock size={11} className="shrink-0" />,
    },
    Selesai: {
      bg: 'bg-[#DCE9DD]',
      text: 'text-[#3B5E41]',
      border: 'border-[#B8D1BA]',
      icon: <CheckCircle2 size={11} className="shrink-0" />,
    },
  };

  const current = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-semibold whitespace-nowrap shrink-0 ${current.bg} ${current.text} ${current.border}`}
    >
      {current.icon}
      <span>{status}</span>
    </span>
  );
};
