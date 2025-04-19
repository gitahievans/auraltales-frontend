// app/page.tsx
"use client";

import BookCarousel from "@/components/BookCarousel";
import UnauthorizedNotification from "@/components/UnauthorizedNotification";
import { useAudiobooks } from "@/hooks/useAudiobooks";
import { Loader, Text } from "@mantine/core";
import { Suspense } from "react";

export default function Home() {
  const { audiobooks, loading, error, categoryNames, categoryObjects } =
    useAudiobooks();

  return (
    <div className="flex flex-col gap-6 min-h-[60dvh]">
      <Suspense fallback={null}>
        <UnauthorizedNotification />
      </Suspense>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader type="bars" size="lg" color="white" />
        </div>
      ) : audiobooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <Text size="xl" fw={700} color="gray.7">
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
