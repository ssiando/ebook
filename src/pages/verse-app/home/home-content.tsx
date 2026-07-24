import { NOTICE_ITEMS_DATA } from '@/pages/verse-management/shared';
import {
  ChallengeCard,
  CURRENT_STREAK_DAYS,
  CURRENT_USER,
  FEATURED_VERSE,
  MY_CHALLENGE,
  ProgressRingStat,
  ReviewListCard,
  ScreenHeader,
  SectionTitle,
  StreakTracker,
  TODAY_REVIEW_VERSES,
} from '../shared';
import { NoticeBanner } from './components/notice-banner';
import { TodayRecitationCard } from './components/today-recitation-card';

export function HomeContent() {
  const activeNotice = NOTICE_ITEMS_DATA.find((notice) => notice.isActive);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <ScreenHeader
        eyebrow="마음판 · 요한계시록"
        title={
          <>
            오늘도 말씀과
            <br />
            함께하세요 ✨
          </>
        }
        rightSlot={
          <div className="flex items-center justify-center size-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg">
            🙏
          </div>
        }
      />

      <div className="px-5">
        <TodayRecitationCard verse={FEATURED_VERSE} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle title="나의 암송 현황" />
        <div className="px-5">
          <StreakTracker days={CURRENT_STREAK_DAYS} streakDays={CURRENT_USER.streakDays} />
        </div>
      </div>

      <div className="px-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center justify-around">
          <ProgressRingStat
            label="학습 진도율"
            value={CURRENT_USER.progressRate}
            colorClassName="text-amber-400"
          />
          <ProgressRingStat
            label="암송 정확도"
            value={CURRENT_USER.accuracyRate}
            colorClassName="text-green-400"
          />
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {CURRENT_USER.completedVerseCount}
            </span>
            <span className="text-xs text-slate-400">암송 완료 절</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle title="오늘의 복습" linkPath="/verse-app/study" />
        <div className="px-5">
          <ReviewListCard verses={TODAY_REVIEW_VERSES} />
        </div>
      </div>

      {activeNotice && (
        <div className="px-5">
          <NoticeBanner notice={activeNotice} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <SectionTitle title="나의 챌린지" linkPath="/verse-app/challenge" />
        <div className="px-5">
          <ChallengeCard challenge={MY_CHALLENGE} />
        </div>
      </div>
    </div>
  );
}
