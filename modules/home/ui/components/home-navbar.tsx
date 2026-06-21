"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How it Works",
    href: "#how-it-works",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-2 md:top-4 inset-x-2 md:inset-x-0 z-50 max-w-6xl mx-auto">
        <div className="rounded-full bg-[#0D0F12]/80 backdrop-blur-sm border border-white/5 px-4 py-3 flex items-center justify-between transition-all duration-300">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#8b5cf6] blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />

              <Image
                src="/logo.svg"
                alt="Logo"
                width={30}
                height={30}
                className="ml-2 dark:invert shrink-0 relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <span className="text-white font-bold text-lg tracking-tight select-none">
              Mono
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="
                  text-sm
                  font-medium
                  text-[#8892b0]
                  hover:text-white
                  transition-all
                  duration-200
                  relative
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-px
                  after:w-0
                  after:bg-white
                  after:transition-all
                  hover:after:w-full
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/sign-in"
              className="
                text-sm
                font-semibold
                text-[#8892b0]
                hover:text-white
                transition-colors
              "
            >
              Sign In
            </Link>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/sign-up"
                className="
                  h-10
                  px-6
                  rounded-full
                  bg-[#8b5cf6]
                  hover:bg-[#7c3aed]
                  text-white
                  transition-all
                  text-sm
                  font-bold
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-[#8b5cf6]/25
                  hover:shadow-[#8b5cf6]/40
                "
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle Menu"
            onClick={() => setIsOpen(!isOpen)}
            className="
              md:hidden
              flex mr-1
              items-center
              justify-center
              text-white
            "
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                top-[84px]
                left-4
                right-4
                z-50 
                md:hidden text-sm
              "
            >
              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#0D0F12]/90
                  backdrop-blur-2xl
                  overflow-hidden
                  shadow-2xl
                "
              >
                <div className="p-3">
                  {navLinks.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{
                        opacity: 0,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="
                          flex
                          items-center
                          rounded-2xl
                          px-4
                          py-2
                          font-medium
                          text-[#8892b0]
                          hover:text-white
                          hover:bg-white/5
                          transition-all
                        "
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="h-px bg-white/10 my-3" />

                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="
                      flex
                      justify-center
                      py-2
                      text-[#8892b0]
                      hover:text-white
                      transition-colors
                    "
                  >
                    Sign In
                  </Link>

                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="mt-2"
                  >
                    <Link
                      href="/sign-up"
                      onClick={() => setIsOpen(false)}
                      className="
                        h-9
                        rounded-full
                        bg-[#8b5cf6]
                        hover:bg-[#7c3aed]
                        text-white
                        font-semibold
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        shadow-[#8b5cf6]/25
                      "
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;