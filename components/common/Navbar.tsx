"use client";

import { NavLinks } from "@/Constants/Navlinks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconBell,
  IconHeart,
  IconMenu2,
  IconSearch,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";
import { sideNavState, userState } from "@/state/state";
import { useMediaQuery } from "@mantine/hooks";
import { useSnapshot } from "valtio";
import SideNav from "./SideNav";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Menu } from "@mantine/core";

const Navbar = () => {
  const router = useRouter();

  const userStateSnap = useSnapshot(userState);
  const { isLoggedIn } = userStateSnap;

  const { data: session } = useSession();

  console.log("session", session);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    userState.isLoggedIn = false;
    router.push("auth/login");
  };

  const isMobile = useMediaQuery("(max-width: 1120px)");

  return (
    <section className="flex items-center justify-between py-2 text-white bg-primary">
      <div className="flex gap-1 items-center">
        <Link
          href="/"
          className="text-xl md:text-4xl font-semibold text-accent-color"
        >
          SoundLeaf
        </Link>
      </div>
      {!isMobile && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search for your favorite audiobook"
            className="w-full bg-[#344639] text-white placeholder-gray-400 py-2 px-4 pr-10 rounded-lg"
          />
          <IconSearch
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      )}
      <div className="flex items-center space-x-4">
        {/* <div className="hidden md:block">
          <button className="p-2 rounded-xl bg-gray-700 text-white">
            <IconBell size={20} />
          </button>
        </div> */}
        {!session || !session.user ? (
          <>
            <Link
              href="/auth/signup"
              className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold"
            >
              Signup
            </Link>
            <Link
              href="/auth/login"
              className="bg-gray-700 text-white py-2 px-4 rounded-lg font-bold"
            >
              Login
            </Link>
          </>
        ) : (
          <Menu
            trigger="hover"
            openDelay={100}
            closeDelay={400}
            position="bottom-end"
          >
            <Menu.Target>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 border border-tertiary">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <IconUserFilled />
                )}
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Link href="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/profile">Settings</Link>
              </Menu.Item>
              <Menu.Item>
                <button onClick={() => signOut()}>Logout</button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </section>
  );
};

export default Navbar;
