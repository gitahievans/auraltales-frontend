import { Loader } from "@mantine/core";
import { IconPlayerStop, IconPlayerPlayFilled } from "@tabler/icons-react";

interface PlayButtonProps {
  isPlaying: boolean;
  audioSampleLoading: boolean;
  onClick: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  audioSampleLoading,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-white bg-transparent border border-gray-400 rounded-xl w-fit px-4 py-2 hover:bg-white hover:text-black transition duration-300"
    >
      <span className="flex items-center space-x-2">
        {audioSampleLoading ? (
          <Loader size="sm" color="white" />
        ) : (
          <>
            {isPlaying ? <IconPlayerStop /> : <IconPlayerPlayFilled />}
            <span>{isPlaying ? "Stop Sample" : "Listen Sample"}</span>
          </>
        )}
      </span>
    </button>
  );
};

export default PlayButton;
