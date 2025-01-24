/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback, use } from "react";
import { ActionIcon, Center, RingProgress } from "@mantine/core";
import { Audiobook, Chapter } from "@/types/types";
import Image from "next/image";

const AudioPlayer = ({
  currentChapter,
  setCurrentChapter,
  audiobook,
  setCurrentIndex,
  currentIndex,
  chapters,
}: {
  currentChapter: Chapter | null;
  setCurrentChapter: React.Dispatch<React.SetStateAction<Chapter | null>>;
  audiobook: Audiobook | null;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
  chapters: Chapter[];
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef(null);

  const audioSrc =
    chapters[currentIndex]?.audio_file || currentChapter?.audio_file;
  const duration = audioRef?.current?.duration || 0;
  const currentPercentage = duration ? (progress / duration) * 100 : 0;

  console.log("currentPercentage", currentPercentage);

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
    }, 100);
  }, [clearInterval, handleNext]);

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
  }, [isPlaying, startTimer, clearTimer]);

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
  }, [currentIndex, audioSrc]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentChapter(null);
    };
  }, [clearTimer]);

  return (
    <div>
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
                className="rounded-full object-cover"
                width={500}
                height={300}
              />
            </ActionIcon>
          </Center>
        }
      />
      {/* controls */}
      <div className="flex flex-row gap-4 items-center text-white">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default AudioPlayer;
