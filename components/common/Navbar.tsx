"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBooks,
  IconLayoutGrid,
  IconHome,
  IconLibrary,
  IconHeart,
  IconSearch,
  IconUserCircle,
  IconMenu2,
  IconX,
  IconChevronDown,
  IconStars,
  IconLogout2,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Loader, Menu } from "@mantine/core";
import apiClient from "@/lib/apiClient";
import SignupForm from "../Auth/SignupForm";
import { useDisclosure } from "@mantine/hooks";
import LoginForm from "../Auth/LoginForm";
import DynamicGreeting from "../DynamicGreeting";
import adminIcon from "../../public/icons8-admin-24.png";

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

const Navbar = ({
  opened,
  toggle,
}: {
  opened: boolean;
  toggle: () => void;
}) => {
  const pathname = usePathname();
  const { status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [openedSignup, { open: openSignup, close: closeSignup }] =
    useDisclosure();
  const [openedLogin, { open: openLogin, close: closeLogin }] = useDisclosure();
  const isLoading = status === "loading";
  const { data: session } = useSession();

  console.log("session in Navbar", session);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, collectionsRes] = await Promise.all([
          apiClient.get("/api/categories/"),
          apiClient.get("/api/collections/"),
        ]);

        if (categoriesRes.status === 200) {
          const filteredCategories = categoriesRes.data.categories.filter(
            (category: Category) =>
              category.audiobooks && category.audiobooks.length > 0
          );
          setCategories(filteredCategories);
        }

        if (collectionsRes.status === 200) {
          const filteredCollections = collectionsRes.data.collections.filter(
            (collection: Collection) =>
              collection.audiobooks && collection.audiobooks.length > 0
          );
          setCollections(filteredCollections);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut();

    localStorage.removeItem("session");
  };

  return (
    <header className="bg-primary">
      <SignupForm
        opened={openedSignup}
        close={closeSignup}
        openLogin={openLogin}
      />
      <LoginForm
        opened={openedLogin}
        close={closeLogin}
        openSignup={openSignup}
      />

      {/* Top Section - Logo, Search, and Auth */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-2">
          <div className="flex items-center justify-between h-full">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggle} className="text-white p-2">
                {opened ? (
                  <IconX className="w-6 h-6" />
                ) : (
                  <IconMenu2 className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center flex-shrink-0">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  SoundLeaf
                </span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-12">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search audiobooks"
                  className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center">
              {isLoading ? (
                <Loader color="green" size="sm" />
              ) : !session ? (
                <div className="flex items-center space-x-2">
                  <div
                    onClick={openSignup}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hidden md:block cursor-pointer"
                  >
                    Signup
                  </div>
                  <div
                    onClick={openLogin}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                  >
                    Login
                  </div>
                </div>
              ) : (
                <Menu
                  position="bottom-end"
                  shadow="xl"
                  width={300}
                  styles={{
                    dropdown: {
                      backgroundColor: "#041714",
                    },
                  }}
                >
                  <Menu.Target>
                    <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                      <div className="w-8 h-8 border border-gray-700 rounded-full flex items-center justify-center">
                        {session && session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <IconUserCircle className="w-6 h-6" />
                        )}
                      </div>
                    </button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <DynamicGreeting />
                    {session && session?.user?.is_staff && (
                      <Menu.Item>
                        <Link
                          href="/admin"
                          className="text-white flex items-center gap-2"
                        >
                          <Image src={adminIcon} alt="admin" />
                          <p className="font-bold">Admin Account</p>
                        </Link>
                      </Menu.Item>
                    )}
                    {session && session?.user?.is_author && (
                      <Menu.Item>
                        <Link
                          href="/author"
                          className="text-white flex items-center gap-2"
                        >
                          <Image src={adminIcon} alt="admin" />
                          <p className="font-bold">Author Account</p>
                        </Link>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <Link
                        href="/profile"
                        className="text-white flex items-center gap-2"
                      >
                        <IconUserCircle className="w-6 h-6" color="green" />
                        <p>Profile</p>
                      </Link>
                    </Menu.Item>
                    <Menu.Item onClick={handleLogout}>
                      <div className="flex items-center gap-2">
                        <IconLogout2 className="w-6 h-6" color="green" />
                        <p className="text-white">Sign out</p>
                      </div>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Navigation */}
      <div className="hidden md:block border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Browse Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white h-12">
                  <IconBooks className="w-5 h-5" />
                  <span>Browse</span>
                  <IconChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute left-0 mt-0 w-48 rounded-b-md shadow-lg bg-gray-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/audiobooks/categories/${category.id}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collections Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white h-12">
                  <IconLayoutGrid className="w-5 h-5" />
                  <span>Collections</span>
                  <IconChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute left-0 mt-0 w-48 rounded-b-md shadow-lg bg-gray-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {collections.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/audiobooks/collections/${collection.id}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        {collection.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regular Nav Items */}
              <Link
                href="/"
                className={`flex items-center space-x-1 text-sm font-medium h-12 border-b-2 ${
                  pathname === "/"
                    ? "text-green-400 border-green-400"
                    : "text-gray-300 hover:text-white border-transparent"
                }`}
              >
                <IconHome className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/library"
                className={`flex items-center space-x-1 text-sm font-medium h-12 border-b-2 ${
                  pathname === "/library"
                    ? "text-green-400 border-green-400"
                    : "text-gray-300 hover:text-white border-transparent"
                }`}
              >
                <IconLibrary className="w-5 h-5" />
                <span>My Library</span>
              </Link>

              <Link
                href="/wishlist"
                className={`flex items-center space-x-1 text-sm font-medium h-12 border-b-2 ${
                  pathname === "/wishlist"
                    ? "text-green-400 border-green-400"
                    : "text-gray-300 hover:text-white border-transparent"
                }`}
              >
                <IconHeart className="w-5 h-5" />
                <span>Wish List</span>
              </Link>

              <Link
                href="/favorites"
                className={`flex items-center space-x-1 text-sm font-medium h-12 border-b-2 ${
                  pathname === "/favorites"
                    ? "text-green-400 border-green-400"
                    : "text-gray-300 hover:text-white border-transparent"
                }`}
              >
                <IconStars className="w-5 h-5" />
                <span>Favorites</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {opened && (
        <div className="md:hidden h-screen">
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Search audiobooks"
                className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="px-4 py-2">
            {/* Browse Section */}
            <div className="py-2">
              <div className="text-sm font-semibold text-gray-400 px-2 pb-2">
                Browse
              </div>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/audiobooks/categories/${category.id}`}
                  className="block px-2 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                  onClick={toggle}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Collections Section */}
            <div className="py-2 border-t border-gray-800">
              <div className="text-sm font-semibold text-gray-400 px-2 pb-2">
                Collections
              </div>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/audiobooks/collections/${collection.id}`}
                  className="block px-2 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                  onClick={toggle}
                >
                  {collection.name}
                </Link>
              ))}
            </div>

            {/* Main Navigation */}
            <div className="py-2 border-t border-gray-800">
              <Link
                href="/"
                className="block px-2 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                onClick={toggle}
              >
                <div className="flex items-center space-x-2">
                  <IconHome className="w-5 h-5" />
                  <span>Home</span>
                </div>
              </Link>
              <Link
                href="/library"
                className="block px-2 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                onClick={toggle}
              >
                <div className="flex items-center space-x-2">
                  <IconLibrary className="w-5 h-5" />
                  <span>My Library</span>
                </div>
              </Link>
              <Link
                href="/wishlist"
                className="block px-2 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                onClick={toggle}
              >
                <div className="flex items-center space-x-2">
                  <IconHeart className="w-5 h-5" />
                  <span>Wish List</span>
                </div>
              </Link>
              <Link
                href="/favorites"
                className="block px-2 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                onClick={toggle}
              >
                <div className="flex items-center space-x-2">
                  <IconStars className="w-5 h-5" />
                  <span>Favorites</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
