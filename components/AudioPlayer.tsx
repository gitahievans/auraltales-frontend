import React, { useEffect, useRef, useState, useCallback } from "react";
import { ActionIcon, Center, RingProgress } from "@mantine/core";
import {
  IconPlayerSkipBack,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconList,
  IconBookmark,
  IconGauge,
  IconRewindForward10,
  IconRewindBackward10,
  IconPlayerPause,
} from "@tabler/icons-react";
import poster from "@/public/Images/soundleaf-files/posters/_f170a6e7-30ee-4c76-8cbc-f4206c1f2db3.jpeg";
import Image from "next/image";
import ChaptersMenu from "./ChaptersMenu";
import NarrationSpeedMenu from "./NarrationSpeedMenu";
import { Audiobook, Chapter } from "@/types/types";
import { Howl } from "howler";
import { useSession } from "next-auth/react";

const chapters = [
  { duration: "-1:16:45" },
  { duration: "1:17:12" },
  { duration: "1:17:15" },
  { duration: "1:17:24" },
  { duration: "56:49" },
  { duration: "1:03:12" },
  { duration: "1:00:32" },
];

// TODO: To fix the issue where the progress bar fails to move on initial page load till a refresh is done, after the initial page load, force a refresh

const AudioPlayer: React.FC<{ chapter: Chapter; audiobook: Audiobook }> = ({
  chapter,
  audiobook,
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const soundRef = useRef<Howl | null>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const { data: session } = useSession();

  const updateProgress = useCallback((time: number) => {
    setCurrentTime(time);
    if (duration > 0) {
      const progressPercentage = (time / duration) * 100;
      setProgress(progressPercentage);
    }
  }, [duration]);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      if (soundRef.current && isPlaying) {
        const currentTime = soundRef.current.seek() as number;
        updateProgress(currentTime);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, updateProgress]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  const loadAudio = useCallback(async (chapterId: number) => {
    const accessToken = session?.jwt;

    if (!accessToken) return;

    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [`http://127.0.0.1:8000/streaming/stream/chapter/${chapterId}/`],
      format: ["mp3"],
      html5: true,
      xhr: {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
      onload: () => {
        const audioDuration = soundRef.current?.duration() || 0;
        setDuration(audioDuration);
        updateProgress(0);
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        updateProgress(duration);
      },
      onseek: () => {
        if (soundRef.current) {
          updateProgress(soundRef.current.seek() as number);
        }
      },
      onloaderror: (id: any, error: any) => console.error("Error loading audio:", error),
      onplayerror: (id: any, error: any) => console.error("Error playing audio:", error),
    });
  }, [session?.jwt, updateProgress, duration]);

  useEffect(() => {
    if (chapter?.id) {
      loadAudio(+chapter.id);
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [chapter?.id, loadAudio]);

  const handlePlayPause = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  };

  const handleSkipForward = () => {
    if (soundRef.current) {
      const newSeek = Math.min(soundRef.current.seek() as number + 10, duration);
      soundRef.current.seek(newSeek);
    }
  };

  const handleSkipBackward = () => {
    if (soundRef.current) {
      const newSeek = Math.max(soundRef.current.seek() as number - 10, 0);
      soundRef.current.seek(newSeek);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (soundRef.current) {
      soundRef.current.rate(newSpeed);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center bg-dark-green rounded-3xl p-6 max-w-md mx-auto border">
      <div className="text-center mb-4">
        <h2 className="text-blue-300 text-xl font-semibold">
          Book: {audiobook?.title}
        </h2>
        <p className="text-gray-300">
          Chapter {chapter?.order}: {chapter?.title}
        </p>
      </div>

      <RingProgress
        size={192}
        thickness={7}
        sections={[{ value: progress, color: "#22c55e" }]}
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
                src={poster}
                alt="Book cover"
                className="rounded-full object-cover"
              />
            </ActionIcon>
          </Center>
        }
      />

      <div className="w-full text-center mt-2 text-gray-300">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <div className="flex justify-between items-center mb-6 w-full">
        <button className="text-gray-400" onClick={handleSkipBackward}>
          <IconRewindBackward10 size={24} />
        </button>
        <button className="text-gray-400">
          <IconPlayerSkipBack size={24} />
        </button>
        <button
          onClick={handlePlayPause}
          className="bg-green-500 rounded-full p-3"
        >
          {isPlaying ? (
            <IconPlayerPause size={28} color="white" />
          ) : (
            <IconPlayerPlay size={28} color="white" />
          )}
        </button>
        <button className="text-gray-400">
          <IconPlayerSkipForward size={24} />
        </button>
        <button onClick={handleSkipForward} className="text-gray-400">
          <IconRewindForward10 size={24} />
        </button>
      </div>

      <div className="flex justify-between text-gray-300 w-full text-sm">
        <ChaptersMenu chapters={chapters} />
        <div className="flex flex-col items-center">
          <IconBookmark size={24} />
          <span>Bookmark</span>
        </div>
        <NarrationSpeedMenu
          currentSpeed={playbackSpeed}
          onSpeedChange={handleSpeedChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;