import { Disc3, Twitter, Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#041714] text-white py-12 px-6 shadow-lg border-t border-t-gray-600">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-3 mb-4">
            <Disc3 className="text-green-400" size={40} />
            <h2 className="text-2xl font-bold text-white">AuralTales</h2>
          </div>
          <p className="text-sm text-gray-300 text-center md:text-left max-w-xs">
            Discover and Enjoy Audiobooks Anytime, Anywhere.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:mx-auto">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", link: "/" },
                { name: "Wishlist", link: "/wishlist" },
                { name: "My Library", link: "/library" },
                { name: "Favourites", link: "/favorites" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="text-gray-300 font-light hover:text-white transition-colors duration-200 ease-in-out block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Support & Legal
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Privacy Policy", link: "/privacy" },
                { name: "Terms of Service", link: "/terms" },
                { name: "FAQ", link: "/faq" },
                { name: "Help Center", link: "/help" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="text-gray-300 font-light hover:text-white transition-colors duration-200 ease-in-out block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <div className="flex space-x-4">
            {[
              { Icon: Twitter, href: "#" },
              { Icon: Facebook, href: "#" },
              { Icon: Instagram, href: "#" },
            ].map(({ Icon, href }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Icon size={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-8 text-center border-t border-gray-600 pt-6">
        <p className="text-sm text-gray-400">
          &copy; 2025 AuralTales. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
