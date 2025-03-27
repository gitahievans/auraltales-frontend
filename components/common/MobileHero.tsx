import React from "react";
import heroImage from "@/public/Images/soundleaf-files/posters/Designer2.jpeg";
import { IconSearch } from "@tabler/icons-react";

const MobileHero = () => {
  return (
    <section
      className="relative w-full bg-center text-white flex flex-col justify-center items-center py-10 px-4"
      style={{
        backgroundImage: `url(${heroImage.src})`,
      }}
    >
      {/* Overlay for better textz readability */}
      <div className="absolute inset-0 bg-black bg-opacity-65"></div>

      <div className="relative z-10 max-w-md text-center">
        <h1 className="text-3xl md:text-4xl xl:text-6xl font-bold mb-4">
          Welcome to <span className="text-green-500">AuralTales</span>, your Audiobooks destination
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
          <IconSearch size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
