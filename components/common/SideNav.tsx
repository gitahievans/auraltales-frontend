"use client";

import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { sideNavState } from "@/state/state";
import Image from "next/image";
import avatar from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_v8c5gbv8c5gbv8c5.jpeg";
import { IconBooks, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { motion } from "framer-motion";

const SideNav = () => {
  const sideBarSnap = useSnapshot(sideNavState);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isListsOpen, setIsListsOpen] = useState(false);
  const { open } = sideBarSnap;

  const browseCategories = [
    { name: "Fiction", path: "/audiobooks/fiction" },
    { name: "Non-Fiction", path: "/audiobooks/non-fiction" },
    { name: "Sci-Fi", path: "/audiobooks/sci-fi" },
    { name: "Romance", path: "/audiobooks/romance" },
  ];

  const listCollections = [
    { name: "New Releases", path: "/collections/new-releases" },
    { name: "Best Sellers", path: "/collections/best-sellers" },
    { name: "Editor's Picks", path: "/collections/editor-picks" },
  ];

  return (
    <aside
      id="default-sidebar"
      className={`w-56 h-screen transition-all duration-500 bg-primary ${
        open ? "" : "hidden"
      } lg:block fixed z-50 h-screen`}
      aria-label="Sidebar"
    >
      <div className="flex items-center gap-4">
        <span className="text-white hidden md:block">Good Morning, Evans!</span>
        <div className="bg-slate-400 w-10 h-10 flex items-center justify-center rounded-full">
          <Image src={avatar} alt="user" className="rounded-full" />
        </div>
      </div>
      <nav className="h-full pl-2 lg:pl-0 overflow-y-auto">
        <ul className="space-y-2">
          {/* Browse Audiobooks Section */}
          <li className="pt-4 pb-2">
            <span className="text-gray-400">Browse Audiobooks</span>
          </li>
          <li>
            <button
              className="flex items-center justify-between w-full p-2 text-white rounded-lg hover:bg-green"
              onClick={() => setIsBrowseOpen(!isBrowseOpen)}
            >
              <span className="flex items-center">
                <IconBooks />
                Browse Audiobooks
              </span>
              {isBrowseOpen ? (
                <IconChevronUp size={20} />
              ) : (
                <IconChevronDown size={20} />
              )}
            </button>
            {isBrowseOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isBrowseOpen ? "auto" : 0,
                  opacity: isBrowseOpen ? 1 : 0,
                }}
                exit={{ height: 0, opacity: 0 }} // Exit animation for collapsing
                transition={{ duration: 0.3, ease: "linear" }}
                className="overflow-hidden pl-8 mt-2 space-y-1"
              >
                {browseCategories.map((category) => (
                  <li key={category.name} className="hover:underline">
                    <a
                      href={category.path}
                      className="text-white hover:underline"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </li>

          {/* Lists & Collections Section */}
          <li>
            <button
              className="flex items-center justify-between w-full p-2 text-white rounded-lg hover:bg-green"
              onClick={() => setIsListsOpen(!isListsOpen)}
            >
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                </svg>
                Lists & Collections
              </span>
              {isListsOpen ? (
                <IconChevronUp size={20} />
              ) : (
                <IconChevronDown size={20} />
              )}
            </button>
            {isListsOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isListsOpen ? "auto" : 0,
                  opacity: isListsOpen ? 1 : 0,
                }}
                exit={{ height: 0, opacity: 0 }} // Exit animation for collapsing
                transition={{ duration: 0.3, ease: "linear" }}
                className="overflow-hidden pl-8 mt-2 space-y-1"
              >
                {listCollections.map((collection) => (
                  <li key={collection.name} className="hover:underline">
                    <a
                      href={collection.path}
                      className="text-white hover:underline"
                    >
                      {collection.name}
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </li>
          <li className="pt-4 pb-2">
            <span className="text-gray-400">You</span>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white bg-green rounded-lg"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
              My Library
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
              </svg>
              Wish List
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Listen History
            </a>
          </li>
          <li className="pt-4 pb-2">
            <span className="text-gray-400">More</span>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              How to Listen
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              Need Help?
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white bg-green rounded-lg"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              Light
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white bg-green rounded-lg"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideNav;
