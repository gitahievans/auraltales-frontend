import HeroSection from "@/components/common/Hero";
import HeroCarousel from "@/components/common/HeroCarousel";
import { Button } from "@mantine/core";
import Image from "next/image";

export default function Home() {
  return (
    <div className='flex flex-col gap-4 min-h-screen md:max-w-3xl lg:max-w-7xl'>
      <HeroSection />
      <HeroCarousel />
    </div>
  );
}
