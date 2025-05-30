import { IconRewindBackward10 } from "@tabler/icons-react";
import React from "react";
import { motion } from "framer-motion";

interface RewindBtnProps {
  handleSkipBackward: () => void;
  canPlay: boolean;
}

const RewindBtn = ({ handleSkipBackward, canPlay }: RewindBtnProps) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <button
        onClick={handleSkipBackward}
        className="text-gray-500 hover:text-gray-700 transition duration-200"
        disabled={!canPlay}
        aria-label="Skip backward 10 seconds"
        role="button"
      >
        <IconRewindBackward10 size={24} />
      </button>
    </motion.div>
  );
};

export default RewindBtn;
