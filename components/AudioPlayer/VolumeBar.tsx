import { IconVolume } from "@tabler/icons-react";
import React from "react";
import { motion } from "framer-motion";

interface VolumeBarProps {
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeBar = ({ volume, setVolume }: VolumeBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-3 bg-slate-800/30 rounded-xl p-3 border border-emerald-500/20"
    >
      <div className="w-full flex items-center justify-between mt-2">
        <IconVolume color="gray" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          aria-label="Volume slider"
        />
      </div>
    </motion.div>
  );
};

export default VolumeBar;
