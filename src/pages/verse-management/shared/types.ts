export type MemorizationStage = '1단계' | '2단계' | '3단계(초성보기)' | '4단계' | '암송완료';

export interface VerseRow {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
  category: string;
  stage: MemorizationStage;
  accuracyRate: number;
  reviewCycle: string;
  nextReviewDate: string;
  createdAt: string;
}

export type ChallengeStatus = '진행중' | '예정' | '종료';

export interface ChallengeRow {
  id: number;
  title: string;
  description: string;
  book: string;
  startDate: string;
  endDate: string;
  totalVerses: number;
  completedVerses: number;
  participantCount: number;
  status: ChallengeStatus;
}

export interface NoticeRow {
  id: number;
  message: string;
  linkPath: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserStudyStatRow {
  id: number;
  name: string;
  email: string;
  progressRate: number;
  accuracyRate: number;
  completedVerseCount: number;
  streakDays: number;
  lastStudyDate: string;
}
