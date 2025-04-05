/* eslint-disable react-hooks/exhaustive-deps */
// hooks/useValidSession.js
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function useValidSession() {
  const { data: session, status, update } = useSession();

  const isTokenExpired = () => {
    if (!session?.jwt) return true;
    try {
      const payload = JSON.parse(atob(session.jwt.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  };

  const isAuthenticated =
    status === "authenticated" && !!session?.jwt && !isTokenExpired();

  useEffect(() => {
    // Try to refresh token if it's expired
    const checkAndRefreshToken = async () => {
      if (session?.jwt && isTokenExpired() && session.refreshToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
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
            await update({
              ...session,
              jwt: data.access,
              refreshToken: data.refresh,
            });
          } else {
            // Force logout if refresh fails
            localStorage.removeItem("session");
            window.location.href = "/";
          }
        } catch (error) {
          localStorage.removeItem("session");
          window.location.href = "/";
        }
      }
    };

    checkAndRefreshToken();
  }, [session, update]);

  return { isAuthenticated, session, status, update };
}
