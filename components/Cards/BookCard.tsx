"use client";

import React, { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconClock, IconBookmarks } from "@tabler/icons-react";
import { Loader, Skeleton, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useValidSession } from "@/hooks/useValidSession";
import {
  addToWishlist,
  removeFromWishlist,
  checkAudiobookInWishlist,
  checkPurchaseStatus,
} from "@/lib/store";

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

// Format length from "00:01:55.204250" to human-readable (e.g., "1 hr 2 min")
const formatLength = (lengthStr: string): string => {
  if (!lengthStr || !/^\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(lengthStr))
    return "Unknown";

  const [hours, minutes, seconds] = lengthStr
    .split(":")
    .map((part, i) =>
      i === 2 ? Math.round(parseFloat(part)) : parseInt(part, 10)
    );

  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hr" : "hrs"} ${minutes} ${
      minutes === 1 ? "min" : "mins"
    }`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ${seconds} ${
      seconds === 1 ? "sec" : "secs"
    }`;
  }
  return `${seconds} ${seconds === 1 ? "sec" : "secs"}`;
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(true);
  const [bought, setBought] = useState<boolean>(false);
  const { isAuthenticated, session } = useValidSession();
  const access = session?.jwt;

  const checkWishlistStatus = async () => {
    if (access && book.id) {
      const isInWishlist = await checkAudiobookInWishlist(book.id, access);
      setInWishlist(isInWishlist);
      setIsCardLoading(false);
    } else {
      setIsCardLoading(false);
    }
  };

  const getPurchaseStatus = async () => {
    if (!book || !access) return;
    const status = await checkPurchaseStatus(book?.id);
    if (status) {
      setBought(status?.bought);
    }
  };

  useEffect(() => {
    checkWishlistStatus();
    getPurchaseStatus();
  }, [book?.id]);

  const handleAddToWishlist = async () => {
    if (!access) {
      notifications.show({
        title: "Authentication Required",
        message: (
          <span>
            Please{" "}
            <a href="/auth/login" className="underline text-blue-400">
              log in
            </a>{" "}
            to add to wishlist.
          </span>
        ),
        color: "red",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    setLoading(true);
    await addToWishlist(book?.id!, setLoading, setInWishlist);
    setLoading(false);
  };

  const handleRemoveFromWishlist = async () => {
    if (!access) {
      notifications.show({
        title: "Authentication Required",
        message: (
          <span>
            Please{" "}
            <a href="/auth/login" className="underline text-blue-400">
              log in
            </a>{" "}
            to remove from wishlist.
          </span>
        ),
        color: "red",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    setLoading(true);
    await removeFromWishlist(book?.id!, setLoading, setInWishlist, null, null);
    setLoading(false);
  };

  if (isCardLoading) {
    return (
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg">
        <Skeleton height={192} width="100%" radius="md" />
        <Skeleton height={20} mt={12} width="80%" />
        <Skeleton height={16} mt={8} width="60%" />
      </div>
    );
  }

  return (
    <div
      className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white/10 hover:border-emerald-400/30 hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-full"
      role="article"
      aria-labelledby={`book-title-${book.id}`}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Subtle glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

      <Link
        href={`/audiobooks/${book.slug}`}
        aria-label={`View details for ${book.title}`}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={book.poster || "/placeholder-book-cover.jpg"}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/placeholder-book-cover.jpg"
          />
          {/* Image overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="relative p-4 backdrop-blur-sm flex-1 flex flex-col">
        {" "}
        <Tooltip
          label={book.title}
          withArrow
          disabled={book.title.length <= 30}
        >
          <h3
            id={`book-title-${book.id}`}
            className="font-bold text-sm md:text-base text-white/90 line-clamp-1 mb-2 group-hover:text-white transition-colors duration-300"
          >
            {book.title}
          </h3>
        </Tooltip>
        <Tooltip
          label={book.authors.map((author) => author.name).join(", ")}
          withArrow
          disabled={
            book.authors.map((author) => author.name).join(", ").length <= 30
          }
        >
          <p className="text-xs md:text-sm text-white/70 line-clamp-1 mb-3 group-hover:text-white/80 transition-colors duration-300">
            {book.authors.map((author) => author.name).join(", ") ||
              "Unknown Author"}
          </p>
        </Tooltip>
        <div className="flex items-center justify-between text-white/80 group-hover:text-white/90 transition-colors duration-300 mt-auto min-h-[2rem]">
          {" "}
          <Tooltip label="Duration" withArrow>
            <div className="flex items-center space-x-2 backdrop-blur-sm bg-white/5 px-2 py-1 rounded-full border border-white/10">
              <IconClock size={14} className="text-emerald-400" />
              <span className="text-xs font-medium">
                {formatLength(book.length || "00:00:00")}
              </span>
            </div>
          </Tooltip>
          {session && !bought && (
            <Tooltip
              label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              withArrow
            >
              <button
                className="p-2 rounded-full backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 transition-all duration-300 hover:scale-110"
                onClick={
                  inWishlist ? handleRemoveFromWishlist : handleAddToWishlist
                }
                disabled={loading}
                aria-label={
                  inWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {loading ? (
                  <Loader size="xs" color="emerald" />
                ) : (
                  <IconBookmarks
                    size={14}
                    className={`transition-colors duration-300 ${
                      inWishlist
                        ? "text-red-400"
                        : "text-emerald-400/70 hover:text-emerald-400"
                    }`}
                  />
                )}
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(BookCard);
