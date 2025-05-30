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
    <div className="rounded-2xl shadow-lg p-4 w-full">
      <audio ref={audioRef} preload="none" />
      <div className="text-sm text-gray-600">{chapter?.title}</div>

      <RingProgressComp
        currentPercentage={currentPercentage}
        audiobook={audiobook}
      />
      <div className="flex justify-between items-center mb-4">
        <PrevBtn handlePrevious={handlePrevious} chapters={chapters} />
        <RewindBtn handleSkipBackward={handleSkipBackward} canPlay={canPlay} />
        <PlayPauseBtn
          isPlaying={isPlaying}
          canPlay={canPlay}
          togglePlay={togglePlay}
        />
        <FwdBtn handleSkipForward={handleSkipForward} canPlay={canPlay} />
        <NextBtn handleNext={handleNext} chapters={chapters} />
      </div>
      <ProgressBar
        duration={duration}
        currentTime={currentTime}
        handleSeek={handleSeek}
        formatTime={formatTime}
      />
      <VolumeBar volume={volume} setVolume={setVolume} />
      <NarrationSpeedMenu
        currentSpeed={playbackSpeed}
        onSpeedChange={handleSpeedChange}
      />
      <div className="mt-4 text-sm text-gray-600">
        {chapter && (
          <div>
            <p className="font-medium">
              Chapter {currentChapterIndex + 1} of {chapters.length}
            </p>
            <p className="truncate">{chapter.title}</p>
          </div>
        )}
      </div>
      {purchaseStatus?.bought && (
        <div className="w-full px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white">Chapters</h1>
            <div className="text-gray-400">{chapters.length || 0} Chapters</div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {chapters.map((chap: Chapter, index: number) => (
              <ChapterCard
                chapter={chap}
                audioBook={audiobook}
                key={chap.id || index}
                isPlaying={chapter?.id === chap.id && isPlaying}
                onPlayClick={() => handleChapterClick(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer2;
