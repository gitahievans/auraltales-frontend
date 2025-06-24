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
      className="w-full text-[white] 
      font-semibold rounded-xl hover:bg-[white]/5 
      transition-all duration-300 
      flex items-center justify-center
      transform hover:scale-105 active:scale-95"
    >
      <span className="flex items-center space-x-2">
        {audioSampleLoading ? (
          <Loader type="bars" size="sm" color="white" />
        ) : (
          <>
            {isPlaying ? <IconPlayerStop /> : <IconPlayerPlayFilled />}
            <span className={`hidden md:inline`}>
              {isPlaying ? "Stop Sample" : "Listen Sample"}
            </span>
          </>
        )}
      </span>
    </button>
  );
};

export default PlayButton;
