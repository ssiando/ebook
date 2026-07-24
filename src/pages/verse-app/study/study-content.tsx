import { VERSE_ITEMS_DATA } from '@/pages/verse-management/shared';
import {
  CURRENT_STREAK_DAYS,
  CURRENT_USER,
  ProgressRingStat,
  ReviewListCard,
  ScreenHeader,
  SectionTitle,
  StreakTracker,
} from '../shared';
import { CategoryProgressList } from './components/category-progress-list';
import { StageBreakdown } from './components/stage-breakdown';

export function StudyContent() {
  const sortedByReview = [...VERSE_ITEMS_DATA].sort((a, b) =>
    a.nextReviewDate.localeCompare(b.nextReviewDate),
  );

  return (
    <div className="flex flex-col gap-6 pb-6">
      <ScreenHeader eyebrow="학습관리" title="나의 암송 학습을 관리해보세요" />

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

      <div className="px-5">
        <StreakTracker days={CURRENT_STREAK_DAYS} streakDays={CURRENT_USER.streakDays} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle title="암송 단계별 현황" />
        <div className="px-5">
          <StageBreakdown verses={VERSE_ITEMS_DATA} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle title="분류별 학습 현황" />
        <div className="px-5">
          <CategoryProgressList verses={VERSE_ITEMS_DATA} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle title="전체 복습 일정" />
        <div className="px-5">
          <ReviewListCard verses={sortedByReview} />
        </div>
      </div>
    </div>
  );
}
