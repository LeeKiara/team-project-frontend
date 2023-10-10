interface BookData {
  id?: number;
  cover: string;
  title: string;
  author: string;
  pricesales: string;
  pricestandard: string;
  publisher: string;
  link: string;
  description: string;
  isbn: string;
}

interface BestBookData {
  id?: number;
  cover: string;
  title: string;
  author: string;
  pricesales: string;
  pricestandard: string;
  publisher: string;
  link: string;
  description: string;
  isbn: string;
}

const INIT_DATA: BookData[] = [];

export const BOOKS_DATA_KEY = "/mall/books";
