import { Chapter } from "@/types/types";
import { IconPlayerTrackPrev } from "@tabler/icons-react";
import React from "react";
import { motion } from "framer-motion";

interface NextBtnProps {
  handleNext: () => void;
  chapters: Chapter[];
}

const NextBtn = ({ handleNext, chapters }: NextBtnProps) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <button
        onClick={handleNext}
        className="text-gray-500 hover:text-gray-700 transition duration-200 p-2"
        disabled={!chapters.length}
        aria-label="Next chapter"
        role="button"
      >
        <IconPlayerTrackPrev
          size={24}
          style={{ transform: "rotate(180deg)" }}
        />
      </button>
    </motion.div>
  );
};

export default NextBtn;
