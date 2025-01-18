"use client";

import { customStyles } from "@/styles/FilterStyles";
import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { useSession } from "next-auth/react";
import { Audiobook } from "@/types/types";
import FavoriteCard from "@/components/Cards/FavoritesCard";
import Link from "next/link";
import { fetchFavorites } from "@/lib/store";

// Define filter options
const filterOptions = [
  { value: "all", label: "All Books" },
  { value: "latest", label: "Latest Added" },
  { value: "oldest", label: "Oldest Added" },
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "title_desc", label: "Title (Z-A)" },
  { value: "date_published_new", label: "Newest Release" },
  { value: "date_published_old", label: "Oldest Release" },
];

export type FavoriteItem = {
  id: number;
  audiobook: Audiobook;
  added_at: string;
};

const FavoritesPage = () => {
  const { data: session } = useSession();
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[] | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] = useState({
    value: "all",
    label: "All Books",
  });

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const items = await fetchFavorites(session?.jwt);
        setFavoriteItems(items);
      } catch (err) {
        console.log(err);
      }
    };

    if (session?.jwt) {
      loadFavorites();
    }
  }, [session?.jwt]);

  const filteredItems = useMemo(() => {
    if (!favoriteItems) return null;

    const items = [...favoriteItems];

    switch (selectedFilter.value) {
      case "latest":
        return items.sort(
          (a, b) =>
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
        );

      case "oldest":
        return items.sort(
          (a, b) =>
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
        );

      case "title_asc":
        return items.sort((a, b) =>
          a.audiobook.title.localeCompare(b.audiobook.title)
        );

      case "title_desc":
        return items.sort((a, b) =>
          b.audiobook.title.localeCompare(a.audiobook.title)
        );

      case "date_published_new":
        return items.sort(
          (a, b) =>
            new Date(b.audiobook.date_published).getTime() -
            new Date(a.audiobook.date_published).getTime()
        );

      case "date_published_old":
        return items.sort(
          (a, b) =>
            new Date(a.audiobook.date_published).getTime() -
            new Date(b.audiobook.date_published).getTime()
        );

      default: // "all"
        return items;
    }
  }, [favoriteItems, selectedFilter]);

  const handleFilterChange = (option: any) => {
    setSelectedFilter(option);
  };

  console.log("filteredItems", filteredItems);

  return (
    <div className="text-white flex flex-col gap-4 min-h-[80dvh]">
      <h1 className="text-3xl font-bold mb-4 text-white">My Favorites</h1>

      <div className="flex items-center gap-6">
        <p>Filter</p>
        <Select
          options={filterOptions}
          styles={customStyles}
          className="w-56"
          value={selectedFilter}
          onChange={handleFilterChange}
          isSearchable={false}
        />
      </div>

      <div className="flex flex-col gap-4">
        {filteredItems?.map((item: FavoriteItem) => (
          <FavoriteCard
            key={item.id}
            audiobook={item}
            setFavoriteItems={setFavoriteItems}
          />
        ))}
      </div>

      {!filteredItems ||
        (filteredItems.length === 0 && (
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="text-center text-gray-400">
              Add books to your favorites to start listening.
            </p>
            <Link
              href="/"
              className="border border-gray-400 px-4 py-2 rounded-md"
            >
              Explore Audiobooks
            </Link>
          </div>
        ))}
    </div>
  );
};

export default FavoritesPage;
