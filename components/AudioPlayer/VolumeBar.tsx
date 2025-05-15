import { IconVolume } from "@tabler/icons-react";
import React from "react";

interface VolumeBarProps {
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeBar = ({ volume, setVolume }: VolumeBarProps ) => {
  return (
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
  );
};

export default VolumeBar;
