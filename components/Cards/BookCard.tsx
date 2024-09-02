import React from 'react'
import Image, { StaticImageData } from 'next/image';

interface BookCardProps {
    title: string;
    author: string;
    poster: StaticImageData;
}

const BookCard: React.FC<BookCardProps> = ({title, author, poster}) => {
  return (
    <div className="bg-dark-green text-white rounded-lg shadow-md overflow-hidden max-w-md cursor-pointer">
    <Image src={poster} alt='title' className="w-full object-cover rounded-lg" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-300">{author}</p>
    </div>
  </div>
  )
}

export default BookCard