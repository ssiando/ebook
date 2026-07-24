import { ClipboardList, Home, Mic, Trophy, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: '홈', path: '/verse-app/home', icon: Home },
  { label: '암송', path: '/verse-app/recite', icon: Mic },
  { label: '학습관리', path: '/verse-app/study', icon: ClipboardList },
  { label: '챌린지', path: '/verse-app/challenge', icon: Trophy },
  { label: 'My', path: '/verse-app/my', icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 flex justify-center">
      <div className="w-full max-w-110 border-t border-white/10 bg-slate-950/95 backdrop-blur supports-backdrop-blur:bg-slate-950/80">
        <div className="grid grid-cols-5">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors',
                  isActive ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300',
                )
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
