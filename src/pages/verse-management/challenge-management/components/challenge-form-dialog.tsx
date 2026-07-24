import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChallengeRow, ChallengeStatus } from '../../shared/types';

const STATUS_OPTIONS: ChallengeStatus[] = ['예정', '진행중', '종료'];

const challengeFormSchema = z.object({
  title: z.string().min(1, '챌린지명을 입력해 주세요.'),
  description: z.string().min(1, '설명을 입력해 주세요.'),
  book: z.string().min(1, '대상 범위를 입력해 주세요.'),
  startDate: z.string().min(1, '시작일을 입력해 주세요.'),
  endDate: z.string().min(1, '종료일을 입력해 주세요.'),
  totalVerses: z.coerce.number().min(1, '전체 절수를 입력해 주세요.'),
  completedVerses: z.coerce.number().min(0),
  participantCount: z.coerce.number().min(0),
  status: z.enum(['예정', '진행중', '종료']),
});

export type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

interface ChallengeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: ChallengeRow;
  onSubmit: (values: ChallengeFormValues) => void;
}

export function ChallengeFormDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: ChallengeFormDialogProps) {
  const isEdit = Boolean(initialValues);

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      title: '',
      description: '',
      book: '',
      startDate: '',
      endDate: '',
      totalVerses: 1,
      completedVerses: 0,
      participantCount: 0,
      status: '예정',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      book: initialValues?.book ?? '',
      startDate: initialValues?.startDate ?? '',
      endDate: initialValues?.endDate ?? '',
      totalVerses: initialValues?.totalVerses ?? 1,
      completedVerses: initialValues?.completedVerses ?? 0,
      participantCount: initialValues?.participantCount ?? 0,
      status: initialValues?.status ?? '예정',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues?.id]);

  const handleSubmit = (values: ChallengeFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? '챌린지 수정' : '새 챌린지 추가'}</DialogTitle>
          <DialogDescription>사용자 앱에 노출될 챌린지 정보를 입력해 주세요.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="block w-full space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>챌린지명</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 계시록 2장 완주 챌린지" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="챌린지 소개를 입력해 주세요." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="book"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>대상 범위</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 요한계시록 2장" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시작일</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>종료일</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="totalVerses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전체 절수</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="completedVerses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>완료 절수</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="participantCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>참여자수</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상태</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" variant="primary">
                  {isEdit ? '저장' : '추가'}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  취소
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
