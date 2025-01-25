/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React, { useEffect, useState } from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import { IconPlayerPlayFilled, IconStar, IconStars } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { Audiobook } from "@/types/types";
import {
  addToFavorites,
  checkAudiobookInFavorites,
  removeFromFavorites,
} from "@/lib/store";
import { useSession } from "next-auth/react";
import { Loader } from "@mantine/core";

const BoughtBookCard = ({ book, open }: { book: Audiobook; open: any }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMedium = useMediaQuery("(max-width: 1023px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");
  const [isLoading, setIsLoading] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const { data: session } = useSession();
  const access = session?.jwt;

  const handleAddToFavorites = async () => {
    if (!access) return;
    await addToFavorites(book.id, access, setIsLoading, setInFavorites);
  };

  const handleRemoveFromFavorites = async () => {
    if (!access) return;
    await removeFromFavorites(book.id, access, setIsLoading, setInFavorites);
  };

  const checkFavoritesStatus = async () => {
    if (access) {
      const isInFavorites = await checkAudiobookInFavorites(book?.id, access);
      setInFavorites(isInFavorites);
    }
  };

  useEffect(() => {
    checkFavoritesStatus();
  }, [access, book?.id]);

  const renderFavoriteButton = () => {
    const handleClick = inFavorites
      ? handleRemoveFromFavorites
      : handleAddToFavorites;
    const buttonText = inFavorites
      ? "Remove from Favorites"
      : "Add to Favorites";

    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-xl border border-gray-400 hover:bg-white hover:text-black transition-all duration-300 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader size="sm" color="white" />
        ) : (
          <IconStars size={20} className="mr-2" />
        )}
        {buttonText}
      </button>
    );
  };

  const handleListenNowClick = () => {
    const audiobookData = encodeURIComponent(JSON.stringify(book));

    window.open(
      `/audiobooks/audioplayer/${book?.id}?audiobook=${audiobookData}`,
      "_blank",
      "noopener,noreferrer,width=500,height=800"
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#062C2A] to-[#041714] text-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* Book Cover Section */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <div className="relative group">
            <Image
              src={book?.poster || poster}
              alt="Book Cover"
              width={400}
              height={400}
              className="rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Book Details Section */}
        <div className="flex flex-col gap-4 w-full justify-start">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-[#1CFAC4] uppercase mb-2">
              {book?.title}
            </h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-semibold text-[#1CFAC4] mr-2">By:</span>
                {book?.authors && book?.authors?.length > 0
                  ? book?.authors.map((author: any) => author.name).join(", ")
                  : "Unknown Author"}
              </p>
              <p>
                <span className="font-semibold text-[#1CFAC4] mr-2">
                  Narrated By:
                </span>
                {book?.narrators?.length > 0
                  ? book?.narrators.map((narrator) => narrator.name).join(", ")
                  : "Unknown Narrator"}
              </p>
              <div className="space-y-1 pt-2">
                <p>Length: 12 Hrs, 35 Mins</p>
                <p>Release Date: 12 May, 2024</p>
                <p>Language: English</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-4 w-full lg:w-1/3 justify-center">
          <button
            onClick={handleListenNowClick}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl 
          hover:bg-green-800 transition-colors duration-300 
          flex items-center justify-center space-x-2 
          transform hover:scale-105 active:scale-95"
          >
            <IconPlayerPlayFilled size={20} />
            <span>Listen Now</span>
          </button>

          {!inFavorites ? (
            <button
              onClick={handleAddToFavorites}
              className="w-full py-3 border-2 border-[#1CFAC4] text-[#1CFAC4] 
            font-bold rounded-xl hover:bg-[#1CFAC4]/10 
            transition-all duration-300 
            flex items-center justify-center space-x-2
            transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader size="sm" color="white" />
              ) : (
                <>
                  <IconStars size={20} />
                  <span>Add to Favorites</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleRemoveFromFavorites}
              className="w-full py-3 border-2 border-red-500 text-red-500 
            font-bold rounded-xl hover:bg-red-500/10 
            transition-all duration-300 
            flex items-center justify-center space-x-2
            transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader size="sm" color="white" />
              ) : (
                <>
                  <IconStars size={20} />
                  <span>Remove from Favorites</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoughtBookCard;
