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
      className="w-full py-3 border-2 border-[white] text-[white] 
      font-bold rounded-xl hover:bg-[white]/10 
      transition-all duration-300 
      flex items-center justify-center space-x-2
      transform hover:scale-105 active:scale-95"
    >
      <span className="flex items-center space-x-2">
        {audioSampleLoading ? (
          <Loader type="bars" size="sm" color="white" />
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
