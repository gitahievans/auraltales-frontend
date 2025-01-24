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
  const from = "unbought";

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

    removeFromWishlist(
      book?.id!,
      access!,
      setRemoveWishLoading,
      setInWishList,
      from
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

          {isMobile && (
            <PlayButton
              isPlaying={isPlaying}
              audioSampleLoading={audioSampleLoading}
              onClick={handleListenSample}
            />
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-4 w-full lg:w-1/3 justify-center">
          <button
            onClick={handleBuyAudiobook}
            className="w-full py-3 bg-[#1CFAC4] text-black font-bold rounded-xl 
        hover:bg-[#15D8A7] transition-colors duration-300 
        flex items-center justify-center space-x-2 
        transform hover:scale-105 active:scale-95"
          >
            <IconShoppingBag size={20} />
            <span>Buy: KES {book?.buying_price}</span>
          </button>

          {!inWishList ? (
            <button
              onClick={handleAddToWishlist}
              className="w-full py-3 border-2 border-[#1CFAC4] text-[#1CFAC4] 
          font-bold rounded-xl hover:bg-[#1CFAC4]/10 
          transition-all duration-300 
          flex items-center justify-center space-x-2
          transform hover:scale-105 active:scale-95"
            >
              {addWishLoading ? (
                <Loader size="sm" color="white" />
              ) : (
                <>
                  <IconListDetails size={20} />
                  <span>Add to Wishlist</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleRemoveFromWishList}
              className="w-full py-3 border-2 border-red-500 text-red-500 
          font-bold rounded-xl hover:bg-red-500/10 
          transition-all duration-300 
          flex items-center justify-center space-x-2
          transform hover:scale-105 active:scale-95"
            >
              {removeWishLoading ? (
                <Loader size="sm" color="white" />
              ) : (
                <>
                  <IconListDetails size={20} />
                  <span>Remove from Wishlist</span>
                </>
              )}
            </button>
          )}
          {!isMobile && (
            <div className="mt-3">
              <PlayButton
                isPlaying={isPlaying}
                audioSampleLoading={audioSampleLoading}
                onClick={handleListenSample}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnboughtBookCard;
