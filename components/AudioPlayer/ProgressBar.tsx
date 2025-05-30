import { IconVinyl } from "@tabler/icons-react";
import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  duration: number;
  currentTime: number;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (time: number) => string;
}

const ProgressBar = ({
  duration,
  currentTime,
  handleSeek,
  formatTime,
}: ProgressBarProps) => {
  return (
     <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-3 bg-slate-800/30 rounded-xl p-3 border border-emerald-500/20"
    >
      <div className="w-full flex flex-col gap-1 items-center">
      <div className="w-full flex gap-2 items-center">
        <IconVinyl color="gray" />
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          aria-label="Seek slider"
          />
      </div>
      <div className="w-full flex justify-between">
        <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
        <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
      </div>
    </div>
          </motion.div>
  );
};

export default ProgressBar;
