'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Calendar, MapPin, Users, Loader2, ArrowRight, ShieldCheck, Ticket as TicketIcon, X, Printer, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Ticket {
  id: string
  uid: string
  registrationId?: string
  eventId: string
  eventName: string
  studentName: string
  studentEmail: string
  createdAt?: any
}

interface EventData {
  id: string
  title: string
  tagline: string
  color: string
  venue: string
  prize: string
}

// Fallback event details if DB events are not loaded
const fallbackEventMap: Record<string, Partial<EventData>> = {
  hackathon: { title: 'Yuva Hackathon 36H', color: '#ff7300', venue: 'CS Lab Block', tagline: '36-hour non-stop building sprint' },
  ctf: { title: 'Cyber-Volt CTF', color: '#00ccff', venue: 'Cyber Lab', tagline: 'Jeopardy-style capture the flag' },
  dronerace: { title: 'Sky-Rush Drone Race', color: '#ff0055', venue: 'Football Ground', tagline: 'High-speed FPV drone racing' },
  robowars: { title: 'Combat Robo-Wars', color: '#ffcc00', venue: 'Open Amphitheatre', tagline: 'Custom combat robot showdown' },
  workshop: { title: 'AI & Web3 Workshops', color: '#b300ff', venue: 'Seminar Hall 3', tagline: 'Hands-on expert-led workshops' }
}

function mapTrackToEventId(track: string): string {
  if (!track) return 'hackathon'
  const t = track.toLowerCase()
  if (t.includes('ctf') || t.includes('cyber')) return 'ctf'
  if (t.includes('drone') || t.includes('sky')) return 'dronerace'
  if (t.includes('robo') || t.includes('combat')) return 'robowars'
  if (t.includes('workshop')) return 'workshop'
  return 'hackathon'
}

