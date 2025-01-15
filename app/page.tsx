"use client";

import BookCarousel from "@/components/BookCarousel";
import BookGrid from "@/components/BookCarousel";
import HeroSection from "@/components/common/Hero";
import MobileHero from "@/components/common/MobileHero";
import HeroCarousel from "@/components/common/MobileHero";
import AudioPlayer from "@/components/AudioPlayer";
import SkeletonCarousel from "@/components/SkeletonCarousel";
import { books } from "@/Constants/Books";
import { fetchedAudiobooks } from "@/state/state";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { proxy } from "valtio";

export const boughtState = proxy({
  bought: false,
});

interface Author {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  bio: string;
}

interface Category {
  id: number;
  name: string;
}

interface Collection {
  id: number;
  name: string;
}

interface Narrator {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  bio: string;
}

interface Audiobook {
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
  categories: Category[];
  collections: Collection[];
  narrators: Narrator[];
}

export default function Home() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const mobile = useMediaQuery("(max-width: 640px)");

  const { data: session } = useSession();

  console.log("session", session);

  const fetchAudiobooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/audiobooks/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log(data);

      if (Array.isArray(data.audiobooks)) {
        setAudiobooks(data.audiobooks);
        localStorage.setItem("audiobooks", JSON.stringify(data.audiobooks));
        console.log("Saved audiobooks to localStorage");

        const categories = data.audiobooks.flatMap((book: Audiobook) =>
          book.categories.map((category: Category) => category.name)
        );
        const uniqueCategories: string[] = Array.from(new Set(categories));
        setCategories(uniqueCategories);
      } else {
        setError("Data format is incorrect");
      }
    } catch (error: any) {
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudiobooks();
  }, []);

  console.log("audiobooks", audiobooks);

  return (
    <div className="mt-4">
      {categories.length > 0
        ? categories.map((cat, i) => {
            const booksInCategory = audiobooks?.filter((book) =>
              book.categories.some((category) => category.name === cat)
            );

            if (booksInCategory.length > 0) {
              return (
                <BookCarousel key={i} title={cat} books={booksInCategory} />
              );
            }
            return null; // Do not render if no audiobooks exist for the category
          })
        : Array.from({ length: 6 }).map((_, i) => <SkeletonCarousel key={i} />)}
    </div>
  );
}
