import React, { useRef, useState } from "react";
import Image from "next/image";
import { Loader } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { Howl } from "howler";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconClock,
  IconHeadphones,
  IconHeart,
  IconStarFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { removeFromFavorites } from "@/lib/store";
import { FavoriteItem } from "@/app/favorites/page";
import { listenSample } from "@/lib/audiobookActions.ts";

const FavoriteCard = ({
  audiobook,
  setFavoriteItems,
}: {
  audiobook: FavoriteItem;
  setFavoriteItems: React.Dispatch<React.SetStateAction<FavoriteItem[] | null>>;
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const { data: session } = useSession();
  const favBook = audiobook.audiobook;

  const handleRemoveFromFavorites = async () => {
    if (!session?.jwt) return;
    await removeFromFavorites(
      favBook.id,
      session.jwt,
      setIsLoading,
      () => {},
      setFavoriteItems,
      "favorites"
    );
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

  const formatAddedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#041714] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
      <div className="flex flex-col h-full">
        {/* Top Section with Image and Overlay */}
        <div className="relative aspect-[4/3] md:aspect-[16/9]">
          <Image
            src={favBook.poster}
            alt={favBook.title}
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
            <h3 className="text-xl font-bold text-[#1CFAC4] mb-2 line-clamp-1">
              {favBook.title}
            </h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <IconStarFilled
                  key={index}
                  size={16}
                  className={index < 4 ? "text-[#1F8505]" : "text-gray-600"}
                />
              ))}
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-2 text-sm text-[#FFFFFF] mb-4">
            <p className="line-clamp-1">
              <span className="text-[#A9A9AA]">By:</span>{" "}
              {favBook.authors.map((author, index) => (
                <span key={author.id}>
                  {author.name}
                  {index < favBook.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-2">
              <IconClock size={16} className="text-[#1CFAC4]" />
              <span>{favBook.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconHeadphones size={16} className="text-[#1CFAC4]" />
              <span>Added: {formatAddedDate(audiobook.added_at)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-3">
            <Link
              href={`/audiobooks/${favBook.slug}`}
              className="flex items-center justify-center w-full text-sm px-2 py-3 bg-[#1F8505] text-white font-semibold rounded-xl hover:bg-[#21440F] transition-all duration-300"
            >
              <IconPlayerPlayFilled size={20} className="mr-2" />
              View Book
            </Link>
            <button
              onClick={handleRemoveFromFavorites}
              disabled={isLoading}
              className="flex items-center gap-2 justify-center w-full px-2 py-3 text-sm text-[#1CFAC4] font-semibold rounded-xl border border-[#1CFAC4] hover:bg-[#152D09] transition-all duration-300"
            >
              <IconHeart size={20} className="fill-[#1CFAC4]" />
              {isLoading ? "Removing..." : "Remove from Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
