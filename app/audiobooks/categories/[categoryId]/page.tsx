"use client";

import BookCard from "@/components/Cards/BookCard";
import { books } from "@/Constants/Books";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";

type CategoryPropsType = {
  params: {
    categoryId: number;
  };
};

const CategoryPage = ({ params }: CategoryPropsType) => {
  const { categoryId } = params;
  const [audiobooks, setAudiobooks] = React.useState([]);
  const [title, setTitle] = React.useState("");

  // const title =
  //   category.charAt(0).toUpperCase() + category.substring(1).toLowerCase();

  useEffect(() => {
    fetchCategoryAudiobooks();
  }, []);

  const fetchCategoryAudiobooks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/categories/${categoryId}`
      );

      if (response.status === 200) {
        console.log("categories", response.data);
        setTitle(response.data.category);
        setAudiobooks(response.data.audiobooks);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
