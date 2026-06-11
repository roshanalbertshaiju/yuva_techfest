'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Terminal, ShieldAlert, Bot, Sparkles, Rocket, Award, MapPin, Users, Coins } from 'lucide-react'
import Link from 'next/link'

// ─── Data ────────────────────────────────────────────────────────────────────

const competitions = [
  {
    id: 'hackathon',
    title: 'Yuva Hackathon',
    tagline: 'Flagship 36-hour sprint of relentless collaborative building.',
    prize: '₹50,000 Champion Pool',
    venue: 'CS Lab Block',
    teamSize: '2 - 4 Members',
    tag: 'FLAGSHIP',
    icon: <Terminal className="w-6 h-6" />,
    color: '#ff7300',
    description: 'Assemble your squad, select a track, and code a working prototype under strict time limits. Guided by industry engineers, judged by veteran founders.',
    regUrl: '/register?event=hackathon',
    detailsUrl: '/events/hackathon',
  },
  {
    id: 'ctf',
    title: 'Cyber-Volt CTF',
    tagline: 'Jeopardy-style Capture The Flag cybersecurity hacking arena.',
    prize: '₹20,000 Cash Pool',
    venue: 'Main Auditorium',
    teamSize: '1 - 2 Members',
    tag: 'CYBER',
    icon: <ShieldAlert className="w-6 h-6" />,
    color: '#00ff66',
    description: 'Test your capabilities in web penetration testing, network forensics, reverse engineering, cryptography, and binary exploitation to secure flags.',
    regUrl: '/register?event=ctf',
    detailsUrl: '/events/ctf',
  },
  {
    id: 'dronerace',
    title: 'Sky-Rush Drone Race',
    tagline: 'High-speed FPV drone racing through complex obstacle loops.',
    prize: '₹20,000 Cash Pool',
    venue: 'University Grounds',
    teamSize: 'Individual',
    tag: 'AERO',
    icon: <Rocket className="w-6 h-6" />,
    color: '#00f0ff',
    description: 'Navigate custom FPV racing drones through illuminated loops, gates, and tight corridors. The fastest pilot across the finish line wins.',
    regUrl: '/register?event=dronerace',
    detailsUrl: '/events/dronerace',
  },
  {
    id: 'robowars',
    title: 'Robo-Wars Arena',
    tagline: 'Ultimate clashing arena of custom combat robotics.',
    prize: '₹15,000 Cash Pool',
    venue: 'Open Arena Block',
    teamSize: '2 - 3 Members',
    tag: 'ROBOTICS',
    icon: <Bot className="w-6 h-6" />,
    color: '#ff003c',
    description: 'Fierce battle of metal and engineering. Custom-built remote-controlled combat robots face off in a reinforced safety cage arena.',
    regUrl: '/register?event=robowars',
    detailsUrl: '/events/robowars',
  },
  {
    id: 'workshop',
    title: 'AI & Web3 Workshops',
    tagline: 'Expert-led developer sessions on deep tech paradigms.',
    prize: 'Elite Swag & Certificates',
    venue: 'Seminar Hall 2',
    teamSize: 'Individual',
    tag: 'WORKSHOP',
    icon: <Sparkles className="w-6 h-6" />,
    color: '#ffb700',
    description: 'Master next-generation frameworks. Intensive hands-on workshops covering large language model fine-tuning, smart contracts, and decentralized app architectures.',
    regUrl: '/register?event=workshop',
    detailsUrl: '/events/workshop',
  },
]

