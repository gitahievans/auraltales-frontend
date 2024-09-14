import Image from "next/image";
import React from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

const ChapterCard = () => {
  return (
    <div className="flex p-4 rounded-lg items-start gap-8 bg-[#06201d] hover:bg-transparent max-w-6xl transition-all duration-500">
      <div className="flex items-center justify-center w-[10%]">
        <Image
          src={poster}
          alt="Book Cover"
          className="rounded-md object-cover"
        />
      </div>

      <div className="w-[50%]">
        <h2 className="mb-3">Chapter Number: Chapter Title</h2>
        <p className="text-sm font-light">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti,
          sequi officiis accusantium atque laudantium voluptatum ipsum doloribus
          nulla reiciendis libero distinctio ut facere nam saepe exercitationem
          iste consectetur beatae eveniet.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p>50 Mins</p>
        <button className="flex items-center justify-center bg-tertiary hover:bg-secondary rounded-lg px-6 py-2 transition-all duration-300">
          <IconPlayerPlayFilled size={16} className="mr-2" />
          Listen Now
        </button>
      </div>
    </div>
  );
};
export default ChapterCard;
