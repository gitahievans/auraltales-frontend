import { IconRewindForward10 } from "@tabler/icons-react";
import React from "react";
import { motion } from "framer-motion";

interface FwdBtnProps {
  handleSkipForward: () => void;
  canPlay: boolean;
}

const FwdBtn = ({ handleSkipForward, canPlay }: FwdBtnProps) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <button
        onClick={handleSkipForward}
        disabled={!canPlay}
        className={`text-gray-500 hover:text-gray-700 transition duration-200 ${
          !canPlay ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Skip forward 10 seconds"
        role="button"
      >
        <IconRewindForward10 size={24} />
      </button>
    </motion.div>
  );
};

export default FwdBtn;
