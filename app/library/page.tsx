"use client";

import BoughtBookCard from "@/components/Cards/BoughtBookCard";
import ChapterCard from "@/components/Cards/ChapterCard";
import UnboughtBookCard from "@/components/Cards/UnboughtBookCard";
import { Divider, Tabs, rem } from "@mantine/core";
import { IconCheck, IconPlayerPlay, IconPlaylistX } from "@tabler/icons-react";
import React from "react";

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
      <Tabs defaultValue="all" variant="pills" radius="md">
        <Tabs.List>
          <Tabs.Tab
            value="all"
            leftSection={<IconPlayerPlay style={iconStyle} />}
          >
            All
          </Tabs.Tab>
          <Tabs.Tab
            value="finished"
            color="green"
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
            <ChapterCard />
            <ChapterCard />

            <ChapterCard />
            <ChapterCard />
            <ChapterCard />
            <ChapterCard />
            <ChapterCard />
            <ChapterCard />
            <ChapterCard />

            <UnboughtBookCard />
            <UnboughtBookCard />
            <BoughtBookCard />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="finished">
          <div className="flex flex-col gap-4">
            <BoughtBookCard />
            <UnboughtBookCard />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="unfinished">
          <div className="flex flex-col gap-4">
            <UnboughtBookCard />
            <UnboughtBookCard />
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default page;
