"use client";

import { NavLinks } from "@/Constants/Navlinks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconMenu2 } from "@tabler/icons-react";
import { sideNavState } from "@/state/state";

const Navbar = () => {
  const router = useRouter();
  const inactiveLinkStyles =
    "px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium hover:bg-gray-200 border-b-2 border-b-transparent rounded-3xl  transition-all duration-500";
  const activeLinkStyles = `border-b-2 border-b-accent-color px-3 lg:px-6 py-2 text-sm lg:text-lg font-medium transition-all duration-500 `;

  const handleMenuClick = () => {
    console.log('menu clicked');
    sideNavState.open = !sideNavState.open
  }


  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex flex-col w-full text-white max-w-[420px] md:max-w-[1440px] bg-primary">
      <section className="flex items-center justify-between py-2">
        <Link href="/" className="flex gap-1 items-center">
          {/* <Image src={Logo} alt="logo" className="h-12 w-16 rounded-2xl" /> */}
          <IconMenu2 size={40} onClick={handleMenuClick} />
          <h1 className="text-xl md:text-4xl font-semibold text-accent-color">
            Afrobyte
          </h1>
        </Link>
        {/* <MobileNav /> */}
        <div className="lg:flex hidden gap-4 xl:gap-7">
          {NavLinks.map((link) => {
            return (
              <Link
                href={link.href}
                key={link.id}
                className={
                  router.pathname === link.href
                    ? activeLinkStyles
                    : inactiveLinkStyles
                }
              >
                {link.text}
              </Link>
            );
          })}
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
