"use client";

import AudioPlayer from "@/components/AudioPlayer";
import apiClient from "@/lib/apiClient";
import { checkPurchaseStatus } from "@/lib/store";
import { Chapter, PurchaseStatus } from "@/types/types";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = ({ params }: { params: { bookSlug: string } }) => {
  const { bookSlug } = params;
  const searchParams = useSearchParams();
  const audiobook = searchParams.get("audiobook");
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = React.useState<Chapter | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [purchaseStatus, setPurchaseStatus] =
    React.useState<PurchaseStatus | null>(null);
  const { data: session } = useSession();

  const parsedAudiobook = audiobook
    ? JSON.parse(decodeURIComponent(audiobook)) || null
    : null;

  const fetchChapters = async () => {
    try {
      const response = await apiClient.get(
        `/api/audiobooks/${parsedAudiobook.slug}/chapters`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch Audiobook details");
      }

      const data = await response.data;
      console.log("data", data);

      setChapters(data.chapters);
      setCurrentChapter(data.chapters.find((ch: Chapter) => ch.order === 1));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getPurchaseStatus = async () => {
      if (!parsedAudiobook || !session?.jwt) {
        return;
      }

      const status = await checkPurchaseStatus(parsedAudiobook.id, session.jwt);
      setPurchaseStatus(status);
    };

    getPurchaseStatus();
  }, [parsedAudiobook, session?.jwt]);

  React.useEffect(() => {
    fetchChapters();
  }, [bookSlug]);

  const chapter = chapters.find((ch: Chapter) => ch.id === +bookSlug);

  return (
    <div className="max-w-md mx-auto flex justify-center items-center">
      <AudioPlayer
        currentChapter={currentChapter}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        setCurrentChapter={setCurrentChapter}
        audiobook={parsedAudiobook}
        chapters={chapters}
        purchaseStatus={purchaseStatus}
      />
    </div>
  );
};

export default Page;
