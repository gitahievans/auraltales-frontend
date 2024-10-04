import Image from "next/image";
import React from "react";
import heroImage from "@/public/Images/soundleaf-files/posters/Designer.jpeg";



const HeroSection = () => {
  return (
    <section className="w-full text-white flex gap-4 md:gap-2 pt-8">
      {/* Left Side - Text Content */}
      <div className="flex flex-col w-2/3 md:w-1/2 gap-4 md:gap-8 md:px-4">
        <h1 className="md:text-4xl xl:text-5xl font-bold">
          Welcome to <span className="text-[#F4F4F4]">SoundLeaf</span>, your Audiobooks destination
        </h1>
        <p className="text-xs md:text-lg">
          Explore our vast collection, listen on the go, and immerse yourself in the world of audio literature.
        </p>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold w-fit">
            Signup
          </button>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/3 md:w-1/2 flex items-end pr-4 justify-end ">
        <Image
          src={heroImage}
          alt="Bookshelf and listening setup"
          className="w-full rounded-lg object-cover"
          // width={500}
          // height={300}
        />
      </div>
    </section>
  );
}

export default HeroSection;