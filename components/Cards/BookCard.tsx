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
    <div className="bg-gradient-to-br from-[#062C2A] to-[#035c4f] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 group">
      <Link href={`/audiobooks/${book.slug}`} className="block w-full">
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={book.poster || defaultPoster}
            alt={book.title}
            width={1200}
            height={675}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>

        <div className="p-3 space-y-4 bg-[#041714]/80 backdrop-blur-sm">
          <div>
            <h3 className="font-bold line-clamp-1 mb-2">
              {book.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-1">
              {book.authors && book.authors.length > 0
                ? book.authors.map((author) => author.name).join(", ")
                : "Unknown Author"}
            </p>
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <IconClock size={20} className="text-[#1CFAC4]" />
              <span className="text-sm">{book.length || "N/A"}</span>
            </div>
            <button
              className="text-gray-300 hover:text-[#1CFAC4] 
            transition-colors transform hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                // Add to bookmarks logic
              }}
            >
              <IconBookmarks size={24} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
