import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SideNav from "@/components/common/SideNav";
import Layout from "@/components/common/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoundLeaf",
  description: "Feel the Voice in every Leaf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {" "}
        <MantineProvider>
          <Layout>{children}</Layout>
        </MantineProvider>
      </body>
    </html>
  );
}
