'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Globe, Cpu, Shield, Lightbulb, Rocket, Calendar, MapPin, Trophy } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const themes = [
  { icon: <Cpu size={28} />, title: 'AI & Machine Learning', desc: 'Build intelligent systems that learn, adapt, and solve real-world challenges using cutting-edge ML models.', color: '#ff7300', tag: 'TRACK 01' },
  { icon: <Globe size={28} />, title: 'Web3 & Blockchain', desc: 'Architect decentralized applications, DeFi protocols, and NFT ecosystems on next-gen blockchains.', color: '#ffb700', tag: 'TRACK 02' },
  { icon: <Shield size={28} />, title: 'Cybersecurity', desc: 'Design robust security tools, pen-testing frameworks, and privacy-preserving technologies.', color: '#ff3c00', tag: 'TRACK 03' },
  { icon: <Code2 size={28} />, title: 'FinTech & EdTech', desc: 'Reimagine finance and education through smart automation, analytics, and inclusive design.', color: '#ff6b35', tag: 'TRACK 04' },
  { icon: <Lightbulb size={28} />, title: 'IoT & Smart Cities', desc: 'Connect the physical and digital world with sensor networks, smart infra, and edge computing.', color: '#ffd700', tag: 'TRACK 05' },
  { icon: <Rocket size={28} />, title: 'Open Innovation', desc: 'No constraints. No boundaries. Bring your wildest idea and disrupt any industry you choose.', color: '#ff4b4b', tag: 'TRACK 06' },
]

const timeline = [
  { date: 'TBA', event: 'Registration Opens', desc: 'Applications go live on the portal', icon: '📋' },
  { date: 'TBA', event: 'Team Confirmation', desc: 'Shortlisted teams receive confirmation', icon: '✅' },
  { date: 'TBA', event: 'Hackathon Kickoff', desc: '36 hours of intense building begins', icon: '⚡' },
  { date: 'TBA', event: 'Mentoring Sessions', desc: 'Industry experts guide your project', icon: '🎯' },
  { date: 'TBA', event: 'Final Submission', desc: 'Submit your project & presentation deck', icon: '🚀' },
  { date: 'TBA', event: 'Grand Finale', desc: 'Demo day, judging & prize ceremony', icon: '🏆' },
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
      <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
      <div className="section-divider mt-6" />
    </motion.div>
  )
}

// ─── Theme Card ───────────────────────────────────────────────────────────────

function ThemeCard({ theme, index }: { theme: typeof themes[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className="glass-card corner-bracket rounded-lg p-6 flex flex-col gap-4 group cursor-default"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between">
        <div
          className="p-3 rounded-lg"
          style={{ color: theme.color, background: `${theme.color}15`, boxShadow: `0 0 20px ${theme.color}20` }}
        >
          {theme.icon}
        </div>
        <span className="status-tag text-[10px]" style={{ color: theme.color, borderColor: `${theme.color}44` }}>
          {theme.tag}
        </span>
      </div>
      <div>
        <h3 className="font-orbitron text-base font-bold text-white mb-2 group-hover:text-[#ff7300] transition-colors duration-300">
          {theme.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">{theme.desc}</p>
      </div>
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded"
        style={{ background: `linear-gradient(90deg, ${theme.color}, transparent)` }}
      />
    </motion.div>
  )
}

// ─── Timeline Item ────────────────────────────────────────────────────────────
// Extracted as a proper component to satisfy React's Rules of Hooks
// (hooks cannot be called inside .map() callbacks)

type TimelineEntry = { date: string; event: string; desc: string; icon: string }

function TimelineItem({ item, index }: { item: TimelineEntry; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-center gap-6 md:gap-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'} mb-8`}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <div className={`glass-card rounded-lg p-5 md:w-[44%] flex gap-4 items-start ${!isLeft ? 'md:flex-row-reverse md:text-right' : ''}`}>
        <div className="text-2xl flex-shrink-0">{item.icon}</div>
        <div className="flex-1">
          <p className="font-mono text-[10px] text-[#ff7300] tracking-widest mb-1">{item.date}</p>
          <h4 className="font-orbitron text-sm font-bold text-white mb-1">{item.event}</h4>
          <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
        </div>
      </div>
      {/* Center dot on the vertical line */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#020408] border-2 border-[#ff7300] items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#ff7300] animate-pulse" />
      </div>
    </motion.div>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

export default function AboutSection() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  return (
    <section id="about" className="relative py-28 bg-[#020408]/80 backdrop-blur-[4px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* What is Yuva Fest */}
        <SectionTitle
          tag="// ABOUT THE EVENT"
          title="What is Yuva Tech-Fest?"
          subtitle="A flagship hackathon hosted by SRM IST Tiruchirappalli — where students, innovators, and builders converge to shape the future of technology."
        />

        {/* Mission statement card */}
        <motion.div
          className="glass-card rounded-xl p-8 md:p-12 mb-20 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-6">
            <Trophy size={40} className="text-[#ffd700]" style={{ filter: 'drop-shadow(0 0 12px #ffd70088)' }} />
          </div>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
            Yuva Tech-Fest Hackathon is a{' '}
            <span className="text-[#ff7300] font-semibold">36-hour marathon</span> of relentless
            innovation. Assemble your team, choose a challenge track, and build a solution that
            could change the world. Guided by{' '}
            <span className="text-[#ffb700] font-semibold">industry mentors</span>, judged by
            experts, and celebrated by the entire SRM community.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: <MapPin size={14} />, text: 'SRM IST, Tiruchirappalli' },
              { icon: <Calendar size={14} />, text: '36 Hours · Hackathon Format' },
              { icon: <Trophy size={14} />, text: 'Prize Pool ₹1 Lakh+' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="text-[#ff7300]">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Challenge Tracks */}
        <SectionTitle tag="// CHALLENGE TRACKS" title="Hack Your Domain" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
          {themes.map((theme, i) => (
            <ThemeCard key={theme.title} theme={theme} index={i} />
          ))}
        </div>

        {/* Timeline */}
        <SectionTitle
          tag="// EVENT SCHEDULE"
          title="The Journey Ahead"
          subtitle="Mark your calendar. Every milestone counts in the race to innovate."
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ff730033] to-transparent -translate-x-1/2 hidden md:block" />
          <div className="flex flex-col gap-0">
            {timeline.map((item, i) => (
              <TimelineItem key={item.event} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          initial={{ opacity: 0 }}
          animate={statsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          {[
            { value: '500+', label: 'Participants', color: '#ff7300' },
            { value: '50+', label: 'Expert Mentors', color: '#ffb700' },
            { value: '6', label: 'Challenge Tracks', color: '#ff3c00' },
            { value: '₹1L+', label: 'Prize Pool', color: '#ffd700' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="glass-card rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div
                className="font-orbitron text-3xl font-black mb-2"
                style={{ color: s.color, textShadow: `0 0 20px ${s.color}66` }}
              >
                {s.value}
              </div>
              <div className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
