import BookCard from "@/components/Cards/BookCard";
import { books } from "@/Constants/Books";
import React from "react";

// TODO this page should be dynamic
const page = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-white">Category Title</h1>
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
