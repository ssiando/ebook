export type UserStatus = '활성' | '휴면' | '비활성';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  avatarLabel: string;
  roleId: number;
  isWorkspaceAdmin: boolean;
  status: UserStatus;
  lastLogin: string;
}