export default function TicketsClient() {
  const { user, loading: authLoading } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [events, setEvents] = useState<Record<string, EventData>>({})
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Fetch Events
        const eventsSnap = await getDocs(collection(db, 'events'))
        const eventsMap: Record<string, EventData> = {}
        eventsSnap.forEach((doc) => {
          const data = doc.data()
          eventsMap[doc.id] = {
            id: doc.id,
            title: data.title || data.name || 'Event',
            tagline: data.tagline || '',
            color: data.color || '#ff7300',
            venue: data.venue || 'Main Campus',
            prize: data.prize || ''
          }
        })
        setEvents(eventsMap)

        // 2. Fetch Tickets
        const ticketsSnap = await getDocs(
          query(collection(db, 'tickets'), where('uid', '==', user.uid))
        )
        const fetchedTickets: Ticket[] = []
        ticketsSnap.forEach((doc) => {
          fetchedTickets.push({ id: doc.id, ...doc.data() } as Ticket)
        })

        // 3. Fetch Registrations (for legacy or fallback compatibility)
        const regsSnap = await getDocs(
          query(collection(db, 'registrations'), where('uid', '==', user.uid))
        )
        const fetchedRegs: any[] = []
        regsSnap.forEach((doc) => {
          fetchedRegs.push({ id: doc.id, ...doc.data() })
        })

        // Combine and resolve
        const resolvedTickets: Ticket[] = [...fetchedTickets]
        
        // Add dynamic tickets for registrations that don't have a ticket doc yet
        fetchedRegs.forEach((reg) => {
          const hasTicket = fetchedTickets.some(
            (t) => t.registrationId === reg.id || t.eventId === reg.eventId || t.eventName === reg.track
          )
          if (!hasTicket) {
            const eventId = reg.eventId || mapTrackToEventId(reg.track)
            resolvedTickets.push({
              id: reg.id,
              uid: user.uid,
              registrationId: reg.id,
              eventId: eventId,
              eventName: reg.track || 'Yuva Tech-Fest Event',
              studentName: reg.name,
              studentEmail: reg.email,
              createdAt: reg.createdAt
            })
          }
        })

        // Sort in memory by createdAt descending
        resolvedTickets.sort((a, b) => {
          const timeA = a.createdAt?.seconds || (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0)
          const timeB = b.createdAt?.seconds || (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0)
          return timeB - timeA
        })

        setTickets(resolvedTickets)
      } catch (err) {
        console.error('Error fetching ticket data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading])

  const handlePrint = () => {
    window.print()
  }

  // Helper to get event details
  const getEventDetails = (ticket: Ticket) => {
    const dbEvent = events[ticket.eventId]
    if (dbEvent) return dbEvent
    
    // Fallback to static mapping
    const fallback = fallbackEventMap[ticket.eventId] || {}
    return {
      id: ticket.eventId,
      title: ticket.eventName || fallback.title || 'Yuva Tech-Fest Event',
      color: fallback.color || '#ff7300',
      venue: fallback.venue || 'SRM Campus',
      tagline: fallback.tagline || 'Technical competition arena',
      prize: fallback.prize || ''
    }
  }

  if (authLoading || loading) {
    return (
      <main className="relative min-h-screen pt-24 bg-[#020408] text-white flex flex-col justify-between">
        <div className="scan-line" />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 relative z-10">
          <Loader2 className="w-12 h-12 text-[#ff7300] animate-spin" />
          <p className="font-mono text-xs tracking-widest text-[#ff7300] animate-pulse">
            // SCANNING DATABASE PASSES
          </p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="relative min-h-screen pt-24 bg-[#020408] text-white flex flex-col justify-between">
        <div className="scan-line" />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 animate-pulse">
            <TicketIcon size={32} className="text-[#ff7300]" />
          </div>
          <h1 className="font-orbitron text-2xl font-black tracking-tight text-white mb-2">
            ACCESS_DENIED // PASS PORTAL
          </h1>
          <p className="text-slate-400 font-mono text-xs leading-relaxed max-w-sm mb-8">
            You must connect your developer terminal (login) to pull active event tickets and credentials.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn-glow px-8 py-3 text-xs tracking-widest font-black font-mono rounded-xl"
          >
            CONNECT_TERMINAL
          </button>
        </div>
        <Footer />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen pt-24 bg-[#020408] text-white flex flex-col justify-between print:bg-white print:text-black print:pt-0">
      <div className="scan-line print:hidden" />
      <Navbar />

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 relative z-10 print:py-0 print:px-0">
        {/* Header */}
        <div className="mb-12 print:hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px bg-gradient-to-r from-[#ff7300] to-transparent flex-1" />
            <span className="font-mono text-[9px] text-[#ff7300] tracking-widest font-bold">// SECURED DATA PASS PORTAL</span>
            <div className="h-px bg-gradient-to-l from-[#ff7300] to-transparent flex-1" />
          </div>
          <h1 className="font-orbitron text-3xl md:text-4xl font-black text-center text-white">
            MY ACCESS <span className="text-orange-gradient">PASSES</span>
          </h1>
          <p className="text-slate-400 text-center text-xs mt-2 max-w-md mx-auto">
            Scan your entry tickets at the registration desk upon campus arrival for quick validation.
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="glass-card border border-slate-900 rounded-3xl p-12 text-center max-w-md mx-auto relative overflow-hidden print:hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,115,0,0.05)_0%,transparent_60%)] pointer-events-none" />
            <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-6">
              <QrCode size={24} className="text-slate-500" />
            </div>
            <h3 className="font-orbitron text-lg font-bold text-white mb-1">No Active Passes Found</h3>
            <p className="text-slate-400 font-mono text-[10px] leading-relaxed mb-6">
              SYSTEM_LOG: Zero database registrations found for UID: {user.uid.substring(0, 8)}...
            </p>
            <Link
              href="/events"
              className="btn-glow inline-flex items-center gap-2 px-6 py-3 text-xs tracking-wider font-bold rounded-xl"
            >
              EXPLORE EVENTS <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:hidden">
            {tickets.map((ticket, index) => {
              const details = getEventDetails(ticket)
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedTicket(ticket)}
                  className="group relative cursor-pointer glass-card corner-bracket rounded-3xl border border-slate-900 bg-[#050b14]/70 p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-slate-800 hover:shadow-[0_10px_30px_rgba(255,115,0,0.05)]"
                  style={{ borderTop: `3px solid ${details.color}80` }}
                >
                  {/* Neon Glow Hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% -20%, ${details.color}10 0%, transparent 60%)`
                    }}
                  />

                  {/* Top Bar */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">EVENT ENTRY PASS</span>
                      <h3 className="font-orbitron text-base font-bold text-white mt-1 group-hover:text-[#ff7300] transition-colors line-clamp-1">
                        {details.title}
                      </h3>
                    </div>
                    <div
                      className="px-2.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1"
                      style={{
                        backgroundColor: `${details.color}15`,
                        color: details.color,
                        border: `1px solid ${details.color}30`
                      }}
                    >
                      <Sparkles size={8} /> ACTIVE
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={12} className="text-slate-500" />
                      <span className="font-mono text-[10px] truncate">{details.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={12} className="text-slate-500" />
                      <span className="font-mono text-[10px]">AUG 31, 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users size={12} className="text-slate-500" />
                      <span className="font-mono text-[10px] truncate">{ticket.studentName}</span>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="border-t border-slate-900 pt-4 flex justify-between items-center mt-auto">
                    <div>
                      <span className="font-mono text-[8px] text-slate-500 block uppercase">PASS SERIAL</span>
                      <span className="font-mono text-[10px] text-white tracking-widest">
                        #{ticket.id.toUpperCase().substring(0, 8)}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-[#ff7300] transition-colors">
                      <QrCode size={16} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Ticket Details Overlay Modal */}
      <AnimatePresence>
        {selectedTicket && (() => {
          const details = getEventDetails(selectedTicket)
          const qrPayload = `Yuva Tech-Fest 2026 Ticket\nID: ${selectedTicket.id}\nEvent: ${details.title}\nAttendee: ${selectedTicket.studentName}\nEmail: ${selectedTicket.studentEmail}\nStatus: VERIFIED PASS`
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}`

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#020306]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 print:absolute print:bg-white print:text-black print:p-0 print:inset-auto"
            >
              <div className="relative w-full max-w-md glass-card rounded-3xl border border-slate-800/80 bg-[#040810]/95 p-6 md:p-8 flex flex-col items-center overflow-hidden print:border-none print:bg-white print:p-0 print:shadow-none">
                {/* Close Button (Hidden in Print) */}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-900 transition-colors print:hidden"
                >
                  <X size={18} />
                </button>

                {/* Print Title Branding */}
                <div className="text-center mb-6 w-full">
                  <div className="font-orbitron text-[10px] tracking-widest text-[#ff7300] font-black uppercase mb-1">// YUVA TECH-FEST 2026 //</div>
                  <h2 className="font-orbitron text-xl font-black text-white print:text-black truncate">
                    EVENT ENTRY CREDENTIAL
                  </h2>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-[#ff7300]/40 to-transparent my-3 w-4/5 mx-auto print:bg-slate-300" />
                </div>

                {/* Cyber Boarding Pass Card */}
                <div
                  className="w-full rounded-2xl border bg-black/60 p-5 relative overflow-hidden flex flex-col items-center gap-6 print:border-slate-350 print:bg-white"
                  style={{
                    borderColor: `${details.color}30`,
                    boxShadow: `0 0 25px ${details.color}05`
                  }}
                >
                  {/* Decorative bracket lines */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: details.color }} />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: details.color }} />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: details.color }} />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: details.color }} />

                  {/* QR Code Container */}
                  <div className="relative w-48 h-48 bg-white p-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-slate-200">
                    <Image
                      src={qrUrl}
                      alt="Pass QR Code"
                      width={168}
                      height={168}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>

                  {/* Attendant & Event Metadata */}
                  <div className="w-full font-mono text-xs text-slate-300 space-y-2.5 border-t border-slate-900 pt-4 print:text-black print:border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-550 uppercase text-[9px] tracking-wider">EVENT</span>
                      <span className="font-bold text-white print:text-black truncate">{details.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 uppercase text-[9px] tracking-wider">ATTENDEE</span>
                      <span className="font-bold text-white print:text-black truncate">{selectedTicket.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 uppercase text-[9px] tracking-wider">EMAIL</span>
                      <span className="font-bold text-slate-400 print:text-slate-800 truncate">{selectedTicket.studentEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 uppercase text-[9px] tracking-wider">VENUE</span>
                      <span className="font-bold text-white print:text-black truncate">{details.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 uppercase text-[9px] tracking-wider">SERIAL KEY</span>
                      <span className="font-bold text-[#ff7300] tracking-wider">
                        #{selectedTicket.id.toUpperCase().substring(0, 16)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Check badge */}
                <div className="flex items-center gap-2 mt-5 text-[10px] font-mono text-[#00ff88] bg-[#00ff88]/5 px-4 py-1.5 rounded-full border border-[#00ff88]/20 print:border-slate-200 print:text-black">
                  <ShieldCheck size={12} />
                  VALIDATED EVENT PASS ACTIVE
                </div>

                {/* Control Action Buttons (Hidden in Print) */}
                <div className="flex gap-4 w-full mt-6 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 transition-colors text-white font-mono text-xs py-3 rounded-xl"
                  >
                    <Printer size={14} /> PRINT_PASS
                  </button>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="flex-1 btn-glow font-mono text-xs py-3 rounded-xl text-center"
                  >
                    CLOSE_PORTAL
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      <Footer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </main>
  )
}
