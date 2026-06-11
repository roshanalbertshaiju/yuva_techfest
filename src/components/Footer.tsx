'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-[#02060e]/80 backdrop-blur-[4px] border-t border-[rgba(255,115,0,0.1)] overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[rgba(255,115,0,0.3)]">
                <Image src="/logo.png" alt="Yuva Tech-Fest" fill className="object-cover scale-110" sizes="40px" />
              </div>
              <div>
                <p className="font-orbitron text-sm font-bold text-white">
                  YUVA <span className="text-[#ff7300]">TECH-FEST</span>
                </p>
                <p className="font-mono text-[9px] text-slate-500 tracking-widest">HACKATHON 2025</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Empowering the next generation of innovators at SRM Institute of Science &amp;
              Technology, Tiruchirappalli.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-mono text-[10px] text-[#ff7300] tracking-widest uppercase mb-4">Quick Links</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Themes', href: '/events' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 text-slate-500 text-xs hover:text-[#ff7300] transition-colors duration-300 font-mono w-fit"
                >
                  <span className="text-[#ff730033]">›</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[10px] text-[#ff7300] tracking-widest uppercase mb-4">Contact</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-slate-500 text-xs">
                <MapPin size={12} className="text-[#ff7300] mt-0.5 flex-shrink-0" />
                SRM IST, Tiruchirappalli, Tamil Nadu
              </div>
              <a
                href="mailto:yuvafest@srmtrichy.edu.in"
                className="flex items-center gap-2 text-slate-500 text-xs hover:text-[#ff7300] transition-colors duration-300"
              >
                <Mail size={12} className="text-[#ff7300] flex-shrink-0" />
                yuvafest@srmtrichy.edu.in
              </a>
              <a
                href="https://www.srmist.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500 text-xs hover:text-[#ff7300] transition-colors duration-300"
              >
                <ExternalLink size={12} className="text-[#ff7300] flex-shrink-0" />
                www.srmist.edu.in
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-slate-600 tracking-widest">
            © 2025 YUVA TECH-FEST HACKATHON — SRM IST TIRUCHIRAPPALLI
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffb700] animate-pulse" style={{ boxShadow: '0 0 6px #ffb700' }} />
            <span className="font-mono text-[9px] text-slate-600 tracking-widest">SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
