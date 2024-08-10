import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SideNav from "@/components/common/SideNav";

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
          <div className="space-y-4 min-h-screen p-4 font-main lg:p-0 bg-primary text-white">
            <Navbar />
            <div className="flex mx-auto max-w-[420px] md:max-w-7xl min-h-[100dvh] border">
              <SideNav />
              <main className="w-full">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
