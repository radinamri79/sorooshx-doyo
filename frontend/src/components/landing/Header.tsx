"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/auth/login", label: "Sign up / Log in" },
  { href: "/become-a-tasker", label: "Become a Tasker" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-white ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/doyo-logo.png"
                alt="Doyo logo"
                width={40}
                height={40}
                className="w-9 h-9 lg:w-10 lg:h-10"
                priority
              />
              <span className="font-bold text-[22px] lg:text-[26px] text-navy-900 tracking-tight">
                doyo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/services"
                className="px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-navy-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Services
              </Link>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-[15px] font-medium text-gray-700 hover:text-navy-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign up / Log in
              </Link>
              <Link
                href="/become-a-tasker"
                className="ml-2 px-5 py-2.5 text-[15px] font-semibold text-navy-900 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors"
              >
                Become a Tasker
              </Link>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden relative z-50 p-2 -mr-2 text-navy-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in Panel */}
          <nav className="absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl pt-20 px-6 animate-slide-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3.5 text-[16px] font-medium text-navy-900 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* <div className="mt-8 px-4">
              <Link
                href="/become-a-tasker"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-5 py-3 text-[15px] font-semibold text-navy-900 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors"
              >
                Become a Tasker
              </Link>
            </div> */}
          </nav>
        </div>
      )}
    </>
  );
}
