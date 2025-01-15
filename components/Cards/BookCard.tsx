import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import defaultPoster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_v8c5gbv8c5gbv8c5.jpeg";
import {
  Audiobook,
  Author,
  Category,
  Chapter,
  Collection,
  Narrator,
} from "@/types/types";
// implement lazy loading

interface BookCardProps {
  book: {
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
    chapters: Chapter[];
    categories: Category[];
    collections: Collection[];
    narrators: Narrator[];
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link
      href={`/audiobooks/${book?.slug}`}
      className="bg-dark-green text-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden w-full max-w-52 cursor-pointer flex flex-col transition-all duration-300"
    >
      {/* TODO: Add placeholder image to show before poster shows */}
      <Image
        src={book?.poster || defaultPoster}
        alt="title"
        className="w-full object-cover rounded-lg"
        width={500}
        height={500}
        layout="responsive"
        loading="lazy"
      />
      <div className="p-2 sm:p-4 flex flex-col">
        <h3 className="text-base font-semibold mb-1 line-clamp-2">
          {book?.title}
        </h3>
        <p className="text-gray-200 mb-1 text-sm">
          <span className="mr-2"> BY: </span>{" "}
          {book?.authors && book?.authors?.length > 0 ? (
            book.authors.map((author: any) => (
              <span key={author.id}>
                {author.name}
                {book.authors.length > 1 &&
                author !== book.authors[book.authors.length - 1]
                  ? ", "
                  : ""}
              </span>
            ))
          ) : (
            <span>Unknown Author</span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;
