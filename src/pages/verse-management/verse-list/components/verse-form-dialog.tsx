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
import { MemorizationStage, VerseRow } from '../../shared/types';

const STAGE_OPTIONS: MemorizationStage[] = [
  '1단계',
  '2단계',
  '3단계(초성보기)',
  '4단계',
  '암송완료',
];

const verseFormSchema = z.object({
  book: z.string().min(1, '성경 이름을 입력해 주세요.'),
  chapter: z.coerce.number().min(1, '장을 입력해 주세요.'),
  verse: z.coerce.number().min(1, '절을 입력해 주세요.'),
  category: z.string().min(1, '분류를 입력해 주세요.'),
  text: z.string().min(1, '본문을 입력해 주세요.'),
  stage: z.enum(['1단계', '2단계', '3단계(초성보기)', '4단계', '암송완료']),
  accuracyRate: z.coerce.number().min(0).max(100),
  reviewCycle: z.string().min(1),
  nextReviewDate: z.string().min(1, '다음 복습일을 입력해 주세요.'),
});

export type VerseFormValues = z.infer<typeof verseFormSchema>;

interface VerseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: VerseRow;
  onSubmit: (values: VerseFormValues) => void;
}

export function VerseFormDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: VerseFormDialogProps) {
  const isEdit = Boolean(initialValues);

  const form = useForm<VerseFormValues>({
    resolver: zodResolver(verseFormSchema),
    defaultValues: {
      book: '요한계시록',
      chapter: 1,
      verse: 1,
      category: '',
      text: '',
      stage: '1단계',
      accuracyRate: 0,
      reviewCycle: '1·3·7·14일 주기',
      nextReviewDate: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      book: initialValues?.book ?? '요한계시록',
      chapter: initialValues?.chapter ?? 1,
      verse: initialValues?.verse ?? 1,
      category: initialValues?.category ?? '',
      text: initialValues?.text ?? '',
      stage: initialValues?.stage ?? '1단계',
      accuracyRate: initialValues?.accuracyRate ?? 0,
      reviewCycle: initialValues?.reviewCycle ?? '1·3·7·14일 주기',
      nextReviewDate: initialValues?.nextReviewDate ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues?.id]);

  const handleSubmit = (values: VerseFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? '암송 구절 수정' : '새 암송 구절 추가'}</DialogTitle>
          <DialogDescription>사용자 앱에 노출될 암송 구절 정보를 입력해 주세요.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="block w-full space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="book"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>성경</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: 요한계시록" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chapter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>장</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="verse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>절</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>분류</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 에베소 교회" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>본문</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="암송 구절 본문을 입력해 주세요." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>암송 단계</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STAGE_OPTIONS.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
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
                  name="accuracyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>정확도(%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} max={100} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reviewCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>복습 주기</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: 1·3·7·14일 주기" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nextReviewDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>다음 복습일</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
