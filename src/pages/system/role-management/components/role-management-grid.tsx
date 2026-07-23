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
import { Plus, Search, ShieldCheck, SquarePen, Trash2 } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { ROLE_ITEMS_DATA } from './data';
import { RoleFormDialog, type RoleFormValues } from './role-form-dialog';
import { RoleRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

function NameCell({ data }: ICellRendererParams<RoleRow>) {
  if (!data) return null;
  return (
    <div className="flex items-center gap-2 h-full">
      <ShieldCheck className="size-4 text-muted-foreground shrink-0" />
      <span className="font-medium text-foreground truncate">{data.name}</span>
      {data.isSystem && (
        <Badge variant="outline" size="sm">
          기본
        </Badge>
      )}
    </div>
  );
}

export function RoleManagementGrid() {
  const { resolvedTheme } = useTheme();
  const [rows, setRows] = useState<RoleRow[]>(ROLE_ITEMS_DATA);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RoleRow | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<RoleRow | undefined>(undefined);

  const handleToggleEnabled = (id: number, enabled: boolean) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, enabled } : row)));
  };

  const handleOpenAdd = () => {
    setEditingRow(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (row: RoleRow) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleSubmit = (values: RoleFormValues) => {
    if (editingRow) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingRow.id
            ? {
                ...row,
                name: values.name,
                code: values.code,
                description: values.description ?? '',
                enabled: values.enabled,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : row,
        ),
      );
      toast.success('역할이 수정되었습니다.');
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setRows((prev) => [
        ...prev,
        {
          id: nextId,
          name: values.name,
          code: values.code,
          description: values.description ?? '',
          userCount: 0,
          isSystem: false,
          enabled: values.enabled,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
      ]);
      toast.success('새 역할이 추가되었습니다.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    toast.success('역할이 삭제되었습니다.');
    setDeleteTarget(undefined);
  };

  const columnDefs = useMemo<ColDef<RoleRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 70, sortable: true },
      {
        headerName: '역할명',
        field: 'name',
        flex: 1.2,
        sortable: true,
        filter: true,
        cellRenderer: NameCell,
      },
      { headerName: '역할 코드', field: 'code', flex: 1, sortable: true, filter: true },
      { headerName: '설명', field: 'description', flex: 2 },
      {
        headerName: '사용자 수',
        field: 'userCount',
        width: 110,
        sortable: true,
        cellClass: 'text-center',
        headerClass: 'text-center',
      },
      {
        headerName: '사용여부',
        field: 'enabled',
        width: 120,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<RoleRow, boolean>) => {
          if (!params.data) return null;
          return (
            <div className="flex items-center h-full gap-2">
              <Switch
                checked={params.data.enabled}
                onCheckedChange={(checked) => handleToggleEnabled(params.data!.id, checked)}
              />
              <Badge variant={params.data.enabled ? 'success' : 'secondary'} appearance="light" size="sm">
                {params.data.enabled ? '활성' : '비활성'}
              </Badge>
            </div>
          );
        },
      },
      { headerName: '수정일', field: 'updatedAt', width: 130, sortable: true },
      {
        headerName: '액션',
        width: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<RoleRow>) => {
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
                disabled={params.data.isSystem}
                onClick={() => setDeleteTarget(params.data)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(() => ({ resizable: true }), []);

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>역할 목록</CardTitle>
        </CardHeading>
        <CardToolbar className="gap-2.5">
          <InputWrapper>
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder="역할명, 코드 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-56"
            />
          </InputWrapper>
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus className="size-4" />
            새 역할 추가
          </Button>
        </CardToolbar>
      </CardHeader>
      <div className="p-3">
        <AgGridReact<RoleRow>
          theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
          rowData={rows}
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

      <RoleFormDialog
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
            <AlertDialogTitle>역할을 삭제하시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} 역할이 삭제됩니다. 이 역할이 부여된 사용자는 권한을 잃게 되며, 이 작업은
              되돌릴 수 없습니다.
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
  );
}
