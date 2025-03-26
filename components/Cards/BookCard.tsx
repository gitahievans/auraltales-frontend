'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconClock, IconBookmarks } from "@tabler/icons-react";
import { Loader } from "@mantine/core";
import defaultPoster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_v8c5gbv8c5gbv8c5.jpeg";
import { useSession } from "next-auth/react";
import { addToWishlist, removeFromWishlist } from "@/lib/store";

interface BookCardProps {
  book: {
    id?: number;
    title: string;
    poster: string;
    length: string;
    authors: { name: string }[];
    slug: string;
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [inWishList, setInWishList] = useState(false);
  const [addWishLoading, setAddWishLoading] = useState(false); 
  const [removeWishLoading, setRemoveWishLoading] = useState(false);

  const handleAddToWishlist = () => {
    setLoading(true);
    addToWishlist(book?.id!, setAddWishLoading, setInWishList);
    setLoading(false);
  };

  const handleRemoveFromWishlist = () => {
    setLoading(true);
    removeFromWishlist(book?.id!, setRemoveWishLoading, setInWishList, null, null);
    setLoading(false);
  };

  return (
    <div className="bg-[#124e3f] rounded-md overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
      <Link href={`/audiobooks/${book.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={book.poster || defaultPoster}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
      </Link>
      <div className="p-2 bg-[#041714]/80 backdrop-blur-sm">
        <h3 className="font-bold line-clamp-1 mb-2 text-white">{book.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-1">
          {book.authors.map((author) => author.name).join(", ")}
        </p>
        <div className="flex items-center justify-between text-white mt-4">
          <div className="flex items-center space-x-3">
            <IconClock size={16} className="text-[#1CFAC4]" />
            <span className="text-xs">{book.length || "N/A"}</span>
          </div>
          {session && (
            <button
              className="text-gray-300 hover:text-[#1CFAC4] transition-colors transform hover:scale-110"
              onClick={
                inWishlist ? handleRemoveFromWishlist : handleAddToWishlist
              }
            >
              {loading ? (
                <Loader size="xs" />
              ) : (
                <IconBookmarks
                  size={16}
                  color={inWishlist ? "#1CFAC4" : "white"}
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
