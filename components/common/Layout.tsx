"use client";

import React from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Footer from "./Footer";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Save session to localStorage when it changes
    if (session) {
      console.log("Saving session to localStorage:", session);
      localStorage.setItem("session", JSON.stringify(session));
    } else if (status === "unauthenticated") {
      // Clear session from localStorage when user is not authenticated
      console.log("Clearing session from localStorage");
      localStorage.removeItem("session");
    }
  }, [session, status]);

  // Optional: Load session from localStorage on initial render
  // useEffect(() => {
  //   const savedSession = localStorage.getItem("session");
  //   if (savedSession && !session) {
  //     console.log(
  //       "Found saved session in localStorage:",
  //       JSON.parse(savedSession)
  //     );
  //   }
  // }, []);

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col bg-primary font-main max-w-7xl mx-auto">
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
            <div className="flex items-center h-full bg-primary px-2 w-full">
              <div className="max-w-7xl w-full mx-auto flex items-center">
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
    </SessionProvider>
  );
};

export default Layout;
