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
import { Switch } from '@/components/ui/switch';
import { resolveMenuIcon } from './icon-map';
import { MENU_ITEMS_DATA } from './data';
import { MenuFormDialog, type MenuFormValues } from './menu-form-dialog';
import { MenuItemRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

function getDescendantIds(rows: MenuItemRow[], id: number): number[] {
  const children = rows.filter((row) => row.parentId === id);
  return children.flatMap((child) => [child.id, ...getDescendantIds(rows, child.id)]);
}

function TitleCell({ data }: ICellRendererParams<MenuItemRow>) {
  if (!data) return null;
  const Icon = resolveMenuIcon(data.icon);
  return (
    <div className="flex items-center gap-2 h-full">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <span className="font-medium text-foreground truncate">{data.title}</span>
    </div>
  );
}

export function MenuManagementGrid() {
  const { resolvedTheme } = useTheme();
  const [rows, setRows] = useState<MenuItemRow[]>(MENU_ITEMS_DATA);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MenuItemRow | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemRow | undefined>(undefined);

  const parentTitleMap = useMemo(() => {
    const map = new Map<number, string>();
    rows.forEach((row) => map.set(row.id, row.title));
    return map;
  }, [rows]);

  const handleToggleEnabled = (id: number, enabled: boolean) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, enabled } : row)));
  };

  const handleOpenAdd = () => {
    setEditingRow(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (row: MenuItemRow) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleSubmit = (values: MenuFormValues) => {
    const parentId = values.parentId === 'none' ? null : Number(values.parentId);

    if (editingRow) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingRow.id
            ? {
                ...row,
                title: values.title,
                path: values.path ?? '',
                icon: values.icon,
                order: values.order,
                parentId,
                enabled: values.enabled,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : row,
        ),
      );
      toast.success('메뉴가 수정되었습니다.');
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setRows((prev) => [
        ...prev,
        {
          id: nextId,
          parentId,
          title: values.title,
          path: values.path ?? '',
          icon: values.icon,
          order: values.order,
          enabled: values.enabled,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
      ]);
      toast.success('새 메뉴가 추가되었습니다.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const idsToRemove = new Set([deleteTarget.id, ...getDescendantIds(rows, deleteTarget.id)]);
    setRows((prev) => prev.filter((row) => !idsToRemove.has(row.id)));
    toast.success('메뉴가 삭제되었습니다.');
    setDeleteTarget(undefined);
  };

  const parentOptions = useMemo(() => {
    if (!editingRow) return rows;
    const excluded = new Set([editingRow.id, ...getDescendantIds(rows, editingRow.id)]);
    return rows.filter((row) => !excluded.has(row.id));
  }, [rows, editingRow]);

  const columnDefs = useMemo<ColDef<MenuItemRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 80, sortable: true },
      {
        headerName: '메뉴명',
        field: 'title',
        flex: 1.3,
        sortable: true,
        filter: true,
        cellRenderer: TitleCell,
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
        headerName: '정렬순서',
        field: 'order',
        width: 110,
        editable: true,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 1, max: 999 },
        cellClass: 'text-center',
        headerClass: 'text-center',
      },
      {
        headerName: '노출여부',
        field: 'enabled',
        width: 120,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<MenuItemRow, boolean>) => {
          if (!params.data) return null;
          return (
            <div className="flex items-center h-full gap-2">
              <Switch
                checked={params.data.enabled}
                onCheckedChange={(checked) => handleToggleEnabled(params.data!.id, checked)}
              />
              <Badge variant={params.data.enabled ? 'success' : 'secondary'} appearance="light" size="sm">
                {params.data.enabled ? '노출' : '숨김'}
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
        cellRenderer: (params: ICellRendererParams<MenuItemRow>) => {
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
    [parentTitleMap],
  );

  const defaultColDef = useMemo<ColDef>(() => ({ resizable: true }), []);

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>메뉴 목록</CardTitle>
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
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus className="size-4" />
            새 메뉴 추가
          </Button>
        </CardToolbar>
      </CardHeader>
      <div className="p-3">
        <AgGridReact<MenuItemRow>
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

      <MenuFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={editingRow}
        parentOptions={parentOptions}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메뉴를 삭제하시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} 메뉴{getDescendantIds(rows, deleteTarget?.id ?? -1).length > 0
                ? '와 하위 메뉴가 모두'
                : '가'}{' '}
              삭제됩니다. 이 작업은 되돌릴 수 없습니다.
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
