import React from "react";
import heroImage from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_6g64ay6g64ay6g64.jpeg";

const HeroSection = () => {
  return (
    <section
      className="relative w-full bg-center text-white flex flex-col justify-center items-center py-10 px-4"
      style={{
        backgroundImage: `url(${heroImage.src})`,
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-65"></div>

      <div className="relative z-10 max-w-md text-center">
        <h1 className="text-3xl md:text-4xl xl:text-6xl font-bold mb-4">
          Welcome to <span className="text-green-500">SoundLeaf</span>, your Audiobooks destination
        </h1>
        <p className="md:text-lg mb-6">
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
    </section>
  );
};

export default HeroSection;
