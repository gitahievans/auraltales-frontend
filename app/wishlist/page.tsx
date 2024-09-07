'use client';

import BookCard from "@/components/Cards/BookCard";
import WishListCard from "@/components/Cards/WishListCard";
import { books } from "@/Constants/Books";
import React from "react";
import Select from "react-select";

const page = () => {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  return (
    <div className="text-white flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-4 text-white">My Wish List</h1>
      <div className="flex items-center gap-6">
        <p>Filter</p>
        <Select options={options} className="w-56"/>{" "}
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((card, i) => (
          <WishListCard />
        ))}
      </div>
    </div>
  );
};

export default page;
