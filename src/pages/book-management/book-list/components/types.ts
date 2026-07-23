export type BookStatus = '대출가능' | '대출중';

export interface BookRow {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  isbn: string;
  category: string;
  status: BookStatus;
  description: string;
  coverImage: string;
}
