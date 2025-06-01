"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { IconPlayerPlayFilled, IconClockHour4 } from "@tabler/icons-react";
import { Audiobook, Chapter } from "@/types/types";
import { Loader } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import fallbackPoster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";

const ChapterCard: React.FC<{
  chapter: Chapter;
  audioBook: Audiobook;
  isPlaying: boolean;
  onPlayClick: () => void;
}> = ({ chapter, audioBook, isPlaying, onPlayClick }) => {
  console.log("chapter card", chapter);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Utility function to format duration
  const formatDuration = (duration: string): string => {
    // Remove microseconds by taking the part before the decimal point
    const [timePart] = duration.split(".");
    // Split into hours, minutes, seconds
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Format as H:MM:SS if hours > 0, otherwise MM:SS
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card Container */}
      <div
        className={`
          relative z-10 rounded-2xl border p-2 transition-all duration-300
          bg-gradient-to-br from-[#062C2A]/90 to-[#041714]/90
          backdrop-blur-sm
          ${
            isPlaying
              ? "border-emerald-500/50 shadow-lg shadow-emerald-500/20"
              : "border-emerald-500/20 hover:border-emerald-500/40"
          }
        `}
      >
        {/* Playing Pulse Effect */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div className="relative flex flex-row items-center gap-4">
          {/* Book Cover */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl blur-sm" />
              <Image
                src={audioBook?.poster || fallbackPoster}
                alt="Chapter Cover"
                width={isMobile ? 50 : 70}
                height={isMobile ? 50 : 70}
                className="rounded-xl object-cover border-2 border-emerald-500/30 shadow-lg"
              />
            </div>
          </motion.div>

          {/* Chapter Details */}
          <div className="flex-grow space-y-1 md:text-left min-w-0">
            <motion.h2
              className="font-bold text-emerald-300 text-[10px] md:text-xs uppercase"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Chapter {chapter?.order}
            </motion.h2>
            <motion.div
              className="flex items-center text-gray-400 space-x-2 text-[10px] md:text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <IconClockHour4 size={14} />
              <span>{formatDuration(chapter?.duration || "00:00:00")}</span>
            </motion.div>
          </div>

          {/* Play Button */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {!isPlaying ? (
              <button
                onClick={onPlayClick}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
              >
                <span className="flex items-center space-x-2 text-sm">
                  <IconPlayerPlayFilled size={20} />
                  <span>Play</span>
                </span>
              </button>
            ) : (
              <div className="bg-gradient-to-r from-emerald-950 to-green-900 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 flex gap-2 items-center">
                <Loader type="bars" size="xs" color="green" />
                <span>Playing</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChapterCard;
