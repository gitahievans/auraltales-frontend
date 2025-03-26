// components/AuthProvider.js
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only run on client side and when we have a session
    if (typeof window !== "undefined" && session?.jwt) {
      // Store session in localStorage
      localStorage.setItem(
        "session",
        JSON.stringify({
          jwt: session.jwt,
          refreshToken: session.refreshToken,
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          phoneNumber: session.user.phoneNumber,
          is_staff: session.user.is_staff,
          is_active: session.user.is_active,
          date_joined: session.user.date_joined,
        })
      );
    }
  }, [session]);

  return children;
}
