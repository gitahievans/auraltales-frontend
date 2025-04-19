"use client";

import BookCard from "@/components/Cards/BookCard";
import { books } from "@/Constants/Books";
import React, { useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { Loader } from "@mantine/core";
import apiClient from "@/lib/apiClient";

export const runtime = "edge";

type CollectionPropsType = {
  params: {
    collectionId: number;
  };
};

const CollectionPage = ({ params }: CollectionPropsType) => {
  const { collectionId } = params;

  const [audiobooks, setAudiobooks] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  useEffect(() => {
    fetchCollectionAudiobooks();
  }, [collectionId]);

  const fetchCollectionAudiobooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get(`/api/collections/${collectionId}`);

      if (response.status === 200) {
        setTitle(response.data.collection);
        setAudiobooks(response.data.audiobooks);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title> {title ? `${title} | Audiobooks` : "Audiobooks"}</title>
      </Head>

      <div className="min-h-[80dvh]">
        <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
        {loading ? (
          <div className="flex justify-center items-center h-[80dvh]">
            <Loader type="bars" color="green" size="xl" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : audiobooks.length === 0 ? (
          <p className="text-gray-400">
            No audiobooks available in this collection.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {audiobooks.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CollectionPage;
