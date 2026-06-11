'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Cpu, Globe, Shield, Code2, Lightbulb, Rocket, ClipboardList, CheckCircle2, Zap, Users, Upload, Trophy } from 'lucide-react'

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
  { 
    date: 'TBA', 
    event: 'Registration Opens', 
    desc: 'Applications go live on the portal', 
    icon: <ClipboardList size={20} />,
    details: [
      "Form teams of 2 to 4 members to compete",
      "Submit academic details and developer profiles",
      "No registration fee required for participation"
    ]
  },
  { 
    date: 'TBA', 
    event: 'Team Confirmation', 
    desc: 'Shortlisted teams receive confirmation', 
    icon: <CheckCircle2 size={20} />,
    details: [
      "Teams shortlisted based on profile and tech stack compatibility",
      "Receive official confirmation emails and joining invite to Discord server",
      "RSVP to confirm attendance and lock team slots"
    ]
  },
  { 
    date: 'TBA', 
    event: 'Hackathon Kickoff', 
    desc: '36 hours of intense building begins', 
    icon: <Zap size={20} />,
    details: [
      "Opening ceremony with keynote addresses from industry pioneers",
      "Problem statements, tracking tracks, and API partners announced",
      "Start of the 36-hour coding sprint timer"
    ]
  },
  { 
    date: 'TBA', 
    event: 'Mentoring Sessions', 
    desc: 'Industry experts guide your project', 
    icon: <Users size={20} />,
    details: [
      "Direct access to top developers, designers, and industry mentors",
      "Required checkpoint reviews at the 12-hour and 24-hour marks",
      "Refine project directions and presentation slide deck details"
    ]
  },
  { 
    date: 'TBA', 
    event: 'Final Submission', 
    desc: 'Submit your project & presentation deck', 
    icon: <Upload size={20} />,
    details: [
      "Stage fully working code on a public GitHub repository",
      "Submit a short 3-minute video demonstration highlighting the MVP",
      "Finalize project slides for the judging presentations"
    ]
  },
  { 
    date: 'TBA', 
    event: 'Grand Finale', 
    desc: 'Demo day, judging & prize ceremony', 
    icon: <Trophy size={20} />,
    details: [
      "Pitch live to a panel of expert judges and venture capitalists",
      "5-minute presentation followed by a 3-minute Q&A session",
      "Winner announcement and cash prize distribution ceremony"
    ]
  },
]

const currentLiveMilestoneIndex = 0 // Registration Opens is active

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

interface TimelineEntry {
  date: string
  event: string
  desc: string
  icon: React.ReactNode
  details: string[]
}

