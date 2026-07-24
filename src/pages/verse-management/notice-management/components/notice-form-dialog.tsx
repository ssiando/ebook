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
import { Switch } from '@/components/ui/switch';
import { NoticeRow } from '../../shared/types';

const LINK_OPTIONS = [
  { label: '홈', value: '/verse-app/home' },
  { label: '암송', value: '/verse-app/recite' },
  { label: '학습관리', value: '/verse-app/study' },
  { label: '챌린지', value: '/verse-app/challenge' },
  { label: 'My', value: '/verse-app/my' },
];

const noticeFormSchema = z.object({
  message: z.string().min(1, '공지 메시지를 입력해 주세요.'),
  linkPath: z.string().min(1, '연결 화면을 선택해 주세요.'),
  isActive: z.boolean(),
});

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;

interface NoticeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: NoticeRow;
  onSubmit: (values: NoticeFormValues) => void;
}

export function NoticeFormDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: NoticeFormDialogProps) {
  const isEdit = Boolean(initialValues);

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      message: '',
      linkPath: LINK_OPTIONS[0].value,
      isActive: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      message: initialValues?.message ?? '',
      linkPath: initialValues?.linkPath ?? LINK_OPTIONS[0].value,
      isActive: initialValues?.isActive ?? true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues?.id]);

  const handleSubmit = (values: NoticeFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? '공지사항 수정' : '새 공지사항 추가'}</DialogTitle>
          <DialogDescription>홈 화면 배너에 노출될 공지 내용을 입력해 주세요.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="block w-full space-y-5">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>공지 메시지</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 7월 계시록 전체 챌린지가 시작되었습니다" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연결 화면</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LINK_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2.5">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <FormLabel className="!mt-0">활성화</FormLabel>
                    </div>
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
