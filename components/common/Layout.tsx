// app/layout.tsx
"use client";

import React, { useEffect } from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Footer from "./Footer";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SessionProvider, useSession } from "next-auth/react";
import AuthProvider from "../Auth/AuthProvider";

// Utility function to check if token is expired
const isExpired = (jwtToken: string) => {
  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    const expired = payload.exp * 1000 < Date.now();
    console.log(
      `Checking token expiration: Expired=${expired}, Exp=${new Date(
        payload.exp * 1000
      ).toISOString()}`
    );
    return expired;
  } catch (e: any) {
    console.log("Invalid token detected, treating as expired:", e.message);
    return true; // Treat invalid token as expired
  }
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const syncSession = async () => {
      const localStorageSession = localStorage.getItem("session");
      console.log("Syncing session - Current NextAuth session:", {
        jwt: session?.jwt,
        status,
      });
      console.log(
        "LocalStorage session:",
        localStorageSession ? JSON.parse(localStorageSession) : null
      );

      if (
        localStorageSession &&
        (!session || !session.jwt || isExpired(session.jwt))
      ) {
        const parsedSession = JSON.parse(localStorageSession);
        console.log("Parsed localStorage session:", {
          jwt: parsedSession.jwt,
          refreshToken: parsedSession.refreshToken,
        });

        if (!isExpired(parsedSession.jwt)) {
          console.log(
            "Updating NextAuth session with valid localStorage token..."
          );
          await update(parsedSession);
          console.log("NextAuth session updated successfully.");
        } else {
          console.log("LocalStorage token is expired, skipping update.");
        }
      } else {
        console.log(
          "No sync needed: NextAuth session is valid or localStorage is empty."
        );
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
