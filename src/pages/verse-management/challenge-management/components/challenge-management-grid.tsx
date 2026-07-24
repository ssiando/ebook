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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CHALLENGE_ITEMS_DATA } from '../../shared/data';
import { ChallengeRow, ChallengeStatus } from '../../shared/types';
import { ChallengeFormDialog, type ChallengeFormValues } from './challenge-form-dialog';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

const STATUS_FILTER_OPTIONS: Array<ChallengeStatus | '전체'> = ['전체', '예정', '진행중', '종료'];

function statusBadgeVariant(status: ChallengeStatus) {
  if (status === '진행중') return 'success' as const;
  if (status === '예정') return 'info' as const;
  return 'secondary' as const;
}

function TitleCell({ data }: ICellRendererParams<ChallengeRow>) {
  if (!data) return null;
  return (
    <div className="flex flex-col min-w-0 justify-center h-full">
      <span className="font-medium text-foreground truncate">{data.title}</span>
      <span className="text-xs text-secondary-foreground truncate max-w-90">{data.book}</span>
    </div>
  );
}

function ProgressCell({ data }: ICellRendererParams<ChallengeRow>) {
  if (!data) return null;
  const rate = data.totalVerses ? Math.round((data.completedVerses / data.totalVerses) * 100) : 0;
  return (
    <div className="flex flex-col justify-center h-full gap-1 w-full">
      <div className="flex items-center justify-between text-xs text-secondary-foreground">
        <span>
          {data.completedVerses}/{data.totalVerses}절
        </span>
        <span>{rate}%</span>
      </div>
      <Progress value={rate} className="h-1.5" />
    </div>
  );
}

export function ChallengeManagementGrid() {
  const { resolvedTheme } = useTheme();
  const [rows, setRows] = useState<ChallengeRow[]>(CHALLENGE_ITEMS_DATA);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus | '전체'>('전체');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ChallengeRow | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<ChallengeRow | undefined>(undefined);

  const filteredRows = useMemo(
    () => (statusFilter === '전체' ? rows : rows.filter((row) => row.status === statusFilter)),
    [rows, statusFilter],
  );

  const totalCount = rows.length;
  const ongoingCount = rows.filter((row) => row.status === '진행중').length;
  const totalParticipants = rows.reduce((sum, row) => sum + row.participantCount, 0);

  const handleOpenAdd = () => {
    setEditingRow(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (row: ChallengeRow) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const handleSubmit = (values: ChallengeFormValues) => {
    if (editingRow) {
      setRows((prev) =>
        prev.map((row) => (row.id === editingRow.id ? { ...row, ...values } : row)),
      );
      toast.success('챌린지가 수정되었습니다.');
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setRows((prev) => [...prev, { id: nextId, ...values }]);
      toast.success('새 챌린지가 추가되었습니다.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    toast.success('챌린지가 삭제되었습니다.');
    setDeleteTarget(undefined);
  };

  const columnDefs = useMemo<ColDef<ChallengeRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 70, sortable: true },
      {
        headerName: '챌린지',
        field: 'title',
        flex: 1.4,
        sortable: true,
        filter: true,
        cellRenderer: TitleCell,
      },
      {
        headerName: '기간',
        flex: 1,
        sortable: true,
        valueGetter: (params) =>
          params.data ? `${params.data.startDate} ~ ${params.data.endDate}` : '-',
      },
      {
        headerName: '진행률',
        flex: 1,
        sortable: false,
        cellRenderer: ProgressCell,
      },
      { headerName: '참여자수', field: 'participantCount', width: 110, sortable: true },
      {
        headerName: '상태',
        field: 'status',
        width: 110,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<ChallengeRow>) => {
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
      {
        headerName: '액션',
        width: 110,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<ChallengeRow>) => {
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
              <span className="text-sm text-secondary-foreground">전체 챌린지</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{totalCount}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">진행중 챌린지</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-green-600">{ongoingCount}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">누적 참여자수</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">
            {totalParticipants.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>챌린지 목록</CardTitle>
          </CardHeading>
          <CardToolbar className="gap-2.5">
            <InputWrapper>
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="챌린지명 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-56"
              />
            </InputWrapper>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ChallengeStatus | '전체')}
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
              새 챌린지 추가
            </Button>
          </CardToolbar>
        </CardHeader>
        <div className="p-3">
          <AgGridReact<ChallengeRow>
            theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
            rowData={filteredRows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={search}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            domLayout="autoHeight"
            rowHeight={58}
            headerHeight={40}
          />
        </div>

        <ChallengeFormDialog
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
              <AlertDialogTitle>챌린지를 삭제하시겠어요?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget?.title} 챌린지가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
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
