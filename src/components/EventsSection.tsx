'use client'

import { useRef } from 'react'
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
    icon: <Terminal className="w-8 h-8 text-[#ff7300]" />,
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
    icon: <ShieldAlert className="w-8 h-8 text-[#ff3c00]" />,
    color: '#ff3c00',
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
    icon: <Rocket className="w-8 h-8 text-[#ffb700]" />,
    color: '#ffb700',
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
    icon: <Bot className="w-8 h-8 text-[#ff6b35]" />,
    color: '#ff6b35',
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
    icon: <Sparkles className="w-8 h-8 text-[#ffd700]" />,
    color: '#ffd700',
    description: 'Master next-generation frameworks. Intensive hands-on workshops covering large language model fine-tuning, smart contracts, and decentralized app architectures.',
    regUrl: '/register?event=workshop',
    detailsUrl: '/events/workshop',
  },
]

// ─── Section Title ────────────────────────────────────────────────────────────

function SectionTitle({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">{tag}</span>
      <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
      <div className="section-divider mx-auto mt-6" />
    </motion.div>
  )
}

// ─── Events Section Component ─────────────────────────────────────────────────

export default function EventsSection() {
  const bannerRef = useRef(null)
  const isBannerInView = useInView(bannerRef, { once: true })

  return (
    <div className="relative min-h-screen bg-[#020408] overflow-hidden pb-24">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />

      {/* Dynamic Header */}
      <div className="relative pt-24 pb-4 z-20 max-w-7xl mx-auto px-6 text-center">
        <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">// EVENT SPHERE</span>
        <h1 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-6">Events Dashboard</h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-12 leading-relaxed font-light">
          Browse the arena. Select a card below to explore full details, challenge rules, schedules, or secure your slot.
        </p>

        {/* Total Prize Pool Banner Callout */}
        <motion.div
          ref={bannerRef}
          className="glass-card max-w-xl mx-auto mb-16 p-6 sm:p-8 rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-amber-500/5 relative overflow-hidden shadow-[0_0_40px_rgba(255,115,0,0.1)] flex flex-col sm:flex-row items-center justify-center gap-5 cursor-default"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isBannerInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Animated decorative ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.03)_0%,transparent_70%)] pointer-events-none animate-pulse" />
          
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-[#ff7300] rounded-xl flex-shrink-0">
            <Coins size={36} className="animate-bounce" />
          </div>
          
          <div className="text-center sm:text-left relative z-10">
            <p className="font-mono text-[10px] text-orange-400 tracking-[0.2em] uppercase mb-1">CASH POOLS & REWARDS</p>
            <h3 className="font-orbitron text-2xl sm:text-3xl font-black text-white leading-tight">
              ₹1,20,000+ <span className="text-[#ff7300]">Total Prizes</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed font-light">
              Cash bounties distributed across flagship competitions, track challenges, and category awards.
            </p>
          </div>
        </motion.div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {competitions.map((comp, idx) => (
            <motion.div
              key={comp.title}
              className="glass-card corner-bracket rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-orange-500/10 hover:border-[#ff7300]/30 transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,115,0,0.05)] group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {/* Top Details */}
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-white/5 rounded-xl border border-slate-800/80 group-hover:border-[#ff7300]/30 transition-colors">
                    {comp.icon}
                  </div>
                  <span className="status-tag text-[9px] font-mono tracking-widest px-3 py-0.5 rounded-full uppercase" style={{ color: comp.color, borderColor: `${comp.color}44` }}>
                    {comp.tag}
                  </span>
                </div>

                <h3 className="font-orbitron text-xl font-bold text-white mb-1.5 group-hover:text-[#ff7300] transition-colors duration-300">
                  {comp.title}
                </h3>
                <p className="font-mono text-[10px] text-[#ff7300] tracking-wide mb-4 uppercase">{comp.tagline}</p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light mb-6">
                  {comp.description}
                </p>
              </div>

              {/* Bottom stats and action buttons */}
              <div>
                <div className="h-px bg-slate-800/80 mb-5" />
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
                    <Award size={14} className="text-[#ff7300]" />
                    <span className="text-slate-500">Prize Pool:</span>
                    <span className="font-semibold text-white">{comp.prize}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
                    <MapPin size={14} className="text-[#ffb700]" />
                    <span className="text-slate-500">Venue:</span>
                    <span className="text-white">{comp.venue}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
                    <Users size={14} className="text-[#ff3c00]" />
                    <span className="text-slate-500">Team Size:</span>
                    <span className="text-white">{comp.teamSize}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={comp.detailsUrl} className="btn-outline flex-1 text-center py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg">
                    Explore Details
                  </Link>
                  <Link href={comp.regUrl} className="btn-glow flex-1 text-center py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg">
                    Register Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
