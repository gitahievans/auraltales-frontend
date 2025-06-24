/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState, memo } from "react";
import {
  IconCalendar,
  IconHeadset,
  IconLanguage,
  IconListDetails,
  IconShoppingBag,
  IconClock,
  IconUsers,
} from "@tabler/icons-react";
import { Audiobook } from "@/types/types";
import { useMediaQuery } from "@mantine/hooks";
import { Howl } from "howler";
import { notifications } from "@mantine/notifications";
import { Loader, Skeleton, Tooltip } from "@mantine/core";
import {
  addToWishlist,
  checkAudiobookInWishlist,
  removeFromWishlist,
} from "@/lib/store";
import { buyAudiobook, listenSample } from "@/lib/audiobookActions.ts";
import PlayButton from "../PlayButton";
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

// Format price (e.g., 1000 -> "1,000")
const formatPrice = (price: number): string => {
  return price.toLocaleString("en-KE", { style: "decimal" });
};

type PropsType = {
  book: Audiobook;
};

const UnboughtBookCard = ({ book }: PropsType) => {
  const { isAuthenticated, session, status } = useValidSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMedium = useMediaQuery("(max-width: 1023px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");
  const [inWishList, setInWishList] = useState(false);
  const [addWishLoading, setAddWishLoading] = useState(false);
  const [removeWishLoading, setRemoveWishLoading] = useState(false);
  const access = session?.jwt;
  const from = "unbought";
  const [isHovered, setIsHovered] = useState(false);

  const checkWishlistStatus = async () => {
    if (access) {
      const isInWishlist = await checkAudiobookInWishlist(
        book.id as number,
        access
      );
      setInWishList(isInWishlist);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("audiobookToBuy", JSON.stringify(book));
    localStorage.setItem("session", JSON.stringify(session));
    checkWishlistStatus();

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [book, session]);

  const handleListenSample = () => {
    listenSample(
      book,
      soundRef,
      isPlaying,
      setIsPlaying,
      setAudioSampleLoading
    );
  };

  const handleBuyAudiobook = () => {
    const accessToken = session?.jwt;
    const userEmail = session?.user?.email;
    const bookId = book.id;
    const buyingPrice = +book.buying_price;

    if (accessToken && userEmail) {
      buyAudiobook(bookId as number, buyingPrice, userEmail, accessToken);
    } else {
      notifications.show({
        title: "Authentication Required",
        message: (
          <span>
            Please{" "}
            <a href="/auth/login" className="underline text-blue-400">
              log in
            </a>{" "}
            to buy this audiobook.
          </span>
        ),
        color: "red",
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

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
    await addToWishlist(book?.id!, setAddWishLoading, setInWishList);
  };

  const handleRemoveFromWishList = async () => {
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
    await removeFromWishlist(
      book?.id!,
      setRemoveWishLoading,
      setInWishList,
      null,
      from!
    );
  };

  if (isLoading && !book) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6">
        <Skeleton
          height={isMobile ? 225 : 270}
          width={isMobile ? 150 : 180}
          radius="xl"
        />
        <Skeleton height={20} mt={16} width="80%" />
        <Skeleton height={16} mt={8} width="60%" />
        <Skeleton height={16} mt={8} width="40%" />
      </div>
    );
  }

  return (
    <div
      className="bg-transparent text-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-500"
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
            {/* Always visible play button overlay */}
            <div
              className="absolute bottom-2 border border-[white]/30 right-2 bg-black bg-opacity-45 rounded-full p-2 hover:bg-opacity-90 transition-all duration-300 cursor-pointer shadow-lg"
              onClick={handleListenSample}
              role="button"
              aria-label="Play sample"
            >
              <PlayButton
                isPlaying={isPlaying}
                audioSampleLoading={audioSampleLoading}
                onClick={handleListenSample}
              />
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

                {/* <Tooltip label="Language" withArrow>
                  <div className="flex items-center gap-2">
                    <IconLanguage
                      size={16}
                      className="text-emerald-400 flex-shrink-0"
                    />
                    <p className="text-sm">{book?.language || "English"}</p>
                  </div>
                </Tooltip> */}
              </div>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex flex-col mt-auto gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleBuyAudiobook}
                className="flex-1 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                aria-label={`Buy audiobook for KES ${book?.buying_price}`}
              >
                <IconShoppingBag size={16} />
                <span>Buy: KES {formatPrice(+book?.buying_price)}</span>
              </button>

              <button
                onClick={
                  inWishList ? handleRemoveFromWishList : handleAddToWishlist
                }
                className={`flex-1 py-2 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                  inWishList
                    ? "border border-red-500 text-red-400 hover:bg-red-900/20"
                    : "border border-emerald-500 text-emerald-400 hover:bg-emerald-900/20"
                }`}
                disabled={inWishList ? removeWishLoading : addWishLoading}
                aria-label={
                  inWishList ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {inWishList && removeWishLoading ? (
                  <Loader size="sm" color="red" />
                ) : !inWishList && addWishLoading ? (
                  <Loader size="sm" color="emerald" />
                ) : (
                  <>
                    <IconListDetails size={16} />
                    <span>{inWishList ? "Remove" : "Add Wishlist"}</span>
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
          onClick={handleBuyAudiobook}
          className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={`Buy audiobook for KES ${book?.buying_price}`}
        >
          <IconShoppingBag size={18} />
          <span>Buy: KES {formatPrice(+book?.buying_price)}</span>
        </button>

        <button
          onClick={inWishList ? handleRemoveFromWishList : handleAddToWishlist}
          className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            inWishList
              ? "border border-red-500 text-red-400 hover:bg-red-900/20"
              : "border border-emerald-500 text-emerald-400 hover:bg-emerald-900/20"
          }`}
          disabled={inWishList ? removeWishLoading : addWishLoading}
          aria-label={inWishList ? "Remove from wishlist" : "Add to wishlist"}
        >
          {inWishList && removeWishLoading ? (
            <Loader size="sm" color="red" />
          ) : !inWishList && addWishLoading ? (
            <Loader size="sm" color="emerald" />
          ) : (
            <>
              <IconListDetails size={18} />
              <span>
                {inWishList ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(UnboughtBookCard);
