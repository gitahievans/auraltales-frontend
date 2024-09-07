import { books } from "@/Constants/Books";
import React from "react";

type PagePropsType = {
    params: {
        slug: String;
    };
};
const page = ({ params }: PagePropsType) => {
  const { slug } = params;

  const book = books.find((book) => book.slug === slug);
  console.log(book);
  

  return(
    <div className="text-white">
      <h1>{slug}</h1>
      <p>{book?.author}</p>
    </div>
  );
};

export default page;
