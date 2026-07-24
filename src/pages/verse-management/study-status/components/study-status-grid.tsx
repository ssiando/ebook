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
import { Card, CardHeader, CardHeading, CardTitle, CardToolbar } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { USER_STUDY_STATS_DATA } from '../../shared/data';
import { UserStudyStatRow } from '../../shared/types';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withPart(colorSchemeLight);
const darkTheme = themeQuartz.withPart(colorSchemeDark);

function UserCell({ data }: ICellRendererParams<UserStudyStatRow>) {
  if (!data) return null;
  return (
    <div className="flex items-center gap-2.5 h-full">
      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
        {data.name.slice(0, 1)}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-foreground truncate">{data.name}</span>
        <span className="text-xs text-secondary-foreground truncate">{data.email}</span>
      </div>
    </div>
  );
}

function RateCell({ value }: { value: number }) {
  return (
    <div className="flex flex-col justify-center h-full gap-1 w-full">
      <div className="flex items-center justify-between text-xs text-secondary-foreground">
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

export function StudyStatusGrid() {
  const { resolvedTheme } = useTheme();
  const [rows] = useState<UserStudyStatRow[]>(USER_STUDY_STATS_DATA);
  const [search, setSearch] = useState('');

  const totalUsers = rows.length;
  const averageProgress = totalUsers
    ? Math.round(rows.reduce((sum, row) => sum + row.progressRate, 0) / totalUsers)
    : 0;
  const averageAccuracy = totalUsers
    ? Math.round(rows.reduce((sum, row) => sum + row.accuracyRate, 0) / totalUsers)
    : 0;

  const columnDefs = useMemo<ColDef<UserStudyStatRow>[]>(
    () => [
      { headerName: 'ID', field: 'id', width: 70, sortable: true },
      {
        headerName: '사용자',
        field: 'name',
        flex: 1.4,
        sortable: true,
        filter: true,
        cellRenderer: UserCell,
      },
      {
        headerName: '학습 진도율',
        field: 'progressRate',
        flex: 1,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<UserStudyStatRow>) =>
          params.data ? <RateCell value={params.data.progressRate} /> : null,
      },
      {
        headerName: '암송 정확도',
        field: 'accuracyRate',
        flex: 1,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<UserStudyStatRow>) =>
          params.data ? <RateCell value={params.data.accuracyRate} /> : null,
      },
      { headerName: '암송 완료 절', field: 'completedVerseCount', width: 120, sortable: true },
      { headerName: '연속학습일수', field: 'streakDays', width: 120, sortable: true },
      { headerName: '마지막 학습일', field: 'lastStudyDate', width: 130, sortable: true },
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
              <span className="text-sm text-secondary-foreground">전체 학습자</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{totalUsers}</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">평균 학습 진도율</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-foreground">{averageProgress}%</div>
        </Card>
        <Card>
          <CardHeader className="border-0 pt-5">
            <CardHeading>
              <span className="text-sm text-secondary-foreground">평균 암송 정확도</span>
            </CardHeading>
          </CardHeader>
          <div className="px-5 pb-5 text-2xl font-semibold text-green-600">{averageAccuracy}%</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>사용자 학습현황</CardTitle>
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
          </CardToolbar>
        </CardHeader>
        <div className="p-3">
          <AgGridReact<UserStudyStatRow>
            theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
            rowData={rows}
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
      </Card>
    </div>
  );
}
