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
  
export interface Audiobook {
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
  }