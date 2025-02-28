"use client";

import React, { useEffect } from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Footer from "./Footer";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SessionProvider, useSession } from "next-auth/react";
import AuthProvider from "../Auth/AuthProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const syncSession = async () => {
      const localSession = localStorage.getItem("session");
      if (localSession && !session) {
        await update({ jwt: JSON.parse(localSession)?.jwt });
      }
    };
    syncSession();
  }, [session, status, update]);

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <div className="flex flex-col bg-primary font-main min-h-screen">
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { desktop: true, mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header withBorder={false}>
              <Navbar opened={opened} toggle={toggle} />
            </AppShell.Header>

            <AppShell.Main>
              <div className="max-w-7xl mx-auto w-full md:pt-14">
                {children}
              </div>
              <Footer />
            </AppShell.Main>
          </AppShell>
        </div>
      </AuthProvider>
    </SessionProvider>
  );
};

export default Layout;
