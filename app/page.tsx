import HeroSection from "@/components/common/Hero";
import { Button } from "@mantine/core";
import Image from "next/image";

export default function Home() {
  return (
    <div className='flex flex-col gap-4 min-h-screen p-1 my-2 md:max-w-3xl lg:max-w-7xl'>
      <HeroSection />
    </div>
  );
}
