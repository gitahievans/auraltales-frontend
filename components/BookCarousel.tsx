import React from "react";
import BookCard from "./Cards/BookCard";
import { IconArrowRight } from "@tabler/icons-react";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { Audiobook, Category } from "@/types/types";

type Props = {
  title: string;
  books: Audiobook[];
  categoryNames: string[];
  categoryObjects: Category[];
};

const BookCarousel: React.FC<Props> = ({
  title,
  books,
  categoryNames,
  categoryObjects,
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const categoryObject = categoryObjects.find(
    (category) => category.name.toLowerCase() === title.toLowerCase()
  );

  const getSlidesToShow = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  const getSlidesToScroll = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const getSlideSize = () => {
    if (isMobile) return "50%";
    if (isTablet) return "33.33%";
    return "25%";
  };

  return (
    <div className="flex flex-col text-white py-4 gap-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg md:text-2xl font-bold">{title}</h1>
        <Link
          href={`/audiobooks/categories/${categoryObject?.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <p className="text-green-400 font-semibold">See all</p>
          <IconArrowRight color="#4ade80" size={20} />
        </Link>
      </div>
      <Carousel
        withControls
        loop
        align="start"
        slidesToShow={getSlidesToShow()}
        slidesToScroll={getSlidesToScroll()}
        slideSize={getSlideSize()}
        slideGap="xs"
        controlsOffset="xs"
        controlSize={40}
        classNames={{
          control: "bg-white/30 text-white hover:bg-white/50",
        }}
      >
        {books.map((book: any, index: number) => (
          <Carousel.Slide key={index}>
            <BookCard book={book} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};

export default BookCarousel;
