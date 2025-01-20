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
  IconBookmarks,
  IconStarFilled,
  IconProgress,
} from "@tabler/icons-react";
import { listenSample } from "@/lib/audiobookActions.ts";
import { Audiobook } from "@/types/types";

const LibraryCard = ({ book }: { book: Audiobook }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  const handleListenSample = () => {
    listenSample(
      book,
      soundRef,
      isPlaying,
      setIsPlaying,
      setAudioSampleLoading
    );
  };

  const formatLastListened = (dateString?: string) => {
    if (!dateString) return "Not started yet";
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
            src={book.poster}
            alt={book.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041714] to-transparent opacity-90">
            {/* Progress Bar */}
            {book.progress && book.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1F8505]/30">
                <div
                  className="h-full bg-[#1CFAC4] transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            )}
          </div>

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
            {book.rating && (
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
            {book.progress !== undefined && (
              <div className="flex items-center gap-2">
                <IconProgress size={16} className="text-[#1CFAC4]" />
                <span>{book.progress}% complete</span>
              </div>
            )}
            {book.lastListened && (
              <div className="flex items-center gap-2">
                <IconHeadphones size={16} className="text-[#1CFAC4]" />
                <span>
                  Last listened: {formatLastListened(book.lastListened)}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Link
              href={`/audiobooks/${book.slug}`}
              className="flex items-center justify-center w-full px-6 py-3 bg-[#1F8505] text-white font-semibold rounded-xl hover:bg-[#21440F] transition-all duration-300"
            >
              <IconBookmarks size={20} className="mr-2" />
              Continue Listening
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryCard;
