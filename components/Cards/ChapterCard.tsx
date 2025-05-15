"use client";

import Image from "next/image";
import React from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import { IconPlayerPlayFilled, IconClockHour4 } from "@tabler/icons-react";
import { Audiobook, Chapter } from "@/types/types";
import { Loader } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const ChapterCard: React.FC<{
  chapter: Chapter;
  audioBook: Audiobook;
  isPlaying: boolean;
  onPlayClick: () => void;
}> = ({ chapter, audioBook, isPlaying, onPlayClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className={`group relative ${
        isPlaying
          ? "animate-pulse bg-gradient-to-br from-[#062C2A] to-[#041714]"
          : "bg-[#062C2A]"
      }  
      rounded-2xl overflow-hidden shadow-lg
      transition-all duration-300 hover:shadow-xl
      border border-green-950 p-2 hover:border-[white]/20`}
    >
      <div className="absolute inset-0 bg-[white]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10 flex flex-row gap-4 items-center">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image
              src={audioBook?.poster || poster}
              alt="Chapter Cover"
              width={isMobile ? 50 : 70}
              height={isMobile ? 50 : 70}
              className="rounded-xl object-cover shadow-md
              transform transition-transform duration-300
              group-hover:scale-105"
            />
          </div>
        </div>
        {/* Chapter Details */}
        <div className="flex-grow space-y-1 md:text-left">
          <h2 className="font-bold text-[white] text-[10px] md:text-xs uppercase">
            Chapter {chapter?.order}
          </h2>
          <div className="flex items-center md:justify-start space-x-4 text-gray-400">
            <div className="flex space-x-2">
              <IconClockHour4 size={16} />
              <span className="text-[10px] md:text-xs">
                {formatDuration(Number(chapter?.duration))}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {!isPlaying ? (
            <button
              onClick={onPlayClick}
              className="flex items-center justify-center
              px-6 py-2 bg-primary text-white
              font-bold rounded-xl
              hover:bg-[#15D8A7]
              transition-all duration-300
              transform hover:scale-105 active:scale-95
              group/button"
            >
              <span className="flex items-center space-x-2 text-sm">
                <IconPlayerPlayFilled size={20} />
                <span>Play</span>
              </span>
            </button>
          ) : (
            <div
              className="flex items-center justify-center px-6 py-2 bg-primary text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95
              group/button"
            >
              <span className="flex items-center space-x-2 text-sm">
                <span>Playing</span>
                <Loader type="bars" size="sm" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format duration
const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default ChapterCard;
