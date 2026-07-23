import { useMemo, useState } from 'react';
import {
  AllCommunityModule,
  colorSchemeDark,
  colorSchemeLight,
  type ColDef,
  type ICellRendererParams,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardHeading, CardTitle, CardToolbar } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { resolveMenuIcon } from '../../menu-management/components/icon-map';
import { MENU_ITEMS_DATA } from '../../menu-management/components/data';
import { MenuItemRow } from '../../menu-management/components/types';
import { ROLE_ITEMS_DATA } from '../../role-management/components/data';
import { ROLE_MENU_PERMISSIONS_DATA } from './data';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

function buildPermissionMap() {
  const map = new Map<number, Set<number>>();
  ROLE_MENU_PERMISSIONS_DATA.forEach((entry) => {
    map.set(entry.roleId, new Set(entry.menuIds));
  });
  return map;
}

function MenuTitleCell({ data }: ICellRendererParams<MenuItemRow>) {
  if (!data) return null;
  const Icon = resolveMenuIcon(data.icon);
  return (
    <div className="flex items-center gap-2 h-full">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <span className="font-medium text-foreground truncate">{data.title}</span>
    </div>
  );
}

export function RoleMenuManagementGrid() {
  const { resolvedTheme } = useTheme();
  const [permissions, setPermissions] = useState<Map<number, Set<number>>>(buildPermissionMap);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(String(ROLE_ITEMS_DATA[0].id));
  const [search, setSearch] = useState('');

  const parentTitleMap = useMemo(() => {
    const map = new Map<number, string>();
    MENU_ITEMS_DATA.forEach((row) => map.set(row.id, row.title));
    return map;
  }, []);

  const roleId = Number(selectedRoleId);
  const selectedRole = ROLE_ITEMS_DATA.find((role) => role.id === roleId);
  const grantedCount = permissions.get(roleId)?.size ?? 0;

  const handleTogglePermission = (menuId: number, allowed: boolean) => {
    setPermissions((prev) => {
      const next = new Map(prev);
      const current = new Set(next.get(roleId) ?? []);
      if (allowed) {
        current.add(menuId);
      } else {
        current.delete(menuId);
      }
      next.set(roleId, current);
      return next;
    });
  };

  const handleSelectAll = (allowed: boolean) => {
    setPermissions((prev) => {
      const next = new Map(prev);
      next.set(roleId, allowed ? new Set(MENU_ITEMS_DATA.map((row) => row.id)) : new Set());
      return next;
    });
    toast.success(allowed ? '모든 메뉴 접근이 허용되었습니다.' : '모든 메뉴 접근이 해제되었습니다.');
  };

  const columnDefs = useMemo<ColDef<MenuItemRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 70, sortable: true },
      {
        headerName: '메뉴명',
        field: 'title',
        flex: 1.3,
        sortable: true,
        filter: true,
        cellRenderer: MenuTitleCell,
      },
      {
        headerName: '상위메뉴',
        flex: 1,
        sortable: true,
        filter: true,
        valueGetter: (params) =>
          params.data?.parentId != null
            ? (parentTitleMap.get(params.data.parentId) ?? '-')
            : '최상위',
      },
      {
        headerName: '경로',
        field: 'path',
        flex: 1.3,
        valueFormatter: (params) => params.value || '-',
      },
      {
        headerName: '접근 허용',
        width: 140,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<MenuItemRow>) => {
          if (!params.data) return null;
          const allowed = permissions.get(roleId)?.has(params.data.id) ?? false;
          return (
            <div className="flex items-center h-full gap-2">
              <Switch
                checked={allowed}
                onCheckedChange={(checked) => handleTogglePermission(params.data!.id, checked)}
              />
              <Badge variant={allowed ? 'success' : 'secondary'} appearance="light" size="sm">
                {allowed ? '허용' : '차단'}
              </Badge>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentTitleMap, permissions, roleId],
  );

  const defaultColDef = useMemo<ColDef>(() => ({ resizable: true }), []);

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>역할별 메뉴 접근 권한</CardTitle>
        </CardHeading>
        <CardToolbar className="gap-2.5">
          <InputWrapper>
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder="메뉴명, 경로 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-56"
            />
          </InputWrapper>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="역할 선택" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_ITEMS_DATA.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardToolbar>
      </CardHeader>
      <div className="flex items-center justify-between px-5 pt-3.5 flex-wrap gap-2.5">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-secondary-foreground">선택한 역할:</span>
          <span className="font-medium text-foreground">{selectedRole?.name}</span>
          <span className="text-secondary-foreground">·</span>
          <span className="text-secondary-foreground">
            접근 가능 메뉴 {grantedCount}/{MENU_ITEMS_DATA.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => handleSelectAll(true)}
          >
            전체 허용
          </button>
          <span className="text-border">|</span>
          <button
            type="button"
            className="text-xs font-medium text-destructive hover:underline"
            onClick={() => handleSelectAll(false)}
          >
            전체 해제
          </button>
        </div>
      </div>
      <div className="p-3">
        <AgGridReact<MenuItemRow>
          theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
          rowData={MENU_ITEMS_DATA}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={search}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          domLayout="autoHeight"
          rowHeight={48}
          headerHeight={40}
        />
      </div>
    </Card>
  );
}
