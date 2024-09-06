"use client";

import {
  IconArrowLeft,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconArrowRight,
} from "@tabler/icons-react";
import React, { useState, useEffect, ReactNode } from "react";

interface CarouselProps {
  children: ReactNode; // Content to display in the carousel
  slideWidth: number; // Width of each slide in pixels
  loop?: boolean; // Enable infinite loop
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  slideWidth,
  loop = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clonedChildren, setClonedChildren] = useState<ReactNode[]>([]);
  const totalSlides = React.Children.count(children);

  // Set up cloned slides to create an infinite loop effect
  useEffect(() => {
    const cloneCount = Math.ceil(window.innerWidth / slideWidth); // Calculate how many clones we need to fill the carousel
    const clones = React.Children.toArray(children).slice(0, cloneCount); // Clone the first few slides
    setClonedChildren(clones);
  }, [children, slideWidth]);

  // Function to go to the next slide
  const nextSlide = () => {
    if (loop) {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    } else {
      setCurrentSlide((prevSlide) => Math.min(prevSlide + 1, totalSlides - 1));
    }
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    if (loop) {
      setCurrentSlide((prevSlide) =>
        prevSlide === 0 ? totalSlides - 1 : prevSlide - 1
      );
    } else {
      setCurrentSlide((prevSlide) => Math.max(prevSlide - 1, 0));
    }
  };

  return (
    <div className="relative overflow-hidden w-full mx-auto">
      {/* Carousel Container */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentSlide * slideWidth}px)` }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            className="min-w-[300px] flex-shrink-0 p-2"
            key={index}
            style={{ width: `${slideWidth}px` }}
          >
            {child}
          </div>
        ))}

        {/* Render cloned children to ensure full carousel effect */}
        {clonedChildren.map((child, index) => (
          <div
            className="min-w-[300px] flex-shrink-0 p-2"
            key={`clone-${index}`}
            style={{ width: `${slideWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Previous Slide Button */}
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-darkerGreen rounded-full shadow-md"
        onClick={prevSlide}
      >
        <IconArrowLeft color="#4ade80" />
      </button>

      {/* Next Slide Button */}
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-darkerGreen rounded-full shadow-md"
        onClick={nextSlide}
      >
        <IconArrowRight color="#4ade80" />
      </button>
    </div>
  );
};

export default Carousel;
