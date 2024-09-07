import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface BookCardProps {
  book: {
    title: string;
    author: string;
    poster: StaticImageData;
    slug: string;
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link
      href={`audiobooks/${book.slug}`}
      className="bg-dark-green text-white rounded-lg hover:shadow-2xl hover:scale-105 overflow-hidden max-w-full sm:max-w-md cursor-pointer flex flex-col transition-all duration-300"
    >
      <Image
        src={book.poster}
        alt="title"
        className="w-full object-cover rounded-lg"
      />
      <div className="p-2 sm:p-4 flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm sm:text-sm text-gray-300">{book.author}</p>
      </div>
    </Link>
  );
};

export default BookCard;
