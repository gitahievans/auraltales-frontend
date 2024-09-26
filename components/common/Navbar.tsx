"use client";

import { NavLinks } from "@/Constants/Navlinks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell, IconHeart, IconMenu2, IconUser } from "@tabler/icons-react";
import { sideNavState, userState } from "@/state/state";
import { useMediaQuery } from "@mantine/hooks";
import { useSnapshot } from "valtio";

const Navbar = () => {
  const router = useRouter();

  const userStateSnap = useSnapshot(userState);
  const { isLoggedIn } = userStateSnap;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    userState.isLoggedIn = false;
    router.push("auth/login");
  };

  const inactiveLinkStyles =
    "px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium hover:bg-gray-200 border-b-2 border-b-transparent rounded-3xl  transition-all duration-500";
  const activeLinkStyles = `border-b-2 border-b-accent-color px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium transition-all duration-500 `;

  const handleMenuClick = () => {
    console.log("menu clicked");
    sideNavState.open = !sideNavState.open;
  };
  const isMobile = useMediaQuery("(max-width: 1120px)");

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex flex-col w-full text-white bg-primary px-2">
      <section className="flex items-center justify-between py-2">
        <Link href="/" className="flex gap-1 items-center">
          {/* <Image src={Logo} alt="logo" className="h-12 w-16 rounded-2xl" /> */}
          {isMobile && <IconMenu2 size={40} onClick={handleMenuClick} />}
          <h1 className="text-xl md:text-4xl font-semibold text-accent-color">
            SoundLeaf
          </h1>
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for your favorite audiobook"
            className="w-full bg-[#344639] text-white placeholder-gray-400 py-2 px-4 pr-10 rounded-lg"
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
        <div className="hidden md:flex items-center space-x-4">

          <div className="">
            <button className="p-2 rounded-xl bg-gray-700 text-white">
              <IconBell size={20} />
            </button>

          </div>

          <Link href="/auth/signup" className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold">
            Signup
          </Link>
          {!isLoggedIn ? (
            <Link href="/auth/login" className="bg-gray-700 text-white py-2 px-4 rounded-lg font-bold">
              Login
            </Link>) : (
            <button onClick={handleLogout} className="bg-gray-700 text-white py-2 px-4 rounded-lg font-bold">
              Logout
            </button>
          )}
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
