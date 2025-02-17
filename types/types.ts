export interface Author {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  bio: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
}

export interface Narrator {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  bio: string;
}

export interface Chapter {
  id: number;
  title: string;
  audio_file: string;
  order: number;
}

export interface Audiobook {
  id: number;
  title: string;
  description: string;
  summary: string;
  length: string;
  rental_price: number;
  buying_price: number;
  date_published: string;
  slug: string;
  poster: string;
  audio_sample?: string | null;
  authors: Author[];
  categories: Category[];
  collections: Collection[];
  narrators: Narrator[];
  chapters: Chapter[];
}

export type PurchaseStatus = {
  bought: boolean;
  rented: boolean;
};

export interface FormDataOne {
  poster: File[];
  audio_sample: File[];
  title: string;
  description: string;
  summary: string;
  length: string;
  buying_price: string;
  date_published: string;
  categories: Category[];
  collections: Collection[];
  narrators: Narrator[];
  authors: Author[];
}

export interface FormDataTwo {
  chapters: Chapter[];
}
