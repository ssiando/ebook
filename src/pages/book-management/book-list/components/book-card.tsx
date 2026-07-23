import { Eye } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookRow } from './types';

interface BookCardProps {
  book: BookRow;
  onView: (book: BookRow) => void;
}

export function BookCard({ book, onView }: BookCardProps) {
  return (
    <Card className="border-0 shadow-sm shadow-black/8 flex-row gap-9 p-9">
      <img
        src={toAbsoluteUrl(`/media/images/600x600/${book.coverImage}`)}
        className="w-45 h-63 rounded-lg object-cover shrink-0"
        alt={book.title}
      />
      <div className="flex flex-col gap-4.5 min-w-0 grow">
        <button
          type="button"
          onClick={() => onView(book)}
          className="text-3xl font-medium text-mono hover:text-primary text-start line-clamp-2"
        >
          {book.title}
        </button>
        <span className="text-2xl text-secondary-foreground truncate">{book.author}</span>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <Badge variant="secondary" size="lg">
            {book.category}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Badge
              variant={book.status === '대출가능' ? 'success' : 'warning'}
              appearance="light"
              size="lg"
            >
              {book.status}
            </Badge>
            <Button variant="ghost" mode="icon" size="lg" onClick={() => onView(book)}>
              <Eye size={36} className="text-blue-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
