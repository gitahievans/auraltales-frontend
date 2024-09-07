"use client";

import BookCard from "@/components/Cards/BookCard";
import { books } from "@/Constants/Books";
import { useRouter } from "next/navigation";
import React from "react";

type CategoryPropsType = {
  params: {
    category: String;
  };
};

const page = ({ params }: CategoryPropsType) => {
  const { category } = params;
  const title =
    category.charAt(0).toUpperCase() + category.substring(1).toLowerCase();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            poster={book.poster}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
