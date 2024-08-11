import Image from "next/image";
import React from "react";
import heroImage from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";



const HeroSection = () => {
  return (
    <section className="w-full py-6 text-white flex items-start justify-between gap-4 md:gap-0">
      {/* Left Side - Text Content */}
      <div className="flex flex-col w-2/3 md:w-1/2 gap-4 md:gap-8">
        <h1 className="lg:text-4xl xl:text-6xl font-bold">
          Welcome to <span className="text-[#F4F4F4]">SoundLeaf</span>, your Audiobooks destination
        </h1>
        <p className="text-xs md:text-lg">
          Explore our vast collection, listen on the go, and immerse yourself in the world of audio literature.
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for your favorite audiobook"
            className="w-full bg-[#344639] text-white placeholder-gray-400 py-3 px-4 pr-10 rounded-lg"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/3 md:w-1/2 flex items-center justify-end">
        <Image
          src={heroImage}
          alt="Bookshelf and listening setup"
          className="w-full max-w-xs xl:max-w-md rounded-lg"
        />
      </div>
    </section>
  );
}

export default HeroSection;