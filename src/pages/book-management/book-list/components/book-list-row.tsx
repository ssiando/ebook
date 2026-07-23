import { Eye } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookRow } from './types';

interface BookListRowProps {
  book: BookRow;
  onView: (book: BookRow) => void;
}

export function BookListRow({ book, onView }: BookListRowProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap justify-between items-center gap-7">
        <div className="flex flex-wrap items-center gap-5">
          <img
            src={toAbsoluteUrl(`/media/images/600x400/${book.coverImage}`)}
            className="rounded-md h-20 w-28 object-cover shrink-0"
            alt={book.title}
          />
          <div className="grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => onView(book)}
              className="text-lg font-semibold text-mono hover:text-primary-active mb-px text-start"
            >
              {book.title}
            </button>
            <span className="text-sm font-medium text-secondary-foreground">
              {book.author} · {book.publisher}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-5 lg:gap-7.5">
          <Badge variant="secondary" size="sm">
            {book.category}
          </Badge>
          <Badge
            variant={book.status === '대출가능' ? 'success' : 'warning'}
            appearance="light"
            size="sm"
          >
            {book.status}
          </Badge>
          <Button variant="ghost" mode="icon" onClick={() => onView(book)}>
            <Eye size={16} className="text-blue-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
