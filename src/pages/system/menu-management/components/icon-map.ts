import {
  Bell,
  Database,
  FileText,
  Folder,
  Home,
  Key,
  LayoutGrid,
  ListTree,
  Lock,
  type LucideIcon,
  Plug,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserCog,
  UserPlus,
  Users,
} from 'lucide-react';

export const MENU_ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Settings,
  Users,
  UserCog,
  UserPlus,
  Upload,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Database,
  ListTree,
  Plug,
  Bell,
  FileText,
  ScrollText,
  LayoutGrid,
  Folder,
};

export function resolveMenuIcon(name: string): LucideIcon {
  return MENU_ICON_MAP[name] ?? Folder;
}
