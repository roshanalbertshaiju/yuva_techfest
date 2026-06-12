'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Lucide from 'lucide-react'
import Navbar from '@/components/Navbar'
import PrizesSection from '@/components/PrizesSection'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

// Helper to resolve string icon names to Lucide elements dynamically
const getIcon = (name: string, size = 20) => {
  const Icon = (Lucide as any)[name]
  return Icon ? <Icon size={size} /> : <Lucide.HelpCircle size={size} />
}

interface EventDetailsClientProps {
  eventId: string
}

export default function EventDetailsClient({ eventId }: EventDetailsClientProps) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeDossierTab, setActiveDossierTab] = useState<'tracks' | 'rules' | 'checklist'>('tracks')
  const [activeStep, setActiveStep] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineStyles, setLineStyles] = useState({ top: 0, activeHeight: 0, totalHeight: 0 })

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        const docRef = doc(db, 'events', eventId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setEvent(docSnap.data())
        } else {
          // Try to load from static fallbacks
          const { defaultEvents } = await import('@/lib/db-seed')
          const fallback = defaultEvents.find(e => e.id === eventId)
          if (fallback) {
            console.warn(`Event ${eventId} not found in Firestore. Loaded from static fallback.`)
            setEvent(fallback)
          }
        }
      } catch (error) {
        console.error("Error loading event detail, loading from static fallback:", error)
        try {
          const { defaultEvents } = await import('@/lib/db-seed')
          const fallback = defaultEvents.find(e => e.id === eventId)
          if (fallback) {
            setEvent(fallback)
          }
        } catch (innerErr) {
          console.error("Fallback load failed:", innerErr)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [eventId])

  useEffect(() => {
    if (!event || !event.timeline || event.timeline.length === 0) return
    const container = containerRef.current
    if (!container) return

    const updateLine = () => {
      const firstDot = container.querySelector('[data-timeline-dot="0"]') as HTMLElement
      const currentDot = container.querySelector(`[data-timeline-dot="${activeStep}"]`) as HTMLElement
      const lastDot = container.querySelector(`[data-timeline-dot="${event.timeline.length - 1}"]`) as HTMLElement

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
  }, [activeStep, event])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center gap-4 text-slate-400 font-mono">
        <Lucide.Loader2 className="animate-spin text-[#ff7300]" size={36} />
        <p className="text-xs tracking-[0.2em]">// LOADING DATA DOSSIER...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#020408] flex flex-col justify-between pt-24 text-center">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 max-w-md mx-auto">
          <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-2xl text-orange-500">
            <Lucide.ShieldAlert size={40} className="animate-pulse" />
          </div>
          <h1 className="font-orbitron text-2xl font-black text-white">EVENT NOT REGISTERED</h1>
          <p className="text-slate-400 text-xs leading-relaxed font-light font-mono">
            // ERROR: THE REQUESTED MODULE &apos;{eventId}&apos; IS NOT FOUND ON DATABASE LINK.
          </p>
          <Link href="/events" className="btn-outline px-6 py-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 mx-auto">
            <Lucide.ArrowLeft size={14} /> Back to Arena
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const color = event.color || '#ff7300'

  return (
    <main className="relative min-h-screen pt-24 bg-[#020408]">
      <style dangerouslySetInnerHTML={{ __html: `
        .dynamic-track-card:hover {
          border-color: ${color}44 !important;
          box-shadow: 0 0 20px ${color}15 !important;
        }
      ` }} />
      <div className="scan-line" />
      <Navbar />

      {/* Widescreen Hero Banner */}
      <div className="relative w-full h-[35vh] sm:h-[45vh] min-h-[320px] border-b border-slate-900 overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-slate-950/30 z-10 pointer-events-none" />
        <Image
          src={event.image || '/hackathon.png'}
          alt={event.title || 'Event Hero'}
          fill
          className="object-cover opacity-35 scale-105"
          priority
        />
        <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#020408] to-transparent pointer-events-none" />
        
        {/* Left-Aligned Title Block */}
        <div className="absolute bottom-8 left-0 right-0 z-20 max-w-6xl mx-auto px-6">
          <Link href="/events" className="font-mono text-xs text-orange-400 hover:text-white transition-colors tracking-widest uppercase mb-4 inline-block">
            &lt; Back to Dashboard
          </Link>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase mb-2 block" style={{ color }}>
            // ARENA DEPLOYMENT
          </span>
          <h1 className="font-orbitron text-4xl sm:text-6xl font-black text-white leading-none mb-3">
            {event.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
            {event.tagline || event.description}
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Dossier & Telemetry Sidebar */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Dossier Tabs (Col-span 8) */}
        <div className="lg:col-span-8 flex flex-col">
          
          {/* Tabs Selector Header */}
          <div className="flex border-b border-slate-900 mb-6 bg-[#04070d]/20 rounded-t-xl overflow-hidden">
            {[
              { id: 'tracks', label: event.tag === 'WORKSHOP' ? 'WORKSHOP MODULES' : 'CHALLENGE TRACKS' },
              { id: 'rules', label: 'EVALUATION RULES' },
              { id: 'checklist', label: 'EQUIPMENT CHECKLIST' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDossierTab(tab.id as any)}
                className={`flex-1 py-3.5 px-4 text-center font-mono text-[9px] sm:text-xs font-bold tracking-widest transition-all ${
                  activeDossierTab === tab.id 
                    ? 'text-white border-b-2' 
                    : 'text-slate-500 hover:text-slate-350'
                }`}
                style={activeDossierTab === tab.id ? { 
                  borderColor: color,
                  background: `${color}10`
                } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeDossierTab === 'tracks' && (
                <motion.div
                  key="tracks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {event.tracks?.map((track: any, i: number) => (
                    <div
                      key={i}
                      className="glass-card corner-bracket dynamic-track-card rounded-lg p-6 flex flex-col gap-4 group cursor-default border border-slate-900 bg-[#04070d]/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="p-3 rounded-lg text-white"
                          style={{ background: `${color}15`, color: color }}
                        >
                          {getIcon(event.iconName || 'Terminal', 24)}
                        </div>
                        <span className="status-tag text-[10px]" style={{ color: color, borderColor: `${color}44` }}>
                          {track.tag || `TRACK 0${i + 1}`}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-orbitron text-base font-bold text-white mb-2" style={{ transition: 'colors 0.3s' }}>
                          {track.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">{track.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeDossierTab === 'rules' && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card corner-bracket rounded-xl p-6 border border-slate-900 bg-[#04070d]/30"
                >
                  <ul className="space-y-4">
                    {event.rules?.map((rule: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed font-light">
                        <span className="font-mono text-[10px] mt-1 flex-shrink-0" style={{ color }}>•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeDossierTab === 'checklist' && (
                <motion.div
                  key="checklist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card corner-bracket rounded-xl p-6 border border-slate-900 bg-[#04070d]/30"
                >
                  <ul className="space-y-4">
                    {event.checklist?.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-slate-330 leading-relaxed font-light">
                        <span className="mt-0.5 flex-shrink-0" style={{ color }}>
                          <Lucide.CheckSquare size={14} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tactical Telemetry Sidebar (Col-span 4) */}
        <div className="lg:col-span-4">
          <div className="glass-card corner-bracket rounded-2xl p-6 border border-slate-900 bg-[#04070d]/40 flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <div className="flex items-center justify-between mb-5 border-b border-slate-900 pb-3">
                <span className="font-mono text-[9px] text-slate-500 uppercase">SYS.METRICS</span>
                <span className="font-mono text-[9px] animate-pulse flex items-center gap-1" style={{ color }}>
                  <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color }} />
                  SYS // ONLINE
                </span>
              </div>
              
              <div className="space-y-5">
                <div>
                  <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block mb-1">COMPETITION BOUNTY</span>
                  <span className="font-orbitron text-xl font-black text-white">{event.prize}</span>
                  <span className="font-mono text-[8.5px] text-slate-500 block mt-0.5">Rank rewards & championship certificates</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block mb-1">ARENA VENUE</span>
                  <span className="font-orbitron text-sm font-bold text-white flex items-center gap-1.5">
                    <Lucide.MapPin size={14} className="text-[#ffb700]" />
                    {event.venue}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block mb-1">COMPETITION SCALE</span>
                  <span className="font-orbitron text-xs font-bold flex items-center gap-1.5" style={{ color }}>
                    <Lucide.Calendar size={13} />
                    {event.teamSize}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block mb-1">CAPACITY STATUS</span>
                  <span className="font-orbitron text-xs font-bold text-white flex items-center gap-2">
                    <span>SECTOR SECURED</span>
                    <span className="text-slate-500 text-[10px] font-mono font-light">(ROLLING REGISTRATIONS)</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-900/60 pt-5">
              <Link
                href={`/register?event=${event.id}`}
                className="btn-glow block w-full text-center py-3 text-xs font-bold tracking-widest uppercase rounded-xl text-black"
                style={{
                  background: `linear-gradient(135deg, ${color}, #fff)`,
                  boxShadow: `0 0 20px ${color}44`
                }}
              >
                Register for {event.title}
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Timeline */}
      {event.timeline && event.timeline.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-[0.3em] uppercase mb-4 block" style={{ color }}>
              // EVENT SCHEDULE
            </span>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">Milestone Timeline</h2>
            <div className="section-divider mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          </div>

          <div ref={containerRef} className="relative max-w-3xl mx-auto">
            <div 
              className="absolute left-1/2 w-[2px] -translate-x-1/2 hidden md:block transition-all duration-300 ease-out"
              style={{ 
                top: `${lineStyles.top}px`, 
                height: `${lineStyles.totalHeight}px` 
              }}
            >
              <div className="absolute inset-0 bg-slate-800/80 rounded" />
              <div 
                className="absolute top-0 left-0 w-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out rounded"
                style={{ 
                  height: `${lineStyles.activeHeight}px`,
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`
                }}
              />
            </div>
            <div className="flex flex-col gap-0">
              {event.timeline.map((item: any, i: number) => {
                const isActive = activeStep === i
                const isLeft = i % 2 === 0
                return (
                  <div
                    key={i}
                    className={`relative flex items-center gap-6 md:gap-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'} mb-10 cursor-pointer`}
                    onClick={() => setActiveStep(i)}
                  >
                    <div className={`hidden md:block absolute top-[52px] h-px transition-all duration-500 ${
                      isLeft ? 'left-[45%] w-[5%]' : 'left-[50%] w-[5%]'
                    }`}
                    style={isActive ? {
                      background: `linear-gradient(to right, ${color}, transparent)`,
                      boxShadow: `0 0 8px ${color}`
                    } : {
                      background: `linear-gradient(to right, ${color}20, transparent)`
                    }} />

                    <motion.div 
                      layout
                      className="glass-card rounded-2xl p-6 md:w-[45%] flex gap-4 items-start group relative border transition-all duration-500"
                      style={isActive ? {
                        borderColor: `${color}50`,
                        background: `${color}10`,
                        boxShadow: `0 0 30px ${color}22`
                      } : {
                        borderColor: `${color}10`
                      }}
                    >
                      <div className="absolute top-3 right-4 font-mono text-[9px] text-slate-650">
                        // {(i + 1).toString().padStart(2, '0')}
                      </div>

                      <div 
                        className="flex-shrink-0 p-2.5 rounded-xl border transition-all duration-500"
                        style={isActive ? {
                          color: '#000',
                          backgroundColor: color,
                          borderColor: 'transparent',
                          boxShadow: `0 0 15px ${color}55`
                        } : {
                          color: '#94a3b8',
                          backgroundColor: `${color}08`,
                          borderColor: `${color}15`
                        }}
                      >
                        {getIcon(item.iconName || 'Clock', 20)}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex flex-col items-start">
                          <span 
                            className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold tracking-widest border mb-2 uppercase transition-all duration-500"
                            style={isActive ? {
                              backgroundColor: color,
                              color: '#000',
                              borderColor: 'transparent',
                              boxShadow: `0 0 10px ${color}33`
                            } : {
                              backgroundColor: `${color}10`,
                              borderColor: `${color}20`,
                              color: color
                            }}
                          >
                            {item.date}
                          </span>
                          <h4 
                            className="font-orbitron text-sm md:text-base font-bold mb-1.5 transition-colors duration-300"
                            style={isActive ? { color } : {}}
                          >
                            {item.event}
                          </h4>
                          <p className="text-slate-400 text-xs leading-relaxed font-light mb-1">
                            {item.desc}
                          </p>

                          <AnimatePresence initial={false}>
                            {isActive && item.details && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden w-full border-t border-slate-900/60 mt-4 pt-4"
                              >
                                <ul className="space-y-2.5">
                                  {item.details.map((detail: string, dIdx: number) => (
                                    <li key={dIdx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-normal">
                                      <span className="mt-1 font-mono text-[9px]" style={{ color }}>•</span>
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

                    <div 
                      data-timeline-dot={i}
                      className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20 top-[42px]"
                    >
                      {i < activeStep && (
                        <div 
                          className="rounded-full w-3 h-3 transition-all duration-500"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      
                      {i === activeStep && (
                        <div className="relative flex items-center justify-center">
                          <div 
                            className="absolute rounded-full border animate-ping w-8 h-8"
                            style={{ borderColor: `${color}50` }}
                          />
                          <div 
                            className="rounded-full border-2 bg-slate-950/90 flex items-center justify-center transition-all duration-500 w-6 h-6"
                            style={{ borderColor: color, boxShadow: `0 0 15px ${color}` }}
                          >
                            <div 
                              className="rounded-full animate-pulse w-2 h-2"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {i > activeStep && (
                        <div className="rounded-full bg-[#020408] border-2 border-slate-700/80 w-4 h-4 transition-all duration-500" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Prizes */}
      <PrizesSection />

      <Footer />
    </main>
  )
}
