import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VerseRow } from '@/pages/verse-management/shared';

interface ReviewListCardProps {
  verses: VerseRow[];
}

export function ReviewListCard({ verses }: ReviewListCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10 overflow-hidden">
      {verses.map((verse) => (
        <button
          key={verse.id}
          type="button"
          onClick={() => navigate('/verse-app/recite', { state: { verseId: verse.id } })}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-white/5 transition-colors"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white">{verse.reference}</span>
            <span className="text-xs text-slate-400">{verse.reviewCycle}</span>
          </div>
          <ChevronRight className="size-4 text-slate-500 shrink-0" />
        </button>
      ))}
    </div>
  );
}
