import React from "react";
import { Menu, Button } from "@mantine/core";
import { IconGauge, IconCheck } from "@tabler/icons-react";

const NarrationSpeedMenu = ({ currentSpeed, onSpeedChange }) => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <Menu
      trigger="hover"
      openDelay={100}
      closeDelay={400}
      position="top"
      shadow="xl"
      width={150}
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
          <IconGauge size={24} color="white" />
          <span className="text-white">Speed</span>
        </div>
      </Menu.Target>

      <Menu.Dropdown className="bg-gray-900 border border-gray-700">
        <Menu.Label className="font-bold text-white px-4 py-2 border-b border-gray-700">
          Narration Speed
        </Menu.Label>
        {speeds.map((speed) => (
          <Menu.Item
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={`flex justify-between items-center px-4 py-3 ${
              speed === currentSpeed ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <span
              className={`${
                speed === currentSpeed ? "text-white" : "text-gray-400"
              }`}
            >
              {speed}x
            </span>
            {speed === currentSpeed && (
              <IconCheck size={16} className="text-green-500" />
            )}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default NarrationSpeedMenu;
