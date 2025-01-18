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

const BoughtBookCard = ({ book }: { book: Audiobook }) => {
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

  return (
    <div className="flex flex-col md:flex-row p-6 rounded-lg items-center md:items-start gap-6 bg-[#061c19]">
      {/* Book Cover */}
      <div className="flex flex-col gap-4 items-start justify-center lg:w-[35%]">
        <Image
          src={book?.poster || poster}
          alt="Book Cover"
          width={isMobile ? 250 : 500}
          height={isMobile ? 250 : 500}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col gap-2 w-full lg:w-[35%] items-center md:items-start">
        <h2 className="text-2xl font-semibold text-white mb-2 uppercase">
          {book?.title}
        </h2>
        <div className="flex flex-col gap-2">
          {" "}
          <div className="flex flex-col items-center md:items-start gap-1 mt-3">
            <p className="text-gray-200 mb-1">
              <span className="mr-2"> BY: </span>{" "}
              {book?.authors && book?.authors?.length > 0 ? (
                book.authors.map((author: any) => (
                  <span key={author.id}>
                    {author.name}
                    {book.authors.length > 1 &&
                    author !== book.authors[book.authors.length - 1]
                      ? ", "
                      : ""}
                  </span>
                ))
              ) : (
                <span>Unknown Author</span>
              )}
            </p>
            <p className="text-gray-300 mb-1">
              <span className="mr-2">NARRATED BY:</span>
              {book?.narrators?.length > 0 ? (
                book?.narrators.map((narrator) => (
                  <span key={narrator.id}>{narrator.name}</span>
                ))
              ) : (
                <span>Unknown Narrator</span>
              )}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-1 mt-3">
            <p className="text-gray-300 mb-1">Length: 12 Hrs, 35 Mins</p>
            <p className="text-gray-300 mb-1">Release Date: 12 May, 2024</p>
            <p className="text-gray-300 mb-4">Language: English</p>
          </div>
        </div>

        {(isMobile || isLarge) && (
          <button className="flex items-center text-white bg-transparent border border-gray-400 rounded-xl w-fit px-4 py-2 hover:bg-white hover:text-black transition duration-300">
            <span className="flex items-center space-x-2">
              <IconPlayerPlayFilled />
              <span>Listen Sample</span>
            </span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full lg:w-[35%] space-y-4">
        <button className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-800 transition-all duration-300 focus:outline-none">
          <IconPlayerPlayFilled size={20} className="mr-2" />
          Listen Now
        </button>

        {renderFavoriteButton()}
      </div>
    </div>
  );
};

export default BoughtBookCard;
