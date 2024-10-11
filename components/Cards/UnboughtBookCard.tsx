"use client";

import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import poster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import {
  IconListDetails,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconShoppingBag,
} from "@tabler/icons-react";
import { Audiobook } from "@/types/types";
import { useMediaQuery } from "@mantine/hooks";
import { Howl } from "howler";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";

const UnboughtBookCard = ({ book }: { book: Audiobook }) => {
  // console.log(book);
  const { data: session } = useSession();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMedium = useMediaQuery("(max-width: 1023px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    localStorage.setItem("audiobookToBuy", JSON.stringify(book));
    localStorage.setItem("session", JSON.stringify(session));
  }, [book, session]);

  const buyAudiobook = async () => {
    const accessToken = session?.jwt;
    // console.log("accessToken", accessToken);

    const url = `http://127.0.0.1:8000/purchases/initiate-payment/buy/${book?.id}/`;
    const callbackUrl = "https://7599-217-199-146-210.ngrok-free.app/success";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: +book?.buying_price,
          email: session?.user?.email,
          callback_url: callbackUrl,
        }),
      });

      // console.log("response", response);

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data = await response.json();
      // console.log("data:", data);

      if (data.status) {
        window.location.href = data.authorization_url!;
      } else {
        notifications.show({
          title: "Error",
          message: data.message,
          color: "red",
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
        position: "top-right",
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
          },
        }),
      });
    }
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
        {!isMobile && isMedium && (
          <button className="flex items-center text-white bg-transparent border border-gray-400 rounded-xl w-fit px-4 py-2 hover:bg-white hover:text-black transition duration-300">
            <span className="flex items-center space-x-2">
              <IconPlayerPlayFilled />
              <span>Listen Sample</span>
            </span>
          </button>
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

      <div className="w-full lg:w-[35%] space-y-4">
        <button
          onClick={buyAudiobook}
          className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-800 transition-all duration-300 focus:outline-none"
        >
          <IconShoppingBag size={20} className="mr-2" />
          Buy for $12
        </button>
        <button className="flex items-center justify-center w-full px-6 py-3 text-white font-semibold rounded-xl border border-gray-400 hover:bg-white hover:text-black transition-all duration-300 ease-in-out focus:outline-none">
          <IconListDetails size={20} className="mr-2" />
          Add to Wish List
        </button>
      </div>
    </div>
  );
};

export default UnboughtBookCard;
