/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React, { useEffect, useState, memo } from "react";
import {
  IconHeadset,
  IconPlayerPlayFilled,
  IconStars,
  IconUsers,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { Audiobook } from "@/types/types";
import {
  addToFavorites,
  checkAudiobookInFavorites,
  removeFromFavorites,
} from "@/lib/store";
import { Loader, Skeleton, Tooltip } from "@mantine/core";
import { useValidSession } from "@/hooks/useValidSession";

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

// Format release date
const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const BoughtBookCard = ({ book, open }: { book: Audiobook; open: any }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isLoading, setIsLoading] = useState(true);
  const [inFavorites, setInFavorites] = useState(false);
  const { isAuthenticated, session } = useValidSession();
  const access = session?.jwt;
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToFavorites = async () => {
    if (!access) return;
    setIsLoading(true);
    await addToFavorites(
      book.id as number,
      access,
      setIsLoading,
      setInFavorites
    );
  };

  const handleRemoveFromFavorites = async () => {
    if (!access) return;
    setIsLoading(true);
    await removeFromFavorites(
      book.id as number,
      access,
      setIsLoading,
      setInFavorites,
      () => {},
      ""
    );
  };

  const checkFavoritesStatus = async () => {
    if (access) {
      const isInFavorites = await checkAudiobookInFavorites(
        book?.id as number,
        access
      );
      setInFavorites(isInFavorites);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkFavoritesStatus();
  }, [access, book?.id]);

  const handleListenNowClick = () => {
    const audiobookData = encodeURIComponent(JSON.stringify(book));
    window.open(
      `/audiobooks/audioplayer/${book?.id}?audiobook=${audiobookData}`,
      "_blank",
      "noopener,noreferrer,width=500,height=800"
    );
  };

  if (isLoading && !book) {
    return (
      <div className="bg-green-800 rounded-2xl p-6">
        <Skeleton height={270} width={180} radius="xl" />
        <Skeleton height={20} mt={16} width="80%" />
        <Skeleton height={16} mt={8} width="60%" />
        <Skeleton height={16} mt={8} width="40%" />
      </div>
    );
  }

  return (
    <div
      className="bg-transparent text-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl   hover:border-emerald-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`book-title-${book.id}`}
    >
      <div className="flex flex-col md:flex-row p-4 md:p-6 gap-4">
        {/* Book Cover Section */}
        <div className="relative self-center md:self-start flex-shrink-0">
          <div
            className={`transform transition-transform duration-300 ${
              isHovered ? "scale-105" : ""
            }`}
          >
            <Image
              src={book?.poster || "/placeholder-book-cover.jpg"}
              alt={book?.title || "Audiobook cover"}
              width={isMobile ? 150 : 180}
              height={isMobile ? 225 : 270}
              className="rounded-xl shadow-md object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="/placeholder-book-cover.jpg"
            />
            <div
              className={`absolute inset-0 rounded-xl bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300`}
              role="button"
              aria-label="Play audiobook"
            >
              <button
                onClick={handleListenNowClick}
                className="p-3 bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors duration-300"
              >
                <IconPlayerPlayFilled size={24} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Book Details Section */}
        <div className="flex flex-col flex-1 gap-3">
          <div className="text-center md:text-left">
            <h2
              id={`book-title-${book.id}`}
              className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-2"
            >
              {book?.title || "Untitled Audiobook"}
            </h2>

            <div className="space-y-2 text-green-200">
              {/* Authors */}
              <Tooltip label="Authors" withArrow>
                <div className="flex items-center gap-2">
                  <IconUsers
                    size={16}
                    className="text-emerald-400 flex-shrink-0"
                  />
                  <p className="text-sm line-clamp-1">
                    {book?.authors?.length > 0
                      ? book.authors
                          .map((author: any) => author.name)
                          .join(", ")
                      : "Unknown Author"}
                  </p>
                </div>
              </Tooltip>

              {/* Narrators */}
              <Tooltip label="Narrators" withArrow>
                <div className="flex items-center gap-2">
                  <IconHeadset
                    size={16}
                    className="text-emerald-400 flex-shrink-0"
                  />
                  <p className="text-sm line-clamp-1">
                    {book?.narrators?.length > 0
                      ? book.narrators
                          .map((narrator) => narrator.name)
                          .join(", ")
                      : "Unknown Narrator"}
                  </p>
                </div>
              </Tooltip>

              {/* Additional Info */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                <Tooltip label="Duration" withArrow>
                  <div className="flex items-center gap-2">
                    <IconClock
                      size={16}
                      className="text-emerald-400 flex-shrink-0"
                    />
                    <p className="text-sm">
                      {formatLength(book?.length || "00:00:00")}
                    </p>
                  </div>
                </Tooltip>

                <Tooltip label="Release Date" withArrow>
                  <div className="flex items-center gap-2">
                    <IconCalendar
                      size={16}
                      className="text-emerald-400 flex-shrink-0"
                    />
                    <p className="text-sm">
                      {formatReleaseDate(book?.date_published || "")}
                    </p>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex flex-col mt-auto gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleListenNowClick}
                className="flex-1 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                aria-label="Listen to audiobook"
              >
                <IconPlayerPlayFilled size={16} />
                <span>Listen Now</span>
              </button>

              <button
                onClick={
                  inFavorites ? handleRemoveFromFavorites : handleAddToFavorites
                }
                className={`flex-1 py-2 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                  inFavorites
                    ? "border border-red-500 text-red-400 hover:bg-red-900/20"
                    : "border border-emerald-500 text-emerald-400 hover:bg-emerald-900/20"
                }`}
                disabled={isLoading}
                aria-label={
                  inFavorites ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isLoading ? (
                  <Loader size="sm" color={inFavorites ? "red" : "emerald"} />
                ) : (
                  <>
                    <IconStars size={16} />
                    <span>{inFavorites ? "Remove" : "Add Favorite"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Mobile */}
      <div className="md:hidden flex flex-col px-4 pb-4 gap-2">
        <button
          onClick={handleListenNowClick}
          className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label="Listen to audiobook"
        >
          <IconPlayerPlayFilled size={18} />
          <span>Listen Now</span>
        </button>

        <button
          onClick={
            inFavorites ? handleRemoveFromFavorites : handleAddToFavorites
          }
          className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            inFavorites
              ? "border border-red-500 text-red-400 hover:bg-red-900/20"
              : "border border-emerald-500 text-emerald-400 hover:bg-emerald-900/20"
          }`}
          disabled={isLoading}
          aria-label={
            inFavorites ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isLoading ? (
            <Loader size="sm" color={inFavorites ? "red" : "emerald"} />
          ) : (
            <>
              <IconStars size={18} />
              <span>
                {inFavorites ? "Remove from Favorites" : "Add to Favorites"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(BoughtBookCard);
