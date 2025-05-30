import { Chapter } from "@/types/types";
import { IconPlayerTrackPrev } from "@tabler/icons-react";
import React from "react";
import { motion } from "framer-motion";

interface PrevBtnProps {
  handlePrevious: () => void;
  chapters: Chapter[];
}

const PrevBtn = ({ handlePrevious, chapters }: PrevBtnProps) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <button
        onClick={handlePrevious}
        className="text-gray-500 hover:text-gray-700 transition duration-200 p-2"
        disabled={!chapters.length}
        aria-label="Previous chapter"
        role="button"
      >
        <IconPlayerTrackPrev size={24} />
      </button>
    </motion.div>
  );
};

export default PrevBtn;
