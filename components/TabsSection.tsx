import { Tabs } from "@mantine/core";
import { IconHeadphones, IconPlayerPlay, IconUser } from "@tabler/icons-react";
import React from "react";
import { ExpandableText } from "./ExpandableText";
import { Audiobook } from "@/types/types";

const TabsSection = ({ audioBook }: { audioBook: Audiobook }) => {
  return (
    <div className="bg-[#062C2A] rounded-2xl p-6 shadow-xl">
      <Tabs
        defaultValue="summary"
        variant="pills"
        radius="xl"
        color="green"
        classNames={{
          list: "bg-[#041714]/50 p-2 rounded-xl",
          tab: "data-[active=true]:bg-[#1CFAC4] data-[active=true]:text-black",
        }}
      >
        <Tabs.List className="justify-center mb-4">
          <Tabs.Tab
            value="summary"
            leftSection={<IconPlayerPlay className="text-inherit" />}
          >
            Summary
          </Tabs.Tab>
          <Tabs.Tab
            value="author"
            leftSection={<IconUser className="text-inherit" />}
          >
            Author
          </Tabs.Tab>
          <Tabs.Tab
            value="narrator"
            leftSection={<IconHeadphones className="text-inherit" />}
          >
            Narrator
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="summary" pt="xs">
          <ExpandableText>{audioBook?.description}</ExpandableText>
        </Tabs.Panel>

        <Tabs.Panel value="author" pt="xs">
          <ExpandableText>Lorem ipsum dolor sit amet,</ExpandableText>
        </Tabs.Panel>

        <Tabs.Panel value="narrator" pt="xs">
          <ExpandableText>Lorem ipsum dolor sit amet,</ExpandableText>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TabsSection;
