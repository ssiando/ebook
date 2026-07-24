import { ProgressCircle } from '@/components/ui/progress';

interface ProgressRingStatProps {
  label: string;
  value: number;
  colorClassName: string;
}

export function ProgressRingStat({ label, value, colorClassName }: ProgressRingStatProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressCircle
        value={value}
        size={72}
        strokeWidth={6}
        trackClassName="text-white/10"
        indicatorClassName={colorClassName}
      >
        <span className="text-base font-bold text-white">{value}%</span>
      </ProgressCircle>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}
