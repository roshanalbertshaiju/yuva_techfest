'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/AuthModal'
import { ChevronDown, Terminal, LogOut, QrCode, Scan } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Launchpad', href: '/launchpad' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { user, profile, loading, logout } = useAuth()

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

  const initials = user
    ? (profile?.name || user.displayName || user.email || 'U').charAt(0).toUpperCase()
    : 'U'

  return (
    <nav
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
              TECH-FEST 2025
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={`nav-link text-slate-400 relative ${
                  isActive(link.href) ? 'text-[#ff7300]' : ''
                }`}
              >
                <span className="text-[#ff730044] mr-1">{'>'}</span>
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-[1.5px] bg-[#ff7300]" />
                )}
              </Link>
            </div>
          ))}

          <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
            {loading ? (
              <span className="text-slate-500 font-mono text-[10px]">// INDEXING...</span>
            ) : !user ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-glow px-5 py-2 text-xs block text-center"
              >
                Log In / Sign Up
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-orange-500/5 border border-slate-800 hover:border-orange-500/30 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 group-hover:border-[#ff7300] flex items-center justify-center text-[#ff7300] font-orbitron font-bold text-sm shadow-[0_0_10px_rgba(255,115,0,0.1)] transition-all">
                    {initials}
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 group-hover:text-white transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Transparent click-outside overlay */}
                      <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-52 glass-card rounded-xl p-2 border border-orange-500/20 bg-[#050b14]/95 shadow-2xl z-50"
                      >
                        <div className="px-3 py-2 border-b border-slate-800 mb-1">
                          <p className="font-orbitron text-xs font-bold text-white truncate">
                            {profile?.name || user.displayName || 'User'}
                          </p>
                          <p className="font-mono text-[9px] text-slate-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {profile?.isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-350 hover:text-white hover:bg-orange-500/10 transition-colors animate-pulse"
                          >
                            <Terminal size={14} className="text-[#ff7300]" />
                            CONSOLE_PANEL
                          </Link>
                        )}

                        {(profile?.isManager || profile?.isAdmin) && (
                          <Link
                            href="/scanner"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-350 hover:text-white hover:bg-orange-500/10 transition-colors"
                          >
                            <Scan size={14} className="text-[#ff7300]" />
                            SCANNER_PORTAL
                          </Link>
                        )}

                        <Link
                          href="/tickets"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-xs font-mono text-slate-350 hover:text-white hover:bg-orange-500/10 transition-colors"
                        >
                          <QrCode size={14} className="text-[#ff7300]" />
                          MY_TICKETS
                        </Link>

                        <button
                          onClick={() => {
                            setDropdownOpen(false)
                            logout()
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={14} />
                          DISCONNECT
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 md:hidden bg-[#020408]/98 backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[rgba(255,115,0,0.3)]">
                  <Image
                    src="/logo.png"
                    alt="Yuva Tech-Fest Logo"
                    fill
                    className="object-cover scale-110"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="font-orbitron text-xs font-bold text-white leading-none tracking-wide">
                    YUVA <span className="text-[#ff7300]">TECH-FEST</span>
                  </p>
                  <p className="font-mono text-[8px] text-slate-400 tracking-widest mt-0.5">
                    TECH-FEST 2025
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-xl bg-white/5 border border-slate-800 text-[#ff7300] hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links (Centered) */}
            <div className="flex flex-col items-center justify-center my-auto py-12 gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-orbitron text-2xl font-bold tracking-widest transition-all relative py-1 block ${
                      isActive(link.href) ? 'text-[#ff7300]' : 'text-slate-350 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#ff7300] shadow-[0_0_8px_#ff7300]" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer Profile & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto w-full max-w-sm mx-auto"
            >
              {loading ? (
                <div className="text-center py-4">
                  <span className="text-slate-500 font-mono text-xs">// INDEXING SECURITY PROTOCOLS...</span>
                </div>
              ) : !user ? (
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    setAuthModalOpen(true)
                  }}
                  className="btn-glow px-6 py-4 text-xs text-center w-full font-bold tracking-widest uppercase rounded-xl"
                >
                  Log In / Sign Up
                </button>
              ) : (
                <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-[#050b14]/50 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#ff7300] font-orbitron font-bold text-base shadow-[0_0_10px_rgba(255,115,0,0.15)]">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-orbitron text-xs font-bold text-white truncate">
                        {profile?.name || user.displayName || 'User'}
                      </p>
                      <p className="font-mono text-[9px] text-slate-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {profile?.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-mono text-slate-350 hover:text-white bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/15 transition-all text-center"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Terminal size={12} className="text-[#ff7300]" />
                        CONSOLE_PANEL
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        logout()
                      }}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-mono text-red-400 hover:text-red-350 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 transition-all text-center ${
                        profile?.isAdmin ? 'col-span-1' : 'col-span-2'
                      }`}
                    >
                      <LogOut size={12} />
                      DISCONNECT
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  )
}
