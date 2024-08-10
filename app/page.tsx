import HeroSection from "@/components/common/Hero";
import { Button } from "@mantine/core";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center border border-red-500">
      <HeroSection />
    </div>
  );
}
