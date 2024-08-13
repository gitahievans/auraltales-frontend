"use client";

import React from "react";
import { Carousel } from "@mantine/carousel";
import heroImage from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";
import Image from "next/image";

const HeroCarousel = () => {
  return (
    <div className="bg-darkerGreen">
      <Carousel
        withIndicators
        height={400}
        slideSize="33.333333%"
        slideGap={20}
        loop
        align="center"
        slidesToScroll={3}
        dragFree
        styles={{ controls: { color: 'blue' } }}
        >
        <Carousel.Slide>
            <Image src={heroImage} alt="image" width={500}/>
        </Carousel.Slide>
        <Carousel.Slide>
            <Image src={heroImage} alt="image" width={500}/>
        </Carousel.Slide>
        <Carousel.Slide>
            <Image src={heroImage} alt="image" width={500}/>
        </Carousel.Slide>
        <Carousel.Slide>
            <Image src={heroImage} alt="image" width={500}/>
        </Carousel.Slide>
        <Carousel.Slide>
            <Image src={heroImage} alt="image" width={500}/>
        </Carousel.Slide>
        <Carousel.Slide>
            <Image src={heroImage} alt="image" width={500}/>
        </Carousel.Slide>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
