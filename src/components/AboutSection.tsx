'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Code2, Globe, Cpu, Shield, Lightbulb, Rocket, Calendar, MapPin, Trophy, Github, Linkedin, ClipboardList, CheckCircle2, Zap, Users, Upload } from 'lucide-react'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'

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

const team = [
  {
    name: 'Sudev Krishna',
    role: 'Lead Organizer / Developer',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    color: '#ff7300',
  },
  {
    name: 'Aarav Sharma',
    role: 'Technical Head',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    color: '#ffb700',
  },
  {
    name: 'Ananya Iyer',
    role: 'Design Lead',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    color: '#ff3c00',
  },
  {
    name: 'Rohan Verma',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    color: '#ff6b35',
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
        isLeft ? 'right-[50%] w-[5%]' : 'left-[50%] w-[5%]'
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
      <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full items-center justify-center z-20 transition-all duration-500 ${
        isActive 
          ? 'bg-orange-500 border-2 border-amber-400 shadow-[0_0_15px_#ff7300]' 
          : 'bg-[#020408] border-2 border-[#ff7300] shadow-[0_0_8px_rgba(255,115,0,0.3)]'
      }`}>
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
          isActive ? 'bg-black' : 'bg-[#ff7300] animate-pulse'
        }`} />
      </div>
    </div>
  )
}

// ─── Team Member Card ─────────────────────────────────────────────────────────

function TeamMemberCard({ member, index }: { member: typeof team[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className="glass-card corner-bracket rounded-xl p-4 md:p-6 flex flex-col items-center text-center group cursor-default"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div 
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 md:mb-4 p-0.5 transition-all duration-500 group-hover:scale-105"
        style={{ 
          background: `linear-gradient(135deg, ${member.color}, transparent)`,
          boxShadow: `0 0 15px ${member.color}33`
        }}
      >
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <h3 className="font-orbitron text-xs sm:text-sm md:text-base font-bold text-white mb-1 group-hover:text-[#ff7300] transition-colors duration-300 line-clamp-1">
        {member.name}
      </h3>
      <p className="font-mono text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 tracking-wider mb-3 md:mb-4 uppercase line-clamp-1">
        {member.role}
      </p>
      
      <div className="flex gap-3 md:gap-4 items-center mt-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <a 
          href={member.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Github size={14} className="md:w-4 md:h-4" />
        </a>
        <a 
          href={member.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Linkedin size={14} className="md:w-4 md:h-4" />
        </a>
      </div>
    </motion.div>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

export default function AboutSection() {
  const [activeStep, setActiveStep] = useState<number>(0)
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
          className="glass-card rounded-xl p-5 sm:p-8 md:p-12 mb-20 relative overflow-hidden max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 text-left">
            {/* Left content */}
            <div className="col-span-1 lg:col-span-7 min-w-0">
              <div className="flex justify-start mb-4 md:mb-6">
                <Trophy size={36} className="text-[#ffd700] md:w-10 md:h-10" style={{ filter: 'drop-shadow(0 0 12px #ffd70088)' }} />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-light">
                Yuva Tech-Fest Hackathon is a{' '}
                <span className="text-[#ff7300] font-semibold">36-hour marathon</span> of relentless
                innovation. Assemble your team, choose a challenge track, and build a solution that
                could change the world. Guided by{' '}
                <span className="text-[#ffb700] font-semibold">industry mentors</span>, judged by
                experts, and celebrated by the entire SRM community.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mt-6 md:mt-8">
                {[
                  { icon: <MapPin size={14} />, text: 'SRM IST, Tiruchirappalli' },
                  { icon: <Calendar size={14} />, text: '36 Hours · Hackathon Format' },
                  { icon: <Trophy size={14} />, text: 'Prize Pool ₹1 Lakh+' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-slate-400 text-xs md:text-sm">
                    <span className="text-[#ff7300]">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right content - Spline Scene */}
            <div className="hidden lg:block lg:col-span-5 w-full h-[350px] relative overflow-hidden min-w-0">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
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
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#ff730044] to-transparent -translate-x-1/2 hidden md:block shadow-[0_0_8px_rgba(255,115,0,0.2)]" />
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

        {/* Meet the Team */}
        <div className="mt-32">
          <SectionTitle
            tag="// CORE TEAM"
            title="Meet the Organizers"
            subtitle="The minds behind Yuva Tech-Fest Hackathon, working to bring you the best builder experience."
          />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {team.map((member, i) => (
              <TeamMemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
