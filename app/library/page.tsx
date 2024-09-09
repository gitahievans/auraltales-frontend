"use client";

import BookCard from "@/components/Cards/BookCard";
import BuyAudiobookCard from "@/components/Cards/BuyAudiobookCard";
import FilterSection from "@/components/Cards/LibraryFilter";
import WishListCard from "@/components/Cards/WishListCard";
import { books } from "@/Constants/Books";
import { customStyles } from "@/styles/FilterStyles";
import { Divider, Tabs, rem } from "@mantine/core";
import { IconCheck, IconPlayerPlay, IconPlaylistX } from "@tabler/icons-react";
import React from "react";
import Select from "react-select";

const page = () => {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const iconStyle = { width: rem(16), height: rem(16) };

  return (
    <div className="text-white flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-4 text-white">My Library</h1>
      {/* //TODO - disable tabs if that section doesn't have audiobooks */}
      <Tabs defaultValue="all" variant="pills" radius="xl">
        <Tabs.List>
          <Tabs.Tab
            value="all"
            leftSection={<IconPlayerPlay style={iconStyle} />}
          >
            All
          </Tabs.Tab>
          <Tabs.Tab
            value="finished"
            color="blue"
            leftSection={<IconCheck style={iconStyle} />}
          >
            Finished
          </Tabs.Tab>
          <Tabs.Tab
            value="unfinished"
            color="cyan"
            leftSection={<IconPlaylistX style={iconStyle} />}
          >
            Unfinished
          </Tabs.Tab>
        </Tabs.List>

        <Divider mb={30} mt={10} />

        <Tabs.Panel value="all">
          <div className="flex flex-col gap-4">
            <WishListCard />
            <WishListCard />
            <BuyAudiobookCard />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="finished">
          <div className="flex flex-col gap-4">
            <BuyAudiobookCard />
            <WishListCard />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="unfinished">
          <div className="flex flex-col gap-4">
            <WishListCard />
            <WishListCard />
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default page;
