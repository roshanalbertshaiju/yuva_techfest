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
  { label: 'About', href: '/about' },
  { label: 'Sponsors', href: '/sponsors' },
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
              TECH-FEST 2025
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

          <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
            {loading ? (
              <span className="text-slate-500 font-mono text-[10px]">// INDEXING...</span>
            ) : !user ? (
              <motion.button
                onClick={() => setAuthModalOpen(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="btn-glow px-5 py-2 text-xs block text-center"
              >
                Log In / Sign Up
              </motion.button>
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
              {loading ? (
                <span className="text-slate-500 font-mono text-xs text-center py-2">// INDEXING...</span>
              ) : !user ? (
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    setAuthModalOpen(true)
                  }}
                  className="btn-glow px-5 py-3 text-xs text-center w-full"
                >
                  Log In / Sign Up
                </button>
              ) : (
                <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 mt-2">
                  <div className="flex items-center gap-3 px-2 py-1.5">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#ff7300] font-orbitron font-bold text-base shadow-[0_0_10px_rgba(255,115,0,0.1)]">
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

                  {profile?.isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-xs font-mono text-slate-350 hover:text-white bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 transition-all"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Terminal size={14} className="text-[#ff7300]" />
                      CONSOLE_PANEL
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-left text-xs font-mono text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all"
                  >
                    <LogOut size={14} />
                    DISCONNECT
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </motion.nav>
  )
}
