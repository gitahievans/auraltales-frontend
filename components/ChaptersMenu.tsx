import React from "react";
import { Menu, Button } from "@mantine/core";
import { IconChevronDown, IconList } from "@tabler/icons-react";
import { Audiobook, Chapter } from "@/types/types";

const ChaptersMenu = ({
  chapters,
  audiobook,
}: {
  chapters: Chapter[];
  audiobook: Audiobook;
}) => {
  return (
    <Menu
      trigger="hover"
      openDelay={100}
      closeDelay={400}
      position="top"
      shadow="xl"
      width={250}
      withArrow
      transitionProps={{ transition: "fade-up", duration: 150 }}
      styles={{
        dropdown: {
          backgroundColor: "#041714",
        },
        item: {
          color: "#22C55E",
          "&:hover": {
            backgroundColor: "white",
            color: "black",
          },
        },
      }}
    >
      <Menu.Target>
        <div className="flex flex-col items-center">
          <IconList size={24} color="white" />
          <span className="text-white">Chapters</span>
        </div>
      </Menu.Target>

      <Menu.Dropdown className="bg-gray-900 border border-gray-700">
        <Menu.Label className="text-xl font-bold text-white px-4 py-2 border-b border-gray-700">
          {audiobook?.title}
        </Menu.Label>
        {chapters.map((chapter, index) => (
          <Menu.Item
            key={index}
            className={`flex justify-between items-center px-4 py-3 ${
              index === 0 ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-lg ${
                  index === 0 ? "text-white" : "text-gray-400"
                }`}
              >
                Chapter {index + 1}
              </span>
              {/* <span
                className={`${index === 0 ? "text-white" : "text-gray-400"}`}
              >
                {chapter.duration}
              </span> */}
            </div>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ChaptersMenu;
