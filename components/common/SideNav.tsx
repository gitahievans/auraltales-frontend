"use client";

import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { sideNavState } from "@/state/state";
import Image from "next/image";
import avatar from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_v8c5gbv8c5gbv8c5.jpeg";
import {
  IconBooks,
  IconChevronDown,
  IconChevronUp,
  IconMist,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const SideNav = () => {
  const sideBarSnap = useSnapshot(sideNavState);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isListsOpen, setIsListsOpen] = useState(false);
  const { open } = sideBarSnap;

  const { data: session } = useSession();

  const inactiveLinkStyles =
    "px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium hover:bg-gray-200 border-b-2 border-b-transparent rounded-3xl  transition-all duration-500";
  const activeLinkStyles = `border-b-2 border-b-accent-color px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium transition-all duration-500 `;

  const browseCategories = [
    { name: "Fiction", path: "/audiobooks/fiction" },
    { name: "Non-Fiction", path: "/audiobooks/non-fiction" },
    { name: "Sci-Fi", path: "/audiobooks/sci-fi" },
    { name: "Romance", path: "/audiobooks/romance" },
  ];

  const listCollections = [
    { name: "New Releases", path: "new-releases" },
    { name: "Best Sellers", path: "best-sellers" },
    { name: "Editor's Picks", path: "editor-picks" },
  ];

  return (
    <div className="bg-primary h-full p-2">
      <div className="flex items-center gap-4">
        <span className="text-white hidden md:block">Good Morning, Evans!</span>
        <div className="bg-slate-400 w-10 h-10 flex items-center justify-center rounded-full">
          <Image src={avatar} alt="user" className="rounded-full" />
        </div>
      </div>
      <nav className="text-sm lg:text-base h-full">
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
                <IconBooks className="mr-2" />
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
                className="overflow-hidden pl-8 mt-2 space-y-2"
              >
                {browseCategories.map((category) => (
                  <li key={category.name} className="hover:underline">
                    <Link
                      href={`/audiobooks/categories/${category.name.toLowerCase()}`}
                      className="text-white hover:underline"
                    >
                      {category.name}
                    </Link>
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
                <IconMist className="mr-2" />
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
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="overflow-hidden pl-8 mt-2 space-y-2"
              >
                {listCollections.map((collection) => (
                  <li key={collection.name} className="hover:underline">
                    <Link
                      href={`/audiobooks/collections/${collection.path}`}
                      className="text-white"
                    >
                      {collection.name}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </li>
          <li className="pt-4 pb-2">
            <span className="text-gray-400">You</span>
          </li>
          <li>
            <Link
              href="/"
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
            </Link>
          </li>
          <li>
            <Link
              href="/library"
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
            </Link>
          </li>
          <li>
            <Link
              href="/wishlist"
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
            </Link>
          </li>
          <li>
            <Link
              href="/history"
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
            </Link>
          </li>
          <li className="pt-4 pb-2">
            <span className="text-gray-400">More</span>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              How to Listen
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              Need Help?
            </Link>
          </li>
          {session && session.user && (
            <li>
              <div
                onClick={() => signOut()}
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
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
