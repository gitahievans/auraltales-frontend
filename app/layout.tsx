import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import SessionWrapper from "@/components/SessionWrapper";
import { LayoutWrapper } from "@/components/LayoutWrapper";
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
      <body className={`${inter.className} bg-primary`}>
        {" "}
        <MantineProvider>
          <SessionWrapper>
            <Notifications />
            <LayoutWrapper>{children}</LayoutWrapper>
          </SessionWrapper>
        </MantineProvider>
      </body>
    </html>
  );
}
