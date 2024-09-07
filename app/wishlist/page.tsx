import BookCard from "@/components/Cards/BookCard";
import WishListCard from "@/components/Cards/WishListCard";
import { books } from "@/Constants/Books";
import { Select } from "@mantine/core";
import React from "react";

const page = () => {
  return (
    // <div className="flex flex-col gap-4 min-h-screen max-w-full">
    //   <h1 className="text-3xl font-bold mb-4 text-white">Wish List</h1>{" "}
    //   {[1, 2, 3, 4, 5].map((card, i) => (
    //     <WishListCard />
    //   ))}
    // </div>

    <div>
      <h1 className="text-3xl font-bold mb-4 text-white">My Wish List</h1>
      <div className="flex items-center gap-2">
        <p>Filter</p>
        <Select />
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
