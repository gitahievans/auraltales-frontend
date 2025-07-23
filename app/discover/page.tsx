"use client";

import BookCarousel from "@/components/BookCarousel";
import {
  CategoryCard,
  CollectionCard,
  LibraryBookCard,
  QuickStatsCard,
  TrendingBookCard,
  WishlistCard,
} from "@/components/Cards/HomeCards";
import CustomLoader from "@/components/Cards/HomePgLoader";
import UnauthorizedNotification from "@/components/UnauthorizedNotification";
import { useAudiobooks } from "@/hooks/useAudiobooks";
import { Audiobook, Category, Collection } from "@/types/types";
import { Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import React, { Suspense, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useValidSession } from "@/hooks/useValidSession";
import apiClient from "@/lib/apiClient";
import { fetchWishlist } from "@/lib/store";
import { WishlistItem } from "../wishlist/page";
import { log } from "node:console";

interface SectionHeaderProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}
const SectionHeader = ({
  title,
  showSeeAll = true,
  onSeeAll,
}: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    {/* {showSeeAll && (
      <button
        onClick={onSeeAll}
        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
      >
        <span>See All</span>
        <IconChevronRight size={16} />
      </button>
    )} */}
  </div>
);
export default function Home() {
  const router = useRouter();
  const {
    audiobooks,
    loading,
    error,
    categoryNames,
    collectionNames,
    categoryObjects,
    collectionObjects,
  } = useAudiobooks();
  const [wishlistBooks, setWishlistBooks] = useState<Audiobook[]>([]);
  const { isAuthenticated, session, status } = useValidSession();
  const [libraryBooks, setLibraryBooks] = useState<
    { id: string; audiobook: Audiobook }[]
  >([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | null>(
    null
  );
  const [wishlistLoading, setWishlistLoading] = useState(true);

  const categoriesWithStats = useMemo(() => {
    return categoryNames
      .map((catName) => {
        const booksInCategory = audiobooks.filter((book) =>
          book.categories.some((category) => category.name === catName)
        );

        return {
          name: catName,
          bookCount: booksInCategory.length,
          description: `Discover amazing ${catName.toLowerCase()} audiobooks`,
        };
      })
      .filter((cat) => cat.bookCount > 0);
  }, [categoryNames, audiobooks]);

  useEffect(() => {
    const fetchLibrary = async () => {
      if (isAuthenticated) {
        try {
          const response = await apiClient.get("/purchases/my-library/", {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          });
          setLibraryBooks(response.data.books);
        } catch (error) {
          console.error("Error fetching library:", error);
        } finally {
          setLibraryLoading(false);
        }
      }
    };

    fetchLibrary();
  }, [isAuthenticated, session?.jwt]);

  console.log("libraryBooks:", libraryBooks);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const items = await fetchWishlist();
        setWishlistItems(items);
        const books = items.map((item: WishlistItem) => item.audiobook);
        setWishlistBooks(books);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setWishlistLoading(false);
      }
    };

    loadWishlist();
  }, []);

  console.log("wishListBooks:", wishlistBooks);

  const trendingBooks = useMemo(() => {
    return audiobooks.slice(0, 5);
  }, [audiobooks]);

  const featuredCollections = useMemo(() => {
    return collectionNames
      .slice(0, 4)
      .map((collectionName) => {
        const booksInCollection = audiobooks.filter((book) =>
          book.collections.some(
            (collection) => collection.name === collectionName
          )
        );

        return {
          name: `Best of ${collectionName}`,
          bookCount: booksInCollection.length,
          books: booksInCollection.slice(0, 4),
        };
      })
      .filter((collection) => collection.books.length > 0);
  }, [collectionNames, audiobooks]);

  const userStats = useMemo(() => {
    return {
      totalBooks: audiobooks.length,
      hoursListened: Math.floor(audiobooks.length * 8.5),
      wishlistCount: wishlistBooks.length,
      completedBooks: Math.floor(audiobooks.length * 0.3),
    };
  }, [audiobooks.length, wishlistBooks.length]);

  // Event handlers
  const handleCategoryClick = (category: Category) => {
    console.log("Category clicked:", category);

    const clickedCategoryId = categoryObjects.find(
      (cat) => cat.name === category.name
    )?.id;

    console.log("Clicked category ID:", clickedCategoryId);

    router.push(`/audiobooks/categories/${clickedCategoryId}`);
  };

  const handleCollectionClick = (collection: Collection) => {
    console.log("Collection clicked:", collection);

    const clickedCollectionId = collectionObjects.find(
      (col) => col.name === collection.name.replace(/^Best of /, "").trim()
    )?.id;

    console.log("Clicked collection ID:", clickedCollectionId);

    router.push(`/audiobooks/collections/${clickedCollectionId}`);
  };

  const handlePlayBook = (book: Audiobook) => {
    const audiobookData = encodeURIComponent(JSON.stringify(book));
    window.open(
      `/audiobooks/audioplayer/${book?.id}?audiobook=${audiobookData}`,
      "_blank",
      "noopener,noreferrer,width=500,height=800"
    );
  };

  const handleTrendingClick = (book: Audiobook) => {
    router.push(`/audiobooks/${book.slug}`);
  };

  const handleWishClick = (book: Audiobook) => {
    router.push(`/audiobooks/${book.slug}`);
  };

  const handleSeeAll = (section: string) => {
    console.log("See all clicked for:", section);
    // Navigate to respective section page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CustomLoader />
      </div>
    );
  }

  if (audiobooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Text size="xl" fw={700} color="gray.7">
          No audiobooks available at the moment.
        </Text>
        <Text size="md" color="gray.6">
          Check back later for more content!
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen">
      <Suspense fallback={null}>
        <UnauthorizedNotification />
      </Suspense>

      {isAuthenticated && (
        <section>
          <SectionHeader title="Your Stats" showSeeAll={false} />
          <div className="max-w-md">
            <QuickStatsCard stats={userStats} />
          </div>
        </section>
      )}

      {categoriesWithStats.length > 0 && (
        <section>
          <SectionHeader
            title="Browse Categories"
            onSeeAll={() => handleSeeAll("categories")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoriesWithStats.slice(0, 8).map((category, index) => (
              <CategoryCard
                key={index}
                category={category}
                handleCategoryClick={handleCategoryClick}
              />
            ))}
          </div>
        </section>
      )}

      {isAuthenticated && libraryBooks.length > 0 && (
        <section>
          <SectionHeader
            title="Continue Listening"
            onSeeAll={() => handleSeeAll("library")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {libraryBooks.map((book, index) => (
              <LibraryBookCard
                key={book?.id || index}
                book={book?.audiobook}
                handlePlayBook={handlePlayBook}
              />
            ))}
          </div>
        </section>
      )}

      {isAuthenticated && wishlistItems && wishlistItems.length > 0 && (
        <section>
          <SectionHeader
            title="Your Wishlist"
            onSeeAll={() => handleSeeAll("wishlist")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {wishlistBooks.map((book, index) => {
              return (
                <WishlistCard
                  key={book.id || index}
                  book={book}
                  handleWishClick={handleWishClick}
                />
              );
            })}
          </div>
        </section>
      )}

      {featuredCollections.length > 0 && (
        <section>
          <SectionHeader
            title="Featured Collections"
            onSeeAll={() => handleSeeAll("collections")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCollections.map((collection, index) => (
              <CollectionCard
                key={index}
                collection={collection}
                handleCollectionClick={handleCollectionClick}
              />
            ))}
          </div>
        </section>
      )}

      {trendingBooks.length > 0 && (
        <section>
          <SectionHeader
            title="Trending This Week"
            onSeeAll={() => handleSeeAll("trending")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingBooks.map((book, index) => (
              <TrendingBookCard
                key={book.id || index}
                book={book}
                rank={index + 1}
                handleTrendingClick={() => handleTrendingClick(book)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Fallback: Original Category Carousels for remaining categories */}
      {categoryNames.map((cat, i) => {
        const booksInCategory = audiobooks.filter((book) =>
          book.categories.some((category) => category.name === cat)
        );

        // Only show carousel if category wasn't already shown in cards above
        const isShownInCards = categoriesWithStats.some(
          (cardCat) => cardCat.name === cat
        );

        return booksInCategory.length > 0 && !isShownInCards ? (
          <div key={i} className="w-full">
            <BookCarousel
              title={cat}
              categoryNames={categoryNames}
              categoryObjects={categoryObjects}
              books={booksInCategory}
            />
          </div>
        ) : null;
      })}
    </div>
  );
}
