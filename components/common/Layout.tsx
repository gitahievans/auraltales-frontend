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
import { useValidSession } from "@/hooks/useValidSession";

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
  const { isAuthenticated, session, status, update } = useValidSession();

  useEffect(() => {
    const syncSession = async () => {
      try {
        const localStorageSession = localStorage.getItem("session");

        if (
          status === "authenticated" &&
          session?.jwt &&
          isExpired(session?.jwt)
        ) {
          console.log("Session token expired, attempting to refresh...");

          if (session.refreshToken) {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/accounts/token/refresh`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    refresh: session.refreshToken,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                console.log("Token refreshed successfully", data);

                await update({
                  ...session,
                  jwt: data.access,
                  refreshToken: data.refresh,
                });
              } else {
                console.log("Token refresh failed, signing out");
                localStorage.removeItem("session");
                window.location.href = "/";
              }
            } catch (error) {
              console.log("Error refreshing token:", error);
              localStorage.removeItem("session");
              window.location.href = "/";
            }
          }
        } else if (status === "unauthenticated" && localStorageSession) {
          console.log("Remove stale localStorage session");
          localStorage.removeItem("session");
        }
      } catch (error) {
        console.error("Session sync error:", error);
      }
    };

    syncSession();

    const intervalId = setInterval(syncSession, 60000);

    return () => clearInterval(intervalId);
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
