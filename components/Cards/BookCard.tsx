import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "@mantine/core";
import { Howl } from "howler";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconClock,
  IconBookmarks,
  IconShoppingCart,
  IconCoin,
} from "@tabler/icons-react";
import defaultPoster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_v8c5gbv8c5gbv8c5.jpeg";
import { Author, Category, Chapter, Collection, Narrator } from "@/types/types";
import { notifications } from "@mantine/notifications";
import { addToWishlist, removeFromWishlist } from "@/lib/store";
import { useSession } from "next-auth/react";

interface BookCardProps {
  book: {
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
    chapters: Chapter[];
    categories: Category[];
    collections: Collection[];
    narrators: Narrator[];
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const soundRef = useRef<Howl | null>(null);
  const { data: session } = useSession();
  const access = session?.jwt;
  const [inWishList, setInWishList] = useState(false);
  const [addWishLoading, setAddWishLoading] = useState(false);
  const [removeWishLoading, setRemoveWishLoading] = useState(false);
  const from = "bookCard";

  const handleAddToWishlist = async () => {
    if (!access) {
      // TODO: Give a modal to log in
      notifications.show({
        title: "Error",
        message: "You must be logged in to add to wishlist.",
        color: "red",
        position: "top-right",
      });
      return;
    }

    addToWishlist(book?.id!, setAddWishLoading, setInWishList);
  };
  const handleRemoveFromWishList = async () => {
    if (!access) {
      // TODO: Give a modal to log in
      notifications.show({
        title: "Error",
        message: "You must be logged in to remove from wishlist.",
        color: "red",
        position: "top-right",
      });
      return;
    }

    removeFromWishlist(book?.id!, setRemoveWishLoading, setInWishList, from);
  };

  return (
    <div className="max-w-xs bg-gradient-to-br from-[#062C2A] to-[#035c4f] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 group">
      <Link href={`/audiobooks/${book.slug}`}>
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={book.poster || defaultPoster}
            alt={book.title}
            width={1200}
            height={675}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
      </Link>

      <div className="p-3 space-y-4 bg-[#041714]/80 backdrop-blur-sm">
        <div>
          <h3 className="font-bold line-clamp-1 mb-2 text-white">{book.title}</h3>
          <p className="text-sm text-gray-300 line-clamp-1">
            {book.authors && book.authors.length > 0
              ? book.authors.map((author) => author.name).join(", ")
              : "Unknown Author"}
          </p>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <IconClock size={16} className="text-[#1CFAC4]" />
            <span className="text-xs">{book.length || "N/A"}</span>
          </div>
          <button
            className="text-gray-300 hover:text-[#1CFAC4] 
            transition-colors transform hover:scale-110"
            onClick={
              inWishList ? handleRemoveFromWishList : handleAddToWishlist
            }
          >
            {addWishLoading || removeWishLoading ? (
              <Loader size="xs" />
            ) : (
              <IconBookmarks
                size={16}
                color={inWishList ? "#1CFAC4" : "white"}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
