"use client";

import { boughtState } from "@/app/page";
import BookGrid from "@/components/BookCarousel";
import BookCard from "@/components/Cards/BookCard";
import BoughtBookCard from "@/components/Cards/BoughtBookCard";
import ChapterCard from "@/components/Cards/ChapterCard";
import UnboughtBookCard from "@/components/Cards/UnboughtBookCard";
import { checkPurchaseStatus } from "@/lib/store";
import { fetchedAudiobooks } from "@/state/state";
import { Audiobook, PurchaseStatus } from "@/types/types";
import { Divider, Grid, rem, Tabs } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCheck,
  IconHeadphones,
  IconPlayerPlay,
  IconPlaylistX,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";
import { get } from "http";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

type PagePropsType = {
  params: {
    slug: String;
  };
};

const ExpandableText = ({ children }: { children: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className="text-gray-400">
        {expanded ? children : `${children.substring(0, 250)}...`}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-400 hover:text-blue-700 focus:outline-none"
      >
        {expanded ? "See Less" : "See More"}
      </button>
    </div>
  );
};

const Page = ({ params }: PagePropsType) => {
  const { slug } = params;
  const [audioBook, setAudioBook] = useState<Audiobook | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | null>(
    null
  );
  const [relatedBooks, setRelatedBooks] = useState<Audiobook[]>([]);
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);

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
      const response = await fetch(
        `http://127.0.0.1:8000/api/audiobooks/${slug}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Audiobook details");
      }
      const data = await response.json();
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

      const status = await checkPurchaseStatus(audioBook.id, session.jwt);
      setPurchaseStatus(status);
    };

    getPurchaseStatus();
  }, [audioBook, session?.jwt]);

  useEffect(() => {
    if (audioBook && audiobooks.length > 0) {
      // Get related books by matching categories or collection
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
    <div className="flex flex-col gap-3 text-white min-h-[100dvh] max-w-5xl mx-auto">
      {!audioBook ? (
        <p>Loading...</p>
      ) : (
        <>
          {!purchaseStatus?.bought ? (
            <UnboughtBookCard book={audioBook} />
          ) : (
            <BoughtBookCard book={audioBook} />
          )}
          <Tabs defaultValue="summary" variant="pills" radius="md">
            <Tabs.List>
              <Tabs.Tab
                value="summary"
                leftSection={<IconPlayerPlay style={iconStyle} />}
              >
                Summary
              </Tabs.Tab>
              <Tabs.Tab
                value="author"
                color="green"
                leftSection={<IconUser style={iconStyle} />}
              >
                Author
              </Tabs.Tab>
              <Tabs.Tab
                value="narrator"
                color="cyan"
                leftSection={<IconHeadphones style={iconStyle} />}
              >
                Narrator
              </Tabs.Tab>
            </Tabs.List>

            <Divider mb={30} mt={10} />

            <Tabs.Panel value="summary">
              <ExpandableText>{audioBook?.description}</ExpandableText>
            </Tabs.Panel>

            <Tabs.Panel value="author">
              <ExpandableText>Lorem ipsum dolor sit amet,</ExpandableText>
            </Tabs.Panel>

            <Tabs.Panel value="narrator">
              <ExpandableText>Lorem ipsum dolor sit amet,</ExpandableText>
            </Tabs.Panel>
          </Tabs>

          {purchaseStatus?.bought ? (
            <div className="flex flex-col gap-4 mt-8">
              <h1 className="text-xl font-bold text-secondary">Chapters</h1>
              <div className="flex flex-col gap-4">
                {audioBook?.chapters.map((chapter, index) => (
                  <ChapterCard
                    chapter={chapter}
                    audioBook={audioBook}
                    key={index}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 mt-8">
            <h1 className="text-xl font-bold text-secondary">
              More Like This One
            </h1>
            <div className="flex flex-row gap-4 flex-wrap">
              {relatedBooks.length > 0
                ? relatedBooks.map((item, index) => (
                    <BookCard book={item} key={index} />
                  ))
                : audiobooks?.map((item, index) => (
                    <BookCard book={item} key={index} />
                  ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
