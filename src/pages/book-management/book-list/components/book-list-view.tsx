import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BookCard } from './book-card';
import { BookDetailDialog } from './book-detail-dialog';
import { BookListRow } from './book-list-row';
import { BOOK_ITEMS_DATA } from './data';
import { BookRow } from './types';

export function BookListView() {
  const [activeView, setActiveView] = useState('cards');
  const [selectedBook, setSelectedBook] = useState<BookRow | undefined>(undefined);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleView = (book: BookRow) => {
    setSelectedBook(book);
    setDetailOpen(true);
  };

  return (
    <div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
      <div className="flex flex-wrap items-center gap-5 justify-between">
        <h3 className="text-lg text-mono font-semibold">
          {BOOK_ITEMS_DATA.length} 도서
        </h3>
        <ToggleGroup
          type="single"
          variant="outline"
          value={activeView}
          onValueChange={(value) => {
            if (value) setActiveView(value);
          }}
        >
          <ToggleGroupItem value="cards">
            <LayoutGrid size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value="list">
            <List size={16} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {activeView === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
          {BOOK_ITEMS_DATA.map((book) => (
            <BookCard key={book.id} book={book} onView={handleView} />
          ))}
        </div>
      )}

      {activeView === 'list' && (
        <div className="flex flex-col gap-5 lg:gap-7.5">
          {BOOK_ITEMS_DATA.map((book) => (
            <BookListRow key={book.id} book={book} onView={handleView} />
          ))}
        </div>
      )}

      <BookDetailDialog open={detailOpen} onOpenChange={setDetailOpen} book={selectedBook} />
    </div>
  );
}
