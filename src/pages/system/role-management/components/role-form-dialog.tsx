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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RoleRow } from './types';

const roleFormSchema = z.object({
  name: z.string().min(1, '역할명을 입력해 주세요.'),
  code: z
    .string()
    .min(1, '역할 코드를 입력해 주세요.')
    .regex(/^[A-Z0-9_]+$/, '역할 코드는 영문 대문자, 숫자, _만 사용할 수 있습니다.'),
  description: z.string().optional(),
  enabled: z.boolean(),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: RoleRow;
  onSubmit: (values: RoleFormValues) => void;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: RoleFormDialogProps) {
  const isEdit = Boolean(initialValues);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      enabled: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: initialValues?.name ?? '',
      code: initialValues?.code ?? '',
      description: initialValues?.description ?? '',
      enabled: initialValues?.enabled ?? true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues?.id]);

  const handleSubmit = (values: RoleFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? '역할 수정' : '새 역할 추가'}</DialogTitle>
          <DialogDescription>
            사용자에게 부여할 역할 정보를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="block w-full space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>역할명</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: 운영자" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>역할 코드</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="예: OPERATOR"
                          disabled={initialValues?.isSystem}
                          onChange={(event) =>
                            field.onChange(event.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="이 역할의 권한 범위를 설명해 주세요."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2.5">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel className="!mt-0">사용</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" variant="primary">
                  {isEdit ? '저장' : '추가'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
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
