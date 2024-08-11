import React from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col bg-primary font-main">
      <Navbar />
      <div className="max-w-[420px] md:max-w-[1440px] mx-auto mt-12">
        <SideNav />
        <main className="lg:ml-80">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
