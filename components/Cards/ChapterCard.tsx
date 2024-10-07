"use client";

import Image from "next/image";
import React, { use, useState } from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Audiobook, Chapter } from "@/types/types";
import { useRouter } from "next/navigation";

const ChapterCard: React.FC<{ chapter: Chapter; audioBook: Audiobook }> = ({
  chapter,
  audioBook,
}) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const router = useRouter();

  console.log("chapter", chapter);

  const handleListenNowClick = () => {
    const audiobookData = encodeURIComponent(JSON.stringify(audioBook));

    // router.push(`/audiobooks/${audioBook.slug}/audioplayer/${chapter.id}?audiobook=${audiobookData}`);
    router.push(
      `/audiobooks/audioplayer/${chapter.id}?audiobook=${audiobookData}`
    );
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 rounded-lg items-center md:items-start gap-6 bg-[#06201d] hover:bg-transparent max-w-6xl transition-all duration-500">
      {/* Book Cover */}
      <div className="flex items-center justify-center w-full md:w-[10%]">
        <Image
          src={poster}
          alt="Book Cover"
          width={150}
          height={150}
          className="rounded-md object-cover"
        />
      </div>

      {/* Chapter Details */}
      <div className="w-full md:w-[50%] text-center md:text-left">
        <h2 className="mb-3 text-lg font-semibold">
          Chapter Number: Chapter Title
        </h2>
        <p className="text-sm font-light">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti,
          sequi officiis accusantium atque laudantium voluptatum ipsum doloribus
          nulla reiciendis libero distinctio ut facere nam saepe exercitationem
          iste consectetur beatae eveniet.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <p className="text-md font-medium">50 Mins</p>
        <button
          className="flex items-center justify-center bg-tertiary hover:bg-secondary rounded-lg px-6 py-2 transition-all duration-300"
          onClick={handleListenNowClick}
        >
          <IconPlayerPlayFilled size={16} className="mr-2" />
          Listen Now
        </button>
      </div>
    </div>
  );
};
export default ChapterCard;
