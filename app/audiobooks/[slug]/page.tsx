"use client";

import { boughtState } from "@/app/page";
import BookGrid from "@/components/BookGrid";
import BookCard from "@/components/Cards/BookCard";
import BoughtBookCard from "@/components/Cards/BoughtBookCard";
import ChapterCard from "@/components/Cards/ChapterCard";
import UnboughtBookCard from "@/components/Cards/UnboughtBookCard";
import { books } from "@/Constants/Books";
import { Divider, Grid, rem, Tabs } from "@mantine/core";
import { IconCheck, IconPlayerPlay, IconPlaylistX } from "@tabler/icons-react";
import React, { useState } from "react";
import { useSnapshot } from "valtio";

type PagePropsType = {
  params: {
    slug: String;
  };
};

const ExpandableText = ({ children }) => {
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

const page = ({ params }: PagePropsType) => {
  const { slug } = params;
  const book = books.find((book) => book.slug === slug);
  console.log(book);
  const iconStyle = { width: rem(12), height: rem(12) };

  const boughtSnap = useSnapshot(boughtState);
  const { bought } = boughtSnap;

  return (
    <div className="flex flex-col gap-3 text-white min-h-[100dvh]">
      {!bought ? <UnboughtBookCard /> : <BoughtBookCard />}
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
            leftSection={<IconCheck style={iconStyle} />}
          >
            About Author
          </Tabs.Tab>
          <Tabs.Tab
            value="narrator"
            color="cyan"
            leftSection={<IconPlaylistX style={iconStyle} />}
          >
            About Narrator
          </Tabs.Tab>
        </Tabs.List>

        <Divider mb={30} mt={10} />

        <Tabs.Panel value="summary">
          <ExpandableText>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            omnis minus aut corporis maxime, ullam quaerat laborum perspiciatis
            quasi tempora quos sit sunt similique exercitationem necessitatibus
            quisquam libero vero adipisci. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Rerum omnis minus aut corporis maxime,
            ullam quaerat laborum perspiciatis quasi tempora quos sit sunt
            similique exercitationem necessitatibus quisquam libero vero
            adipisci.
          </ExpandableText>
        </Tabs.Panel>

        <Tabs.Panel value="author">
          <ExpandableText>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            omnis minus aut corporis maxime, ullam quaerat laborum perspiciatis
            quasi tempora quos sit sunt similique exercitationem necessitatibus
            quisquam libero vero adipisci. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Rerum omnis minus aut corporis maxime,
            ullam quaerat laborum perspiciatis quasi tempora quos sit sunt
            similique exercitationem necessitatibus quisquam libero vero
            adipisci. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Rerum omnis minus aut corporis maxime, ullam quaerat laborum
            perspiciatis quasi tempora quos sit sunt similique exercitationem
            necessitatibus quisquam libero vero adipisci.
          </ExpandableText>
        </Tabs.Panel>

        <Tabs.Panel value="narrator">
          <ExpandableText>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            omnis minus aut corporis maxime, ullam quaerat laborum perspiciatis
            quasi tempora quos sit sunt similique exercitationem necessitatibus
            quisquam libero vero adipisci.
          </ExpandableText>
        </Tabs.Panel>
      </Tabs>

      {bought ? (
        <div className="flex flex-col gap-4 mt-8">
          <h1 className="text-xl font-bold text-secondary">Chapters</h1>
          <div className="flex flex-col gap-4">
            {books.map((_, index) => (
              <ChapterCard />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 mt-8">
        <h1 className="text-xl font-bold text-secondary">More Like This one</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-4 ">
          {books.map((_, index) => (
            <BookCard book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