const renderSchematic = (id: string, color: string) => {
  switch (id) {
    case 'hackathon':
      return (
        <svg className="w-full h-full opacity-30 group-hover:opacity-75 transition-opacity duration-500" viewBox="0 0 300 200" fill="none" stroke={color} strokeWidth="1">
          <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="url(#gridGrad)" />
          
          {/* Schematic fine border lines */}
          <line x1="15" y1="15" x2="285" y2="15" strokeDasharray="3 6" />
          <line x1="15" y1="185" x2="285" y2="185" strokeDasharray="3 6" />
          <line x1="15" y1="15" x2="15" y2="185" strokeDasharray="3 6" />
          <line x1="285" y1="15" x2="285" y2="185" strokeDasharray="3 6" />

          {/* Hex blueprint center */}
          <polygon points="150,45 180,62 180,98 150,115 120,98 120,62" strokeWidth={1.5} className="animate-pulse" />
          <line x1="150" y1="15" x2="150" y2="45" />
          <line x1="150" y1="115" x2="150" y2="185" />
          <line x1="120" y1="80" x2="15" y2="80" strokeDasharray="4 4" />
          <line x1="180" y1="80" x2="285" y2="80" strokeDasharray="4 4" />

          <circle cx={150} cy={80} r={50} strokeDasharray="2 8" className="origin-center animate-[spin_40s_linear_infinite]" style={{ transformOrigin: '150px 80px' }} />
          <circle cx={150} cy={80} r={4} fill={color} />

          <text x="25" y="32" fill={color} className="font-mono text-[7px] tracking-widest uppercase opacity-70">CORE.SRC // LINKED</text>
          <text x="205" y="168" fill={color} className="font-mono text-[7px] tracking-widest uppercase opacity-70">BLUEPRINT // v1.2</text>
        </svg>
      )
    case 'ctf':
      return (
        <svg className="w-full h-full opacity-25 group-hover:opacity-60 transition-opacity duration-500" viewBox="0 0 200 150" fill="none" stroke={color} strokeWidth="1">
          <circle cx="100" cy="75" r="48" />
          <circle cx="100" cy="75" r="28" strokeDasharray="3 3" />
          <circle cx="100" cy="75" r="10" />
          
          <line x1="100" y1="15" x2="100" y2="135" strokeDasharray="2 3" />
          <line x1="40" y1="75" x2="160" y2="75" strokeDasharray="2 3" />

          <circle cx="128" cy="52" r="5" fill={color} className="animate-ping" />
          <circle cx="128" cy="52" r="2.5" fill={color} />
          <circle cx="70" cy="98" r="3.5" fill={color} />

          <line x1="100" y1="75" x2="135" y2="40" className="origin-center animate-[spin_10s_linear_infinite]" style={{ transformOrigin: '100px 75px' }} />
          <text x="18" y="25" fill={color} className="font-mono text-[6px] tracking-wider opacity-60">PORT.SCAN // ACTIVE</text>
          <text x="18" y="132" fill={color} className="font-mono text-[6px] tracking-wider opacity-60">MEM.OVERFLOW: 0%</text>
        </svg>
      )
    case 'dronerace':
      return (
        <svg className="w-full h-full opacity-25 group-hover:opacity-60 transition-opacity duration-500" viewBox="0 0 200 150" fill="none" stroke={color} strokeWidth="1">
          <path d="M 72 75 L 88 75" />
          <path d="M 112 75 L 128 75" />
          <path d="M 100 48 L 100 64" />
          <path d="M 100 86 L 100 102" />

          <path d="M 38 48 L 22 48 L 22 102 L 38 102" />
          <path d="M 162 48 L 178 48 L 178 102 L 162 102" />

          <line x1="82" y1="62" x2="118" y2="62" />
          <line x1="82" y1="88" x2="118" y2="88" />

          <line x1="12" y1="75" x2="188" y2="75" strokeDasharray="6 6" className="group-hover:translate-y-2 transition-transform duration-500" />
          
          <line x1="50" y1="22" x2="150" y2="22" />
          <line x1="100" y1="22" x2="100" y2="16" />
          <text x="97" y="11" fill={color} className="font-mono text-[6px] font-bold">N</text>
          <text x="18" y="132" fill={color} className="font-mono text-[6px] tracking-wider opacity-60">ALT // 12.8M</text>
        </svg>
      )
    case 'robowars':
      return (
        <svg className="w-full h-full opacity-25 group-hover:opacity-60 transition-opacity duration-500" viewBox="0 0 200 150" fill="none" stroke={color} strokeWidth="1">
          <circle cx="100" cy="75" r="38" strokeDasharray="3 3" className="origin-center animate-[spin_12s_linear_infinite]" style={{ transformOrigin: '100px 75px' }} />
          <circle cx="100" cy="75" r="26" />
          
          <path d="M 100 38 L 104 46 L 96 46 Z" fill={color} className="origin-center animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '100px 75px' }} />
          <path d="M 100 112 L 104 104 L 96 104 Z" fill={color} className="origin-center animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '100px 75px' }} />
          <path d="M 63 75 L 71 79 L 71 71 Z" fill={color} className="origin-center animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '100px 75px' }} />
          <path d="M 137 75 L 129 79 L 129 71 Z" fill={color} className="origin-center animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '100px 75px' }} />

          <circle cx="100" cy="75" r="46" />
          <line x1="100" y1="18" x2="100" y2="132" strokeDasharray="1 8" />
          
          <text x="18" y="25" fill={color} className="font-mono text-[6px] tracking-wider opacity-60">DRIVE.CHAIN // SECURED</text>
          <text x="132" y="132" fill={color} className="font-mono text-[6px] tracking-wider opacity-60">PSI // 1400</text>
        </svg>
      )
    case 'workshop':
      return (
        <svg className="w-full h-full opacity-25 group-hover:opacity-60 transition-opacity duration-500" viewBox="0 0 200 150" fill="none" stroke={color} strokeWidth="1">
          <circle cx="45" cy="50" r="4.5" fill={color} />
          <circle cx="45" cy="100" r="4.5" />
          <circle cx="100" cy="38" r="4.5" />
          <circle cx="100" cy="75" r="4.5" fill={color} className="animate-pulse" />
          <circle cx="100" cy="112" r="4.5" />
          <circle cx="155" cy="50" r="4.5" />
          <circle cx="155" cy="100" r="4.5" fill={color} />

          <line x1="45" y1="50" x2="100" y2="38" />
          <line x1="45" y1="50" x2="100" y2="75" />
          <line x1="45" y1="100" x2="100" y2="75" />
          <line x1="45" y1="100" x2="100" y2="112" />
          <line x1="100" y1="38" x2="155" y2="50" />
          <line x1="100" y1="75" x2="155" y2="50" />
          <line x1="100" y1="75" x2="155" y2="100" />
          <line x1="100" y1="112" x2="155" y2="100" />

          <line x1="45" y1="50" x2="100" y2="75" strokeWidth="1.5" className="animate-dash" />
          <line x1="100" y1="75" x2="155" y2="100" strokeWidth="1.5" className="animate-dash" />

          <text x="18" y="25" fill={color} className="font-mono text-[6px] tracking-wider opacity-60">LATTICE // CONNECTED</text>
          <text x="18" y="132" fill={color} className="font-mono text-[6px] tracking-wider opacity-60">SAMPLES // 50K</text>
        </svg>
      )
    default:
      return null
  }
}

