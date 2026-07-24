import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToggleItem {
  type: 'toggle';
  key: string;
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

interface LinkItem {
  type: 'link';
  key: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  destructive?: boolean;
}

type SettingsListItem = ToggleItem | LinkItem;

export function SettingsList({ items }: { items: SettingsListItem[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10 overflow-hidden">
      {items.map((item) => {
        const Icon = item.icon;

        if (item.type === 'toggle') {
          return (
            <div key={item.key} className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Icon className="size-4 text-slate-400" />
                <span className="text-sm text-slate-200">{item.label}</span>
              </div>
              <button
                type="button"
                onClick={item.onToggle}
                className={cn(
                  'relative h-6 w-10 rounded-full transition-colors',
                  item.checked ? 'bg-amber-400' : 'bg-white/15',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-5 rounded-full bg-white transition-transform',
                    item.checked ? 'translate-x-4.5' : 'translate-x-0.5',
                  )}
                />
              </button>
            </div>
          );
        }

        return (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-start hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon className={cn('size-4', item.destructive ? 'text-rose-400' : 'text-slate-400')} />
              <div className="flex flex-col min-w-0">
                <span className={cn('text-sm', item.destructive ? 'text-rose-400' : 'text-slate-200')}>
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-xs text-slate-500">{item.description}</span>
                )}
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-500 shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
