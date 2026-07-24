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
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardHeading, CardTitle, CardToolbar } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { NOTICE_ITEMS_DATA } from '../../shared/data';
import { NoticeRow } from '../../shared/types';
import { NoticeFormDialog, type NoticeFormValues } from './notice-form-dialog';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

export function NoticeManagementGrid() {
  const { resolvedTheme } = useTheme();
  const [rows, setRows] = useState<NoticeRow[]>(NOTICE_ITEMS_DATA);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<NoticeRow | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<NoticeRow | undefined>(undefined);

  const totalCount = rows.length;
  const activeCount = rows.filter((row) => row.isActive).length;

  const handleToggleActive = (id: number, isActive: boolean) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, isActive } : row)));
  };

  const handleOpenAdd = () => {
    setEditingRow(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (row: NoticeRow) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleSubmit = (values: NoticeFormValues) => {
    if (editingRow) {
      setRows((prev) =>
        prev.map((row) => (row.id === editingRow.id ? { ...row, ...values } : row)),
      );
      toast.success('공지사항이 수정되었습니다.');
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setRows((prev) => [
        ...prev,
        { id: nextId, createdAt: new Date().toISOString().slice(0, 10), ...values },
      ]);
      toast.success('새 공지사항이 추가되었습니다.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    toast.success('공지사항이 삭제되었습니다.');
    setDeleteTarget(undefined);
  };

  const columnDefs = useMemo<ColDef<NoticeRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 70, sortable: true },
      { headerName: '공지 메시지', field: 'message', flex: 1.8, sortable: true, filter: true },
      { headerName: '연결 화면', field: 'linkPath', flex: 1, sortable: true },
      {
        headerName: '활성화',
        width: 100,
        sortable: true,
        cellClass: 'flex items-center justify-center',
        headerClass: 'text-center',
        cellRenderer: (params: ICellRendererParams<NoticeRow, boolean>) => {
          if (!params.data) return null;
          return (
            <Switch
              checked={params.data.isActive}
              onCheckedChange={(checked) => handleToggleActive(params.data!.id, checked)}
            />
          );
        },
      },
      { headerName: '등록일', field: 'createdAt', width: 130, sortable: true },
      {
        headerName: '액션',
        width: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<NoticeRow>) => {
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
    [],
  );

  const defaultColDef = useMemo<ColDef>(() => ({ resizable: true }), []);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-7.5">
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">전체 공지사항</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{totalCount}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">활성 공지사항</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-green-600">{activeCount}</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>공지사항 목록</CardTitle>
          </CardHeading>
          <CardToolbar className="gap-2.5">
            <InputWrapper>
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="메시지 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-56"
              />
            </InputWrapper>
            <Button variant="primary" onClick={handleOpenAdd}>
              <Plus className="size-4" />
              새 공지 추가
            </Button>
          </CardToolbar>
        </CardHeader>
        <div className="p-3">
          <AgGridReact<NoticeRow>
            theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
            rowData={rows}
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

        <NoticeFormDialog
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
              <AlertDialogTitle>공지사항을 삭제하시겠어요?</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{deleteTarget?.message}&quot; 공지가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
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
