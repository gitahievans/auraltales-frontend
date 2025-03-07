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
import { useSearchParams } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useAudiobooks } from "@/hooks/useAudiobooks";

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
  const { audiobooks, loading, error, categoryNames, categoryObjects } =
    useAudiobooks();

  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("unauthorized");

  useEffect(() => {
    if (unauthorized) {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in to access this page.",
        color: "red",
        position: "top-center",
      });
    }
  }, [unauthorized]);

  return (
    <div className="flex flex-col gap-6">
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
