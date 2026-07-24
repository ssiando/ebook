import { MemorizationStage, VerseRow } from '@/pages/verse-management/shared';

const STAGE_ORDER: MemorizationStage[] = [
  '1단계',
  '2단계',
  '3단계(초성보기)',
  '4단계',
  '암송완료',
];

interface StageBreakdownProps {
  verses: VerseRow[];
}

export function StageBreakdown({ verses }: StageBreakdownProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 grid grid-cols-5 gap-2">
      {STAGE_ORDER.map((stage) => {
        const count = verses.filter((verse) => verse.stage === stage).length;
        return (
          <div key={stage} className="flex flex-col items-center gap-1.5 text-center">
            <span className="text-lg font-bold text-white">{count}</span>
            <span className="text-[10px] leading-tight text-slate-400">{stage}</span>
          </div>
        );
      })}
    </div>
  );
}
