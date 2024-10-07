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
  bought: true,
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
          // Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log(data);

      if (Array.isArray(data.audiobooks)) {
        setAudiobooks(data.audiobooks);
        fetchedAudiobooks.audiobooks = data.audiobooks;

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

  return (
    <div className="flex flex-col gap-4">
      {!mobile ? <HeroSection /> : null}
      {mobile ? <MobileHero /> : null}
      <div className="mt-4">
        {categories.length > 0
          ? categories.map((cat, i) => (
              <BookCarousel key={i} title={cat} books={audiobooks} />
            ))
          : Array.from({ length: 6 }).map((cat, i) => <SkeletonCarousel key={i} />)}
      </div>
    </div>
  );
}