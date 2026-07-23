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
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { ROLE_ITEMS_DATA } from '../../role-management/components/data';
import { USER_ITEMS_DATA } from './data';
import { UserFormDialog, type UserFormValues } from './user-form-dialog';
import { UserRow, UserStatus } from './types';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

const STATUS_FILTER_OPTIONS: Array<UserStatus | '전체'> = ['전체', '활성', '휴면', '비활성'];

function statusBadgeVariant(status: UserStatus) {
  if (status === '활성') return 'success' as const;
  if (status === '휴면') return 'info' as const;
  return 'secondary' as const;
}

function UserCell({ data }: ICellRendererParams<UserRow>) {
  if (!data) return null;
  return (
    <div className="flex items-center gap-2.5 h-full">
      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
        {data.avatarLabel}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-foreground truncate">{data.name}</span>
        <span className="text-xs text-secondary-foreground truncate">{data.email}</span>
      </div>
    </div>
  );
}

export function UserManagementGrid() {
  const { resolvedTheme } = useTheme();
  const [rows, setRows] = useState<UserRow[]>(USER_ITEMS_DATA);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | '전체'>('전체');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<UserRow | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | undefined>(undefined);

  const roleNameMap = useMemo(() => {
    const map = new Map<number, string>();
    ROLE_ITEMS_DATA.forEach((role) => map.set(role.id, role.name));
    return map;
  }, []);

  const filteredRows = useMemo(
    () => (statusFilter === '전체' ? rows : rows.filter((row) => row.status === statusFilter)),
    [rows, statusFilter],
  );

  const totalCount = rows.length;
  const activeCount = rows.filter((row) => row.status === '활성').length;
  const inactiveCount = totalCount - activeCount;

  const handleToggleAdmin = (id: number, isWorkspaceAdmin: boolean) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, isWorkspaceAdmin } : row)));
  };

  const handleOpenAdd = () => {
    setEditingRow(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (row: UserRow) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleSubmit = (values: UserFormValues) => {
    if (editingRow) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingRow.id
            ? {
                ...row,
                name: values.name,
                email: values.email,
                roleId: Number(values.roleId),
                status: values.status,
                isWorkspaceAdmin: values.isWorkspaceAdmin,
              }
            : row,
        ),
      );
      toast.success('사용자 정보가 수정되었습니다.');
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setRows((prev) => [
        ...prev,
        {
          id: nextId,
          name: values.name,
          email: values.email,
          avatarLabel: values.name.slice(0, 1),
          roleId: Number(values.roleId),
          isWorkspaceAdmin: values.isWorkspaceAdmin,
          status: values.status,
          lastLogin: '-',
        },
      ]);
      toast.success('새 사용자가 추가되었습니다.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    toast.success('사용자가 삭제되었습니다.');
    setDeleteTarget(undefined);
  };

  const columnDefs = useMemo<ColDef<UserRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 70, sortable: true },
      {
        headerName: '이름 / 이메일',
        field: 'name',
        flex: 1.4,
        sortable: true,
        filter: true,
        cellRenderer: UserCell,
      },
      {
        headerName: '역할',
        flex: 1,
        sortable: true,
        filter: true,
        valueGetter: (params) =>
          params.data ? (roleNameMap.get(params.data.roleId) ?? '-') : '-',
      },
      {
        headerName: '워크스페이스 관리자',
        width: 160,
        sortable: true,
        cellClass: 'flex items-center justify-center',
        headerClass: 'text-center',
        cellRenderer: (params: ICellRendererParams<UserRow, boolean>) => {
          if (!params.data) return null;
          return (
            <Switch
              checked={params.data.isWorkspaceAdmin}
              onCheckedChange={(checked) => handleToggleAdmin(params.data!.id, checked)}
            />
          );
        },
      },
      {
        headerName: '상태',
        field: 'status',
        width: 110,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<UserRow>) => {
          if (!params.data) return null;
          return (
            <div className="flex items-center h-full">
              <Badge variant={statusBadgeVariant(params.data.status)} appearance="light" size="sm">
                {params.data.status}
              </Badge>
            </div>
          );
        },
      },
      { headerName: '마지막 로그인', field: 'lastLogin', width: 170, sortable: true },
      {
        headerName: '액션',
        width: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<UserRow>) => {
          if (!params.data) return null;
          return (
            <div className="flex items-center h-full gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => handleOpenEdit(params.data!)}
              >
                <SquarePen className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(params.data)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleNameMap],
  );

  const defaultColDef = useMemo<ColDef>(() => ({ resizable: true }), []);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7.5">
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">전체 사용자</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{totalCount}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">활성 사용자</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-green-600">{activeCount}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">휴면·비활성 사용자</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{inactiveCount}</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>사용자 목록</CardTitle>
          </CardHeading>
          <CardToolbar className="gap-2.5">
            <InputWrapper>
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="이름 또는 이메일 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-56"
              />
            </InputWrapper>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as UserStatus | '전체')}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="primary" onClick={handleOpenAdd}>
              <Plus className="size-4" />
              새 사용자 추가
            </Button>
          </CardToolbar>
        </CardHeader>
        <div className="p-3">
          <AgGridReact<UserRow>
            theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
            rowData={filteredRows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={search}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            domLayout="autoHeight"
            rowHeight={54}
            headerHeight={40}
          />
        </div>

        <UserFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          initialValues={editingRow}
          onSubmit={handleSubmit}
        />

        <AlertDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>사용자를 삭제하시겠어요?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget?.name} ({deleteTarget?.email}) 계정이 삭제됩니다. 이 작업은 되돌릴 수
                없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
