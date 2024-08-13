import React from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col bg-primary font-main px-2">
      <Navbar />
      <div className="max-w-[420px] md:max-w-[1440px] mx-auto mt-14 py-6">
        <SideNav />
        <main className="lg:ml-72 mx-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
