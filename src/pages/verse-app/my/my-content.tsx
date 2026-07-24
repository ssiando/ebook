import { useState } from 'react';
import { Bell, HelpCircle, LogOut, Megaphone, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CURRENT_USER, ScreenHeader, SectionTitle } from '../shared';
import { SettingsList } from './components/settings-list';

export function MyContent() {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [challengeAlertEnabled, setChallengeAlertEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <ScreenHeader eyebrow="My" title="나의 암송 여정" />

      <div className="px-5 flex items-center gap-4">
        <div className="flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl font-bold text-white shrink-0">
          {CURRENT_USER.name.slice(0, 1)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-semibold text-white truncate">{CURRENT_USER.name}</span>
          <span className="text-xs text-slate-400 truncate">{CURRENT_USER.email}</span>
        </div>
      </div>

      <div className="px-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 grid grid-cols-3 divide-x divide-white/10">
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-white">{CURRENT_USER.completedVerseCount}</span>
            <span className="text-[11px] text-slate-400">암송 완료 절</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-white">{CURRENT_USER.streakDays}일</span>
            <span className="text-[11px] text-slate-400">연속 학습</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-white">{CURRENT_USER.accuracyRate}%</span>
            <span className="text-[11px] text-slate-400">암송 정확도</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle title="알림 설정" />
        <div className="px-5">
          <SettingsList
            items={[
              {
                type: 'toggle',
                key: 'push',
                icon: Bell,
                label: '오늘의 암송 리마인드 알림',
                checked: pushEnabled,
                onToggle: () => setPushEnabled((prev) => !prev),
              },
              {
                type: 'toggle',
                key: 'challenge-alert',
                icon: Megaphone,
                label: '챌린지 소식 알림',
                checked: challengeAlertEnabled,
                onToggle: () => setChallengeAlertEnabled((prev) => !prev),
              },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle title="계정" />
        <div className="px-5">
          <SettingsList
            items={[
              {
                type: 'link',
                key: 'account',
                icon: UserRound,
                label: '계정 정보',
                description: CURRENT_USER.email,
                onClick: () => toast.info('계정 정보 화면은 준비 중이에요.'),
              },
              {
                type: 'link',
                key: 'privacy',
                icon: ShieldCheck,
                label: '개인정보 및 보안',
                onClick: () => toast.info('개인정보 설정 화면은 준비 중이에요.'),
              },
              {
                type: 'link',
                key: 'help',
                icon: HelpCircle,
                label: '고객센터 및 문의',
                onClick: () => toast.info('고객센터 화면은 준비 중이에요.'),
              },
              {
                type: 'link',
                key: 'logout',
                icon: LogOut,
                label: '로그아웃',
                destructive: true,
                onClick: () => navigate('/auth/signin'),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
