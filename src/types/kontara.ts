export type StageStatus =
  | 'Belum Dimulai'
  | 'Dalam Proses'
  | 'Menunggu Review'
  | 'Selesai';

export type ContentLifecycleStatus =
  | 'Dalam Proses'
  | 'Menunggu Review'
  | 'Terjadwal'
  | 'Terbit'
  | 'Selesai';

export type WorkflowStepId =
  | 'tujuan'
  | 'pesan'
  | 'media'
  | 'penjadwalan'
  | 'kesesuaian'
  | 'review'
  | 'publikasi'
  | 'evaluasi';

export type MediaPlatform =
  | 'Instagram Post'
  | 'Instagram Reels'
  | 'TikTok'
  | 'YouTube'
  | 'Siaran Pers'
  | 'X (Twitter)'
  | 'LinkedIn';

export type ContentFormat =
  | 'Infografis'
  | 'Carousel Edukasi'
  | 'Video Pendek'
  | 'Siaran Pers'
  | 'Artikel Berita'
  | 'Poster Digital'
  | 'Foto Dokumentasi';

export type SentimentType = 'Positif' | 'Netral' | 'Negatif';

export interface IterationLog {
  id: string;
  cycle: number;
  timestamp: string;
  type: 'Revisi Konten & Jadwal' | 'Siklus Perbaikan Evaluasi' | 'Persetujuan & Publikasi';
  reason: string;
  actionTaken: string;
}

export interface MonitoringData {
  reach: number;
  interactions: number;
  sentiment: SentimentType;
  mediaMentions: number;
  publicNotes: string;
  updatedAt: string;
}

export interface EvaluationData {
  isPositive: boolean | null;
  contentEval: string;
  mediaEval: string;
  strategyEval: string;
  improvementPlan: string;
  evaluatedAt?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  purpose: string;
  message: string;
  media: MediaPlatform;
  format: ContentFormat;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description: string;
  currentStage: WorkflowStepId;
  stageStatuses: Record<WorkflowStepId, StageStatus>;
  cycleNumber: number;
  revisionNote?: string;
  monitoring: MonitoringData;
  evaluation: EvaluationData;
  iterationLogs: IterationLog[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  contentId?: string;
  createdAt: string;
  read: boolean;
  type: 'jadwal' | 'review' | 'evaluasi' | 'sukses';
}

export interface WorkspaceProfile {
  orgName: string;
  teamName: string;
  leadName: string;
  roleTitle: string;
  defaultTime: string;
}

export type AppView =
  | 'home'
  | 'kalender'
  | 'monitoring'
  | 'evaluasi'
  | 'notifikasi'
  | 'profil'
  | 'pengaturan'
  | 'alur';

export interface ContentFormValues {
  title: string;
  purpose: string;
  message: string;
  media: MediaPlatform;
  format: ContentFormat;
  date: string;
  time: string;
  description: string;
}
