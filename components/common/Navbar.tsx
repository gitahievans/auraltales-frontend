"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Loader, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Logo from "@/public/Images/Aural.png";
import adminIcon from "@/public/icons8-admin-24.png";
import apiClient from "@/lib/apiClient";
import { useValidSession } from "@/hooks/useValidSession";

// Components
import SignupForm from "../Auth/SignupModal";
import LoginForm from "../Auth/LoginModal";
import DynamicGreeting from "../DynamicGreeting";
import Search from "../Search";

// Icons
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

// Types
interface AudiobookItem {
  id: number;
  // Add other audiobook properties as needed
}

interface Category {
  id: number;
  name: string;
  audiobooks: AudiobookItem[];
}

interface Collection {
  id: number;
  name: string;
  audiobooks: AudiobookItem[];
}

interface NavbarProps {
  opened: boolean;
  toggle: () => void;
}

// Constants
const NAV_ITEMS = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/discover", label: "Discover", icon: IconHome },
  { href: "/library", label: "My Library", icon: IconLibrary },
  { href: "/wishlist", label: "Wish List", icon: IconHeart },
  { href: "/favorites", label: "Favorites", icon: IconStars },
] as const;

// Custom hooks
const useNavbarData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [categoriesRes, collectionsRes] = await Promise.all([
          apiClient.get("/api/categories/"),
          apiClient.get("/api/collections/"),
        ]);

        const filteredCategories =
          categoriesRes.data.categories?.filter(
            (category: Category) => category.audiobooks?.length > 0
          ) || [];

        const filteredCollections =
          collectionsRes.data.collections?.filter(
            (collection: Collection) => collection.audiobooks?.length > 0
          ) || [];

        setCategories(filteredCategories);
        setCollections(filteredCollections);
      } catch (error) {
        console.error("Error fetching navbar data:", error);
        setError("Failed to load navigation data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, collections, isLoading, error };
};

// Components
const DropdownMenu: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  items: Array<{ id: number; name: string }>;
  basePath: string;
}> = ({ icon: Icon, label, items, basePath }) => (
  <div className="relative group">
    <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white h-12">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      <IconChevronDown className="w-4 h-4" />
    </button>
    <div className="absolute left-0 mt-0 w-48 rounded-b-md shadow-lg bg-gray-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="py-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/${item.id}`}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const NavLink: React.FC<{
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname: string;
  onClick?: () => void;
  mobile?: boolean;
}> = ({ href, label, icon: Icon, pathname, onClick, mobile = false }) => {
  const isActive = pathname === href;

  if (mobile) {
    return (
      <Link
        href={href}
        className="block px-2 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
        onClick={onClick}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center space-x-1 text-sm font-medium h-12 border-b-2 ${
        isActive
          ? "text-green-400 border-green-400"
          : "text-gray-300 hover:text-white border-transparent"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

const UserMenu: React.FC<{ session: any; onLogout: () => void }> = ({
  session,
  onLogout,
}) => (
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
          {session?.user?.image ? (
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
      {session?.user?.is_staff && (
        <Menu.Item>
          <Link href="/admin" className="text-white flex items-center gap-2">
            <Image src={adminIcon} alt="admin" />
            <p className="font-bold">Admin Account</p>
          </Link>
        </Menu.Item>
      )}
      {session?.user?.is_author && (
        <Menu.Item>
          <Link href="/author" className="text-white flex items-center gap-2">
            <Image src={adminIcon} alt="admin" />
            <p className="font-bold">Author Account</p>
          </Link>
        </Menu.Item>
      )}
      <Menu.Item>
        <Link href="/profile" className="text-white flex items-center gap-2">
          <IconUserCircle className="w-6 h-6" color="green" />
          <p>Profile</p>
        </Link>
      </Menu.Item>
      <Menu.Item onClick={onLogout}>
        <div className="flex items-center gap-2">
          <IconLogout2 className="w-6 h-6" color="green" />
          <p className="text-white">Sign out</p>
        </div>
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

const AuthButtons: React.FC<{
  onOpenSignup: () => void;
  onOpenLogin: () => void;
}> = ({ onOpenSignup, onOpenLogin }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onOpenSignup}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hidden md:block"
    >
      Signup
    </button>
    <button
      onClick={onOpenLogin}
      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      Login
    </button>
  </div>
);

const MobileMenu: React.FC<{
  categories: Category[];
  collections: Collection[];
  pathname: string;
  onToggle: () => void;
}> = ({ categories, collections, pathname, onToggle }) => (
  <div className="md:hidden h-screen">
    {/* Mobile Search */}
    <div className="p-4 border-b border-gray-800">
      <Search toggle={onToggle} />
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
            onClick={onToggle}
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
            onClick={onToggle}
          >
            {collection.name}
          </Link>
        ))}
      </div>

      {/* Main Navigation */}
      <div className="py-2 border-t border-gray-800">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            pathname={pathname}
            onClick={onToggle}
            mobile
          />
        ))}
      </div>
    </div>
  </div>
);

// Main Component
const Navbar: React.FC<NavbarProps> = ({ opened, toggle }) => {
  const pathname = usePathname();
  const { categories, collections, isLoading: dataLoading } = useNavbarData();
  const { isAuthenticated, session, status } = useValidSession();

  const [openedSignup, { open: openSignup, close: closeSignup }] =
    useDisclosure();
  const [openedLogin, { open: openLogin, close: closeLogin }] = useDisclosure();

  const isAuthLoading = status === "loading";

  const handleLogout = useCallback(async () => {
    try {
      await signOut({
        callbackUrl: "/?logout=true",
        redirect: true,
      });
      localStorage.removeItem("session");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(
    () => NAV_ITEMS.map((item) => ({ ...item, pathname })),
    [pathname]
  );

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
              <button
                onClick={toggle}
                className="text-white p-2"
                aria-label="Toggle menu"
              >
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
                <Image
                  src={Logo}
                  alt="AuralTales"
                  width={96}
                  height={96}
                  className="h-auto w-24"
                  priority
                />
              </Link>
            </div>

            {/* Search Bar on desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <Search />
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center">
              {isAuthLoading ? (
                <Loader type="bars" color="green" size="sm" />
              ) : isAuthenticated ? (
                <UserMenu session={session} onLogout={handleLogout} />
              ) : (
                <AuthButtons
                  onOpenSignup={openSignup}
                  onOpenLogin={openLogin}
                />
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
              <DropdownMenu
                icon={IconBooks}
                label="Browse"
                items={categories}
                basePath="/audiobooks/categories"
              />

              {/* Collections Dropdown */}
              <DropdownMenu
                icon={IconLayoutGrid}
                label="Collections"
                items={collections}
                basePath="/audiobooks/collections"
              />

              {/* Regular Nav Items */}
              {navigationItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {opened && (
        <MobileMenu
          categories={categories}
          collections={collections}
          pathname={pathname}
          onToggle={toggle}
        />
      )}
    </header>
  );
};

export default Navbar;
