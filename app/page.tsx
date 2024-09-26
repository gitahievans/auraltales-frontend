"use client";

import BookGrid from "@/components/BookGrid";
import HeroSection from "@/components/common/Hero";
import MobileHero from "@/components/common/MobileHero";
import HeroCarousel from "@/components/common/MobileHero";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { proxy } from "valtio";

export const boughtState = proxy({
  bought: true
})

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
  date_published: string; // or Date if you plan to handle it as a Date object
  slug: string;
  poster: string; // URL or file path for the image
  audio_sample?: string | null; // URL or file path, optional
  authors: Author[]; // Assuming you have an Author type/interface
  categories: Category[]; // Assuming you have a Category type/interface
  collections: Collection[]; // Assuming you have a Collection type/interface
  narrators: Narrator[]; // Assuming you have a Narrator type/interface
}

export default function Home() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const mobile = useMediaQuery("(max-width: 640px)");

   const fetchAudiobooks = async (accessToken: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/audiobooks/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log(data);

      if (Array.isArray(data.audiobooks)) {
        setAudiobooks(data.audiobooks);

        const categories = data.audiobooks.flatMap((book: Audiobook) =>
          book.categories.map((category: Category) => category.name)
        )
        const uniqueCategories = Array.from(new Set(categories))
        setCategories(uniqueCategories)

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
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setError("No access token found");
      setLoading(false);
      return;
    }

    fetchAudiobooks(accessToken);
  }, []);


  return (
    <div className="flex flex-col gap-4 min-h-screen md:max-w-3xl lg:max-w-7xl">
      {/* {!mobile ? <HeroSection /> : null}
      {mobile ? <MobileHero /> : null} */}
      <div className="mt-4">
        {categories.length > 0 ? (
          categories.map((cat, i) => (
            <BookGrid key={i} title={cat} books={audiobooks} />
          ))) : <p className="text-white text-center">No Audiobooks Found</p>}
      </div>
    </div>
  );
}
