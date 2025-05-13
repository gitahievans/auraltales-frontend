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
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const streamingTokenRef = useRef<string | null>(null);
  const queueRef = useRef<ArrayBuffer[]>([]); // Queue for chunks while SourceBuffer is updating
  const [allChunksFetched, setAllChunksFetched] = useState<boolean>(false); // Track if all chunks are fetched

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
  const [bytesFetched, setBytesFetched] = useState<number>(0);

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
      setBytesFetched(0);
      setError(null);
      setAudioMetadata(null); // Reset audioMetadata to ensure fresh state
      setAllChunksFetched(false); // Reset chunk tracking

      try {
        console.log(
          "[DEBUG] Initializing audio for chapter:",
          currentChapter.id
        );
        // Initial request to get metadata and streaming token
        const response = await apiClient.get(
          `/streaming/stream/chapter/${currentChapter.id}/`,
          {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          }
        );

        console.log("[DEBUG] Metadata response:", response.data);
        console.log("[DEBUG] Response headers:", response.headers);
        // Save metadata and streaming token
        setAudioMetadata(response.data);
        const streamingToken = response.headers["x-streaming-token"];
        streamingTokenRef.current = streamingToken;
        console.log("[DEBUG] Streaming token:", streamingToken);

        if (!streamingToken) {
          throw new Error("Streaming token not received from server.");
        }
      } catch (err) {
        console.error("[ERROR] Error initializing audio stream:", err);
        setError(
          "Failed to initialize audio streaming: " +
            (err.message || "Unknown error")
        );
        setIsLoading(false);
      }
    };

    // Clean up existing audio and MediaSource
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
    if (mediaSourceRef.current) {
      try {
        mediaSourceRef.current.endOfStream();
      } catch (e) {
        console.error("[ERROR] Error ending previous MediaSource stream:", e);
      }
      mediaSourceRef.current = null;
    }

    initializeAudio();

    return () => {
      if (mediaSourceRef.current) {
        try {
          mediaSourceRef.current.endOfStream();
        } catch (e) {
          console.error(
            "[ERROR] Error ending MediaSource stream on cleanup:",
            e
          );
        }
      }
    };
  }, [currentChapter, session]);

  // Setup MediaSource when audioMetadata is available
  useEffect(() => {
    if (
      !audioRef.current ||
      !currentChapter?.id ||
      !audioMetadata ||
      !streamingTokenRef.current
    ) {
      console.log("[DEBUG] Skipping MediaSource setup, requirements not met:", {
        audioRef: !!audioRef.current,
        chapterId: currentChapter?.id,
        audioMetadata: !!audioMetadata,
        streamingToken: streamingTokenRef.current,
      });
      return;
    }

    console.log("[DEBUG] Setting up MediaSource...");
    setupMediaSource();
  }, [audioMetadata, currentChapter, session]); // Depend on audioMetadata to ensure it runs after state update

  // Setup Media Source Extensions for streaming
  const setupMediaSource = useCallback(() => {
    console.log("[DEBUG] Entering setupMediaSource with:", {
      audioRef: !!audioRef.current,
      chapterId: currentChapter?.id,
      audioMetadata: !!audioMetadata,
      streamingToken: streamingTokenRef.current,
    });

    if (
      !audioRef.current ||
      !currentChapter?.id ||
      !audioMetadata ||
      !streamingTokenRef.current
    ) {
      console.error("[ERROR] Missing requirements for MediaSource setup:", {
        audioRef: !!audioRef.current,
        chapterId: currentChapter?.id,
        audioMetadata: !!audioMetadata,
        streamingToken: streamingTokenRef.current,
      });
      setError("Failed to set up audio streaming. Missing requirements.");
      setIsLoading(false);
      return;
    }

    if (!("MediaSource" in window)) {
      console.error("[ERROR] MediaSource API not supported");
      setError("MediaSource API is not supported in this browser.");
      setIsLoading(false);
      return;
    }

    // Initialize MediaSource
    mediaSourceRef.current = new MediaSource();
    const mediaSourceUrl = URL.createObjectURL(mediaSourceRef.current);
    console.log("[DEBUG] MediaSource URL created:", mediaSourceUrl);
    audioRef.current.src = mediaSourceUrl;

    mediaSourceRef.current.addEventListener("sourceopen", () => {
      if (!mediaSourceRef.current || !audioMetadata) {
        console.error("[ERROR] MediaSource or metadata missing on sourceopen");
        setError("Failed to initialize MediaSource.");
        setIsLoading(false);
        return;
      }

      console.log("[DEBUG] MediaSource opened");
      // Initialize SourceBuffer with the correct MIME type
      const mimeType = audioMetadata.content_type || "audio/mpeg";
      console.log("[DEBUG] Using MIME type:", mimeType);
      try {
        sourceBufferRef.current =
          mediaSourceRef.current.addSourceBuffer(mimeType);
        console.log("[DEBUG] SourceBuffer created");
      } catch (e) {
        console.error("[ERROR] Failed to create SourceBuffer:", e);
        setError("Failed to create SourceBuffer. Incorrect audio format?");
        setIsLoading(false);
        return;
      }

      // Handle SourceBuffer updates
      sourceBufferRef.current.addEventListener("updateend", () => {
        console.log("[DEBUG] SourceBuffer updateend");
        if (
          queueRef.current.length > 0 &&
          sourceBufferRef.current &&
          !sourceBufferRef.current.updating
        ) {
          const nextChunk = queueRef.current.shift();
          if (nextChunk) {
            console.log("[DEBUG] Appending queued chunk");
            sourceBufferRef.current.appendBuffer(nextChunk);
          }
        } else if (allChunksFetched && !sourceBufferRef.current.updating) {
          // End the stream only after all chunks are appended and SourceBuffer is not updating
          console.log("[DEBUG] All chunks appended, ending stream");
          try {
            mediaSourceRef.current?.endOfStream();
          } catch (e) {
            console.error("[ERROR] Error ending MediaSource stream:", e);
            setError(
              "Failed to end MediaSource stream: " +
                (e.message || "Unknown error")
            );
            setIsLoading(false);
          }
        }

        // Update buffer progress
        updateBufferProgress();
      });

      // Handle SourceBuffer errors
      sourceBufferRef.current.addEventListener("error", (e) => {
        console.error("[ERROR] SourceBuffer error:", e);
        setError("Error in audio streaming. Please try again.");
        setIsLoading(false);
      });

      // Start fetching chunks
      console.log("[DEBUG] Fetching first chunk...");
      fetchNextChunk(0);
    });

    mediaSourceRef.current.addEventListener("error", (e) => {
      console.error("[ERROR] MediaSource error:", e);
      setError("MediaSource error occurred. Please try again.");
      setIsLoading(false);
    });

    // Update audio element settings
    audioRef.current.volume = volume;
    audioRef.current.playbackRate = playbackSpeed;

    // Auto-play after loading
    audioRef.current.onloadedmetadata = () => {
      console.log(
        "[DEBUG] Audio metadata loaded, duration:",
        audioRef.current?.duration
      );
      setDuration(audioRef.current?.duration || 0);
      setIsLoading(false);

      if (isPlaying) {
        console.log("[DEBUG] Attempting to auto-play");
        audioRef.current?.play().catch((error) => {
          console.error("[ERROR] Autoplay prevented:", error);
          setIsPlaying(false);
        });
      }
    };

    audioRef.current.onerror = (e) => {
      console.error("[ERROR] Audio element error:", e);
      setError("Error loading audio. Please try again.");
      setIsLoading(false);
    };

    // Set up progress tracking
    audioRef.current.ontimeupdate = () => {
      setProgress(audioRef.current?.currentTime || 0);
    };

    // Handle when playback ends
    audioRef.current.onended = () => {
      if (bufferProgress >= 99) {
        handleNext();
      }
    };
  }, [currentChapter, audioMetadata, volume, playbackSpeed, isPlaying]);

  // Fetch the next chunk of audio
  const fetchNextChunk = async (startByte: number) => {
    if (!currentChapter?.id || !streamingTokenRef.current || !audioMetadata) {
      console.error("[ERROR] Missing requirements for fetchNextChunk:", {
        chapterId: currentChapter?.id,
        streamingToken: streamingTokenRef.current,
        audioMetadata: !!audioMetadata,
      });
      setError("Failed to fetch audio chunk. Missing requirements.");
      setIsLoading(false);
      return;
    }

    try {
      const chunkSize = 1024 * 1024; // 1MB chunks
      const endByte = Math.min(
        startByte + chunkSize - 1,
        audioMetadata.file_size - 1
      );
      console.log("[DEBUG] Fetching chunk: bytes=", startByte, "-", endByte);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/streaming/stream/chapter/${currentChapter.id}/`,
        {
          headers: {
            Range: `bytes=${startByte}-${endByte}`,
            Authorization: `Bearer ${session?.jwt}`,
            "X-Streaming-Token": streamingTokenRef.current,
          },
        }
      );

      if (!response.ok) {
        console.error(
          "[ERROR] Fetch response not ok:",
          response.status,
          response.statusText
        );
        throw new Error(`Failed to fetch audio chunk: ${response.statusText}`);
      }

      // Update streaming token
      const newToken = response.headers.get("x-streaming-token");
      if (newToken) {
        streamingTokenRef.current = newToken;
        console.log("[DEBUG] Updated streaming token:", newToken);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log("[DEBUG] Chunk fetched, size:", arrayBuffer.byteLength);
      setBytesFetched((prev) => prev + arrayBuffer.byteLength);

      // Append the chunk to the SourceBuffer
      if (sourceBufferRef.current) {
        if (!sourceBufferRef.current.updating) {
          console.log("[DEBUG] Appending chunk to SourceBuffer");
          sourceBufferRef.current.appendBuffer(arrayBuffer);
        } else {
          console.log("[DEBUG] SourceBuffer updating, queuing chunk");
          queueRef.current.push(arrayBuffer);
        }
      } else {
        console.error("[ERROR] SourceBuffer not available");
        setError("SourceBuffer not available for streaming.");
        setIsLoading(false);
        return;
      }

      // If there’s more to fetch, continue
      if (endByte < audioMetadata.file_size - 1) {
        fetchNextChunk(endByte + 1);
      } else {
        console.log("[DEBUG] All chunks fetched, setting flag");
        setAllChunksFetched(true); // Set flag to end stream after append completes
      }
    } catch (error) {
      console.error("[ERROR] Error fetching chunk:", error);
      setError(
        "Failed to fetch audio chunk: " + (error.message || "Unknown error")
      );
      setIsLoading(false);
    }
  };

  // Update buffer progress based on fetched bytes
  const updateBufferProgress = () => {
    if (!audioMetadata || !audioRef.current) return;

    const totalBytes = audioMetadata.file_size;
    const bufferedPercent = (bytesFetched / totalBytes) * 100;
    setBufferProgress(Math.min(bufferedPercent, 100));
    console.log("[DEBUG] Buffer progress updated:", bufferedPercent);
  };

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("[ERROR] Play error:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle volume change
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

  // Handle seeking in the audio
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseFloat(e.target.value);
    setProgress(newPosition);

    if (audioRef.current) {
      audioRef.current.currentTime = newPosition;
    }
  }, []);

  // Handle playback speed change
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

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (mediaSourceRef.current) {
        try {
          mediaSourceRef.current.endOfStream();
        } catch (e) {
          console.error(
            "[ERROR] Error ending MediaSource stream on cleanup:",
            e
          );
        }
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full p-6 rounded-xl shadow-2xl">
        <audio ref={audioRef} />
        {/* {error && <div className="text-red-500 text-center mb-4">{error}</div>} */}
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
            {/* <div className="w-full mt-2">
              <Progress value={bufferProgress} size="xs" color="blue" />
              <span className="text-gray-400 text-xs">
                Buffering: {Math.round(bufferProgress)}%
              </span>
            </div> */}
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
