// app/UnauthorizedNotification.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

export default function UnauthorizedNotification() {
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("unauthorized");

  useEffect(() => {
    if (unauthorized) {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in to access this page.",
        color: "red",
        position: "top-center",
      });
    }
  }, [unauthorized]);

  return null; 
}
