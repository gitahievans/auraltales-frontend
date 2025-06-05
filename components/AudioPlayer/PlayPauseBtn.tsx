import React from "react";
import { Pause, Play } from "lucide-react";
import { Loader } from "@mantine/core";

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
        className={`bg-green-600 text-white rounded-full p-2 flex items-center justify-center hover:bg-green-900 ${
          !canPlay ? "cursor-not-allowed" : ""
        }`}
      >
        {canPlay ? (
          isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )
        ) : (
          <Loader type="oval" size="xs" color="green" />
        )}
      </button>
    </div>
  );
};

export default PlayPauseBtn;
