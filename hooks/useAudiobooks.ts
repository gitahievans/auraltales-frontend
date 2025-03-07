// hooks/useAudiobooks.ts
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

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
  phone_number: string;
  email: string;
  bio: string;
}

export interface Audiobook {
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

export function useAudiobooks() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);

  const fetchAudiobooks = async () => {
    try {
      const response = await apiClient("api/audiobooks/");

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const data = response.data;

      if (Array.isArray(data.audiobooks)) {
        setAudiobooks(data.audiobooks);
        localStorage.setItem("audiobooks", JSON.stringify(data.audiobooks));

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

  return {
    audiobooks,
    loading,
    error,
    categoryNames,
    categoryObjects,
    refetch: fetchAudiobooks,
  };
}
