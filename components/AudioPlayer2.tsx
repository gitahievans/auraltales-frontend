"use client";

import apiClient from "@/lib/apiClient";
import { Audiobook, Chapter } from "@/types/types";
import {
  IconPlayerTrackPrev,
  IconRewindBackward10,
  IconRewindForward10,
  IconVinyl,
  IconVolume,
} from "@tabler/icons-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ProgressBar from "./AudioPlayer/ProgressBar";
import VolumeBar from "./AudioPlayer/VolumeBar";
import PlayPauseBtn from "./AudioPlayer/PlayPauseBtn";
import NarrationSpeedMenu from "./NarrationSpeedMenu";
import { ActionIcon, Center, RingProgress } from "@mantine/core";
import Image from "next/image";

type Props = {
  chapter: Chapter | null;
  audiobook: Audiobook;
};

const parseDuration = (durationStr: string): number => {
  const [time] = durationStr.split(".");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer2: React.FC<Props> = ({ chapter, audiobook }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const currentByteRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false); // Flag to prevent concurrent fetches
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isReady, setIsReady] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [streamingToken, setStreamingToken] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const chunkSize = 1024 * 1024;

  const fetchMetadata = async () => {
    try {
      const res = await apiClient.get(
        `/streaming/stream/chapter/${chapter?.id}/`
      );
      const { file_size, content_type, duration } = res.data;
      const streamingToken = res.headers["x-streaming-token"];

      console.log("[DEBUG] Metadata loaded:", {
        file_size,
        content_type,
        duration,
      });

      return { file_size, content_type, streamingToken, duration };
    } catch (error) {
      console.error("[ERROR] Failed to fetch metadata:", error);
      return null;
    }
  };

  const setupMediaSource = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    audioEl.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", async () => {
      console.log("[DEBUG] MediaSource opened");

      const metadata = await fetchMetadata();
      if (!metadata) {
        console.error("[ERROR] Metadata fetch failed");
        return;
      }

      const { content_type, streamingToken, file_size, duration } = metadata;
      setStreamingToken(streamingToken);
      setFileSize(file_size);

      if (chapter?.duration) {
        const totalSeconds = parseDuration(chapter.duration);
        setDuration(totalSeconds);
        console.log("[DEBUG] Duration set:", totalSeconds);
      }

      try {
        const sourceBuffer = mediaSource.addSourceBuffer(content_type);
        sourceBufferRef.current = sourceBuffer;
        setIsReady(true);
      } catch (error) {
        console.error("[ERROR] Failed to create SourceBuffer:", error);
      }
    });
  };

  const fetchAndAppendChunk = async (
    file_size: number,
    sourceBuffer: SourceBuffer
  ) => {
    if (!chapter || !streamingToken) {
      console.error("[ERROR] Missing chapter or streaming token", {
        chapterId: chapter?.id,
        streamingToken,
      });
      return;
    }

    if (isFetchingRef.current) {
      console.log("[DEBUG] Already fetching a chunk, skipping...");
      return;
    }

    isFetchingRef.current = true;
    const currentByte = currentByteRef.current;
    const endByte = Math.min(currentByte + chunkSize - 1, file_size - 1);
    console.log(
      `[DEBUG] Fetching bytes ${currentByte}-${endByte}, File Size: ${file_size}`
    );

    // Validate the range on the frontend
    if (currentByte >= file_size) {
      console.log("[DEBUG] Current byte exceeds file size, stopping fetch");
      isFetchingRef.current = false;
      return;
    }
    if (endByte < currentByte) {
      console.error(`[ERROR] Invalid range: ${currentByte}-${endByte}`);
      isFetchingRef.current = false;
      return;
    }

    try {
      const response = await apiClient.get(
        `/streaming/stream/chapter/${chapter.id}/`,
        {
          headers: {
            Range: `bytes=${currentByte}-${endByte}`,
            "X-Streaming-Token": streamingToken,
          },
          responseType: "arraybuffer",
        }
      );

      if (!response.data) {
        console.error("[ERROR] No data received in response");
        return;
      }

      // Update streaming token with the new one from the response
      const newStreamingToken = response.headers["x-streaming-token"];
      if (newStreamingToken) {
        console.log("[DEBUG] Updating streaming token:", newStreamingToken);
        setStreamingToken(newStreamingToken);
      } else {
        console.warn("[WARN] No new streaming token in response");
      }

      const chunk = new Uint8Array(response.data);

      const appendChunk = () => {
        if (sourceBuffer.updating) {
          console.log("[DEBUG] SourceBuffer updating, waiting...");
          sourceBuffer.addEventListener("updateend", appendChunk, {
            once: true,
          });
        } else {
          try {
            sourceBuffer.appendBuffer(chunk);
            console.log("[DEBUG] Chunk appended:", chunk.length);
            currentByteRef.current = endByte + 1;
            setCanPlay(true);

            audioRef.current
              ?.play()
              .then(() => {
                console.log("[DEBUG] Playback started automatically");
                setIsPlaying(true);
              })
              .catch((err) => {
                console.error("[DEBUG] Auto-play failed", err);
              });

            console.log("[DEBUG] Can play set to true");

            if (
              endByte >= file_size - 1 &&
              mediaSourceRef.current?.readyState === "open" &&
              !sourceBuffer.updating
            ) {
              console.log("[DEBUG] End of file reached, closing stream.");
              mediaSourceRef.current.endOfStream();
            }
          } catch (err) {
            console.error("[ERROR] Failed to append buffer:", err);
          }
        }
      };

      appendChunk();
    } catch (error) {
      console.error("[ERROR] Failed to fetch chunk:", error);
      setTimeout(() => {
        isFetchingRef.current = false;
      }, 5000);
      return;
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    setupMediaSource();
    return () => {
      // Cleanup on unmount
      if (mediaSourceRef.current) {
        try {
          if (mediaSourceRef.current.readyState === "open") {
            mediaSourceRef.current.endOfStream();
          }
        } catch (err) {
          console.error("[ERROR] Failed to close MediaSource:", err);
        }
      }
      if (audioRef.current) {
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && streamingToken && fileSize && sourceBufferRef.current) {
      fetchAndAppendChunk(fileSize, sourceBufferRef.current);
    }
  }, [isReady, streamingToken, fileSize]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!audio.duration || isNaN(audio.duration)) return;
      setCurrentTime(audio.currentTime); // <- Add this line
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !sourceBufferRef.current || !fileSize) return;

    const checkBuffer = () => {
      const buffer = audio.buffered;
      if (buffer.length > 0) {
        const remaining = buffer.end(0) - audio.currentTime;
        if (
          remaining < 30 &&
          currentByteRef.current < fileSize &&
          sourceBufferRef.current
        ) {
          console.log("[DEBUG] Less than 30 seconds left, fetching next chunk");
          fetchAndAppendChunk(fileSize, sourceBufferRef.current);
        }
      }
    };

    // Check buffer every 5 seconds instead of every frame
    const intervalId = setInterval(checkBuffer, 5000);

    return () => clearInterval(intervalId);
  }, [canPlay, fileSize]);

  const togglePlay = () => {
    if (!canPlay) {
      console.log("[DEBUG] Not ready to play yet.");
      return;
    }
    const audio = audioRef.current;
    if (!audio) {
      console.error("[ERROR] Audio element not found");
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("[DEBUG] Audio play failed:", err);
        });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(audio.currentTime - 10, 0);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.min(audio.currentTime + 10, duration);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackSpeed(speed);

    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  const currentPercentage = useMemo(() => {
    if (!duration || isNaN(duration)) return 0;
    return (currentTime / duration) * 100;
  }, [duration, currentTime]);

  return (
    <div className="rounded-2xl shadow-lg p-4 w-full">
      <audio ref={audioRef} preload="none" />
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
                  src={audiobook?.poster}
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
      <PlayPauseBtn
        isPlaying={isPlaying}
        canPlay={canPlay}
        togglePlay={togglePlay}
        chapter={chapter}
      />

      <ProgressBar
        duration={duration}
        currentTime={currentTime}
        handleSeek={handleSeek}
        formatTime={formatTime}
      />

      <VolumeBar volume={volume} setVolume={setVolume} />

      <button
        onClick={handleSkipBackward}
        className="text-gray-500 hover:text-gray-700 transition duration-200"
        disabled={!canPlay}
        aria-label="Skip backward 10 seconds"
        role="button"
      >
        <IconRewindBackward10 size={24} />
      </button>
      <button
        onClick={handleSkipForward}
        className="text-gray-400"
        aria-label="Skip forward 10 seconds"
        role="button"
      >
        <IconRewindForward10 size={24} />
      </button>

      <NarrationSpeedMenu
        currentSpeed={playbackSpeed}
        onSpeedChange={handleSpeedChange}
      />

      {!canPlay && (
        <div className="text-sm text-gray-500 mt-2 animate-pulse">
          Buffering audio...
        </div>
      )}
    </div>
  );
};

export default AudioPlayer2;
