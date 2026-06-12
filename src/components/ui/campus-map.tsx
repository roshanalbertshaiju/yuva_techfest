'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Info, Compass, Target, Radio } from 'lucide-react'

interface VenueNode {
  id: string
  name: string
  coordinates: string
  description: string
  icon: React.ReactNode
  x: number // Percent X on SVG
  y: number // Percent Y on SVG
  color: string
  specs: string[]
}

const venues: VenueNode[] = [
  {
    id: 'cslab',
    name: 'CS Lab Block',
    coordinates: '10.8878° N, 78.8471° E',
    description: 'Yuva Hackathon center. Equipped with high-speed gigabit fiber feeds, dual-monitor desktop setups, and ergonomic workspace benches.',
    icon: <Target size={18} />,
    x: 35,
    y: 45,
    color: '#ff7300',
    specs: ['Gigabit LAN connections', 'UPS Backed Power rails', 'Mentor Support Desks']
  },
  {
    id: 'auditorium',
    name: 'Main Auditorium',
    coordinates: '10.8881° N, 78.8468° E',
    description: 'Cyber-Volt CTF Arena. High-density server configurations, dynamic scoreboard projectors, and soundproofed briefing zones.',
    icon: <Radio size={18} />,
    x: 20,
    y: 25,
    color: '#10b981',
    specs: ['Pulsing Scoreboard Array', '1200+ Seating Capacity', 'Command Control Deck']
  },
  {
    id: 'openarena',
    name: 'Open Arena Block',
    coordinates: '10.8875° N, 78.8475° E',
    description: 'Combat Robo-Wars Cage. Features a 12x12ft reinforced bulletproof polycarbonate cage, active hazard hazards, and overhead display screens.',
    icon: <Compass size={18} />,
    x: 55,
    y: 75,
    color: '#ef4444',
    specs: ['12x12ft Polycarbonate Cage', 'Pneumatic Hazard Grids', 'Safety Isolation Pit']
  },
  {
    id: 'grounds',
    name: 'University Grounds',
    coordinates: '10.8885° N, 78.8480° E',
    description: 'Sky-Rush Drone Race loops. Outdoor FPV course layout featuring neon LED loops, tunnel gates, and a precision touchdown landing zone.',
    icon: <MapPin size={18} />,
    x: 75,
    y: 35,
    color: '#06b6d4',
    specs: ['Outdoor LED loops', 'Precision RF Lap Timers', 'Spectator Fences Setup']
  }
]

