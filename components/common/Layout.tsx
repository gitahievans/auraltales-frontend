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

  return (
    <div className="flex flex-col bg-primary font-main px-2 mx-auto">
      
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
          <div className="flex items-center h-full bg-primary px-2">
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
            <div className="w-full mx-auto px-2">
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
