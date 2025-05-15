import { Chapter } from "@/types/types";
import { IconPlayerTrackPrev } from "@tabler/icons-react";
import React from "react";

interface PrevBtnProps {
  handlePrevious: () => void;
  chapters: Chapter[];
}

const PrevBtn = ({ handlePrevious, chapters }: PrevBtnProps) => {
  return (
    <button
      onClick={handlePrevious}
      className="text-gray-500 hover:text-gray-700 transition duration-200 p-2"
      disabled={!chapters.length}
      aria-label="Previous chapter"
      role="button"
    >
      <IconPlayerTrackPrev size={24} />
    </button>
  );
};

export default PrevBtn;
