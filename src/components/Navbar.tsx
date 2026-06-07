'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      // Determine active section
      const sections = ['home', 'about', 'contact']
      for (const sec of sections.reverse()) {
        const el = document.getElementById(sec)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sec)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-[rgba(0,212,255,0.15)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#home"
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(0,212,255,0.3)] group-hover:border-[#00d4ff] transition-colors duration-300 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]">
            <Image
               src="/logo.png"
               alt="Yuva Tech-Fest Logo"
               fill
               className="object-cover scale-110"
               sizes="48px"
               priority
             />
           </div>
           <div className="hidden sm:block">
             <p className="font-orbitron text-sm font-bold text-white leading-none tracking-wide">
               YUVA <span className="text-[#00d4ff]">TECH-FEST</span>
             </p>
            <p className="font-mono text-[10px] text-slate-400 tracking-widest mt-0.5">
              HACKATHON 2025
            </p>
          </div>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className={`nav-link ${
                activeSection === link.label.toLowerCase()
                  ? 'text-[#00d4ff]'
                  : ''
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
            >
              <span className="text-[#00d4ff44] mr-1">{'>'}</span>
              {link.label}
              {activeSection === link.label.toLowerCase() && (
                <motion.span
                  className="absolute bottom-[-4px] left-0 right-0 h-[1px] bg-[#00d4ff]"
                  layoutId="nav-indicator"
                />
              )}
            </motion.a>
          ))}

          <motion.a
            href="#contact"
            id="nav-register-btn"
            className="btn-glow px-5 py-2 text-xs"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            REGISTER NOW
          </motion.a>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-btn"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-6 h-0.5 bg-[#00d4ff]"
              animate={{
                rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                y: menuOpen && i === 0 ? 8 : menuOpen && i === 2 ? -8 : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
              transition={{ duration: 0.25 }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[rgba(0,212,255,0.15)]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link text-sm py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                className="btn-glow px-5 py-3 text-xs text-center"
                onClick={() => setMenuOpen(false)}
              >
                REGISTER NOW
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
