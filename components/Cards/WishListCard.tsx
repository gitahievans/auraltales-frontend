import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { Howl } from "howler";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconClock,
  IconShoppingBag,
  IconListDetails,
  IconStarFilled,
} from "@tabler/icons-react";
import {
  addToWishlist,
  checkAudiobookInWishlist,
  checkPurchaseStatus,
  removeFromWishlist,
} from "@/lib/store";
import { WishlistItem } from "@/app/wishlist/page";
import { PurchaseStatus } from "@/types/types";
import { buyAudiobook, listenSample } from "@/lib/audiobookActions.ts";

interface WishlistCardProps {
  audiobook: WishlistItem;
  setWishlistItems: React.Dispatch<React.SetStateAction<WishlistItem[] | null>>;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  audiobook,
  setWishlistItems,
}) => {
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const [inWishList, setInWishList] = useState(false);
  const [addWishLoading, setAddWishLoading] = useState(false);
  const [removeWishLoading, setRemoveWishLoading] = useState(false);
  const [isPurchased, setPurchaseStatus] = useState<PurchaseStatus | null>(
    null
  );
  const soundRef = useRef<Howl | null>(null);

  const book = audiobook.audiobook;
  const access = session?.jwt;
  const from = "wishlist";

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (access) {
        const isInWishlist = await checkAudiobookInWishlist(book.id, access);
        if (isInWishlist) setInWishList(isInWishlist);
      }
    };

    localStorage.setItem("audiobookToBuy", JSON.stringify(book));
    localStorage.setItem("session", JSON.stringify(session));
    checkWishlistStatus();

    const getPurchaseStatus = async () => {
      if (!audiobook || !access) return;
      const status = await checkPurchaseStatus(audiobook.id, access);
      if (status) {
        setPurchaseStatus(status);
      }
    };

    getPurchaseStatus();

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [book, session, access, audiobook]);

  console.log("is purchased in wishlist", isPurchased);

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
    const userEmail = session?.user?.email;

    if (access && userEmail) {
      buyAudiobook(book.id, +book.buying_price, userEmail, access);
    } else {
      notifications.show({
        title: "Error",
        message: "You must be logged in to buy an audiobook.",
        color: "red",
        position: "top-right",
      });
    }
  };

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
    addToWishlist(book.id, access, setAddWishLoading, setInWishList);
  };

  const handleRemoveFromWishList = async () => {
    if (!access) return;
    removeFromWishlist(
      book.id,
      access,
      setRemoveWishLoading,
      setInWishList,
      setWishlistItems,
      from
    );
  };

  return (
    <div className="bg-[#041714] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
      <div className="flex flex-col h-full">
        {/* Top Section with Image and Overlay */}
        <div className="relative aspect-[4/3] md:aspect-[16/9]">
          <Image
            src={book.poster}
            alt={book.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041714] to-transparent opacity-90" />

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
            <div className="flex gap-4">
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
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Title and Rating */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#1CFAC4] mb-2 line-clamp-2">
              {book.title}
            </h3>
            {book?.rating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <IconStarFilled
                    key={index}
                    size={16}
                    className={
                      index < book.rating! ? "text-[#1F8505]" : "text-gray-600"
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="space-y-2 text-sm text-[#FFFFFF] mb-4">
            <p className="line-clamp-1">
              <span className="text-[#A9A9AA]">By:</span>{" "}
              {book.authors.map((author, index) => (
                <span key={author.id}>
                  {author.name}
                  {index < book.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-2">
              <IconClock size={16} className="text-[#1CFAC4]" />
              <span>{book.length}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-3">
            {!isPurchased && book.buying_price && (
              <button
                onClick={handleBuyAudiobook}
                className="flex items-center justify-center w-full text-sm px-6 py-3 bg-[#1F8505] text-white font-semibold rounded-xl hover:bg-[#21440F] transition-all duration-300"
              >
                <IconShoppingBag size={20} className="mr-2" />
                Buy: KES {book.buying_price}
              </button>
            )}

            {inWishList && (
              <button
                onClick={handleRemoveFromWishList}
                className="w-full py-3 px-2 border-2 border-red-500 text-red-500 text-sm 
                font-bold rounded-xl hover:bg-red-500/10 
                transition-all duration-300 
                flex items-center justify-center space-x-2
                transform hover:scale-105 active:scale-95"
              >
                {removeWishLoading ? (
                  <Loader size="sm" color="#1CFAC4" />
                ) : (
                  <>
                    <IconListDetails size={16} className="mr-2" />
                    Remove
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
