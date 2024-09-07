import React from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col bg-primary font-main px-2 max-w-[420px] md:max-w-[1440px] mx-auto">
      <Navbar />
      <div className="mx-auto mt-14 py-6 w-full">
        <SideNav />
        <main className="lg:ml-64 mx-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
