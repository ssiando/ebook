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
import { VERSE_ITEMS_DATA } from '../../shared/data';
import { MemorizationStage, VerseRow } from '../../shared/types';
import { VerseFormDialog, type VerseFormValues } from './verse-form-dialog';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

const STAGE_FILTER_OPTIONS: Array<MemorizationStage | '전체'> = [
  '전체',
  '1단계',
  '2단계',
  '3단계(초성보기)',
  '4단계',
  '암송완료',
];

function stageBadgeVariant(stage: MemorizationStage) {
  if (stage === '암송완료') return 'success' as const;
  if (stage === '4단계' || stage === '3단계(초성보기)') return 'info' as const;
  return 'secondary' as const;
}

function ReferenceCell({ data }: ICellRendererParams<VerseRow>) {
  if (!data) return null;
  return (
    <div className="flex flex-col min-w-0 justify-center h-full">
      <span className="font-medium text-foreground">{data.reference}</span>
      <span className="text-xs text-secondary-foreground truncate max-w-100">{data.text}</span>
    </div>
  );
}

export function VerseListGrid() {
  const { resolvedTheme } = useTheme();
  const [rows, setRows] = useState<VerseRow[]>(VERSE_ITEMS_DATA);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<MemorizationStage | '전체'>('전체');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<VerseRow | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<VerseRow | undefined>(undefined);

  const filteredRows = useMemo(
    () => (stageFilter === '전체' ? rows : rows.filter((row) => row.stage === stageFilter)),
    [rows, stageFilter],
  );

  const totalCount = rows.length;
  const completedCount = rows.filter((row) => row.stage === '암송완료').length;
  const averageAccuracy = totalCount
    ? Math.round(rows.reduce((sum, row) => sum + row.accuracyRate, 0) / totalCount)
    : 0;

  const handleOpenAdd = () => {
    setEditingRow(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (row: VerseRow) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleSubmit = (values: VerseFormValues) => {
    const reference = `${values.book === '요한계시록' ? '계' : values.book} ${values.chapter}:${values.verse}`;

    if (editingRow) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingRow.id
            ? {
                ...row,
                ...values,
                reference,
              }
            : row,
        ),
      );
      toast.success('암송 구절이 수정되었습니다.');
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setRows((prev) => [
        ...prev,
        {
          id: nextId,
          reference,
          createdAt: new Date().toISOString().slice(0, 10),
          ...values,
        },
      ]);
      toast.success('새 암송 구절이 추가되었습니다.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    toast.success('암송 구절이 삭제되었습니다.');
    setDeleteTarget(undefined);
  };

  const columnDefs = useMemo<ColDef<VerseRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 70, sortable: true },
      {
        headerName: '성경구절',
        field: 'reference',
        flex: 1.6,
        sortable: true,
        filter: true,
        cellRenderer: ReferenceCell,
      },
      { headerName: '분류', field: 'category', flex: 1, sortable: true, filter: true },
      {
        headerName: '암송 단계',
        field: 'stage',
        width: 150,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<VerseRow>) => {
          if (!params.data) return null;
          return (
            <div className="flex items-center h-full">
              <Badge variant={stageBadgeVariant(params.data.stage)} appearance="light" size="sm">
                {params.data.stage}
              </Badge>
            </div>
          );
        },
      },
      {
        headerName: '정확도',
        field: 'accuracyRate',
        width: 100,
        sortable: true,
        valueFormatter: (params) => `${params.value}%`,
      },
      { headerName: '다음 복습일', field: 'nextReviewDate', width: 130, sortable: true },
      {
        headerName: '액션',
        width: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<VerseRow>) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7.5">
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">전체 등록 구절</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{totalCount}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">암송 완료 구절</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-green-600">{completedCount}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">평균 정확도</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{averageAccuracy}%</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>암송 구절 목록</CardTitle>
          </CardHeading>
          <CardToolbar className="gap-2.5">
            <InputWrapper>
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="구절 또는 본문 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-56"
              />
            </InputWrapper>
            <Select
              value={stageFilter}
              onValueChange={(value) => setStageFilter(value as MemorizationStage | '전체')}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGE_FILTER_OPTIONS.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="primary" onClick={handleOpenAdd}>
              <Plus className="size-4" />
              새 구절 추가
            </Button>
          </CardToolbar>
        </CardHeader>
        <div className="p-3">
          <AgGridReact<VerseRow>
            theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
            rowData={filteredRows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={search}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            domLayout="autoHeight"
            rowHeight={56}
            headerHeight={40}
          />
        </div>

        <VerseFormDialog
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
              <AlertDialogTitle>암송 구절을 삭제하시겠어요?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget?.reference} 구절이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
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
