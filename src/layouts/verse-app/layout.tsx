import { Outlet } from 'react-router-dom';
import { BottomNav } from './components/bottom-nav';

export function VerseAppLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex justify-center">
      <div className="w-full max-w-110 min-h-screen relative flex flex-col bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <main className="flex-1 overflow-y-auto pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
