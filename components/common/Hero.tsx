import Image from "next/image";
import React from "react";
import heroImage from "@/public/Images/soundleaf-files/posters/Designer2.jpeg";
import { IconSearch } from "@tabler/icons-react";

const HeroSection = () => {
  return (
    // <section className="w-full min-h-[80dvh] text-white flex md:gap-2 pt-8">

    //   <div className="flex flex-col w-2/3 md:w-1/2  min-h-full gap-4 md:gap-8 md:px-4 justify-center">
    //     <h1 className="md:text-4xl xl:text-5xl font-bold">
    //       Welcome to <span className="text-[#F4F4F4]">SoundLeaf</span>, your Audiobooks destination
    //     </h1>
    //     <p className="text-xs md:text-lg">
    //       Explore our vast collection, listen on the go, and immerse yourself in the world of audio literature.
    //     </p>
    //     <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold w-fit">
    //         Signup
    //       </button>
    //   </div>

    //   <div className="w-1/3 md:w-1/2 min-h-full flex items-center pr-4 justify-end">
    //     <Image
    //       src={heroImage}
    //       alt="Bookshelf and listening setup"
    //       className="w-full min-h-full rounded-lg object-cover"
    //       // width={500}
    //       // height={300}
    //     />
    //   </div>

    <section
      className="relative w-full min-h-[80dvh] bg-center text-white flex flex-col justify-center items-center py-10"
      style={{
        backgroundImage: `url(${heroImage.src})`,
      }}
    >
      {/* Overlay for better textz readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative z-10 max-w-6xl text-center">
        <h1 className="text-3xl md:text-4xl xl:text-6xl font-bold mb-6">
          Welcome to <span className="text-green-500">SoundLeaf</span>, your
          Audiobooks destination
        </h1>
        <p className="md:text-lg mb-6">
          Explore our vast collection, listen on the go, and immerse yourself in
          the world of audio literature.
        </p>
        <div className="relative mt-8">
          <input
            type="text"
            placeholder="Search for your favorite audiobook"
            className="w-full bg-[#344639] text-white placeholder-gray-400 py-3 px-4 pr-10 rounded-lg"
          />
          <IconSearch
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>
    </section>
    // </section>
  );
};

export default HeroSection;
