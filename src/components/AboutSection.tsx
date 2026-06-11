'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, MapPin, Trophy, Github, Linkedin } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'

// ─── Data ────────────────────────────────────────────────────────────────────

const team = [
  {
    name: 'Abhinav Nayak',
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

// ─── About Section Component ──────────────────────────────────────────────────

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
          className="glass-card rounded-xl p-6 sm:p-10 md:p-14 mb-20 relative overflow-hidden max-w-4xl mx-auto border border-orange-500/10 text-center flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex justify-center mb-6">
              <Trophy size={42} className="text-[#ffd700]" style={{ filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.4))' }} />
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed font-light max-w-2xl mx-auto">
              Yuva Tech-Fest Hackathon is a{' '}
              <span className="text-[#ff7300] font-semibold">36-hour marathon</span> of relentless
              innovation. Assemble your team, choose a challenge track, and build a solution that
              could change the world. Guided by{' '}
              <span className="text-[#ffb700] font-semibold">industry mentors</span>, judged by
              experts, and celebrated by the entire SRM community.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-8 justify-center mt-10 border-t border-slate-850 w-full pt-8">
              {[
                { icon: <MapPin size={16} />, text: 'SRM IST, Tiruchirappalli' },
                { icon: <Calendar size={16} />, text: '36 Hours · In-Person' },
                { icon: <Trophy size={16} />, text: 'Prize Pool ₹1 Lakh+' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 text-slate-400 text-sm font-medium">
                  <span className="text-[#ff7300]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
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
