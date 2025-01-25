import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ActionIcon,
  Center,
  Loader,
  RingProgress,
  Slider,
} from "@mantine/core";
import {
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconRewindBackward10,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconRewindForward10,
  IconBookmark,
} from "@tabler/icons-react";
import Image from "next/image";
import { Audiobook, Chapter, PurchaseStatus } from "@/types/types";
import ChapterCard from "./Cards/ChapterCard";
import ChaptersMenu from "./ChaptersMenu";
import NarrationSpeedMenu from "./NarrationSpeedMenu";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer = ({
  currentChapter,
  setCurrentChapter,
  audiobook,
  setCurrentIndex,
  currentIndex,
  chapters,
  purchaseStatus,
}: {
  currentChapter: Chapter | null;
  setCurrentChapter: React.Dispatch<React.SetStateAction<Chapter | null>>;
  audiobook: Audiobook | null;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
  chapters: Chapter[];
  purchaseStatus: PurchaseStatus | null;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const audioSrc =
    chapters[currentIndex]?.audio_file || currentChapter?.audio_file;
  const duration = audioRef?.current?.duration || 0;
  const currentPercentage = duration ? (progress / duration) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex - 1 < 0) {
      setCurrentIndex(chapters.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();

    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        if (audioRef.current.ended) {
          handleNext();
        } else {
          setProgress(audioRef.current.currentTime);
        }
      }
    }, 50);
  }, [clearTimer, handleNext]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((error) => console.error("Playback error:", error));
      startTimer();
      setCurrentChapter(chapters[currentIndex]);
    } else {
      audioRef.current.pause();
      clearTimer();
    }
  }, [
    isPlaying,
    startTimer,
    clearTimer,
    chapters,
    currentIndex,
    setCurrentChapter,
  ]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
    } else {
      audioRef.current.pause();
      audioRef.current.src = audioSrc || "";
      audioRef.current.currentTime = 0;
    }

    setProgress(0);
    setIsPlaying(true);
    setCurrentChapter(chapters[currentIndex]);
  }, [currentIndex, audioSrc, setCurrentChapter]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentChapter(null);
    };
  }, [clearTimer, setCurrentChapter]);

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <div className="w-full p-6  rounded-xl shadow-2xl">
        <audio ref={audioRef} src={audioSrc} volume={volume} />
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

        {/* Chapter Information */}
        <div className="text-center mb-4">
          {chapters[currentIndex]?.title ? (
            <h2 className="text-lg font-bold text-white truncate">
              {chapters[currentIndex]?.title || "Unknown Chapter"}
            </h2>
          ) : (
            <div className="w-full items-center flex justify-center">
              <Loader type="bars" size="xs" color="#1CFAC4" />
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-col gap-1 items-center">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="w-full flex justify-between">
              <span className="text-gray-400 text-xs">
                {formatTime(progress)}
              </span>
              <span className="text-gray-400 text-xs">
                {formatTime(duration)}
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
            />
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className="text-white hover:text-green-500 transition-colors"
          >
            <IconPlayerTrackPrev size={24} />
          </button>
          <button className="text-gray-400" onClick={handleSkipBackward}>
            <IconRewindBackward10 size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors"
          >
            <div className="flex items-center justify-center">
              {isPlaying ? (
                <IconPlayerPause size={24} />
              ) : (
                <IconPlayerPlay size={24} />
              )}
            </div>
          </button>
          <button onClick={handleSkipForward} className="text-gray-400">
            <IconRewindForward10 size={24} />
          </button>
          <button
            onClick={handleNext}
            className="text-white hover:text-green-500 transition-colors"
          >
            <IconPlayerTrackNext size={24} />
          </button>
        </div>
      </div>

      <div className="w-full  flex justify-between items-center">
        <ChaptersMenu chapters={chapters} audiobook={audiobook} />
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
            <h1 className="text-xl font-bold text-[#1CFAC4]">Chapters</h1>
            <div className="text-gray-400">
              {audiobook?.chapters?.length || 0} Chapters •{" "}
              {audiobook?.total_duration}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {audiobook?.chapters.map((chapter: Chapter, index: number) => (
              <ChapterCard
                chapter={chapter}
                audioBook={audiobook}
                key={chapter.id || index}
                isPlaying={currentChapter?.id === chapter.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
