export interface MenuItemRow {
  id: number;
  parentId: number | null;
  title: string;
  path: string;
  icon: string;
  order: number;
  enabled: boolean;
  updatedAt: string;
}

export const MENU_ICON_OPTIONS = [
  'Home',
  'Settings',
  'Users',
  'UserCog',
  'UserPlus',
  'Upload',
  'ShieldCheck',
  'ShieldAlert',
  'Lock',
  'Key',
  'Database',
  'ListTree',
  'Plug',
  'Bell',
  'FileText',
  'ScrollText',
  'LayoutGrid',
  'Folder',
] as const;
