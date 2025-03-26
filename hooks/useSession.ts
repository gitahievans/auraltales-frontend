// hooks/useAuthSession.ts
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useAuthSession = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    }
  }, [session]);

  return session;
};
