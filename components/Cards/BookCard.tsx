import React from "react";
import Image, { StaticImageData } from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  poster: StaticImageData;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, poster }) => {
  return (
    <div className="bg-dark-green text-white rounded-lg hover:shadow-2xl hover:scale-105 overflow-hidden max-w-full sm:max-w-md cursor-pointer flex flex-col transition-all duration-300">
      <Image
        src={poster}
        alt="title"
        className="w-full object-cover rounded-lg"
      />
      <div className="p-2 sm:p-4 flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm sm:text-sm text-gray-300">{author}</p>
      </div>
    </div>
  );
};

export default BookCard;
