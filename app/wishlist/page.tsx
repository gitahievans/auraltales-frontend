"use client";

import UnboughtBookCard from "@/components/Cards/UnboughtBookCard";
import { customStyles } from "@/styles/FilterStyles";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useSession } from "next-auth/react";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
const WishListPage = () => {
  const { data: session } = useSession();
  // console.log("session in wishlist", session);

  const [wishlistItems, setWishlistItems] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

    fetchWishlist();
  }, []);

  console.log("wishlist irems", wishlistItems);

  return (
    <div className="text-white flex flex-col gap-4 min-h-[80dvh]">
      <h1 className="text-3xl font-bold mb-4 text-white">My Wish List</h1>
      <div className="flex items-center gap-6">
        <p>Filter</p>
        <Select options={options} styles={customStyles} className="w-56" />{" "}
      </div>
      <div className="flex flex-col gap-2">
        {wishlistItems &&
          wishlistItems.map((book: any) => (
            <UnboughtBookCard
              key={book.id}
              book={book}
              wishlistItems={wishlistItems}
            />
          ))}
      </div>
    </div>
  );
};

export default WishListPage;
