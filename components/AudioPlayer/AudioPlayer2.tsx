"use client";

import {
  setupMediaSource,
  fetchAndAppendChunk,
} from "@/components/AudioPlayer/utils/audioStreaming";
import { Audiobook, Chapter, PurchaseStatus } from "@/types/types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ProgressBar from "./ProgressBar";
import VolumeBar from "./VolumeBar";
import PlayPauseBtn from "./PlayPauseBtn";
import NarrationSpeedMenu from "../NarrationSpeedMenu";
import RingProgressComp from "./RingProgressComp";
import NextBtn from "./NextBtn";
import PrevBtn from "./PrevBtn";
import RewindBtn from "./RewindBtn";
import FwdBtn from "./FwdBtn";
import ChapterCard from "../Cards/ChapterCard";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  chapter: Chapter | null;
  audiobook: Audiobook;
  chapters: Chapter[];
  currentChapterIndex: number;
  onChapterChange: (index: number) => void;
  purchaseStatus: PurchaseStatus | null;
};

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer2: React.FC<Props> = ({
  chapter,
  audiobook,
  chapters,
  currentChapterIndex,
  onChapterChange,
  purchaseStatus,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const currentByteRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
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

  useEffect(() => {
    setupMediaSource({
      audioRef,
      mediaSourceRef,
      sourceBufferRef,
      chapter,
      setStreamingToken,
      setFileSize,
      setDuration,
      setIsReady,
    });

    return () => {
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
  }, [chapter]);

  useEffect(() => {
    if (isReady && streamingToken && fileSize && sourceBufferRef.current) {
      fetchAndAppendChunk({
        chapter,
        streamingToken,
        fileSize,
        sourceBuffer: sourceBufferRef.current,
        currentByteRef,
        isFetchingRef,
        mediaSourceRef,
        audioRef,
        setStreamingToken,
        setCanPlay,
        setIsPlaying,
        chunkSize,
      });
    }
  }, [isReady, streamingToken, fileSize]);

  const handleNext = useCallback(() => {
    const newIndex =
      currentChapterIndex < chapters.length - 1 ? currentChapterIndex + 1 : 0;
    onChapterChange(newIndex);
    setIsPlaying(false);
    setCanPlay(false);
    setIsReady(false);
    currentByteRef.current = 0;
  }, [currentChapterIndex, chapters.length, onChapterChange]);

  const handlePrevious = useCallback(() => {
    const newIndex =
      currentChapterIndex > 0 ? currentChapterIndex - 1 : chapters.length - 1;
    onChapterChange(newIndex);
    setIsPlaying(false);
    setCanPlay(false);
    setIsReady(false);
    currentByteRef.current = 0;
  }, [currentChapterIndex, chapters.length, onChapterChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!audio.duration || isNaN(audio.duration)) return;
      setCurrentTime(audio.currentTime);
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [handleNext]);

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
          fetchAndAppendChunk({
            chapter,
            streamingToken,
            fileSize,
            sourceBuffer: sourceBufferRef.current,
            currentByteRef,
            isFetchingRef,
            mediaSourceRef,
            audioRef,
            setStreamingToken,
            setCanPlay,
            setIsPlaying,
            chunkSize,
          });
        }
      }
    };

    const intervalId = setInterval(checkBuffer, 5000);

    return () => clearInterval(intervalId);
  }, [canPlay, fileSize, streamingToken, chapter]);

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
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed]);

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
    if (!audio || !sourceBufferRef.current || !fileSize) return;

    const effectiveDuration = audio.duration || duration || Infinity;
    const newTime = Math.min(audio.currentTime + 10, effectiveDuration);
    audio.currentTime = newTime;
    setCurrentTime(newTime);

    // Check if newTime is beyond or near the buffered range
    const buffer = audio.buffered;
    let isBuffered = false;
    for (let i = 0; i < buffer.length; i++) {
      if (newTime >= buffer.start(i) && newTime <= buffer.end(i)) {
        isBuffered = true;
        break;
      }
    }

    if (
      !isBuffered &&
      currentByteRef.current < fileSize &&
      sourceBufferRef.current
    ) {
      console.log(
        "[DEBUG] New time beyond buffered range, fetching chunk immediately"
      );
      fetchAndAppendChunk({
        chapter,
        streamingToken,
        fileSize,
        sourceBuffer: sourceBufferRef.current,
        currentByteRef,
        isFetchingRef,
        mediaSourceRef,
        audioRef,
        setStreamingToken,
        setCanPlay,
        setIsPlaying,
        chunkSize,
      });
    }

    // Ensure playback continues if it was playing
    if (isPlaying && canPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("[DEBUG] Resume play after skip failed:", err);
        });
    }
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

  // Handler for chapter card play click
  const handleChapterClick = (index: number) => {
    // Only change if it's a different chapter
    if (index !== currentChapterIndex) {
      onChapterChange(index);
      setIsPlaying(false);
      setCanPlay(false);
      setIsReady(false);
      currentByteRef.current = 0;

      // We'll set it to playing after the chapter changes and loads
      setTimeout(() => {
        if (canPlay) togglePlay();
      }, 500);
    } else {
      // If it's the same chapter, just toggle play/pause
      togglePlay();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full mx-auto px-4"
    >
      {/* Main Layout: Flex on large screens, stacked on small screens */}
      <div className="flex flex-col lg:flex-row lg:gap-8 max-w-7xl mx-auto">
        {/* Main Card (Player) */}
        <motion.div
          className="relative bg-transparent backdrop-blur-xl rounded-3xl border border-green-500 shadow-2xl overflow-hidden lg:w-1/2"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 bg-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6 md:p-8">
            <audio ref={audioRef} preload="none" />

            {/* Chapter Title */}
            <motion.div variants={itemVariants} className="text-center mb-6">
              <h2 className="text-sm md:text-base font-medium text-green-300/80 tracking-wide">
                {chapter?.title}
              </h2>
            </motion.div>

            {/* Ring Progress */}
            <motion.div variants={itemVariants} className="mb-8">
              <RingProgressComp
                currentPercentage={currentPercentage}
                audiobook={audiobook}
              />
            </motion.div>

            {/* Controls */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-3 md:gap-6 mb-6"
            >
              <PrevBtn handlePrevious={handlePrevious} chapters={chapters} />
              <RewindBtn
                handleSkipBackward={handleSkipBackward}
                canPlay={canPlay}
              />
              <PlayPauseBtn
                isPlaying={isPlaying}
                canPlay={canPlay}
                togglePlay={togglePlay}
              />
              <FwdBtn handleSkipForward={handleSkipForward} canPlay={canPlay} />
              <NextBtn handleNext={handleNext} chapters={chapters} />
            </motion.div>

            {/* Progress */}
            <motion.div variants={itemVariants} className="mb-6">
              <ProgressBar
                duration={duration}
                currentTime={currentTime}
                handleSeek={handleSeek}
                formatTime={formatTime}
              />
            </motion.div>

            {/* Volume & Speed */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              <VolumeBar volume={volume} setVolume={setVolume} />
              <NarrationSpeedMenu
                currentSpeed={playbackSpeed}
                onSpeedChange={handleSpeedChange}
              />
            </motion.div>

            {/* Chapter Info */}
            <motion.div variants={itemVariants} className="text-center">
              {chapter && (
                <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 rounded-2xl p-4 border border-green-500">
                  <p className="font-semibold text-green-300 text-sm md:text-base">
                    Chapter {currentChapterIndex + 1} of {chapters.length}
                  </p>
                  <p className="text-green-300 text-xs md:text-sm mt-1 truncate">
                    {chapter.title}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Chapter List */}
        <AnimatePresence>
          {purchaseStatus?.bought && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 lg:mt-0 lg:w-1/2"
            >
              <div className="relative h-full">
                {/* Glow */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-green-800/5 to-teal-900/10 rounded-3xl blur-lg" /> */}

                {/* Chapter Section */}
                <div className="relative bg-transparent backdrop-blur-xl rounded-3xl border border-green-500 p-6 md:p-8 lg:overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <motion.h1
                      className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-300 to-green-300 bg-clip-text text-transparent"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Chapters
                    </motion.h1>
                    <motion.div
                      className="text-green-400 text-sm md:text-base"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {chapters.length || 0} Chapters
                    </motion.div>
                  </div>

                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {chapters.map((chap: Chapter, index: number) => (
                      <motion.div
                        key={chap.id || index}
                        variants={itemVariants}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ChapterCard
                          chapter={chap}
                          audioBook={audiobook}
                          isPlaying={chapter?.id === chap.id && isPlaying}
                          onPlayClick={() => handleChapterClick(index)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AudioPlayer2;
