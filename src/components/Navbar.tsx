'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-[rgba(255,115,0,0.15)] bg-[rgba(5,11,20,0.85)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(255,115,0,0.3)] group-hover:border-[#ff7300] transition-colors duration-300 group-hover:shadow-[0_0_20px_rgba(255,115,0,0.5)]">
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
              YUVA <span className="text-[#ff7300]">TECH-FEST</span>
            </p>
            <p className="font-mono text-[10px] text-slate-400 tracking-widest mt-0.5">
              HACKATHON 2025
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
            >
              <Link
                href={link.href}
                className={`nav-link text-slate-400 relative ${
                  isActive(link.href) ? 'text-[#ff7300]' : ''
                }`}
              >
                <span className="text-[#ff730044] mr-1">{'>'}</span>
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    className="absolute bottom-[-4px] left-0 right-0 h-[1.5px] bg-[#ff7300]"
                    layoutId="nav-indicator"
                  />
                )}
              </Link>
            </motion.div>
          ))}

          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/register?type=student"
                id="nav-register-btn"
                className="btn-glow px-5 py-2 text-xs block text-center"
              >
                REGISTER NOW
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-menu-btn"
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block w-6 h-0.5 bg-[#ff7300]"
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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[rgba(255,115,0,0.15)] bg-[rgba(5,11,20,0.95)]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm py-2 ${
                    isActive(link.href) ? 'text-[#ff7300]' : 'text-slate-350'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register?type=student"
                className="btn-glow px-5 py-3 text-xs text-center"
                onClick={() => setMenuOpen(false)}
              >
                REGISTER NOW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
