import { useNavigate } from 'react-router-dom';

interface SectionTitleProps {
  title: string;
  linkLabel?: string;
  linkPath?: string;
}

export function SectionTitle({ title, linkLabel = '전체보기 →', linkPath }: SectionTitleProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-5">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {linkPath && (
        <button
          type="button"
          onClick={() => navigate(linkPath)}
          className="text-xs font-medium text-amber-300/80 hover:text-amber-300"
        >
          {linkLabel}
        </button>
      )}
    </div>
  );
}
