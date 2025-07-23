import React, { useState } from "react";
import {
  IconHeadphones,
  IconBookmarks,
  IconUsers,
  IconTrendingUp,
  IconClock,
  IconHeart,
  IconStar,
  IconChevronRight,
} from "@tabler/icons-react";
import { Play } from "lucide-react";
import { Audiobook, Author, Category, Collection } from "@/types/types";
import Image from "next/image";

export const CategoryCard = ({
  category,
  handleCategoryClick,
}: {
  category: any;
  handleCategoryClick: (category: any) => void;
}) => {
  //   console.log("Category Card Clicked:", category);

  return (
    <div
      onClick={() => handleCategoryClick(category)}
      className="group relative backdrop-blur-md bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.05] hover:-translate-y-1 cursor-pointer min-h-[140px] flex flex-col justify-between p-4"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-emerald-400/20 transition-colors duration-300">
            <IconHeadphones size={20} className="text-emerald-400" />
          </div>
          <span className="text-xs text-white/60 font-medium bg-white/10 px-2 py-1 rounded-full">
            {category.bookCount} books
          </span>
        </div>

        <h3 className="font-bold text-base text-white/90 group-hover:text-white transition-colors duration-300 mb-1">
          {category.name}
        </h3>

        <p className="text-xs text-white/70 group-hover:text-white/80 transition-colors duration-300 line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="flex items-center justify-end mt-3">
        <IconChevronRight
          size={16}
          className="text-emerald-400 group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

// 2. Library Book Card - for "My Library" section (more compact than main BookCard)
export const LibraryBookCard = ({
  book,
  handlePlayBook,
}: {
  book: Audiobook;
  handlePlayBook: (book: Audiobook) => void;
}) => {
  return (
    <div
      onClick={() => handlePlayBook(book)}
      className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:bg-white/10 hover:border-emerald-400/30 cursor-pointer"
    >
      <div className="flex items-center p-3 space-x-3">
        {/* Book Cover */}
        <div className="relative w-12 h-16 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={book?.poster || "/placeholder-book-cover.jpg"}
            alt={book?.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            width={100}
            height={100}
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-white/90 line-clamp-1 group-hover:text-white transition-colors duration-300">
            {book?.title}
          </h4>
          <p className="text-xs text-white/70 line-clamp-1 mb-1">
            {book?.authors?.map((author: Author) => author.name).join(", ")}
          </p>
          <div className="flex items-center space-x-2 text-xs text-white/60">
            <IconClock size={12} className="text-emerald-400" />
            <span>{book?.length}</span>
          </div>
        </div>

        {/* Progress/Play Button */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
            <Play size={12} className="text-emerald-400 ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Wishlist Card - for "Wishlist" section
export const WishlistCard = ({
  book,
  handleWishClick,
}: {
  book: Audiobook;
  handleWishClick: (book: Audiobook) => void;
}) => {
  console.log("Wishlist Card Book:", book);

  return (
    <div
      onClick={() => handleWishClick(book)}
      className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-pink-500/20 hover:bg-white/8 hover:border-pink-400/30 cursor-pointer"
    >
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={book?.poster || "/placeholder-book-cover.jpg"}
          alt={book?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          width={100}
          height={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist heart icon */}
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-red-500/30 transition-colors duration-300">
          <IconHeart size={14} className="text-red-400" fill="currentColor" />
        </button>
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm text-white/90 line-clamp-1 group-hover:text-white transition-colors duration-300 mb-1">
          {book?.title}
        </h4>
        <p className="text-xs text-white/70 line-clamp-1 mb-2">
          {book?.authors?.map((author: Author) => author.name).join(", ")}
        </p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-white/60">
            <IconClock size={12} className="text-emerald-400" />
            <span>{book?.length}</span>
          </div>
          <span className="text-pink-400 font-medium">
            ${book?.buying_price}
          </span>
        </div>
      </div>
    </div>
  );
};

// 4. Collection Card - for "Featured Collections" section
export const CollectionCard = ({
  collection,
  handleCollectionClick,
}: {
  collection: any;
  handleCollectionClick: (collection: any) => void;
}) => {
  return (
    <div
      onClick={() => handleCollectionClick(collection)}
      className="group relative backdrop-blur-md bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
          {collection.books
            ?.slice(0, 4)
            .map((book: Audiobook, index: number) => (
              <div key={index} className="relative rounded-md overflow-hidden">
                <Image
                  src={book?.poster || "/placeholder-book-cover.jpg"}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  width={100}
                  height={100}
                />
              </div>
            ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">
            {collection.name}
          </h3>
          <div className="flex items-center space-x-3 text-xs text-white/80">
            <div className="flex items-center space-x-1">
              <IconUsers size={12} />
              <span>{collection.bookCount} books</span>
            </div>
            <div className="flex items-center space-x-1">
              <IconStar size={12} className="text-yellow-400" />
              <span>{collection.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
    </div>
  );
};

// 5. Trending Book Card - for "Trending Now" section
export const TrendingBookCard = ({
  book,
  rank,
  handleTrendingClick,
}: {
  book: Audiobook;
  rank: number;
  handleTrendingClick: (book: Audiobook) => void;
}) => {
  return (
    <div
      onClick={() => handleTrendingClick(book)}
      className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/20 hover:bg-white/8 hover:border-orange-400/30 cursor-pointer"
    >
      {/* Rank badge */}
      <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{rank}</span>
      </div>

      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={book?.poster || "/placeholder-book-cover.jpg"}
          alt={book?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          width={100}
          height={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm text-white/90 line-clamp-1 group-hover:text-white transition-colors duration-300 mb-1">
          {book?.title}
        </h4>
        <p className="text-xs text-white/70 line-clamp-1 mb-2">
          {book?.authors?.map((author) => author.name).join(", ")}
        </p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-orange-400">
            <IconTrendingUp size={12} />
            <span>Trending</span>
          </div>
          <div className="flex items-center space-x-1 text-white/60">
            <IconClock size={12} className="text-emerald-400" />
            <span>{book?.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. Quick Stats Card - for dashboard-like information
export const QuickStatsCard = ({ stats }: { stats: any }) => {
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-white/10 rounded-xl p-4 shadow-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {stats.totalBooks}
          </div>
          <div className="text-xs text-white/70">Total Books</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-400 mb-1">
            {stats.hoursListened}h
          </div>
          <div className="text-xs text-white/70">Hours Listened</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {stats.wishlistCount}
          </div>
          <div className="text-xs text-white/70">Wishlist</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {stats.completedBooks}
          </div>
          <div className="text-xs text-white/70">Completed</div>
        </div>
      </div>
    </div>
  );
};
