'use client'

import React from 'react'
import CountdownTimer from './ui/countdown-timer'

export default function CountdownBanner() {
  return (
    <div className="relative py-12 bg-[#020408]/90 overflow-hidden border-b border-t border-[rgba(255,115,0,0.1)]">
      {/* Subtle neon horizontal line glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730044] to-transparent shadow-[0_0_15px_#ff7300]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730044] to-transparent shadow-[0_0_15px_#ff7300]" />

      {/* Cyberpunk grid background accent */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        <CountdownTimer />
      </div>
    </div>
  )
}
