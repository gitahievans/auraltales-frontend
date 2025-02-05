import React from "react";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import BookCard from "./Cards/BookCard";
import { Audiobook, Category } from "@/types/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

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
  const categoryObject = categoryObjects.find(
    (category) => category.name.toLowerCase() === title.toLowerCase()
  );

  const getBreakpoints = () => ({
    // Mobile (< 640px)
    0: {
      slidesPerView: 2.2,
      slidesPerGroup: 2,
      spaceBetween: 8, // Reduced from 12
    },
    // Small tablets (640px - 768px)
    640: {
      slidesPerView: 3.2,
      slidesPerGroup: 2,
      spaceBetween: 12, // Reduced from 16
    },
    // Tablets/Small laptops (768px - 1024px)
    768: {
      slidesPerView: 4.2,
      slidesPerGroup: 3,
      spaceBetween: 16, // Reduced from 20
    },
    // Desktop (>= 1024px)
    1024: {
      slidesPerView: 5.2,
      slidesPerGroup: 4,
      spaceBetween: 16, // Reduced from 24
    },
    // Large Desktop (>= 1280px)
    1280: {
      slidesPerView: 6.2,
      slidesPerGroup: 5,
      spaceBetween: 16, // Reduced from 24
    },
  });

  return (
    <div className="flex flex-col text-white py-4">
      <div className="flex items-center justify-between mb-4 px-4">
        <h1 className="text-lg md:text-2xl font-bold">{title}</h1>
        <Link
          href={`/audiobooks/categories/${categoryObject?.id}`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <p className="text-green-400 font-semibold text-sm">See all</p>
          <IconArrowRight color="#4ade80" size={18} />
        </Link>
      </div>

      <div className="w-full relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={true}
          breakpoints={getBreakpoints()}
          className="px-4"
        >
          {books.map((book: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="w-full max-w-[200px] mx-auto">
                <BookCard book={book} />
              </div>
            </SwiperSlide>
          ))}

          <button className="swiper-button-prev !hidden group-hover:!flex !w-8 !h-8 !rounded-full !bg-white/30 hover:!bg-white/50 !text-white after:!text-sm !left-0"></button>
          <button className="swiper-button-next !hidden group-hover:!flex !w-8 !h-8 !rounded-full !bg-white/30 hover:!bg-white/50 !text-white after:!text-sm !right-0"></button>
        </Swiper>
      </div>
    </div>
  );
};

export default BookCarousel;
