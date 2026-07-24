import { ReactNode } from 'react';

interface ScreenHeaderProps {
  eyebrow: string;
  title: ReactNode;
  rightSlot?: ReactNode;
}

export function ScreenHeader({ eyebrow, title, rightSlot }: ScreenHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-8 pb-2">
      <div className="flex flex-col gap-2 min-w-0">
        <span className="text-xs font-medium text-amber-300/80 tracking-wide">{eyebrow}</span>
        <h1 className="text-xl font-bold text-white leading-snug">{title}</h1>
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}
