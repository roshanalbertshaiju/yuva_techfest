'use client'

import React, { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export default function CountdownTimer() {
  const calculateTimeLeft = (): TimeLeft => {
    // Target: August 31, 2026 11:59 PM (23:59:00)
    // Note: Month is 0-indexed in JavaScript Date constructor (7 = August)
    const targetDate = new Date(2026, 7, 31, 23, 59, 0)
    const difference = +targetDate - +new Date()
    
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: false
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      }
    } else {
      timeLeft.isExpired = true
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) {
    return (
      <div className="flex justify-center items-center h-20 font-mono text-[10px] tracking-[0.2em] text-orange-400/50 uppercase">
        <span>SYNCING SYSTEM CHRONOMETER...</span>
      </div>
    )
  }

  if (timeLeft.isExpired) {
    return (
      <div className="flex justify-center items-center px-8 py-4 bg-red-950/20 backdrop-blur-md border border-red-500/30 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.1)] max-w-md mx-auto">
        <span className="font-orbitron font-bold text-red-500 tracking-[0.15em] text-lg md:text-xl animate-pulse text-center">
          MISSION INITIATED / REGISTRATION CLOSED
        </span>
      </div>
    )
  }

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 md:mt-12 px-2 sm:px-4">
      {/* Cyberpunk countdown container */}
      <div className="relative p-4 sm:p-5 md:p-6 bg-black/40 backdrop-blur-md border border-orange-500/20 hover:border-orange-500/30 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(255,115,0,0.08)]">
        {/* Glow corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-orange-500/60 rounded-tl-md"></div>
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-orange-500/60 rounded-tr-md"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-orange-500/60 rounded-bl-md"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-orange-500/60 rounded-br-md"></div>
        
        {/* Small header/label */}
        <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-orange-500/10 pb-2 sm:pb-2.5">
          <span className="font-mono text-[8px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] text-orange-400 font-semibold uppercase">
            REGISTRATION DEADLINE COUNTDOWN
          </span>
          <span className="font-mono text-[8px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.15em] text-orange-300/40 flex items-center gap-1 sm:gap-1.5 font-semibold">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff7300]" />
            LIVE_SYNC
          </span>
        </div>

        {/* Timers grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {timeBlocks.map((block) => (
            <div key={block.label} className="flex flex-col items-center">
              <div className="relative w-full py-2 sm:py-3 md:py-4 bg-orange-500/[0.03] border border-orange-500/10 rounded-xl overflow-hidden flex justify-center items-center">
                {/* Subtle digital noise / tech background */}
                <div 
                  className="absolute inset-0 opacity-[0.03] bg-orange-500 pointer-events-none" 
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ff7300 1px, transparent 1px)',
                    backgroundSize: '6px 6px'
                  }} 
                />
                
                {/* Large digital numbers */}
                <span className="font-orbitron font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-amber-500 drop-shadow-[0_0_10px_rgba(255,115,0,0.25)]">
                  {block.value.toString().padStart(2, '0')}
                </span>
              </div>
              
              {/* Label */}
              <span className="mt-2 font-mono text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-orange-300/60 font-semibold">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
