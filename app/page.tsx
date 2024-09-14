"use client";

import BookGrid from "@/components/BookGrid";
import HeroSection from "@/components/common/Hero";
import MobileHero from "@/components/common/MobileHero";
import HeroCarousel from "@/components/common/MobileHero";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { proxy } from "valtio";

export const boughtState = proxy({
  bought: true
})

export default function Home() {
  

  const mobile = useMediaQuery("(max-width: 640px)");

  const categories = [
    "Recommended for You",
    "New Releases",
    "Fiction",
    "Business & Career",
    "Horror",
    "Romance",
  ];
  return (
    <div className="flex flex-col gap-4 min-h-screen md:max-w-3xl lg:max-w-7xl">
      {!mobile ? <HeroSection /> : null}
      {mobile ? <MobileHero /> : null}
      <div className="mt-4">
        {categories.map((cat, i) => (
          <BookGrid key={i} title={cat} />
        ))}
      </div>
    </div>
  );
}
