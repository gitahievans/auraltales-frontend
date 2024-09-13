"use client";

import BookGrid from "@/components/BookGrid";
import BookCard from "@/components/Cards/BookCard";
import WishListCard from "@/components/Cards/WishListCard";
import { books } from "@/Constants/Books";
import { Divider, Grid, rem, Tabs } from "@mantine/core";
import { IconCheck, IconPlayerPlay, IconPlaylistX } from "@tabler/icons-react";
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

  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div className="flex flex-col gap-3 text-white min-h-[100dvh]">
      <WishListCard />
      <Tabs defaultValue="summary" variant="pills" radius="xl">
        {/* Tabs List */}
        <Tabs.List>
          <Tabs.Tab
            value="summary"
            leftSection={<IconPlayerPlay style={iconStyle} />}
          >
            Summary
          </Tabs.Tab>
          <Tabs.Tab
            value="author"
            leftSection={<IconCheck style={iconStyle} />}
          >
            About Author
          </Tabs.Tab>
          <Tabs.Tab
            value="narrator"
            leftSection={<IconPlaylistX style={iconStyle} />}
          >
            About Narrator
          </Tabs.Tab>
        </Tabs.List>

        <Divider mb={30} mt={10} />

        <Tabs.Panel value="summary">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            omnis minus aut corporis maxime, ullam quaerat laborum perspiciatis
            quasi tempora quos sit sunt similique exercitationem necessitatibus
            quisquam libero vero adipisci.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            omnis minus aut corporis maxime, ullam quaerat laborum perspiciatis
            quasi tempora quos sit sunt similique exercitationem necessitatibus
            quisquam libero vero adipisci.
          </p>
        </Tabs.Panel>

        <Tabs.Panel value="author">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            omnis minus aut corporis maxime, ullam quaerat laborum perspiciatis
            quasi tempora quos sit sunt similique exercitationem necessitatibus
            quisquam libero vero adipisci.
          </p>
        </Tabs.Panel>

        <Tabs.Panel value="narrator">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            omnis minus aut corporis maxime, ullam quaerat laborum perspiciatis
            quasi tempora quos sit sunt similique exercitationem necessitatibus
            quisquam libero vero adipisci.
          </p>
        </Tabs.Panel>
      </Tabs>

      <div className="flex flex-col gap-4 mt-8">
        <h1 className="text-xl font-bold text-secondary">More Like This one</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-4 ">
          {books.map((_, index) => (
            <BookCard book={book}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
