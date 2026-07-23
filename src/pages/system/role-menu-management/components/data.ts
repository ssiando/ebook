import { RoleMenuPermission } from './types';

export const ROLE_MENU_PERMISSIONS_DATA: RoleMenuPermission[] = [
  // 어드민: 전체 메뉴 접근
  { roleId: 1, menuIds: Array.from({ length: 20 }, (_, i) => i + 1) },
  // 워크스페이스 관리자: 외부 연동을 제외한 전체
  {
    roleId: 2,
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20],
  },
  // RBAC Member: 홈, 사용자 관련 일부
  { roleId: 3, menuIds: [1, 3, 4, 7] },
  // RBAC Viewer: 홈, 조회 위주
  { roleId: 4, menuIds: [1, 4, 7] },
  // 운영자: 홈, 알림 전체
  { roleId: 5, menuIds: [1, 2, 17, 18, 19, 20] },
  // 감사자: 홈, 보안 및 정책, 발송 로그 모니터링
  { roleId: 6, menuIds: [1, 10, 11, 12, 20] },
];
