"use client";

import { usePathname } from "next/navigation";
import Layout from "./common/Layout";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return children;
  }

  return <Layout>{children}</Layout>;
};
