import React from "react";
import { books } from "@/Constants/Books";
import BookCard from "./Cards/BookCard";
import { IconArrowNarrowRight, IconArrowRight } from "@tabler/icons-react";
import Carousel from "./Carousel/Carousel";

const BookGrid: React.FC = ({title}) => {
  return (
    <div className="flex flex-col text-white p-4 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl">{title}</h1>
        <div className="flex items-center gap-2 cursor-pointer">
          <p className="text-green-400">More</p>
          <IconArrowRight color="#4ade80" />
        </div>
      </div>
      {/* <Carousel
        withControls
        withIndicators 
        slideSize="20%"
        controlSize={40}
        controlsOffset="sm"
        slideGap="md"
        align="start"
        loop<IconArrowNarrowRight />
        styles={{
          control: {
            "&[data-inactive]": { opacity: 0.5 }, // Inactive control style
          },
        }}
      >
        {books.map((book, index) => (
          <Carousel.Slide key={index}>
            <BookCard
              title={book.title}
              author={book.author}
              poster={book.poster}
            />
          </Carousel.Slide>
        ))}
      </Carousel> */}
      <Carousel slideWidth={300} loop={true}>
        {books.map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            poster={book.poster}
          />
        ))}
      </Carousel>
      {/* <button className="bg-green-500 text-white py-2 px-6 rounded-lg font-bold w-fit self-center">
        More
      </button> */}
    </div>
  );
};

export default BookGrid;
