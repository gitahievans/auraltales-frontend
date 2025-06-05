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
      <div className="bg-gray-800 rounded-lg p-4">
        <Skeleton height={192} width="100%" radius="md" />
        <Skeleton height={20} mt={12} width="80%" />
        <Skeleton height={16} mt={8} width="60%" />
      </div>
    );
  }

  return (
    <div
      className="bg-transparent rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-700 hover:border-emerald-500"
      role="article"
      aria-labelledby={`book-title-${book.id}`}
    >
      <Link
        href={`/audiobooks/${book.slug}`}
        aria-label={`View details for ${book.title}`}
      >
        <div className="relative h-48 w-full group">
          <Image
            src={book.poster || "/placeholder-book-cover.jpg"}
            alt={book.title}
            fill
            className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/placeholder-book-cover.jpg"
          />
        </div>
      </Link>
      <div className="p-3">
        <Tooltip
          label={book.title}
          withArrow
          disabled={book.title.length <= 30}
        >
          <h3
            id={`book-title-${book.id}`}
            className="font-bold text-sm md:text-base text-white line-clamp-1 mb-1"
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
          <p className="text-xs md:text-sm text-gray-200 line-clamp-1">
            {book.authors.map((author) => author.name).join(", ") ||
              "Unknown Author"}
          </p>
        </Tooltip>
        <div className="flex items-center justify-between text-white mt-3">
          <Tooltip label="Duration" withArrow>
            <div className="flex items-center space-x-2">
              <IconClock size={14} className="text-emerald-400" />
              <span className="text-xs">
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
                className="p-1 rounded-full hover:bg-emerald-900/20 transition-colors duration-300"
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
                    className={inWishlist ? "text-red-400" : "text-gray-400"}
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
