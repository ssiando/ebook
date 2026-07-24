import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CHALLENGE_ITEMS_DATA, ChallengeStatus } from '@/pages/verse-management/shared';
import { ChallengeCard, ScreenHeader } from '../shared';

const FILTER_OPTIONS: Array<ChallengeStatus | '전체'> = ['전체', '진행중', '예정', '종료'];

export function ChallengeContent() {
  const [filter, setFilter] = useState<ChallengeStatus | '전체'>('전체');

  const challenges =
    filter === '전체'
      ? CHALLENGE_ITEMS_DATA
      : CHALLENGE_ITEMS_DATA.filter((challenge) => challenge.status === filter);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <ScreenHeader eyebrow="챌린지" title="함께 도전하고 완주해보세요 🏆" />

      <div className="px-5 flex items-center gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
              filter === option
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white/5 text-slate-400 hover:bg-white/10',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-3">
        {challenges.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
            해당하는 챌린지가 없어요.
          </div>
        ) : (
          challenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
        )}
      </div>
    </div>
  );
}
