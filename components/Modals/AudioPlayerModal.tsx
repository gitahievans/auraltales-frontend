/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import ChapterCard from "../Cards/ChapterCard";
import { Modal } from "@mantine/core";
import { Audiobook, Chapter, PurchaseStatus } from "@/types/types";
import AudioPlayer from "../AudioPlayer";
import axiosInstance from "@/lib/axiosInstance";

const AudioPlayerModal = ({
  audioBook,
  purchaseStatus,
  opened,
  close,
}: {
  audioBook: Audiobook;
  purchaseStatus: PurchaseStatus;
  opened: boolean;
  close: any;
}) => {
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = React.useState<Chapter | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  useEffect(() => {
    fetchChapters();
  }, [audioBook]);

  const fetchChapters = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/audiobooks/${audioBook?.slug}/chapters`
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

  return (
    <Modal
      title="Audio Player"
      size="xl"
      opened={opened}
      onClose={close}
      closeOnClickOutside={false}
      styles={{
        content: {
          backgroundColor: "#041714",
          color: "#fff",
        },
        header: {
          backgroundColor: "#041714",
          color: "#fff",
        },
      }}
    >
      <div className="container mx-auto flex flex-col items-center justify-center">
        <AudioPlayer
          audiobook={audioBook}
          currentChapter={currentChapter}
          setCurrentChapter={setCurrentChapter}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
          chapters={chapters}
        />
        {purchaseStatus?.bought && (
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-[#1CFAC4]">Chapters</h1>
              <div className="text-gray-400">
                {audioBook?.chapters?.length || 0} Chapters •{" "}
                {audioBook?.total_duration}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {audioBook?.chapters.map((chapter: Chapter, index: number) => (
                <ChapterCard
                  chapter={chapter}
                  audioBook={audioBook}
                  key={chapter.id || index}
                  isPlaying={currentChapter?.id === chapter.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AudioPlayerModal;
