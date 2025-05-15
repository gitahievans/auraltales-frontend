import { Audiobook } from "@/types/types";
import { ActionIcon, Center, RingProgress } from "@mantine/core";
import Image from "next/image";
import React from "react";

interface RingProgressProps {
  audiobook: Audiobook;
  currentPercentage: number;
}

const RingProgressComp = ({ audiobook, currentPercentage }: RingProgressProps) => {
  return (
    <div className="w-full flex justify-center items-center mb-4">
      <RingProgress
        size={192}
        thickness={7}
        sections={[{ value: currentPercentage, color: "#22c55e" }]}
        rootColor="#1a1a1a"
        roundCaps
        label={
          <Center>
            <ActionIcon
              styles={{
                root: {
                  backgroundColor: "transparent",
                },
              }}
              variant="light"
              radius="xl"
              size={155}
            >
              <Image
                src={audiobook?.poster}
                alt="Book cover"
                className="rounded-full object-cover border-2 border-gray-700"
                width={500}
                height={300}
              />
            </ActionIcon>
          </Center>
        }
      />
    </div>
  );
};

export default RingProgressComp;
