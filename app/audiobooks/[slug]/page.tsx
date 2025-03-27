"use client";

import BookCard from "@/components/Cards/BookCard";
import BoughtBookCard from "@/components/Cards/BoughtBookCard";
import UnboughtBookCard from "@/components/Cards/UnboughtBookCard";
import TabsSection from "@/components/TabsSection";
import apiClient from "@/lib/apiClient";
import { checkPurchaseStatus } from "@/lib/store";
import { Audiobook, PurchaseStatus } from "@/types/types";
import { Loader, rem, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronLeft } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export const runtime = "edge";
type PagePropsType = {
  params: {
    slug: String;
  };
};

const Page = ({ params }: PagePropsType) => {
  const { slug } = params;
  const [audioBook, setAudioBook] = useState<Audiobook | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | null>(
    null
  );
  const [relatedBooks, setRelatedBooks] = useState<Audiobook[]>([]);
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [opened, { open, close }] = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    const storedAudiobooks = localStorage.getItem("audiobooks");
    console.log("Retrieved audiobooks from localStorage:", storedAudiobooks);
    if (storedAudiobooks) {
      setAudiobooks(JSON.parse(storedAudiobooks));
    }
  }, []);

  const iconStyle = { width: rem(12), height: rem(12) };

  console.log("audioBook", audioBook);
  console.log("purchaseStatus", purchaseStatus);

  const { data: session } = useSession();

  console.log("audiobooks in details", audiobooks.length);

  const fetchAudioBook = async () => {
    try {
      const response = await apiClient.get(`/api/audiobooks/${slug}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch Audiobook details");
      }
      const data = await response.data;
      setAudioBook(data.audiobook);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAudioBook();
  }, [slug]);

  useEffect(() => {
    const getPurchaseStatus = async () => {
      if (!audioBook || !session?.jwt) {
        return;
      }

      const status = await checkPurchaseStatus(
        audioBook.id as number,
        session.jwt
      );
      console.log("Purchase status for audiobook:", status?.bought);

      setPurchaseStatus(status);
    };

    getPurchaseStatus();
  }, [audioBook, session?.jwt]);

  useEffect(() => {
    if (audioBook && audiobooks.length > 0) {
      const related = audiobooks.filter((book) => {
        const sharedCategories = book.categories.some((category) =>
          audioBook.categories.map((cat) => cat.name).includes(category.name)
        );

        const sharedCollections = book.collections.some((collection) =>
          audioBook.collections.map((col) => col.name).includes(collection.name)
        );

        return (
          (sharedCategories || sharedCollections) && book?.id !== audioBook?.id
        );
      });

      setRelatedBooks(related);
    }
  }, [audioBook, audiobooks]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#041714] to-[#062C2A] text-white">
      <button
        onClick={() => router.back()}
        className="flex items-center text-green-400 hover:text-green-500 mb-4 transition-colors"
      >
        <IconChevronLeft className="mr-2" />
        Back to Library
      </button>
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {!audioBook ? (
          <div className="flex justify-center items-center h-full">
            <Loader color="white" size="xl" />
          </div>
        ) : (
          <>
            <div className="animate-fade-in">
              {!purchaseStatus?.bought ? (
                <UnboughtBookCard book={audioBook} />
              ) : (
                <BoughtBookCard book={audioBook} open={open} />
              )}
            </div>

            <TabsSection audioBook={audioBook} />

            {/* Related Books Section */}
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-[white]">
                More Like This One
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(relatedBooks.length > 0 ? relatedBooks : audiobooks).map(
                  (item, index) => (
                    <BookCard book={item} key={index} />
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
