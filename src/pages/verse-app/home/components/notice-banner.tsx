import { ChevronRight, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NoticeRow } from '@/pages/verse-management/shared';

interface NoticeBannerProps {
  notice: NoticeRow;
}

export function NoticeBanner({ notice }: NoticeBannerProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(notice.linkPath)}
      className="w-full flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-start hover:bg-white/10 transition-colors"
    >
      <Megaphone className="size-4 text-pink-400 shrink-0" />
      <span className="text-sm text-slate-200 truncate grow">{notice.message}</span>
      <ChevronRight className="size-4 text-slate-500 shrink-0" />
    </button>
  );
}
