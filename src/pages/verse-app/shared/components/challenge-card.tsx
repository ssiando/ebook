import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChallengeRow } from '@/pages/verse-management/shared';
import { getDDay } from '../current-user';

const STATUS_STYLES: Record<ChallengeRow['status'], string> = {
  진행중: 'bg-amber-400/15 text-amber-300',
  예정: 'bg-sky-400/15 text-sky-300',
  종료: 'bg-white/10 text-slate-400',
};

interface ChallengeCardProps {
  challenge: ChallengeRow;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const rate = challenge.totalVerses
    ? Math.round((challenge.completedVerses / challenge.totalVerses) * 100)
    : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center size-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0">
            <Trophy className="size-4 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{challenge.title}</span>
            <span className="text-xs text-slate-400 truncate">{challenge.book}</span>
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
            STATUS_STYLES[challenge.status],
          )}
        >
          {challenge.status === '진행중' ? getDDay(challenge.endDate) : challenge.status}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-green-400"
            style={{ width: `${rate}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">
          {challenge.completedVerses} / {challenge.totalVerses}절 완료
        </span>
      </div>
    </div>
  );
}
