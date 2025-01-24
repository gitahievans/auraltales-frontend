"use client";

import Image from "next/image";
import React, { useState } from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import {
  IconPlayerPlayFilled,
  IconClockHour4,
  IconChevronRight,
} from "@tabler/icons-react";
import { Audiobook, Chapter } from "@/types/types";
import { Loader } from "@mantine/core";

const ChapterCard: React.FC<{
  chapter: Chapter;
  audioBook: Audiobook;
  isPlaying: boolean;
}> = ({ chapter, audioBook, isPlaying }) => {
  // const handleListenNowClick = () => {
  //   const audiobookData = encodeURIComponent(JSON.stringify(audioBook));

  //   window.open(
  //     `/audiobooks/audioplayer/${chapter?.id}?audiobook=${audiobookData}`,
  //     "_blank",
  //     "noopener,noreferrer,width=500,height=800"
  //   );
  // };

  return (
    <div
      className="group relative bg-gradient-to-br from-[#062C2A] to-[#041714] 
      rounded-2xl overflow-hidden shadow-lg 
      transition-all duration-300 hover:shadow-xl 
      border border-green-950 p-2 hover:border-[#1CFAC4]/20"
    >
      <div className="absolute inset-0 bg-[#1CFAC4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image
              src={audioBook?.poster || poster}
              alt="Chapter Cover"
              width={70}
              height={70}
              className="rounded-xl object-cover shadow-md 
              transform transition-transform duration-300 
              group-hover:scale-105"
            />
          </div>
        </div>

        {/* Chapter Details */}
        <div className="flex-grow space-y-1 text-center md:text-left">
          <h2 className="font-bold text-[#1CFAC4] uppercase">
            Chapter {chapter?.chapter_number}
          </h2>
          <p className="text-xs text-gray-300 line-clamp-2">
            {chapter?.description || "No chapter description available"}
          </p>

          <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-400">
            <div className="flex items-center space-x-2">
              <IconClockHour4 size={16} />
              <span className="text-xs">{chapter?.duration || "50 mins"}</span>
            </div>
          </div>
        </div>

        {/* Listen Button */}
        <div className="flex-shrink-0">
          <button
            // onClick={handleListenNowClick}
            className="flex items-center justify-center 
            px-6 py-2 bg-[#1CFAC4] text-black 
            font-bold rounded-xl 
            hover:bg-[#15D8A7] 
            transition-all duration-300 
            transform hover:scale-105 active:scale-95
            group/button"
          >
            {!isPlaying ? (
              <span className="flex items-center space-x-2 text-sm">
                <IconPlayerPlayFilled size={20} />
                <span>Listen</span>
                <IconChevronRight
                  size={20}
                  className="opacity-0 group-hover/button:opacity-100 
                transition-opacity duration-300"
                />
              </span>
            ) : (
              <span className="flex items-center space-x-2 text-sm">
                <span>Playing</span>
                <Loader />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
