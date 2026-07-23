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
import { resolveMenuIcon } from './icon-map';
import { MENU_ICON_OPTIONS, MenuItemRow } from './types';

const menuFormSchema = z.object({
  title: z.string().min(1, '메뉴명을 입력해 주세요.'),
  path: z.string().optional(),
  icon: z.string().min(1, '아이콘을 선택해 주세요.'),
  order: z.coerce.number().int().min(1, '정렬순서는 1 이상이어야 합니다.'),
  parentId: z.string(),
  enabled: z.boolean(),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;

interface MenuFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: MenuItemRow;
  parentOptions: MenuItemRow[];
  onSubmit: (values: MenuFormValues) => void;
}

const NO_PARENT_VALUE = 'none';

export function MenuFormDialog({
  open,
  onOpenChange,
  initialValues,
  parentOptions,
  onSubmit,
}: MenuFormDialogProps) {
  const isEdit = Boolean(initialValues);

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      title: '',
      path: '',
      icon: 'Folder',
      order: 1,
      parentId: NO_PARENT_VALUE,
      enabled: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      title: initialValues?.title ?? '',
      path: initialValues?.path ?? '',
      icon: initialValues?.icon ?? 'Folder',
      order: initialValues?.order ?? 1,
      parentId: initialValues?.parentId ? String(initialValues.parentId) : NO_PARENT_VALUE,
      enabled: initialValues?.enabled ?? true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues?.id]);

  const handleSubmit = (values: MenuFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? '메뉴 수정' : '새 메뉴 추가'}</DialogTitle>
          <DialogDescription>
            시스템 사이드바에 노출되는 메뉴 항목 정보를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="block w-full space-y-5"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>메뉴명</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 사용자 관리" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상위 메뉴</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="최상위 메뉴" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_PARENT_VALUE}>최상위 메뉴</SelectItem>
                        {parentOptions.map((option) => (
                          <SelectItem key={option.id} value={String(option.id)}>
                            {option.title}
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
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      경로{' '}
                      <span className="text-xs text-muted-foreground">
                        (폴더성 메뉴는 비워두세요)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/system/users/manage" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => {
                    const PreviewIcon = resolveMenuIcon(field.value);
                    return (
                      <FormItem>
                        <FormLabel>아이콘</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <div className="flex items-center gap-1.5">
                                <PreviewIcon className="size-4" />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MENU_ICON_OPTIONS.map((iconName) => (
                              <SelectItem key={iconName} value={iconName}>
                                {iconName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>정렬순서</FormLabel>
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
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2.5">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel className="!mt-0">사이드바에 노출</FormLabel>
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
