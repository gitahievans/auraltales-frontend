// app/layout.tsx (or wherever your Layout component is located)
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
      const localStorageSession = localStorage.getItem("session");

      // If there's a session in localStorage but no active Next-Auth session
      if (localStorageSession && (!session || !session.jwt)) {
        const parsedSession = JSON.parse(localStorageSession);

        // Check if localStorage session already has the correct structure
        if (!parsedSession?.user) {
          // Convert to the correct structure if needed
          const structuredSession: typeof session = {
            user: {
              id: parsedSession?.id || "",
              firstName: parsedSession?.firstName || "",
              lastName: parsedSession?.lastName || "",
              email: parsedSession?.email || "",
              phoneNumber: parsedSession?.phoneNumber || "",
              image: parsedSession?.image || undefined,
              name: parsedSession?.name || undefined,
              is_staff: parsedSession?.is_staff || false,
              is_active: parsedSession?.is_active || false,
              is_author: parsedSession?.is_author || false,
              date_joined:
                parsedSession?.date_joined || new Date().toISOString(),
            },
            expires: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            jwt: parsedSession?.jwt || "",
            refreshToken: parsedSession?.refreshToken || "",
          };

          // Save the correctly structured session to localStorage
          localStorage.setItem("session", JSON.stringify(structuredSession));

          // Update Next-Auth session
          await update(structuredSession);
        } else {
          // If the structure is already correct, just update Next-Auth
          await update(parsedSession);
        }
      } else if (session && session.jwt) {
        // If Next-Auth session exists but localStorage needs updating
        localStorage.setItem("session", JSON.stringify(session));
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

            {/* <AppShell.Navbar>
              <SideNav />
            </AppShell.Navbar> */}

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
