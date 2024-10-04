import BookCard from "@/components/Cards/BookCard";
import { books } from "@/Constants/Books";
import React from "react";

type CollectionPropsType = {
  params: {
    collection: String;
  };
};

const page = ({ params }: CollectionPropsType) => {
  const { collection } = params;
  const title =
    collection.charAt(0).toUpperCase() + collection.substring(1).toLowerCase();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
