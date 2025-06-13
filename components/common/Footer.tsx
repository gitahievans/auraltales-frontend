import { Disc3, Shield, FileText } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#041714] to-[#0a2520] text-white py-16 px-6 mt-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-400/5 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Brand Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center space-x-4 mb-6 group">
              <div className="relative">
                <Disc3
                  className="text-green-400 transition-all duration-300 group-hover:text-green-300 group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                  size={48}
                />
                <div className="absolute inset-0 text-green-400 animate-pulse opacity-50">
                  <Disc3 size={48} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-wide">
                AuralTales
              </h2>
            </div>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed mb-8">
              Discover and Enjoy Audiobooks Anytime, Anywhere.
            </p>
          </div>

          {/* Legal Links Section */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/terms"
                className="group flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
              >
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                  <FileText size={20} className="text-green-400" />
                </div>
                <span className="font-medium">Terms & Conditions</span>
              </Link>

              <Link
                href="/privacy"
                className="group flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
              >
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                  <Shield size={20} className="text-green-400" />
                </div>
                <span className="font-medium">Privacy Policy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-green-500/20 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <p className="text-gray-400 text-sm">
              &copy; 2025 AuralTales. All rights reserved.
            </p>
            <div className="hidden sm:block w-1 h-1 bg-green-400 rounded-full opacity-60" />
            <p className="text-green-400 text-sm font-medium">
              Built with passion for audiobook lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
