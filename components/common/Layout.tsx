"use client";

import React from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Footer from "./Footer";
import { AppShell, Burger, Button } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconMenu2, IconMenu3 } from "@tabler/icons-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMedium = useMediaQuery("(max-width: 1023px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex flex-col bg-primary font-main px-2 max-w-[420px] md:max-w-[1440px] mx-auto">
      {/* <div className="mx-auto flex flex-col items-center mt-14 py-6 w-full">
        <SideNav />
        <Navbar />
        <main className="mx-auto">{children}</main>
        <Footer />
      </div> */}
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 250,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        styles={{
          main: {
            background: "#041714",
          },
        }}
      >
        <AppShell.Header withBorder={false}>
          <div className="flex items-center w-full h-full bg-primary px-2">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
              color="white"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
              color="white"
            />
            <div className="w-full px-2">
              <Navbar />
            </div>
          </div>
        </AppShell.Header>
        <AppShell.Navbar withBorder={false}>
          <SideNav />
        </AppShell.Navbar>
        <AppShell.Main>
          <main className="mx-auto">{children}</main>
          <Footer />
        </AppShell.Main>
      </AppShell>
    </div>
  );
};

export default Layout;
