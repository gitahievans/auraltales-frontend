import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { debounce } from "lodash";
import {
  ActionIcon,
  Center,
  Loader,
  RingProgress,
  Progress,
} from "@mantine/core";
import {
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconRewindBackward10,
  IconRewindForward10,
  IconBookmark,
  IconVinyl,
} from "@tabler/icons-react";
import Image from "next/image";
import { Audiobook, Chapter, PurchaseStatus } from "@/types/types";
import ChapterCard from "./Cards/ChapterCard";
import ChaptersMenu from "./ChaptersMenu";
import NarrationSpeedMenu from "./NarrationSpeedMenu";
import apiClient from "@/lib/apiClient";
import { useValidSession } from "@/hooks/useValidSession";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

interface AudioPlayerProps {
  currentChapter: Chapter | null;
  setCurrentChapter: React.Dispatch<React.SetStateAction<Chapter | null>>;
  audiobook: Audiobook | null;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
  chapters: Chapter[];
  purchaseStatus: PurchaseStatus | null;
  jwt?: string;
}

interface AudioMetadata {
  file_size: number;
  content_type: string;
  chapter_title: string;
}

const AudioPlayer = ({
  currentChapter,
  setCurrentChapter,
  audiobook,
  setCurrentIndex,
  currentIndex,
  chapters,
  purchaseStatus,
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamingTokenRef = useRef<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bufferProgress, setBufferProgress] = useState<number>(0);
  const [isFirstChunk, setIsFirstChunk] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { session } = useValidSession();

  const currentPercentage = useMemo(() => {
    if (!duration) return 0;
    return (progress / duration) * 100;
  }, [progress, duration]);

  // Initialize audio player when chapter changes
  useEffect(() => {
    if (!currentChapter?.id) return;

    const initializeAudio = async () => {
      setIsLoading(true);
      setIsFirstChunk(true);
      setBufferProgress(0);

      try {
        // Initial request to get metadata and streaming token
        const response = await apiClient.get(
          `/streaming/stream/chapter/${currentChapter.id}/`,
          {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          }
        );

        // Save metadata and streaming token
        setAudioMetadata(response.data);
        streamingTokenRef.current = response.headers["x-streaming-token"];

        if (audioRef.current) {
          // Set up Media Source Extensions for streaming
          setupMediaSource();
        }
      } catch (err) {
        console.error("Error initializing audio stream:", err);
        setError("Failed to initialize audio streaming. Please try again.");
        setIsLoading(false);
      }
    };

    // Clean up existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }

    initializeAudio();
  }, [currentChapter, session]);

  // Setup Media Source Extensions for streaming
  const setupMediaSource = useCallback(() => {
    if (!audioRef.current || !currentChapter?.id) return;

    // Create a URL for the audio stream
    const audioUrl = `${process.env.NEXT_PUBLIC_API_URL}/streaming/stream/chapter/${currentChapter.id}/`;

    // Set up the MSE (Media Source Extensions) or direct streaming based on browser support
    if ("MediaSource" in window) {
      // Advanced streaming with MSE could be implemented here
      // For simplicity, we'll use range requests directly
      streamAudioWithRangeRequests();
    } else {
      // Fallback for browsers without MSE support
      streamAudioWithRangeRequests();
    }
  }, [currentChapter]);

  // Stream audio using Range requests
  const streamAudioWithRangeRequests = useCallback(async () => {
    if (!audioRef.current || !currentChapter?.id) return;

    try {
      // Create a blob URL for the audio element
      const audioBlob = await fetchInitialChunk();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current.src = audioUrl;
      audioRef.current.load();

      // Update audio element settings
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;

      // Auto-play after loading
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
        setIsLoading(false);

        if (isPlaying) {
          audioRef.current?.play().catch((error) => {
            console.error("Autoplay prevented:", error);
            setIsPlaying(false);
          });
        }
      };

      // Set up progress tracking
      audioRef.current.ontimeupdate = () => {
        setProgress(audioRef.current?.currentTime || 0);
      };

      // Set up buffering progress tracking
      audioRef.current.onprogress = () => {
        if (!audioRef.current) return;

        const buffered = audioRef.current.buffered;
        if (buffered.length > 0) {
          const bufferedEnd = buffered.end(buffered.length - 1);
          const bufferedPercent =
            (bufferedEnd / audioRef.current.duration) * 100;
          setBufferProgress(bufferedPercent);
        }
      };

      // Handle when current chunk ends - fetch next chunk
      audioRef.current.onended = () => {
        // If we're at the end of the chapter, move to next chapter
        if (bufferProgress >= 99) {
          handleNext();
        } else {
          // Otherwise, it might be just the current chunk ending
          fetchNextChunk();
        }
      };
    } catch (err) {
      console.error("Error setting up audio stream:", err);
      setError("Failed to setup audio streaming. Please try again.");
      setIsLoading(false);
    }
  }, [currentChapter, volume, playbackSpeed, isPlaying]);

  // Fetch the initial chunk of audio
  const fetchInitialChunk = async (): Promise<Blob> => {
    if (!currentChapter?.id) {
      throw new Error("No chapter selected");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/streaming/stream/chapter/${currentChapter.id}/`,
        {
          headers: {
            Range: "bytes=0-1048575", // Request first 1MB chunk
            Authorization: `Bearer ${session?.jwt}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch initial audio chunk");
      }

      // Save streaming token for subsequent requests
      streamingTokenRef.current = response.headers.get("x-streaming-token");
      setIsFirstChunk(false);

      return await response.blob();
    } catch (error) {
      console.error("Error fetching initial chunk:", error);
      throw error;
    }
  };

  // Fetch the next chunk of audio when needed
  const fetchNextChunk = async () => {
    if (!currentChapter?.id || !streamingTokenRef.current) return;

    try {
      // Calculate the next byte range
      const currentTime = audioRef.current?.currentTime || 0;
      const totalDuration = audioRef.current?.duration || 0;
      const fileSize = audioMetadata?.file_size || 0;

      // Calculate approximately where we are in the file
      const estimatedBytePosition = Math.floor(
        (currentTime / totalDuration) * fileSize
      );
      const chunkSize = 1048576; // 1MB chunks

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/streaming/stream/chapter/${currentChapter.id}/`,
        {
          headers: {
            Range: `bytes=${estimatedBytePosition}-${
              estimatedBytePosition + chunkSize - 1
            }`,
            Authorization: `Bearer ${session?.jwt}`,
            "X-Streaming-Token": streamingTokenRef.current,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch next audio chunk");
      }

      // Update streaming token
      const newToken = response.headers.get("x-streaming-token");
      if (newToken) {
        streamingTokenRef.current = newToken;
      }

      // Append the new chunk to our audio
      const chunk = await response.blob();
      // Advanced implementation would append this to MediaSource buffer
      // For simplicity, we're tracking buffer progress but not actually appending

      // Update buffer progress
      const newBufferEnd = estimatedBytePosition + chunk.size;
      const newBufferPercent = (newBufferEnd / fileSize) * 100;
      setBufferProgress(Math.min(newBufferPercent, 100));
    } catch (error) {
      console.error("Error fetching next chunk:", error);
    }
  };

  // Function to handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Play error:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Function to handle volume change
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);

      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    },
    []
  );

  // Function to handle seeking in the audio
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseFloat(e.target.value);
    setProgress(newPosition);

    if (audioRef.current) {
      audioRef.current.currentTime = newPosition;
    }
  }, []);

  // Function to handle playback speed change
  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackSpeed(speed);

    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  // Skip backward 10 seconds
  const handleSkipBackward = useCallback(() => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - 10);
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  }, []);

  // Skip forward 10 seconds
  const handleSkipForward = useCallback(() => {
    if (audioRef.current) {
      const newTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  }, []);

  // Go to previous chapter
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentChapter(chapters[prevIndex]);
    }
  }, [currentIndex, chapters, setCurrentIndex, setCurrentChapter]);

  // Go to next chapter
  const handleNext = useCallback(() => {
    if (currentIndex < chapters.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentChapter(chapters[nextIndex]);
    }
  }, [currentIndex, chapters, setCurrentIndex, setCurrentChapter]);

  // Buffer progress monitoring with debounce
  const updateBufferProgressDebounced = useMemo(
    () =>
      debounce(() => {
        if (!audioRef.current) return;

        try {
          const buffered = audioRef.current.buffered;
          if (buffered.length > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1);
            const duration = audioRef.current.duration;
            const bufferedPercent = (bufferedEnd / duration) * 100;
            setBufferProgress(Math.min(bufferedPercent, 100));

            // Request next chunk if we're below 90% buffered
            if (bufferedPercent < 90 && !isFirstChunk) {
              fetchNextChunk();
            }
          }
        } catch (error) {
          console.error("Error updating buffer progress:", error);
        }
      }, 500),
    [isFirstChunk]
  );

  // Set up periodic buffer checking
  useEffect(() => {
    const bufferInterval = setInterval(() => {
      updateBufferProgressDebounced();
    }, 2000);

    return () => {
      clearInterval(bufferInterval);
      updateBufferProgressDebounced.cancel();
    };
  }, [updateBufferProgressDebounced]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full p-6 rounded-xl shadow-2xl">
        <audio ref={audioRef} />
        <div className="w-full flex justify-center items-center mb-4">
          <RingProgress
            size={192}
            thickness={7}
            sections={[{ value: currentPercentage, color: "#22c55e" }]}
            rootColor="#1a1a1a"
            roundCaps
            label={
              <Center>
                <ActionIcon
                  styles={{
                    root: {
                      backgroundColor: "transparent",
                    },
                  }}
                  variant="light"
                  radius="xl"
                  size={155}
                >
                  <Image
                    src={audiobook?.poster || "/default-poster.jpg"}
                    alt="Book cover"
                    className="rounded-full object-cover border-2 border-gray-700"
                    width={500}
                    height={300}
                  />
                </ActionIcon>
              </Center>
            }
          />
        </div>

        <div className="text-center mb-4">
          {chapters[currentIndex]?.title ? (
            <h2 className="text-lg font-bold text-white truncate">
              {chapters[currentIndex]?.title || "Unknown Chapter"}
            </h2>
          ) : (
            <div className="w-full items-center flex justify-center">
              <Loader type="bars" size="xs" color="white" />
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-col gap-1 items-center">
            <div className="w-full flex gap-2 items-center">
              <IconVinyl color="white" />
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Seek slider"
              />
            </div>
            <div className="w-full flex justify-between">
              <span className="text-gray-400 text-xs">
                {formatTime(progress)}
              </span>
              <span className="text-gray-400 text-xs">
                {formatTime(duration)}
              </span>
            </div>
            <div className="w-full mt-2">
              <Progress value={bufferProgress} size="xs" color="blue" />
              <span className="text-gray-400 text-xs">
                Buffering: {Math.round(bufferProgress)}%
              </span>
            </div>
          </div>

          <div className="w-full flex gap-2 items-center">
            <IconVolume color="white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Volume slider"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className="text-white hover:text-green-500 transition-colors"
            aria-label="Previous chapter"
            role="button"
          >
            <IconPlayerTrackPrev size={24} />
          </button>
          <button
            onClick={handleSkipBackward}
            className="text-gray-400"
            aria-label="Skip backward 10 seconds"
            role="button"
          >
            <IconRewindBackward10 size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
            role="button"
          >
            <div className="flex items-center justify-center">
              {isLoading ? (
                <Loader size="sm" color="white" />
              ) : isPlaying ? (
                <IconPlayerPause size={24} />
              ) : (
                <IconPlayerPlay size={24} />
              )}
            </div>
          </button>
          <button
            onClick={handleSkipForward}
            className="text-gray-400"
            aria-label="Skip forward 10 seconds"
            role="button"
          >
            <IconRewindForward10 size={24} />
          </button>
          <button
            onClick={handleNext}
            className="text-white hover:text-green-500 transition-colors"
            aria-label="Next chapter"
            role="button"
          >
            <IconPlayerTrackNext size={24} />
          </button>
        </div>
      </div>

      <div className="w-full flex justify-between items-center">
        <ChaptersMenu chapters={chapters} audiobook={audiobook as Audiobook} />
        <div className="flex flex-col items-center">
          <IconBookmark size={24} color="white" />
          <span className="text-white">Bookmark</span>
        </div>
        <NarrationSpeedMenu
          currentSpeed={playbackSpeed}
          onSpeedChange={handleSpeedChange}
        />
      </div>

      {purchaseStatus?.bought ? (
        <div className="w-full px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white">Chapters</h1>
            <div className="text-gray-400">
              {audiobook?.chapters?.length || 0} Chapters
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {audiobook?.chapters?.map((chapter: Chapter, index: number) => (
              <ChapterCard
                chapter={chapter}
                audioBook={audiobook}
                key={chapter.id || index}
                isPlaying={currentChapter?.id === chapter.id}
                onPlayClick={() => {
                  setCurrentIndex(index);
                  setCurrentChapter(chapter);
                  setIsPlaying(true);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-full">
            <p className="text-white">
              Please purchase the audiobook to view chapters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
