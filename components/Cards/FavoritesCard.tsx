import React, { useRef, useState } from "react";
import Image from "next/image";
import { Loader } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FavoriteItem } from "@/app/favorites/page";
import {
  IconClock,
  IconHeart,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconShoppingBag,
  IconStar,
  IconStars,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { addToFavorites } from "@/lib/store";
import Link from "next/link";
import { listenSample } from "@/lib/audiobookActions.ts";

const FavoriteCard = ({ audiobook }: FavoriteItem) => {
  // Calculate a random rating between 4 and 5 for display
  const rating = Math.floor(Math.random() * (5 - 4 + 1) + 4);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [addFavLoading, setAddFavLoading] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const favBook = audiobook.audiobook;
  const soundRef = useRef<Howl | null>(null);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: session } = useSession();
  const access = session?.jwt;

  console.log("audiobook", audiobook);

  const handleRemoveFromFavorites = () => {
    // Implement logic to remove the book from favorites
  };

  const handleListenSample = () => {
    listenSample(
      favBook,
      soundRef,
      isPlaying,
      setIsPlaying,
      setAudioSampleLoading
    );
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#041714] hover:shadow-lg transition-all duration-300">
      {/* <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleRemoveFromFavorites}
          className="p-2 rounded-full bg-[#152D09] hover:bg-[#21440F] transition-all duration-300"
        >
          <IconHeart className="w-6 h-6 text-[#1CFAC4] fill-[#1CFAC4]" />
        </button>
      </div> */}

      <div className="flex flex-col md:flex-row">
        {/* Left Section - Image and Quick Actions */}
        <div className="relative group md:w-1/3">
          <Image
            src={favBook?.poster}
            alt={favBook?.title || "Book Cover"}
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
              {favBook?.title}
            </h3>
            {/* <div className="flex items-center gap-2 text-[#A9A9AA]">
              {[...Array(5)].map((_, index) => (
                <IconStar
                  key={index}
                  className={`w-4 h-4 ${
                    index < rating
                      ? "fill-[#1F8505] text-[#1F8505]"
                      : "text-gray-400"
                  }`}
                />
              ))}
              <span className="text-sm ml-2">
                Favorited on{" "}
                {new Date(favBook?.added_at).toLocaleDateString()}
              </span>
            </div> */}
          </div>

          {/* Content */}
          <div className="space-y-3 text-[#FFFFFF] mb-6">
            <p>
              <span className="text-[#A9A9AA]">By:</span>{" "}
              {favBook?.authors?.map((author, index) => (
                <span key={author.id}>
                  {author.name}
                  {index < favBook.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p>
              <span className="text-[#A9A9AA]">Narrated by:</span>{" "}
              {favBook?.narrators?.map((narrator, index) => (
                <span key={narrator.id}>
                  {narrator.name}
                  {index < favBook.narrators.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-2">
              <IconClock className="w-4 h-4 text-[#1CFAC4]" />
              <span>{favBook?.length}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-3">
            <Link
              href={`/audiobooks/${favBook?.slug}`}
              className="w-full px-6 py-3 bg-[#1F8505] text-white font-semibold rounded-xl hover:bg-[#21440F] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <IconPlayerPlayFilled size={20} className="mr-2" />
              <span>View Book</span>
            </Link>
            <button
              onClick={handleRemoveFromFavorites}
              className="flex items-center justify-center w-full px-6 py-3 text-[#1CFAC4] font-semibold rounded-xl border border-[#1CFAC4] hover:bg-[#152D09] transition-all duration-300 ease-in-out focus:outline-none"
            >
              <IconStars size={20} className="mr-2" />
              Remove from Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
