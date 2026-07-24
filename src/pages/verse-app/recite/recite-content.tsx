import { useState } from 'react';
import { ArrowLeft, Check, Eye, RotateCcw, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VERSE_ITEMS_DATA } from '@/pages/verse-management/shared';
import { ScreenHeader, toChoseong } from '../shared';

export function ReciteContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialVerseId = (location.state as { verseId?: number } | null)?.verseId;

  const queue = VERSE_ITEMS_DATA;
  const foundIndex = queue.findIndex((verse) => verse.id === initialVerseId);

  const [index, setIndex] = useState(foundIndex === -1 ? 0 : foundIndex);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const verse = queue[index];
  const progress = Math.round(((index + 1) / queue.length) * 100);
  const correctCount = Object.values(results).filter(Boolean).length;

  const goNext = (remembered?: boolean) => {
    if (remembered !== undefined) {
      setResults((prev) => ({ ...prev, [verse.id]: remembered }));
    }
    setRevealed(false);
    setIndex((prev) => (prev + 1 < queue.length ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      <ScreenHeader
        eyebrow={`암송 학습 · ${index + 1}/${queue.length}`}
        title={verse.reference}
        rightSlot={
          <button
            type="button"
            onClick={() => navigate('/verse-app/home')}
            className="flex items-center justify-center size-9 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </button>
        }
      />

      <div className="px-5">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 min-h-52 flex flex-col justify-center gap-4">
          <span className="text-xs font-semibold text-amber-300">
            {verse.category} · 암송 {verse.stage}
          </span>
          <p className="text-lg font-medium text-white leading-relaxed">
            {revealed ? verse.text : toChoseong(verse.text)}
          </p>
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
          >
            <Eye className="size-4" />
            정답 보기
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => goNext(false)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/15 transition-colors"
            >
              <X className="size-4 text-rose-400" />
              기억 안남
            </button>
            <button
              type="button"
              onClick={() => goNext(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
            >
              <Check className="size-4" />
              기억했어요
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => goNext()}
          className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
        >
          <RotateCcw className="size-3.5" />
          건너뛰기
        </button>
      </div>

      <div className="px-5 flex items-center justify-between text-xs text-slate-400">
        <span>이번 세션 정답 {correctCount}개</span>
        <span>총 {queue.length}개 구절</span>
      </div>
    </div>
  );
}
