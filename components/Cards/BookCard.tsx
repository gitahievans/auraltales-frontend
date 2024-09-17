import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface BookCardProps {
  book: {
    title: string;
    description: string;
    summary: string;
    length: string;
    rental_price: number;
    buying_price: number;
    date_published: string; // or Date if you plan to handle it as a Date object
    slug: string;
    poster: string; // URL or file path for the image
    audio_sample?: string | null; // URL or file path, optional
    // authors: Author[]; // Assuming you have an Author type/interface
    // categories: Category[]; // Assuming you have a Category type/interface
    // collections: Collection[]; // Assuming you have a Collection type/interface
    // narrators: Narrator[];
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link
      href={`audiobooks/${book?.slug}`}
      className="bg-dark-green text-white rounded-lg hover:shadow-2xl hover:scale-105 overflow-hidden max-w-full sm:max-w-md cursor-pointer flex flex-col transition-all duration-300"
    >
      <Image
        src={book?.poster}
        alt="title"
        className="w-full object-cover rounded-lg"
        width={500}
        height={500}
      />
      <div className="p-2 sm:p-4 flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2">
          {book?.title}
        </h3>
        <p className="text-sm sm:text-sm text-gray-300">{book?.author}</p>
      </div>
    </Link>
  );
};

export default BookCard;
