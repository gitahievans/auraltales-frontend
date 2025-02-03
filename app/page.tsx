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
import apiClient from "@/lib/apiClient";

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
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);

  const { data: session } = useSession();

  console.log("session", session);

  const fetchAudiobooks = async () => {
    try {
      const response = await apiClient("api/audiobooks/");

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const data = response.data;

      console.log("data using axios instance", data);

      if (Array.isArray(data.audiobooks)) {
        setAudiobooks(data.audiobooks);
        localStorage.setItem("audiobooks", JSON.stringify(data.audiobooks));
        console.log("Saved audiobooks to localStorage");

        const categoryObjects = data.audiobooks.flatMap((book: Audiobook) =>
          book.categories.map((category: Category) => category)
        );
        const uniqueCategoryObjects: Category[] = Array.from(
          new Set(categoryObjects)
        );
        setCategoryObjects(uniqueCategoryObjects);

        const categoryNames = data.audiobooks.flatMap((book: Audiobook) =>
          book.categories.map((category: Category) => category.name)
        );
        const uniqueCategoryNames: string[] = Array.from(
          new Set(categoryNames)
        );
        setCategoryNames(uniqueCategoryNames);
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

  return (
    <div className="mt-4">
      {categoryNames.length > 0
        ? categoryNames.map((cat, i) => {
            const booksInCategory = audiobooks?.filter((book) =>
              book.categories.some((category) => category.name === cat)
            );

            if (booksInCategory.length > 0) {
              return (
                <BookCarousel
                  key={i}
                  title={cat}
                  categoryNames={categoryNames}
                  categoryObjects={categoryObjects}
                  books={booksInCategory}
                />
              );
            }
            return null; // Do not render if no audiobooks exist for the category
          })
        : Array.from({ length: 6 }).map((_, i) => <SkeletonCarousel key={i} />)}
    </div>
  );
}
