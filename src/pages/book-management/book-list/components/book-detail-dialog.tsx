import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { BookRow } from './types';

interface BookDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: BookRow;
}

export function BookDetailDialog({ open, onOpenChange, book }: BookDetailDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
              <BookOpen className="size-4.5" />
            </div>
            <DialogTitle>{book.title}</DialogTitle>
          </div>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-secondary-foreground mb-4">{book.description}</p>
          <Table className="align-middle text-sm text-muted-foreground">
            <TableBody>
              <TableRow>
                <TableCell className="py-2 text-secondary-foreground font-normal">저자</TableCell>
                <TableCell className="py-2 text-foreground font-normal">{book.author}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 text-secondary-foreground font-normal">출판사</TableCell>
                <TableCell className="py-2 text-foreground font-normal">{book.publisher}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 text-secondary-foreground font-normal">출판일</TableCell>
                <TableCell className="py-2 text-foreground font-normal">{book.publishedDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 text-secondary-foreground font-normal">ISBN</TableCell>
                <TableCell className="py-2 text-foreground font-normal">{book.isbn}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 text-secondary-foreground font-normal">분류</TableCell>
                <TableCell className="py-2 text-foreground font-normal">{book.category}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 text-secondary-foreground font-normal">상태</TableCell>
                <TableCell className="py-2">
                  <Badge
                    variant={book.status === '대출가능' ? 'success' : 'warning'}
                    appearance="light"
                    size="sm"
                  >
                    {book.status}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
