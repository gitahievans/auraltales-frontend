import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "@mantine/core";
import { Howl } from "howler";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconClock,
  IconBookmarks,
  IconShoppingCart,
  IconCoin,
} from "@tabler/icons-react";
import defaultPoster from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_v8c5gbv8c5gbv8c5.jpeg";
import { Author, Category, Chapter, Collection, Narrator } from "@/types/types";

interface BookCardProps {
  book: {
    title: string;
    description: string;
    summary: string;
    length: string;
    rental_price: number;
    buying_price: number;
    date_published: string;
    slug: string;
    poster: string;
    audio_sample?: string | null;
    authors: Author[];
    chapters: Chapter[];
    categories: Category[];
    collections: Collection[];
    narrators: Narrator[];
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSampleLoading, setAudioSampleLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  const handleListenSample = () => {
    if (!book.audio_sample) return;

    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
        setIsPlaying(false);
      } else {
        soundRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    setAudioSampleLoading(true);
    const sound = new Howl({
      src: [book.audio_sample],
      html5: true,
      onend: () => {
        setIsPlaying(false);
      },
      onload: () => {
        setAudioSampleLoading(false);
        sound.play();
        setIsPlaying(true);
      },
      onloaderror: () => {
        setAudioSampleLoading(false);
      },
    });

    soundRef.current = sound;
  };

  return (
    <div className="bg-[#041714] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
      <div className="flex flex-col h-full">
        <div className="relative aspect-[4/3] md:aspect-[16/9]">
          <Image
            src={book.poster || defaultPoster}
            alt={book.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="px-2 py-4 flex flex-col flex-grow">
          <div className="mb-2">
            <h3 className=" font-bold text-[#1CFAC4] line-clamp-1">
              {book.title}
            </h3>
          </div>

          <div className="text-sm text-[#FFFFFF] mb-4">
            <p className="line-clamp-1">
              <span className="text-[#A9A9AA]">By:</span>{" "}
              {book.authors && book.authors.length > 0 ? (
                book.authors.map((author, index) => (
                  <span key={author.id}>
                    {author.name}
                    {index < book.authors.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <span>Unknown Author</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
