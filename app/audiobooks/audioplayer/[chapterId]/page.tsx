"use client";

import AudioPlayer from "@/components/AudioPlayer";
import { Chapter } from "@/types/types";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = ({ params }: { params: { chapterId: string } }) => {
  const { chapterId } = params;
  const searchParams = useSearchParams();
  const audiobook = searchParams.get("audiobook");
  const [chapters, setChapters] = React.useState<Chapter[]>([]);

  const parsedAudiobook = audiobook
    ? JSON.parse(decodeURIComponent(audiobook)) || null
    : null;

  console.log("parsedAudiobook", parsedAudiobook);
  console.log("id", chapterId);

  // Fetch chapters using the chapterId
  const fetchChapters = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/audiobooks/${parsedAudiobook.slug}/chapters`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Audiobook details");
      }

      const data = await response.json();
      console.log("data", data);

      setChapters(data.chapters);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchChapters();
  }, [chapterId]);

  const chapter = chapters.find((ch: Chapter) => ch.id === +chapterId);
  console.log("chapter", chapter);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <AudioPlayer chapter={chapter} audiobook={parsedAudiobook} />
    </div>
  );
};

export default Page;
