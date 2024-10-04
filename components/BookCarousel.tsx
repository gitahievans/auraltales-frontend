import React from "react";
// import { books } from "@/Constants/Books";
import BookCard from "./Cards/BookCard";
import { IconArrowNarrowRight, IconArrowRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
// import Carousel from "./Carousel/Carousel";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  title: string;
  books: any;
};

const BookCarousel: React.FC<Props> = ({ title, books }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getSlideSize = () => {
    if (isMobile) return '50%';
    if (isTablet) return '33.333%';
    return '16.666%';
  };

  const getSlidesToScroll = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  return (
    <div className="flex flex-col text-white p-4 gap-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2 cursor-pointer">
          <p className="text-green-400 font-semibold">See all</p>
          <IconArrowRight color="#4ade80" size={20} />
        </div>
      </div>
      <Carousel
        withControls
        loop
        align="start"
        slidesToScroll={getSlidesToScroll()}
        slideSize={getSlideSize()}
        slideGap="md"
        controlsOffset="xs"
        controlSize={40}
        classNames={{
          control: 'bg-white/30 text-white hover:bg-white/50',
        }}
      >
        {books.concat(books).map((book: any, index: number) => (
          <Carousel.Slide key={index}>
            <BookCard book={book} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};

export default BookCarousel;
