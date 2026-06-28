"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 md:top-6 inset-x-4 md:inset-x-8 z-50">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Menu Button (Left) */}
          <button
            aria-label="Toggle Menu"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center text-white hover:text-white/70 ml-2 tracking-[0.2em] uppercase"
          >
            {isOpen ? <X className="w-4 md:w-6 h-4 md:h-6" /> : <Menu className="w-4 md:w-6 h-4 md:h-6" />} <span className="ml-2 text-xs md:text-sm">MENU</span>
          </button>

          {/* Action (Right) */}
          <Link
            href="/sign-in"
            className="
              h-9 md:h-11
              px-5 md:px-6
              rounded-full
              bg-white
              hover:bg-white/90
              text-black
              text-xs
              tracking-wide md:tracking-[0.2em] 
              uppercase
              font-bold
              flex
              items-center
              justify-center
            "
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="
              fixed
              top-20 md:top-22
              left-4 md:left-32
              w-64
              z-50 
              text-xs md:text-sm
            "
          >
            <div
              className="
                rounded-2xl md:rounded-4xl
                border
                border-white/10
                bg-black/80
                backdrop-blur-xl
                overflow-hidden
                shadow-2xl
              "
            >
              <div className="p-2 md:p-4 flex flex-col gap-1 md:gap-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="
                      flex
                      items-center
                      rounded-2xl
                      p-4
                      font-light
                      tracking-widest
                      uppercase
                      text-xs
                      text-white/60
                      hover:text-white
                      hover:bg-white/5
                    "
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;