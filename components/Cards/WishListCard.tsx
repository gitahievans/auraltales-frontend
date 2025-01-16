/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import {
  IconListDetails,
  IconPlaylist,
  IconShoppingBag,
} from "@tabler/icons-react";
import { Audiobook, PurchaseStatus } from "@/types/types";
import { useMediaQuery } from "@mantine/hooks";
import { Howl } from "howler";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";
import {
  addToWishlist,
  checkAudiobookInWishlist,
  checkPurchaseStatus,
  removeFromWishlist,
} from "@/lib/store";
import { buyAudiobook, listenSample } from "@/lib/audiobookActions.ts";
import PlayButton from "../PlayButton";
import { WishlistItem } from "@/app/wishlist/page";
import Link from "next/link";

function WishlistCard({
  audiobook,
  setWishlistItems,
}: {
  audiobook: WishlistItem;
  setWishlistItems: React.Dispatch<React.SetStateAction<WishlistItem[] | null>>;
}) {
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [inWishList, setInWishList] = useState(false);
  const [addWishLoading, setAddWishLoading] = useState(false);
  const [removeWishLoading, setRemoveWishLoading] = useState(false);
  const [isPurchased, setPurchaseStatus] = useState<PurchaseStatus | null>(
    null
  );
  const from = "wishlist";
  const access = session?.jwt;

  console.log("wishlist book", audiobook);
  const book = audiobook.audiobook;

  const checkWishlistStatus = async () => {
    if (access) {
      const isInWishlist = await checkAudiobookInWishlist(book.id, access);
      setInWishList(isInWishlist);
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
      buyAudiobook(bookId, buyingPrice, userEmail, accessToken);
    } else {
      notifications.show({
        title: "Error",
        message: "You must be logged in to buy an audiobook.",
        color: "red",
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const getPurchaseStatus = async () => {
      if (!audiobook || !session?.jwt) {
        return;
      }

      const status = await checkPurchaseStatus(audiobook.id, session.jwt);
      setPurchaseStatus(status);
    };

    getPurchaseStatus();
  }, [audiobook, session?.jwt]);

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

    addToWishlist(book?.id!, access!, setAddWishLoading, setInWishList);
  };

  const handleRemoveFromWishList = async () => {
    if (!access) {
      return;
    }

    removeFromWishlist(
      book?.id!,
      access!,
      setRemoveWishLoading,
      setInWishList,
      setWishlistItems,
      from
    );
  };

  return (
    <div className="flex flex-col md:flex-row p-6 rounded-lg items-center md:items-start gap-6 bg-[#041714]">
      {/* Book Cover */}
      <div className="flex flex-col gap-4 items-start justify-center lg:w-[35%] xl:w-[25%]">
        <Image
          src={book?.poster || "/api/placeholder/250/250"}
          alt={book?.title || "Book Cover"}
          width={isMobile ? 250 : 500}
          height={isMobile ? 250 : 500}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col gap-2 w-full lg:w-[35%] items-center md:items-start">
        <h2 className="text-2xl font-semibold text-[#1CFAC4] mb-2 uppercase">
          {book?.title}
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center md:items-start gap-1 mt-3">
            <p className="text-[#FFFFFF] mb-1">
              <span className="text-[#A9A9AA] mr-2">BY:</span>
              {book?.authors?.map((author, index) => (
                <span key={author.id}>
                  {author.name}
                  {index < book.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p className="text-[#FFFFFF] mb-1">
              <span className="text-[#A9A9AA] mr-2">NARRATED BY:</span>
              {book?.narrators?.map((narrator, index) => (
                <span key={narrator.id}>
                  {narrator.name}
                  {index < book.narrators.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-1 mt-3">
            <p className="text-[#FFFFFF] mb-1">
              <span className="text-[#A9A9AA] mr-2">Length:</span>
              {book?.length}
            </p>
            <p className="text-[#FFFFFF] mb-1">
              <span className="text-[#A9A9AA] mr-2">Release Date:</span>
              {book?.date_published}
            </p>
            <p className="text-[#FFFFFF] mb-1">
              <span className="text-[#A9A9AA] mr-2">Language:</span>
              English
            </p>
          </div>
        </div>

        <div className="mt-4">
          <PlayButton
            isPlaying={isPlaying}
            audioSampleLoading={audioSampleLoading}
            onClick={handleListenSample}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full lg:w-[35%] space-y-4">
        {!isPurchased ? (
          <button
            onClick={handleBuyAudiobook}
            className="flex items-center justify-center w-full px-6 py-3 bg-[#1F8505] text-white font-semibold rounded-xl hover:bg-[#21440F] transition-all duration-300 focus:outline-none"
          >
            <IconShoppingBag size={20} className="mr-2" />
            Buy: KES {book?.buying_price}
          </button>
        ) : isPurchased ? (
          <Link
            href={`/audiobooks/${book?.slug}`}
            className="flex items-center justify-center w-full px-6 py-3 bg-[#1F8505] text-white font-semibold rounded-xl hover:bg-[#21440F] transition-all duration-300 focus:outline-none"
          >
            <IconPlaylist size={20} className="mr-2" />
            Owned: View Book
          </Link>
        ) : (
          <div>
            <Loader size="sm" color="#1CFAC4" />
          </div>
        )}

        {!inWishList ? (
          <button
            onClick={handleAddToWishlist}
            className="flex items-center justify-center w-full px-6 py-3 text-[#1CFAC4] font-semibold rounded-xl border border-[#1CFAC4] hover:bg-[#152D09] transition-all duration-300 ease-in-out focus:outline-none"
          >
            {addWishLoading ? (
              <Loader size="sm" color="#1CFAC4" />
            ) : (
              <IconListDetails size={20} className="mr-2" />
            )}
            Add to Wishlist
          </button>
        ) : (
          <button
            onClick={handleRemoveFromWishList}
            className="flex items-center justify-center w-full px-6 py-3 text-[#1CFAC4] font-semibold rounded-xl border border-[#1CFAC4] hover:bg-[#152D09] transition-all duration-300 ease-in-out focus:outline-none"
          >
            {removeWishLoading ? (
              <Loader size="sm" color="#1CFAC4" />
            ) : (
              <IconListDetails size={20} className="mr-2" />
            )}
            Remove from Wishlist
          </button>
        )}
      </div>
    </div>
  );
}

export default WishlistCard;
