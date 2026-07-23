import { MenuItemRow } from './types';

export const MENU_ITEMS_DATA: MenuItemRow[] = [
  { id: 1, parentId: null, title: '홈', path: '/', icon: 'Home', order: 1, enabled: true, updatedAt: '2026-07-01' },
  { id: 2, parentId: null, title: '시스템', path: '', icon: 'Settings', order: 2, enabled: true, updatedAt: '2026-07-01' },
  { id: 3, parentId: 2, title: '사용자', path: '', icon: 'Users', order: 1, enabled: true, updatedAt: '2026-07-01' },
  { id: 4, parentId: 3, title: '사용자 관리', path: '/system/users/manage', icon: 'UserCog', order: 1, enabled: true, updatedAt: '2026-07-08' },
  { id: 5, parentId: 3, title: '사용자 초대', path: '/system/users/invite', icon: 'UserPlus', order: 2, enabled: true, updatedAt: '2026-07-02' },
  { id: 6, parentId: 3, title: '사용자 일괄 초대', path: '/system/users/bulk-invite', icon: 'Upload', order: 3, enabled: true, updatedAt: '2026-06-24' },
  { id: 7, parentId: 3, title: '역할 관리', path: '/system/users/roles', icon: 'ShieldCheck', order: 4, enabled: true, updatedAt: '2026-07-11' },
  { id: 8, parentId: 3, title: '사용자별 역할 관리', path: '/system/users/roles-by-user', icon: 'UserCog', order: 5, enabled: true, updatedAt: '2026-07-11' },
  { id: 9, parentId: 3, title: '역할별 사용자 관리', path: '/system/users/users-by-role', icon: 'Users', order: 6, enabled: true, updatedAt: '2026-07-11' },
  { id: 10, parentId: 2, title: '보안 및 정책', path: '', icon: 'ShieldAlert', order: 2, enabled: true, updatedAt: '2026-06-30' },
  { id: 11, parentId: 10, title: '접근 정책', path: '/system/security/access-policy', icon: 'Lock', order: 1, enabled: true, updatedAt: '2026-06-30' },
  { id: 12, parentId: 10, title: '비밀번호 정책', path: '/system/security/password-policy', icon: 'Key', order: 2, enabled: true, updatedAt: '2026-06-30' },
  { id: 13, parentId: 2, title: '시스템 마스터', path: '', icon: 'Database', order: 3, enabled: true, updatedAt: '2026-06-20' },
  { id: 14, parentId: 13, title: '코드 관리', path: '/system/master/codes', icon: 'ListTree', order: 1, enabled: true, updatedAt: '2026-06-20' },
  { id: 15, parentId: 2, title: '외부 연동', path: '', icon: 'Plug', order: 4, enabled: true, updatedAt: '2026-05-15' },
  { id: 16, parentId: 15, title: 'API 연동 관리', path: '/system/integration/api', icon: 'Plug', order: 1, enabled: false, updatedAt: '2026-05-15' },
  { id: 17, parentId: null, title: '알림', path: '', icon: 'Bell', order: 3, enabled: true, updatedAt: '2026-07-15' },
  { id: 18, parentId: 17, title: '알림 대상 관리', path: '/notification/targets', icon: 'Users', order: 1, enabled: true, updatedAt: '2026-07-15' },
  { id: 19, parentId: 17, title: '알림 템플릿 관리', path: '/notification/templates', icon: 'FileText', order: 2, enabled: true, updatedAt: '2026-07-15' },
  { id: 20, parentId: 17, title: '발송 로그 모니터링', path: '/notification/logs', icon: 'ScrollText', order: 3, enabled: true, updatedAt: '2026-07-21' },
];
