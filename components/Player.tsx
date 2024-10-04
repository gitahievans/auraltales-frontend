"use client";

import React, { useState } from "react";
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
} from "@tabler/icons-react";
import poster from "@/public/Images/soundleaf-files/posters/_f170a6e7-30ee-4c76-8cbc-f4206c1f2db3.jpeg";
import Image from "next/image";
import ChaptersMenu from "./ChaptersMenu";
import NarrationSpeedMenu from "./NarrationSpeedMenu";

const chapters = [
  { duration: "-1:16:45" },
  { duration: "1:17:12" },
  { duration: "1:17:15" },
  { duration: "1:17:24" },
  { duration: "56:49" },
  { duration: "1:03:12" },
  { duration: "1:00:32" },
];

const AudioPlayer = () => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handleSpeedChange = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    // Here you would also update the actual audio playback speed
    // using your audio player's API
  };

  return (
    <div className="bg-dark-green rounded-3xl p-6 max-w-md mx-auto border">
      <div className="text-center mb-4">
        <h2 className="text-blue-300 text-xl font-semibold">
          Book: The Silent Patient
        </h2>
        <p className="text-gray-300">Chapter 1: The Prologue</p>
      </div>

      <RingProgress
        size={192}
        thickness={5}
        sections={[{ value: 40, color: "#22c55e" }]}
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
              size={160}
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

      <div className="flex justify-between items-center mb-6">
        <button className="text-gray-400">
          <IconRewindBackward10 size={24} />
        </button>
        <button className="text-gray-400">
          <IconPlayerSkipBack size={24} />
        </button>
        <button className="bg-green-500 rounded-full p-3">
          <IconPlayerPlay size={32} color="white" />
        </button>
        <button className="text-gray-400">
          <IconPlayerSkipForward size={24} />
        </button>
        <button className="text-gray-400">
          <IconRewindForward10 size={24} />
        </button>
      </div>

      <div className="flex justify-between text-gray-300 text-sm">
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
