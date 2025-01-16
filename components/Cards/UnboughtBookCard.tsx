/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import { IconListDetails, IconShoppingBag } from "@tabler/icons-react";
import { Audiobook } from "@/types/types";
import { useMediaQuery } from "@mantine/hooks";
import { Howl } from "howler";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";
import axios from "axios";
import {
  addToWishlist,
  checkAudiobookInWishlist,
  removeFromWishlist,
} from "@/lib/store";
import { buyAudiobook, listenSample } from "@/lib/audiobookActions.ts";
import PlayButton from "../PlayButton";

type propsType = {
  book: Audiobook;
};

const UnboughtBookCard = ({ book }: propsType) => {
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMedium = useMediaQuery("(max-width: 1023px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");
  const [inWishList, setInWishList] = useState(false);
  const [addWishLoading, setAddWishLoading] = useState(false);
  const [removeWishLoading, setRemoveWishLoading] = useState(false);
  const access = session?.jwt;

  const checkWishlistStatus = async () => {
    if (access) {
      const isInWishlist = await checkAudiobookInWishlist(book.id, access);
      setInWishList(isInWishlist);
    }
  };

  useEffect(() => {
    localStorage.setItem("audiobookToBuy", JSON.stringify(book));
    localStorage.setItem("session", JSON.stringify(session));

    checkWishlistStatus();

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [book, session]);

  const handleListenSample = () => {
    listenSample(
      book,
      soundRef,
      isPlaying,
      setIsPlaying,
      setAudioSampleLoading
    );
  };

  const handleBuyAudiobook = () => {
    const accessToken = session?.jwt;
    const userEmail = session?.user?.email;
    const bookId = book.id;
    const buyingPrice = +book.buying_price;

    if (accessToken && userEmail) {
      buyAudiobook(bookId, buyingPrice, userEmail, accessToken);
    } else {
      notifications.show({
        title: "Error",
        message: "You must be logged in to buy an audiobook.",
        color: "red",
        position: "top-right",
      });
    }
  };

  const handleAddToWishlist = async () => {
    if (!access) {
      // TODO: Give a modal to log in
      notifications.show({
        title: "Error",
        message: "You must be logged in to add to wishlist.",
        color: "red",
        position: "top-right",
      });
      return;
    }

    addToWishlist(book?.id!, access!, setAddWishLoading, setInWishList);
  };

  const handleRemoveFromWishList = async () => {
    if (!access) {
      // TODO: Give a modal to log in
      notifications.show({
        title: "Error",
        message: "You must be logged in to remove from wishlist.",
        color: "red",
        position: "top-right",
      });
      return;
    }

    removeFromWishlist(book?.id!, access!, setRemoveWishLoading, setInWishList);
  };

  return (
    <div className="flex flex-col md:flex-row p-6 rounded-lg items-center md:items-start gap-6 bg-[#061c19]">
      {/* Book Cover */}
      <div className="flex flex-col gap-4 items-start justify-center lg:w-[35%] xl:w-[25%]">
        <Image
          src={book?.poster || poster}
          alt="Book Cover"
          width={isMobile ? 250 : 500}
          height={isMobile ? 250 : 500}
          className="rounded-lg object-cover"
        />
        {!isMobile && isMedium && (
          <PlayButton
            isPlaying={isPlaying}
            audioSampleLoading={audioSampleLoading}
            onClick={handleListenSample}
          />
        )}
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
                book?.authors.map((author: any) => (
                  <span key={author.id}>
                    {author.name}
                    {book?.authors.length > 1 &&
                    author !== book?.authors[book?.authors.length - 1]
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
          <PlayButton
            isPlaying={isPlaying}
            audioSampleLoading={audioSampleLoading}
            onClick={handleListenSample}
          />
        )}
      </div>

      <div className="w-full lg:w-[35%] space-y-4">
        <button
          onClick={handleBuyAudiobook}
          className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-800 transition-all duration-300 focus:outline-none"
        >
          <IconShoppingBag size={20} className="mr-2" />
          Buy: KES {book?.buying_price}
        </button>
        {!inWishList ? (
          <button
            onClick={handleAddToWishlist}
            className="flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-xl border border-gray-400 hover:bg-white hover:text-black transition-all duration-300 ease-in-out focus:outline-none"
          >
            {addWishLoading ? (
              <Loader size="sm" color="white" />
            ) : (
              <IconListDetails size={20} className="mr-2" />
            )}
            Add to Wishlist
          </button>
        ) : (
          <button
            onClick={handleRemoveFromWishList}
            className="flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-xl border border-gray-400 hover:bg-white hover:text-black transition-all duration-300 ease-in-out focus:outline-none"
          >
            {removeWishLoading ? (
              <Loader size="sm" color="white" />
            ) : (
              <IconListDetails size={20} className="mr-2" />
            )}
            Remove from Wishlist
          </button>
        )}
      </div>
    </div>
  );
};

export default UnboughtBookCard;
