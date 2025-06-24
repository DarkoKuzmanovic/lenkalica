"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import StyledLink from "./StyledLink";
import SearchBar from "./SearchBar";

const navVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
      duration: 0.4,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-sm border-b border-base-300">
      <div className="navbar h-14 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="navbar-start">
          <Link href="/" className="group flex items-center space-x-3">
            <motion.div
              className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-transparent"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image src="/jecilkic.png" alt="Lenkalica Logo" fill className="object-cover" priority />
            </motion.div>
            <motion.span
              className="text-2xl font-bold text-base-content transition-colors duration-200 group-hover:text-primary"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Lenkalica
            </motion.span>
          </Link>
        </div>

        {/* Center - Search Bar (Desktop) */}
        <div className="navbar-center hidden lg:flex">
          <SearchBar />
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-end hidden md:flex">
          <motion.div
            className="flex items-center space-x-2"
            variants={navVariants}
            initial="initial"
            animate="animate"
          >
            {[
              { href: "/articles", label: "Articles" },
              { href: "/shorts", label: "Shorts" },
              { href: "/comics", label: "Comics" },
              { href: "/podcasts", label: "Podcasts" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <motion.div key={link.href} variants={itemVariants}>
                <StyledLink href={link.href}>
                  <span className="relative inline-block">
                    {link.label}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </span>
                </StyledLink>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-end md:hidden">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-ghost btn-sm px-2"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-4 h-4 flex items-center justify-center relative">
              <span
                className={`absolute h-0.5 w-4 bg-base-content transform transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-0.5 w-4 bg-base-content transform transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-0.5 w-4 bg-base-content transform transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-1"
                }`}
              />
            </div>
          </motion.button>

          {/* Mobile Menu Dropdown */}
          <motion.div
            className={`absolute top-full right-0 w-full md:hidden ${!isMenuOpen && "hidden"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="bg-base-100 border-b border-base-300 shadow-lg">
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2">
                {/* Mobile Search */}
                <div className="py-3 border-b border-base-300 mb-2 lg:hidden">
                  <SearchBar />
                </div>
                
                <motion.div
                  className="flex flex-col space-y-1 py-4"
                  variants={navVariants}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    { href: "/articles", label: "Articles" },
                    { href: "/shorts", label: "Shorts" },
                    { href: "/comics", label: "Comics" },
                    { href: "/podcasts", label: "Podcasts" },
                    { href: "/about", label: "About" },
                  ].map((link) => (
                    <motion.div key={link.href} variants={itemVariants}>
                      <StyledLink href={link.href} onClick={handleCloseMenu}>
                        <span className="relative inline-block">
                          {link.label}
                          <motion.span
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        </span>
                      </StyledLink>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
