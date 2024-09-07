import Image from "next/image";
import React from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import {
  IconListDetails,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconShoppingBag,
} from "@tabler/icons-react";

const WishListCard = () => {
  return (
    <div className="flex p-6 rounded-lg items-start space-x-8 bg-[#061c19]">
      {/* Book Cover */}
      <div className="flex items-center justify-center w-[25%]">
        <Image
          src={poster}
          alt="Book Cover"
          className="rounded-md object-cover"
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col gap-2 w-1/3">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Title Of The Book
        </h2>
        <div className="flex flex-col gap-2">
          {" "}
          <p className="text-sm text-gray-400 mb-1">By: Evans Gitahi</p>
          <p className="text-sm text-gray-400 mb-1">
            Narrated By: Evans Gitahi
          </p>
          <p className="text-sm text-gray-400 mb-1">Length: 12 Hrs, 35 Mins</p>
          <p className="text-sm text-gray-400 mb-1">
            Release Date: 12 May, 2024
          </p>
          <p className="text-sm text-gray-400 mb-4">Language: English</p>
        </div>

        <button className="flex items-center text-white bg-transparent border border-white rounded-full w-fit px-4 py-2 hover:bg-white hover:text-black transition duration-300">
          <span className="flex items-center space-x-2">
            <IconPlayerPlayFilled />
            <span>Listen Sample</span>
          </span>
        </button>
      </div>

      <div className="w-[25%] space-y-4">
        <button className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-800 transition-all duration-300 focus:outline-none">
          <IconShoppingBag size={20} className="mr-2" />
          Buy for $12
        </button>
        <button className="flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 focus:outline-none">
          <IconListDetails size={20} className="mr-2" />
          Add to Wish List
        </button>
      </div>
    </div>
  );
};

export default WishListCard;
