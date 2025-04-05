// hooks/useAuthSession.ts
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useValidSession } from "./useValidSession";

export const useAuthSession = () => {
  const { isAuthenticated, session, status } = useValidSession();

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    }
  }, [session]);

  return session;
};
