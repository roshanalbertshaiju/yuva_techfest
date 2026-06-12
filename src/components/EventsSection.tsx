'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Terminal, ShieldAlert, Bot, Sparkles, Rocket, Award, MapPin, Users, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import CardBlueprint from '@/components/ui/card-blueprint'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { defaultEvents } from '@/lib/db-seed'

// ─── Icon Map Resolver ────────────────────────────────────────────────────────

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-6 h-6" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  Bot: <Bot className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />
}

const getIcon = (name: string) => iconMap[name] || <Terminal className="w-6 h-6" />

export default function EventsSection() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'))
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      if (list.length > 0) {
        setEvents(list)
      } else {
        console.warn("Firestore events collection is empty. Falling back to static events.")
        setEvents(defaultEvents)
      }
    } catch (error) {
      console.error("Error loading events from Firestore, falling back to static events:", error)
      setEvents(defaultEvents)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center gap-4 text-slate-400 font-mono">
        <Loader2 className="animate-spin text-[#ff7300]" size={36} />
        <p className="text-xs tracking-[0.2em]">// LOADING EVENT MATRIX...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center gap-4 text-slate-400 font-mono">
        <p className="text-xs tracking-[0.2em]">// ERROR: NO EVENT DATA FOUND</p>
      </div>
    )
  }
  const hackathon = events.find(e => e.id === 'hackathon') || events[0]
  const otherComps = events.filter(e => e.id !== hackathon.id)

  return (
    <div className="relative min-h-screen bg-[#020408] overflow-hidden pb-32">
      {/* Embedded styles for horizontal marquee */}
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
          className="glass-card corner-bracket rounded-3xl border border-slate-900 bg-[#04070d]/40 hover:bg-[#070b14]/70 hover:border-orange-500/35 transition-all duration-500 hover:shadow-[0_0_45px_rgba(255,115,0,0.06)] group relative overflow-hidden flex flex-col lg:flex-row cursor-pointer"
          onClick={() => router.push(`/events/${hackathon.id}`)}
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
                  {getIcon(hackathon.iconName)}
                </span>
                <div>
                  <span className="status-tag text-[9px] font-mono tracking-widest px-3 py-0.5 rounded-full uppercase text-[#ff7300] border-orange-500/25 bg-orange-500/5">
                    {hackathon.tag}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 tracking-wider uppercase ml-3 hidden sm:inline">// DEPLOYMENT_SECURED</span>
                </div>
              </div>

              <h2 className="font-orbitron text-3xl sm:text-4xl font-extrabold text-white mb-2 group-hover:text-[#ff7300] transition-colors duration-300">
                {hackathon.title}
              </h2>
              <p className="font-mono text-[10px] text-orange-450 tracking-widest mb-6 uppercase">{hackathon.tagline}</p>
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
                <Link 
                  href={hackathon.detailsUrl || `/events/${hackathon.id}`} 
                  className="btn-outline px-6 py-3 text-xs text-center font-bold tracking-widest uppercase rounded-xl flex-1 justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  Explore Details
                </Link>
                <Link 
                  href={hackathon.regUrl || `/register?event=${hackathon.id}`} 
                  className="btn-glow px-6 py-3 text-xs text-center font-bold tracking-widest uppercase rounded-xl flex-1 justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  Initiate Registration
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Imagery Viewport */}
          <div className="lg:w-[38%] bg-[#020408]/30 p-8 flex items-center justify-center relative min-h-[280px] lg:min-h-0">
            <div className="absolute inset-4 rounded-2xl border border-slate-900/60 overflow-hidden bg-[#020408]/40">
              <Image
                src={hackathon.image || '/hackathon.png'}
                alt={hackathon.title || 'Event image'}
                fill
                className="object-cover opacity-50 group-hover:opacity-85 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 38vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020408]/40 to-transparent pointer-events-none" />
              <CardBlueprint id={hackathon.id} color={hackathon.color} />
            </div>
          </div>
        </motion.div>

        {/* SECONDARY COMPETITIONS: 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherComps.map((comp, idx) => (
            <motion.div
              key={comp.id || idx}
              className="glass-card corner-bracket rounded-3xl border border-slate-900 bg-[#04070d]/40 hover:bg-[#070b14]/70 hover:border-slate-800 transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,115,0,0.03)] group relative overflow-hidden flex flex-col justify-between cursor-pointer"
              onClick={() => router.push(`/events/${comp.id}`)}
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
                <div className="absolute inset-4 rounded-xl border border-slate-900/30 overflow-hidden bg-[#020408]/20">
                  <Image
                    src={comp.image || '/hackathon.png'}
                    alt={comp.title || 'Event image'}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-75 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020408]/30 to-transparent pointer-events-none" />
                  <CardBlueprint id={comp.id} color={comp.color} />
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
                    <Link 
                      href={`/events/${comp.id}`}
                      className="btn-outline flex-1 text-center py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details
                    </Link>
                    <Link 
                      href={comp.regUrl || `/register?event=${comp.id}`} 
                      className="btn-glow flex-1 text-center py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        borderColor: `${comp.color}35`,
                        color: '#000000',
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
