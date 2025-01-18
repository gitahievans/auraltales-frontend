import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  IconListDetails,
  IconPlaylist,
  IconShoppingBag,
  IconPlayerPlay,
  IconPlayerPause,
  IconClock,
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
import Link from "next/link";
import { WishlistItem } from "@/app/wishlist/page";

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
      if (!audiobook || !session?.jwt) return;
      const status = await checkPurchaseStatus(audiobook.id, session.jwt);
      setPurchaseStatus(status);
    };
    getPurchaseStatus();
  }, [audiobook, session?.jwt]);

  const handleAddToWishlist = async () => {
    if (!access) {
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
    if (!access) return;
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
    <div className="relative overflow-hidden rounded-xl bg-[#041714] hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Image and Quick Actions */}
        <div className="relative group md:w-1/3">
          <Image
            src={book?.poster || "/api/placeholder/250/250"}
            alt={book?.title || "Book Cover"}
            width={isMobile ? 300 : 400}
            height={isMobile ? 300 : 400}
            className="object-cover w-full h-[300px] md:h-full rounded-t-xl md:rounded-l-xl md:rounded-t-none"
          />

          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleListenSample}
              className="p-4 rounded-full bg-[#1F8505] hover:bg-[#21440F] transition-all duration-300"
            >
              {audioSampleLoading ? (
                <Loader size="sm" color="#1CFAC4" />
              ) : isPlaying ? (
                <IconPlayerPause className="w-8 h-8 text-white" />
              ) : (
                <IconPlayerPlay className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-[#1CFAC4] mb-2">
              {book?.title}
            </h3>
          </div>

          {/* Content */}
          <div className="space-y-3 text-[#FFFFFF] mb-6">
            <p>
              <span className="text-[#A9A9AA]">By:</span>{" "}
              {book?.authors?.map((author, index) => (
                <span key={author.id}>
                  {author.name}
                  {index < book.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p>
              <span className="text-[#A9A9AA]">Narrated by:</span>{" "}
              {book?.narrators?.map((narrator, index) => (
                <span key={narrator.id}>
                  {narrator.name}
                  {index < book.narrators.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-2">
              <IconClock className="w-4 h-4 text-[#1CFAC4]" />
              <span>{book?.length}</span>
            </div>
            <p>
              <span className="text-[#A9A9AA]">Release Date:</span>{" "}
              {book?.date_published}
            </p>
            <p>
              <span className="text-[#A9A9AA]">Language:</span> English
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-3">
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
              <div className="flex justify-center">
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
      </div>
    </div>
  );
}

export default WishlistCard;
