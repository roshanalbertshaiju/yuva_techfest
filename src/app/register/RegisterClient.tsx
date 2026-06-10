'use client'

import React, { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RegistrationForm from '@/components/RegistrationForm'

function RegisterContent() {
  return (
    <div className="relative z-10 w-full max-w-4xl px-6 py-16 flex flex-col items-center">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-10 group">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(255,115,0,0.3)] group-hover:border-[#ff7300] transition-colors duration-300">
          <Image
            src="/logo.png"
            alt="Yuva Tech-Fest Logo"
            fill
            className="object-cover scale-110"
            sizes="48px"
            priority
          />
        </div>
        <div>
          <p className="font-orbitron text-sm font-bold text-white leading-none tracking-wide">
            YUVA <span className="text-[#ff7300]">TECH-FEST</span>
          </p>
          <p className="font-mono text-[10px] text-slate-400 tracking-widest mt-0.5">
            HACKATHON 2025
          </p>
        </div>
      </Link>

      <RegistrationForm />
    </div>
  )
}

export default function RegisterClient() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#020408] overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent" />
      
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* scanline */}
      <div className="scan-line" />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4 text-[#ff7300]">
          <div className="loader" />
          <p className="font-mono text-xs tracking-widest">INITIALIZING ACCESS...</p>
        </div>
      }>
        <RegisterContent />
      </Suspense>
    </main>
  )
}