export default function CampusMap() {
  const [activeVenue, setActiveVenue] = useState<string>('cslab')

  const currentVenue = venues.find(v => v.id === activeVenue) || venues[0]

  return (
    <div className="mt-20 max-w-6xl mx-auto text-left">
      <div className="flex items-center gap-2.5 mb-8 border-b border-slate-900 pb-4">
        <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase block">// COORDINATES MAP</span>
        <span className="font-mono text-[9px] text-slate-500 uppercase">SYS.LOC // CAMPUS_BLUEPRINTS</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: SVG Map Schematic (Col-span 7) */}
        <div className="lg:col-span-7 bg-[#04070d]/50 border border-slate-900 rounded-2xl p-6 relative flex flex-col items-center justify-center overflow-hidden min-h-[380px] lg:min-h-0">
          
          {/* Blueprint style grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

          {/* Compass layout decorative */}
          <div className="absolute bottom-4 right-4 w-16 h-16 border border-slate-800/40 rounded-full flex items-center justify-center pointer-events-none opacity-50">
            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/40" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-slate-800/40" />
            <span className="absolute -top-3.5 font-mono text-[7px] text-slate-600">N</span>
          </div>

          {/* SVG Map Graphics */}
          <svg className="w-full max-w-[500px] h-auto aspect-[4/3] text-slate-900 relative z-10" viewBox="0 0 100 75" fill="none">
            {/* Campus Pathways (Vector layout) */}
            <path d="M 10 35 Q 25 35 45 45 T 75 45 M 45 45 L 50 70 M 20 25 L 35 45" stroke="rgba(255,255,255,0.03)" strokeWidth="2" strokeDasharray="1,2" />
            <path d="M 10 35 L 75 45 M 45 45 L 50 70 M 20 25 L 35 45" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            
            {/* Buildings wireframes */}
            {/* CS LAB BLOCK */}
            <rect x="28" y="38" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="0.5" className={`${activeVenue === 'cslab' ? 'text-orange-500/30' : 'text-slate-800/40'}`} fill="rgba(255,115,0,0.01)" />
            {/* AUDITORIUM */}
            <polygon points="12,18 28,18 26,30 14,30" stroke="currentColor" strokeWidth="0.5" className={`${activeVenue === 'auditorium' ? 'text-green-500/30' : 'text-slate-800/40'}`} fill="rgba(16,185,129,0.01)" />
            {/* OPEN ARENA */}
            <polygon points="50,68 62,68 59,78 47,78" stroke="currentColor" strokeWidth="0.5" className={`${activeVenue === 'openarena' ? 'text-red-500/30' : 'text-slate-800/40'}`} fill="rgba(239,68,68,0.01)" />
            {/* UNIVERSITY GROUNDS */}
            <ellipse cx="78" cy="35" rx="12" ry="8" stroke="currentColor" strokeWidth="0.5" className={`${activeVenue === 'grounds' ? 'text-cyan-500/30' : 'text-slate-800/40'}`} fill="rgba(6,182,212,0.01)" />

            {/* Interactive pulsing targets */}
            {venues.map((venue) => {
              const isSelected = activeVenue === venue.id
              return (
                <g 
                  key={venue.id}
                  className="cursor-pointer"
                  onClick={() => setActiveVenue(venue.id)}
                >
                  {/* Outer Pulsing Ring */}
                  {isSelected && (
                    <circle 
                      cx={venue.x} 
                      cy={venue.y} 
                      r="5" 
                      fill="none" 
                      stroke={venue.color} 
                      strokeWidth="0.5"
                    >
                      <animate 
                        attributeName="r" 
                        values="3;8;3" 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="opacity" 
                        values="0.8;0;0.8" 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  )}
                  {/* Central Node */}
                  <circle 
                    cx={venue.x} 
                    cy={venue.y} 
                    r={isSelected ? "1.8" : "1.2"} 
                    fill={venue.color} 
                    className="transition-all duration-300"
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 4px ${venue.color})` : 'none'
                    }}
                  />
                  {/* Invisible click target buffer */}
                  <circle 
                    cx={venue.x} 
                    cy={venue.y} 
                    r="8" 
                    fill="transparent" 
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Right Side: Venue Details and Selector list (Col-span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Venue Selection buttons */}
          <div className="grid grid-cols-2 gap-2">
            {venues.map((venue) => {
              const isSelected = activeVenue === venue.id
              return (
                <button
                  key={venue.id}
                  onClick={() => setActiveVenue(venue.id)}
                  className={`px-4 py-3 rounded-xl border font-orbitron text-xs font-bold text-left transition-all duration-300 flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-slate-900 border-slate-700 text-white shadow-[0_0_15px_rgba(255,255,255,0.03)]'
                      : 'bg-[#04070d]/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
                  }`}
                  style={{
                    borderLeft: isSelected ? `3px solid ${venue.color}` : undefined
                  }}
                >
                  <span style={{ color: isSelected ? venue.color : '#64748b' }}>
                    {venue.icon}
                  </span>
                  <span>{venue.name}</span>
                </button>
              )
            })}
          </div>

          {/* Detailed Info Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-900 flex-1 flex flex-col justify-between bg-[#04070d]/30">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-900/60 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  METRICS RESOLVER
                </span>
                <span 
                  className="font-mono text-[9px] px-2 py-0.5 rounded-full border"
                  style={{ 
                    color: currentVenue.color, 
                    borderColor: `${currentVenue.color}35`, 
                    background: `${currentVenue.color}05` 
                  }}
                >
                  ONLINE
                </span>
              </div>

              <h3 className="font-orbitron text-base font-extrabold text-white mb-1">
                {currentVenue.name}
              </h3>
              <p className="font-mono text-[10px] text-slate-500 tracking-wider mb-4 flex items-center gap-1.5">
                <MapPin size={10} style={{ color: currentVenue.color }} />
                {currentVenue.coordinates}
              </p>

              <p className="text-slate-400 text-xs leading-relaxed font-light mb-6">
                {currentVenue.description}
              </p>
            </div>

            {/* Spec lines */}
            <div>
              <div className="h-px bg-slate-900 mb-4" />
              <h4 className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                <Info size={10} />
                Venue Technical Matrix
              </h4>
              <ul className="space-y-2">
                {currentVenue.specs.map((spec, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-2 text-xs text-slate-300 font-light">
                    <span 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ 
                        background: currentVenue.color,
                        boxShadow: `0 0 5px ${currentVenue.color}` 
                      }} 
                    />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
