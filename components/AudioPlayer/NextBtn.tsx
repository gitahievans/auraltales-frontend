import { Chapter } from "@/types/types";
import { IconPlayerTrackPrev } from "@tabler/icons-react";
import React from "react";

interface NextBtnProps {
  handleNext: () => void;
  chapters: Chapter[];
}

const NextBtn = ({ handleNext, chapters }: NextBtnProps) => {
  return (
    <button
      onClick={handleNext}
      className="text-gray-500 hover:text-gray-700 transition duration-200 p-2"
      disabled={!chapters.length}
      aria-label="Next chapter"
      role="button"
    >
      <IconPlayerTrackPrev size={24} style={{ transform: "rotate(180deg)" }} />
    </button>
  );
};

export default NextBtn;
