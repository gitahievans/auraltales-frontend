"use client";

import { customStyles } from "@/styles/FilterStyles";
import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Audiobook } from "@/types/types";
import WishlistCard from "@/components/Cards/WishListCard";

// Define filter options based on your needs
const filterOptions = [
  { value: "all", label: "All Books" },
  { value: "latest", label: "Latest Added" },
  { value: "oldest", label: "Oldest Added" },
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "title_desc", label: "Title (Z-A)" },
  { value: "date_published_new", label: "Newest Release" },
  { value: "date_published_old", label: "Oldest Release" },
];

export type WishlistItem = {
  id: number;
  audiobook: Audiobook;
  added_at: string;
};

const WishListPage = () => {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState({
    value: "all",
    label: "All Books",
  });

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/wishlist/",
          {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          }
        );

        if (response.status === 200) {
          setWishlistItems(response.data.items);
        }
      } catch (err) {
        setError("Failed to load wishlist.");
      }
    };

    if (session?.jwt) {
      fetchWishlist();
    }
  }, [session?.jwt]);

  // Filter and sort wishlist items based on selected filter
  const filteredItems = useMemo(() => {
    if (!wishlistItems) return null;

    const items = [...wishlistItems];

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
  }, [wishlistItems, selectedFilter]);

  const handleFilterChange = (option: any) => {
    setSelectedFilter(option);
  };

  return (
    <div className="text-white flex flex-col gap-4 min-h-[80dvh]">
      <h1 className="text-3xl font-bold mb-4 text-white">My Wish List</h1>

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

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col gap-2">
        {filteredItems?.map((item: WishlistItem) => (
          <WishlistCard key={item.id} audiobook={item} />
        ))}
      </div>

      {filteredItems?.length === 0 && (
        <p className="text-center text-gray-400 mt-8">
          Your wishlist is empty.
        </p>
      )}
    </div>
  );
};

export default WishListPage;