export default function EventsSection() {
  const hackathon = competitions[0]
  const otherComps = competitions.slice(1)

  return (
    <div className="relative min-h-screen bg-[#020408] overflow-hidden pb-32">
      {/* Embedded styles for Awwwards-worthy marquee and animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-dash {
          stroke-dasharray: 5 15;
          animation: dash 2s linear infinite;
        }
      `}} />

      {/* Abstract Background Elements */}
      <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,115,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Editorial Header */}
      <div className="relative pt-32 pb-12 z-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center border-b border-slate-900/80 pb-4 mb-10">
          <span className="font-mono text-[9px] text-slate-500 tracking-[0.2em] uppercase">
            SYS.LOC // 10.887° N, 78.847° E
          </span>
          <span className="font-mono text-[9px] text-[#ff7300] tracking-[0.2em] uppercase flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7300] shadow-[0_0_8px_#ff7300]" />
            SYS // ONLINE & MONITORING
          </span>
          <span className="font-mono text-[9px] text-slate-500 tracking-[0.2em] uppercase hidden sm:inline">
            SYS.VER // YUVA.V2.026
          </span>
        </div>

        <div className="text-left max-w-4xl">
          <span className="font-mono text-[10px] text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">// COMPETITION ARENA</span>
          <h1 className="font-orbitron text-5xl sm:text-7xl font-black text-white tracking-tight leading-none mb-6">
            EVENTS <span className="text-slate-500 font-light">DASHBOARD</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
            Enter the digital colosseum. Inspect event metrics, safety parameters, and technical blueprints below. Connect your terminal to secure registration.
          </p>
        </div>
      </div>

      {/* Brutalist Marquee Banner */}
      <div className="w-full border-y border-slate-900/60 bg-[#04070d]/30 py-5 overflow-hidden mb-20 relative z-20">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020408] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020408] to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="font-mono text-xs uppercase tracking-[0.25em] text-orange-500/80 mx-8 flex items-center gap-4 select-none">
              <span>₹1,20,000+ Total Prizes</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-slate-800" />
              <span>36h Hackathon Sprint</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-slate-800" />
              <span>Cyber-Volt Jeopardy CTF</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-slate-800" />
              <span>Sky-Rush FPV Drone Race</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-slate-800" />
              <span>Combat Robo-Wars Arena</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-slate-800" />
              <span>AI & Web3 Workshops</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-slate-800" />
            </span>
          ))}
        </div>
      </div>

      {/* Asymmetrical Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10">
        
        {/* HERO CARD: Flagship Hackathon */}
        <motion.div
          key={hackathon.title}
          className="glass-card corner-bracket rounded-3xl border border-slate-900 bg-[#04070d]/40 hover:bg-[#070b14]/70 hover:border-orange-500/35 transition-all duration-500 hover:shadow-[0_0_45px_rgba(255,115,0,0.06)] group relative overflow-hidden flex flex-col lg:flex-row"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Subtle neon hover accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-[#ff7300] to-transparent" />

          {/* Left Side: Details */}
          <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between z-10 border-b lg:border-b-0 lg:border-r border-slate-900/60">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <span className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-[#ff7300]">
                  <Terminal className="w-6 h-6" />
                </span>
                <div>
                  <span className="status-tag text-[9px] font-mono tracking-widest px-3 py-0.5 rounded-full uppercase text-[#ff7300] border-orange-500/25 bg-orange-500/5">
                    {hackathon.tag}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 tracking-wider uppercase ml-3 hidden sm:inline">// SECURITY_LOCKED</span>
                </div>
              </div>

              <h2 className="font-orbitron text-3xl sm:text-4xl font-extrabold text-white mb-2 group-hover:text-[#ff7300] transition-colors duration-300">
                {hackathon.title}
              </h2>
              <p className="font-mono text-[10px] text-orange-455 tracking-widest mb-6 uppercase">{hackathon.tagline}</p>
              <p className="text-slate-400 text-sm leading-relaxed font-light mb-8 max-w-xl">
                {hackathon.description}
              </p>
            </div>

            <div>
              <div className="h-px bg-slate-900/80 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Prize Pool</span>
                  <span className="font-orbitron text-sm font-bold text-white flex items-center gap-1.5">
                    <Award size={14} className="text-[#ff7300]" />
                    {hackathon.prize}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Deployment Venue</span>
                  <span className="font-orbitron text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#ffb700]" />
                    {hackathon.venue}
                  </span>
                </div>
                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <span className="font-mono text-[9px] text-slate-550 uppercase tracking-wider">Team Capacity</span>
                  <span className="font-orbitron text-sm font-bold text-white flex items-center gap-1.5">
                    <Users size={14} className="text-[#ff3c00]" />
                    {hackathon.teamSize}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={hackathon.detailsUrl} className="btn-outline px-6 py-3 text-xs text-center font-bold tracking-widest uppercase rounded-xl flex-1 justify-center gap-2">
                  Explore Blueprints
                </Link>
                <Link href={hackathon.regUrl} className="btn-glow px-6 py-3 text-xs text-center font-bold tracking-widest uppercase rounded-xl flex-1 justify-center gap-2">
                  Initiate Registration
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Schematic Visual */}
          <div className="lg:w-[38%] bg-[#020408]/30 p-8 flex items-center justify-center relative min-h-[280px] lg:min-h-0">
            <div className="absolute inset-4 rounded-2xl border border-slate-900/60 overflow-hidden flex items-center justify-center bg-[#020408]/40">
              {renderSchematic(hackathon.id, hackathon.color)}
            </div>
          </div>
        </motion.div>

        {/* SECONDARY COMPETITIONS: 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherComps.map((comp, idx) => (
            <motion.div
              key={comp.title}
              className="glass-card corner-bracket rounded-3xl border border-slate-900 bg-[#04070d]/40 hover:bg-[#070b14]/70 hover:border-slate-800 transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,115,0,0.03)] group relative overflow-hidden flex flex-col justify-between"
              style={{
                borderTop: `2px solid ${comp.color}20`
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              {/* Custom dynamic color bar on hover */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${comp.color}, transparent)`
                }}
              />

              {/* Graphic schematic viewport */}
              <div className="h-48 bg-[#020408]/40 border-b border-slate-900/60 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-4 rounded-xl border border-slate-900/30 overflow-hidden flex items-center justify-center bg-[#020408]/20">
                  {renderSchematic(comp.id, comp.color)}
                </div>
              </div>

              {/* Details card content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="status-tag text-[9px] font-mono tracking-widest px-3 py-0.5 rounded-full uppercase" style={{ color: comp.color, borderColor: `${comp.color}25`, background: `${comp.color}05` }}>
                      {comp.tag}
                    </span>
                    <span className="font-mono text-[8px] text-slate-650 tracking-wider">// LEVEL.0{idx + 1}</span>
                  </div>

                  <h3 className="font-orbitron text-xl font-bold text-white mb-1.5 group-hover:text-white transition-colors duration-300">
                    {comp.title}
                  </h3>
                  <p className="font-mono text-[9px] text-slate-500 tracking-wider mb-4 uppercase">{comp.tagline}</p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light mb-6">
                    {comp.description}
                  </p>
                </div>

                <div>
                  <div className="h-px bg-slate-900/60 mb-5" />
                  <div className="flex flex-col gap-2.5 mb-6 text-xs font-mono text-slate-450">
                    <div className="flex justify-between">
                      <span className="text-slate-555">PRIZE POOL:</span>
                      <span className="text-white font-semibold">{comp.prize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-555">VENUE:</span>
                      <span className="text-white">{comp.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-555">TEAM SIZE:</span>
                      <span className="text-white">{comp.teamSize}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={comp.detailsUrl} className="btn-outline flex-1 text-center py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg">
                      Blueprints
                    </Link>
                    <Link 
                      href={comp.regUrl} 
                      className="btn-glow flex-1 text-center py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg"
                      style={{
                        borderColor: `${comp.color}35`,
                        color: comp.color,
                        boxShadow: `0 0 15px ${comp.color}08`
                      }}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
