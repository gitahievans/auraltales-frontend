import Image from "next/image";
import React from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import { IconPlayerPlayFilled, IconStar } from "@tabler/icons-react";

const BoughtBookCard = () => {
  return (
    <div className="flex p-6 rounded-lg items-start space-x-6 bg-[#0d1f22] text-white">
      {/* Book Cover */}
      <div className="w-1/4">
        <Image
          src={poster}
          alt="Book Cover"
          className="rounded-md object-cover"
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col gap-3 w-2/4">
        <h2 className="text-xl font-bold">Title Of The Book</h2>
        <div className="flex flex-col gap-1">
          <p className="text-base">
            By: <span className="font-semibold">Name Of The Author</span>
          </p>
          <p className="text-sm">
            Narrated By:{" "}
            <span className="font-semibold">Name Of The Narrator</span>
          </p>
          <p className="text-sm text-gray-300">
            Horem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nunc
            Vulputate Libero Et Velit Interdum, Ac Aliquet Odio Mattis. Class
            Aptent Taciti Sociosqu Ad Litora Torquent Per Conubia Nostra.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-start gap-4 justify-between w-1/4">
        <p className="text-lg font-semibold">22Hrs 33 Mins</p>
        <div className="flex flex-col space-y-3">
          <button className="flex items-center justify-center px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 focus:outline-none">
            <IconPlayerPlayFilled size={16} className="mr-2" />
            Listen Now
          </button>
          <button className="flex items-center justify-center px-4 py-2 text-white font-semibold rounded-xl border border-gray-400 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none">
            <IconStar size={16} className="mr-2" />
            Add to Favourites
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoughtBookCard;
