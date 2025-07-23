"use client";

// hooks/useAudiobooks.ts
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { Audiobook, Category, Collection } from "@/types/types";

export function useAudiobooks() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [collectionObjects, setCollectionObjects] = useState<Category[]>([]);
  const [collectionNames, setCollectionNames] = useState<string[]>([]);

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

        const collectionObjects = data.audiobooks.flatMap((book: Audiobook) =>
          book.collections.map((collection) => collection)
        );
        const uniqueCollectionObjects: Collection[] = Array.from(
          new Set(collectionObjects)
        );
        setCollectionObjects(uniqueCollectionObjects);

        const collectionNames = data.audiobooks.flatMap((book: Audiobook) =>
          book.collections.map((collection) => collection.name)
        );

        const uniqueCollectionNames: string[] = Array.from(
          new Set(collectionNames)
        );
        setCollectionNames(uniqueCollectionNames);
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
    collectionNames,
    categoryObjects,
    collectionObjects,
    refetch: fetchAudiobooks,
  };
}