function TimelineItem({ 
  item, 
  index, 
  isActive, 
  onClick 
}: { 
  item: TimelineEntry
  index: number
  isActive: boolean
  onClick: () => void 
}) {
  const ref = useRef(null)
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-6 md:gap-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'} mb-10 cursor-pointer`}
      onClick={onClick}
    >
      {/* Horizontal connector line on desktop */}
      <div className={`hidden md:block absolute top-[52px] h-px transition-all duration-500 ${
        isLeft ? 'left-[45%] w-[5%]' : 'left-[50%] w-[5%]'
      } ${
        isActive 
          ? 'bg-gradient-to-r from-orange-500 to-orange-400 shadow-[0_0_8px_#ff7300]' 
          : 'bg-gradient-to-r from-orange-500/20 to-transparent'
      }`} />

      {/* Card container */}
      <motion.div 
        layout
        className={`glass-card rounded-2xl p-6 md:w-[45%] flex gap-4 items-start group relative border transition-all duration-500 ${
          isActive 
            ? 'border-orange-500/50 bg-[#ff7300]/10 shadow-[0_0_30px_rgba(255,115,0,0.15)]' 
            : 'border-orange-500/10 hover:border-orange-500/30'
        }`}
      >
        {/* Index counter */}
        <div className={`absolute top-3 right-4 font-mono text-[9px] transition-colors duration-300 ${
          isActive ? 'text-orange-400' : 'text-orange-500/30 group-hover:text-orange-500/60'
        }`}>
          // {(index + 1).toString().padStart(2, '0')}
        </div>

        {/* Icon wrapper */}
        <div className={`flex-shrink-0 p-2.5 rounded-xl border transition-all duration-500 ${
          isActive 
            ? 'text-black bg-gradient-to-br from-orange-500 to-amber-500 border-transparent shadow-[0_0_15px_rgba(255,115,0,0.4)]' 
            : 'text-slate-400 bg-orange-500/5 border-orange-500/10 group-hover:border-[#ff7300]/30 group-hover:text-[#ff7300]'
        }`}>
          {item.icon}
        </div>

        {/* Text content */}
        <div className="flex-1 text-left">
          <div className="flex flex-col items-start">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold tracking-widest border mb-2 uppercase transition-all duration-500 ${
              isActive 
                ? 'bg-orange-500 text-black border-transparent shadow-[0_0_10px_rgba(255,115,0,0.3)]' 
                : 'bg-orange-500/10 border-orange-500/20 text-[#ff7300]'
            }`}>
              {item.date}
            </span>
            <h4 className={`font-orbitron text-sm md:text-base font-bold mb-1.5 transition-colors duration-300 ${
              isActive ? 'text-[#ff7300]' : 'text-white group-hover:text-[#ff7300]'
            }`}>
              {item.event}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed font-light mb-1">
              {item.desc}
            </p>

            {/* Expanded Details section */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden w-full border-t border-orange-500/10 mt-4 pt-4"
                >
                  <ul className="space-y-2.5">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-normal">
                        <span className="text-orange-500 mt-1 font-mono text-[9px]">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Center dot on the vertical line */}
      <div 
        data-timeline-dot={index}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20 top-[42px]"
      >
        {index < currentLiveMilestoneIndex && (
          <div 
            className={`rounded-full bg-orange-500 shadow-[0_0_10px_#ff7300] transition-all duration-500 ${
              isActive 
                ? 'w-5 h-5 border-2 border-amber-300 shadow-[0_0_15px_#ff7300]' 
                : 'w-4 h-4'
            }`} 
          />
        )}
        
        {index === currentLiveMilestoneIndex && (
          <div className="relative flex items-center justify-center">
            {/* Outer double ring (ping pulse) */}
            <div className={`absolute rounded-full border border-orange-500/40 animate-ping ${
              isActive ? 'w-8 h-8' : 'w-7 h-7'
            }`} />
            {/* Middle ring */}
            <div className={`rounded-full border-2 border-amber-400 bg-orange-950/90 shadow-[0_0_15px_#ff7300] flex items-center justify-center transition-all duration-500 ${
              isActive ? 'w-6 h-6' : 'w-5 h-5'
            }`}>
              {/* Inner dot */}
              <div className={`rounded-full bg-orange-500 animate-pulse ${
                isActive ? 'w-2 h-2' : 'w-1.5 h-1.5'
              }`} />
            </div>
          </div>
        )}
        
        {index > currentLiveMilestoneIndex && (
          <div 
            className={`rounded-full bg-[#020408] transition-all duration-500 border-2 ${
              isActive 
                ? 'border-orange-500/60 shadow-[0_0_8px_rgba(255,115,0,0.3)] w-5 h-5' 
                : 'border-slate-700/80 w-4 h-4'
            }`}
          />
        )}
      </div>
    </div>
  )
}

// ─── Events Section Component ─────────────────────────────────────────────────

export default function EventsSection() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineStyles, setLineStyles] = useState({ top: 0, activeHeight: 0, totalHeight: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateLine = () => {
      const firstDot = container.querySelector('[data-timeline-dot="0"]') as HTMLElement
      const currentDot = container.querySelector(`[data-timeline-dot="${currentLiveMilestoneIndex}"]`) as HTMLElement
      const lastDot = container.querySelector(`[data-timeline-dot="${timeline.length - 1}"]`) as HTMLElement

      if (firstDot && currentDot && lastDot) {
        const containerRect = container.getBoundingClientRect()
        const firstDotRect = firstDot.getBoundingClientRect()
        const currentDotRect = currentDot.getBoundingClientRect()
        const lastDotRect = lastDot.getBoundingClientRect()

        const firstCenterY = (firstDotRect.top + firstDotRect.height / 2) - containerRect.top
        const currentCenterY = (currentDotRect.top + currentDotRect.height / 2) - containerRect.top
        const lastCenterY = (lastDotRect.top + lastDotRect.height / 2) - containerRect.top

        setLineStyles({
          top: firstCenterY,
          activeHeight: Math.max(0, currentCenterY - firstCenterY),
          totalHeight: Math.max(0, lastCenterY - firstCenterY)
        })
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updateLine()
    })
    resizeObserver.observe(container)

    window.addEventListener('resize', updateLine)
    const timer = setTimeout(updateLine, 50)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateLine)
      clearTimeout(timer)
    }
  }, [activeStep])

  return (
    <section id="events" className="relative py-28 bg-[#020408]/80 backdrop-blur-[4px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
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

        <div ref={containerRef} className="relative max-w-3xl mx-auto">
          {/* Vertical center line container */}
          <div 
            className="absolute left-1/2 w-[2px] -translate-x-1/2 hidden md:block transition-all duration-300 ease-out"
            style={{ 
              top: `${lineStyles.top}px`, 
              height: `${lineStyles.totalHeight}px` 
            }}
          >
            {/* Background track */}
            <div className="absolute inset-0 bg-slate-800/80 rounded" />
            {/* Active glowing track */}
            <div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#ff7300] to-[#ffb700] shadow-[0_0_10px_rgba(255,115,0,0.8)] transition-all duration-300 ease-out rounded"
              style={{ 
                height: `${lineStyles.activeHeight}px` 
              }}
            />
          </div>
          <div className="flex flex-col gap-0">
            {timeline.map((item, i) => (
              <TimelineItem 
                key={item.event} 
                item={item} 
                index={i} 
                isActive={activeStep === i}
                onClick={() => setActiveStep(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
