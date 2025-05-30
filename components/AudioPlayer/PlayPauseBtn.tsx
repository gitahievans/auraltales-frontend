import React from "react";
import { Pause, Play } from "lucide-react";

interface PlayPauseBtnProps {
  isPlaying: boolean;
  canPlay: boolean;
  togglePlay: () => void;
}

const PlayPauseBtn = ({
  isPlaying,
  canPlay,
  togglePlay,
}: PlayPauseBtnProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <button
        onClick={togglePlay}
        className={`bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 ${
          !canPlay ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!canPlay}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
};

export default PlayPauseBtn;
