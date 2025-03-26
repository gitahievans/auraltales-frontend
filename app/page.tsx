"use client";

import BookCarousel from "@/components/BookCarousel";
import { useAudiobooks } from "@/hooks/useAudiobooks";
import { useSearchParams } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { Loader, Text } from "@mantine/core";
import { useEffect } from "react";

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
    <div className="flex flex-col gap-6 min-h-[60dvh]">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader size="lg" color="white" />
        </div>
      ) : audiobooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <Text size="xl" weight={700} color="gray.7">
            No audiobooks available at the moment.
          </Text>
          <Text size="md" color="gray.6">
            Check back later for more content!
          </Text>
        </div>
      ) : (
        categoryNames.map((cat, i) => {
          const booksInCategory = audiobooks.filter((book) =>
            book.categories.some((category) => category.name === cat)
          );

          return booksInCategory.length > 0 ? (
            <div key={i} className="w-full">
              <BookCarousel
                key={i}
                title={cat}
                categoryNames={categoryNames}
                categoryObjects={categoryObjects}
                books={booksInCategory}
              />
            </div>
          ) : null;
        })
      )}
    </div>
  );
}
