"use client";

import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { sideNavState } from "@/state/state";
import Image from "next/image";
import avatar from "@/public/Images/soundleaf-files/posters/Gemini_Generated_Image_v8c5gbv8c5gbv8c5.jpeg";
import {
  IconBooks,
  IconChevronDown,
  IconChevronUp,
  IconHistory,
  IconHomeStar,
  IconLayoutGridAdd,
  IconLibrary,
  IconLogout2,
  IconMist,
  IconStars,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { log } from "console";
import { WishlistItem } from "@/app/wishlist/page";
import { fetchWishlist } from "@/lib/store";
import axiosInstance from "@/lib/axiosInstance";

type Category = {
  id: number;
  name: string;
  audiobooks: [];
};

type Collection = {
  id: number;
  name: string;
  audiobooks: [];
};

const SideNav = () => {
  const sideBarSnap = useSnapshot(sideNavState);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isListsOpen, setIsListsOpen] = useState(false);
  const { open } = sideBarSnap;
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[] | null>(
    null
  );
  const { data: session } = useSession();

  const fetchCollections = async () => {
    try {
      const response = await axiosInstance.get("/api/collections/");

      if (response.status === 200) {
        const filteredCollections = response.data.collections.filter(
          (collection: Collection) =>
            collection.audiobooks && collection.audiobooks.length > 0
        );
        setCollections(filteredCollections);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/categories/");

      if (response.status === 200) {
        const filteredCategories = response.data.categories.filter(
          (category: Category) =>
            category.audiobooks && category.audiobooks.length > 0
        );
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const items = await fetchWishlist();
        setWishlistItems(items);
      } catch (err) {
        console.log(err);
      }
    };

    if (session?.jwt) {
      loadWishlist();
    }
  }, [session?.jwt]);

  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, []);

  // console.log("collections", collections, "categories", categories);

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
                {categories?.map((category: Category) => (
                  <li key={category.name} className="hover:underline">
                    <Link
                      href={`/audiobooks/categories/${category.id}`}
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
                {collections?.map((collection: Collection) => (
                  <li key={collection?.name} className="hover:underline">
                    <Link
                      href={`/audiobooks/collections/${collection.id}`}
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
              <IconHomeStar className="mr-2" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/library"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              <IconLibrary className="mr-2" />
              My Library
            </Link>
          </li>
          <li>
            <Link
              href="/wishlist"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              <IconLayoutGridAdd className="mr-2" />
              Wish List
              {/* {wishlistItems && wishlistItems.length > 0 && (
                <div className="flex items-center justify-center bg-green-200 rounded-full ml-2 h-4 w-4">
                  <span className="text-[10px] font-bold text-black ">
                    {wishlistItems.length}
                  </span>
                </div>
              )} */}
            </Link>
          </li>

          {/* favorites */}
          <li>
            <Link
              href="/favorites"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              <IconStars className="w-6 h-6 mr-2" />
              Favorites
            </Link>
          </li>

          <li>
            <Link
              href="/history"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              <IconHistory className="mr-2" />
              Listen History
            </Link>
          </li>
          {/* <li className="pt-4 pb-2">
            <span className="text-gray-400">More</span>
          </li> */}
          {/* <li>
            <Link
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              How to Listen
            </Link>
          </li> */}
          {/* <li>
            <Link
              href="#"
              className="flex items-center p-2 text-white rounded-lg hover:bg-green"
            >
              Need Help?
            </Link>
          </li> */}
          {session && session.user && (
            <li>
              <div
                onClick={() => signOut()}
                className="flex items-center p-2 text-white bg-green rounded-lg cursor-pointer"
              >
                <IconLogout2 className="mr-2" />
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
