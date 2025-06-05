"use client";
import AudioPlayer from "@/components/AudioPlayer";
import { useValidSession } from "@/hooks/useValidSession";
import apiClient from "@/lib/apiClient";
import { checkPurchaseStatus } from "@/lib/store";
import { Chapter, PurchaseStatus } from "@/types/types";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import AudioPlayer2 from "./AudioPlayer2";

const AudioPlayerClient = ({ bookSlug }: { bookSlug: string }) => {
  const searchParams = useSearchParams();
  const audiobook = searchParams.get("audiobook");
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = React.useState<Chapter | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [purchaseStatus, setPurchaseStatus] =
    React.useState<PurchaseStatus | null>(null);
  const { isAuthenticated, session, status } = useValidSession();
  const [error, setError] = React.useState<string | null>(null);

  const parsedAudiobook = React.useMemo(() => {
    if (!audiobook) return null;
    try {
      return JSON.parse(decodeURIComponent(audiobook));
    } catch (error) {
      console.error("Failed to parse audiobook:", error);
      return null;
    }
  }, [audiobook]);

  const fetchChapters = useCallback(async () => {
    if (!parsedAudiobook) return;
    console.log("Fetching chapters for", parsedAudiobook.slug);
    try {
      const response = await apiClient.get(
        `/api/audiobooks/${parsedAudiobook.slug}/chapters`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch Audiobook details");
      }
      const data = await response.data;

      // Sort chapters by order
      const sortedChapters = data.chapters.sort(
        (a: Chapter, b: Chapter) => a.order - b.order
      );

      setChapters(sortedChapters);

      // Set the first chapter as the current chapter
      setCurrentChapter(sortedChapters[0] || null);
    } catch (error) {
      console.error(error);
      setError("Failed to load chapters. Please try again.");
    }
  }, [parsedAudiobook]);

  // Handle changing to a different chapter
  const handleChapterChange = useCallback(
    (index: number) => {
      if (chapters.length === 0) return;

      // Ensure index is within bounds
      const validIndex = Math.max(0, Math.min(index, chapters.length - 1));

      setCurrentIndex(validIndex);
      setCurrentChapter(chapters[validIndex]);
    },
    [chapters]
  );

  useEffect(() => {
    const getPurchaseStatus = async () => {
      if (!parsedAudiobook || !session?.jwt) return;
      const status = await checkPurchaseStatus(parsedAudiobook.id);
      setPurchaseStatus(status);
    };
    getPurchaseStatus();
  }, [parsedAudiobook, session]);

  useEffect(() => {
    if (parsedAudiobook) {
      fetchChapters();
    }
  }, [parsedAudiobook, fetchChapters]);

  if (error) return <div>{error}</div>;

  return (
    <div className="w-full mx-auto flex justify-center items-start mb-20">
      {currentChapter && (
        <AudioPlayer2
          chapter={currentChapter}
          currentChapterIndex={currentIndex}
          onChapterChange={handleChapterChange}
          chapters={chapters}
          audiobook={parsedAudiobook}
          purchaseStatus={purchaseStatus}
        />
      )}
    </div>
  );
};

export default AudioPlayerClient;
