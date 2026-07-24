import { VerseRow } from '@/pages/verse-management/shared';

interface CategoryProgressListProps {
  verses: VerseRow[];
}

export function CategoryProgressList({ verses }: CategoryProgressListProps) {
  const categories = Array.from(new Set(verses.map((verse) => verse.category))).map((category) => {
    const items = verses.filter((verse) => verse.category === category);
    const completed = items.filter((verse) => verse.stage === '암송완료').length;
    return { category, total: items.length, completed };
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10 overflow-hidden">
      {categories.map(({ category, total, completed }) => {
        const rate = total ? Math.round((completed / total) * 100) : 0;
        return (
          <div key={category} className="px-4 py-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white">{category}</span>
              <span className="text-xs text-slate-400">
                {completed}/{total}절
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-green-400"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
