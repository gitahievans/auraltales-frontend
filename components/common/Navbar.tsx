"use client";

import { NavLinks } from "@/Constants/Navlinks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell, IconHeart, IconMenu2, IconUser } from "@tabler/icons-react";
import { sideNavState } from "@/state/state";
import { useMediaQuery } from "@mantine/hooks";

const Navbar = () => {
  const router = useRouter();
  const inactiveLinkStyles =
    "px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium hover:bg-gray-200 border-b-2 border-b-transparent rounded-3xl  transition-all duration-500";
  const activeLinkStyles = `border-b-2 border-b-accent-color px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium transition-all duration-500 `;

  const handleMenuClick = () => {
    console.log("menu clicked");
    sideNavState.open = !sideNavState.open;
  };
  const isMobile = useMediaQuery("(max-width: 1120px)");

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex flex-col w-full text-white max-w-[420px] md:max-w-3xl xl:max-w-[1440px] bg-primary">
      <section className="flex items-center justify-between py-2">
        <Link href="/" className="flex gap-1 items-center">
          {/* <Image src={Logo} alt="logo" className="h-12 w-16 rounded-2xl" /> */}
          {isMobile && <IconMenu2 size={40} onClick={handleMenuClick} />}
          <h1 className="text-xl md:text-4xl font-semibold text-accent-color">
            Afrobyte
          </h1>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-white hidden md:block">
            Good Morning, Evans!
          </span>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-gray-700 text-white">
              <IconBell size={20} />
            </button>
            <button className="p-2 rounded-xl bg-gray-700 text-white">
              <IconUser size={20} />
            </button>
            <button className="p-2 rounded-xl bg-gray-700 text-white">
              <IconHeart size={20} />
            </button>
          </div>

          <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold">
            Signup
          </button>
          <button className="bg-gray-700 text-white py-2 px-4 rounded-lg font-bold">
            Login
          </button>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
