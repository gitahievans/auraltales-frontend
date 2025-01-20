"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconBell,
  IconHeart,
  IconLogout,
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
import { Menu, rem } from "@mantine/core";
import React from "react";

const Navbar = () => {
  const router = useRouter();

  const userStateSnap = useSnapshot(userState);
  const { isLoggedIn } = userStateSnap;

  const { data: session } = useSession();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    signOut();
    userState.isLoggedIn = false;
  };

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMedium = useMediaQuery("(max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return (
    <section className="flex items-center justify-between py-2 text-white bg-primary mx-auto">
      <div className="flex gap-1 items-center">
        <Link
          href="/"
          className="text-xl md:text-4xl font-semibold text-accent-color"
        >
          SoundLeaf
        </Link>
      </div>
      {isDesktop && (
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
            openDelay={100}
            closeDelay={400}
            position="bottom"
            shadow="xl"
            width={170}
            withArrow
            transitionProps={{ transition: "fade-up", duration: 150 }}
            styles={{
              dropdown: {
                backgroundColor: "#041714",
              },
              item: {
                color: "#22C55E",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              },
            }}
          >
            <Menu.Target>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-700 border border-tertiary">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="profile"
                      width={isMobile ? 30 : 40}
                      height={isMobile ? 30 : 40}
                      className="rounded-full"
                    />
                  ) : (
                    <IconUserFilled size={isMobile ? 30 : 40} />
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base md:text-lg font-semibold">
                    {`${session.user?.name}` ||
                      `${session.user?.firstName} ${session.user?.lastName}`}
                  </h3>
                  <p className="text-xs md:text-sm">{session.user?.email}</p>
                </div>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconUserFilled style={{ width: rem(14), height: rem(14) }} />
                }
              >
                <Link href="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(14), height: rem(14) }} />
                }
              >
                <button onClick={handleLogout}>Logout</button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </section>
  );
};

export default Navbar;
