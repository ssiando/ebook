import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VerseRow } from '@/pages/verse-management/shared';

interface TodayRecitationCardProps {
  verse: VerseRow;
}

export function TodayRecitationCard({ verse }: TodayRecitationCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-white/5 to-white/5 p-5 flex flex-col gap-4">
      <span className="text-xs font-semibold text-amber-300">오늘의 암송 · 이어서 학습하기</span>
      <p className="text-lg font-medium text-white leading-relaxed">&quot;{verse.text}&quot;</p>
      <span className="text-xs text-slate-400">
        {verse.reference} · 암송 {verse.stage}
      </span>
      <button
        type="button"
        onClick={() => navigate('/verse-app/recite', { state: { verseId: verse.id } })}
        className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
      >
        이어서 학습
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
