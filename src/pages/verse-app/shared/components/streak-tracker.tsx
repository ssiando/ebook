import { Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeeklyStreakDay } from '@/pages/verse-management/shared';

interface StreakTrackerProps {
  days: WeeklyStreakDay[];
  streakDays: number;
}

export function StreakTracker({ days, streakDays }: StreakTrackerProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-white mb-3">
        <Flame className="size-4 text-orange-400" />
        <span>{streakDays}일 연속 학습 중</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.label} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'flex items-center justify-center size-8 rounded-full',
                day.completed
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                  : 'bg-white/10 text-slate-500',
              )}
            >
              {day.completed && <Check className="size-4" />}
            </div>
            <span className="text-[11px] text-slate-400">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
