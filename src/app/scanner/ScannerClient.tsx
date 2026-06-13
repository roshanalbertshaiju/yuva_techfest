'use client'

import { useState, useEffect, useRef } from 'react'
import { doc, getDoc, setDoc, getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Scan, Users, Loader2, ArrowRight, ShieldCheck, CheckSquare, Search, Play, Pause, AlertTriangle, ShieldAlert } from 'lucide-react'

interface Attendee {
  id: string
  name: string
  email: string
  college: string
  track: string
  food?: string
  checkedIn?: boolean
  eventId?: string
}

export default function ScannerClient() {
  const { user, profile, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera')
  const [scannerActive, setScannerActive] = useState(true)
  const [html5QrcodeModule, setHtml5QrcodeModule] = useState<any>(null)
  
  // Registration list for manual search
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingAttendees, setLoadingAttendees] = useState(true)
  
  // Scan result state
  const [scanResult, setScanResult] = useState<{
    success: boolean
    alreadyCheckedIn?: boolean
    message: string
  } | null>(null)
  const [processing, setProcessing] = useState(false)

  const scannerRef = useRef<any>(null)

  // Load html5-qrcode dynamically (client-side only)
  useEffect(() => {
    import('html5-qrcode').then((module) => {
      setHtml5QrcodeModule(module)
    }).catch(err => {
      console.error('Failed to load html5-qrcode module:', err)
    })
  }, [])

  // Fetch attendees list for manual check-in
  const fetchAttendees = async () => {
    if (!user) return
    setLoadingAttendees(true)
    try {
      const snap = await getDocs(query(collection(db, 'registrations'), orderBy('createdAt', 'desc')))
      const list: Attendee[] = []
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Attendee)
      })
      setAttendees(list)
    } catch (err) {
      console.error('Error fetching attendees:', err)
    } finally {
      setLoadingAttendees(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (user && (profile?.isManager || profile?.isAdmin)) {
      fetchAttendees()
    }
  }, [user, profile, authLoading])

  // Camera QR scanner effect
  useEffect(() => {
    if (!html5QrcodeModule || activeTab !== 'camera' || !scannerActive) return

    let isMounted = true
    let scannerInstance: any = null

    // Initialize scanner
    const startScanner = async () => {
      try {
        // Wait briefly to ensure div element is in DOM
        await new Promise(r => setTimeout(r, 100))
        if (!isMounted) return

        scannerInstance = new html5QrcodeModule.Html5QrcodeScanner(
          'reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          false
        )

        scannerInstance.render(
          async (decodedText: string) => {
            // Success handler
            if (processing) return
            
            // Extract unique ID
            const match = decodedText.match(/ID:\s*([a-zA-Z0-9]+)/)
            const resolvedId = match ? match[1].trim() : decodedText.trim()
            
            // Stop scanning temporarily while processing
            setScannerActive(false)
            await handleCheckIn(resolvedId)
          },
          (errorMessage: string) => {
            // Failure handler (silent - log only)
          }
        )
        
        scannerRef.current = scannerInstance
      } catch (err) {
        console.error('Scanner initialization error:', err)
      }
    }

    startScanner()

    return () => {
      isMounted = false
      if (scannerInstance) {
        scannerInstance.clear().catch((err: any) => {
          console.error('Error clearing html5-qrcode scanner:', err)
        })
      }
    }
  }, [html5QrcodeModule, activeTab, scannerActive])

  // Core Check-In Logic
  const handleCheckIn = async (docId: string) => {
    setProcessing(true)
    setScanResult(null)
    try {
      // 1. Fetch Ticket details if this is a ticket ID
      const ticketRef = doc(db, 'tickets', docId)
      const ticketSnap = await getDoc(ticketRef)

      let registrationId = docId
      let studentName = ''
      let eventTitle = ''

      if (ticketSnap.exists()) {
        const ticketData = ticketSnap.data()
        registrationId = ticketData.registrationId || docId
        studentName = ticketData.studentName || ''
        eventTitle = ticketData.eventName || ''
      }

      // 2. Fetch/Update Registration Doc
      const regRef = doc(db, 'registrations', registrationId)
      const regSnap = await getDoc(regRef)

      if (!regSnap.exists()) {
        throw new Error(`Record with ID "${docId.substring(0, 10)}..." not found in database.`)
      }

      const regData = regSnap.data()
      if (regData.status !== undefined && regData.status !== 'accepted') {
        throw new Error(`Registration is not approved (Current status: "${regData.status?.toUpperCase()}"). Only accepted registrants can check-in.`)
      }
      studentName = studentName || regData.name || 'Student'
      eventTitle = eventTitle || regData.track || 'Yuva Tech-Fest Event'

      if (regData.checkedIn) {
        setScanResult({
          success: true,
          alreadyCheckedIn: true,
          message: `ALREADY CHECKED IN\nAttendee: ${studentName}\nEvent: ${eventTitle}`
        })
      } else {
        // Set checkedIn: true in database
        await setDoc(regRef, { checkedIn: true }, { merge: true })
        
        // Update local list
        setAttendees(prev => prev.map(a => a.id === registrationId ? { ...a, checkedIn: true } : a))

        setScanResult({
          success: true,
          alreadyCheckedIn: false,
          message: `CHECK-IN SUCCESSFUL\nAttendee: ${studentName}\nEvent: ${eventTitle}`
        })
      }
    } catch (err: any) {
      console.error(err)
      setScanResult({
        success: false,
        message: err.message || 'Verification failed.'
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleManualCheckIn = async (attendee: Attendee) => {
    try {
      const regRef = doc(db, 'registrations', attendee.id)
      const nextStatus = !attendee.checkedIn
      await setDoc(regRef, { checkedIn: nextStatus }, { merge: true })
      setAttendees(prev => prev.map(a => a.id === attendee.id ? { ...a, checkedIn: nextStatus } : a))
    } catch (err) {
      console.error('Manual check-in failed:', err)
    }
  }

  // Filtered manual check-in list
  const filteredAttendees = attendees.filter((a) => {
    const query = searchQuery.toLowerCase()
    return (
      (a.name?.toLowerCase() || '').includes(query) ||
      (a.email?.toLowerCase() || '').includes(query) ||
      (a.college?.toLowerCase() || '').includes(query) ||
      (a.track?.toLowerCase() || '').includes(query) ||
      (a.id?.toLowerCase() || '').includes(query)
    )
  })

  // Auth/Role Check
  const hasAccess = profile?.isManager || profile?.isAdmin

  if (authLoading) {
    return (
      <main className="relative min-h-screen pt-24 bg-[#020408] text-white flex flex-col justify-between">
        <div className="scan-line" />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 relative z-10">
          <Loader2 className="w-12 h-12 text-[#ff7300] animate-spin" />
          <p className="font-mono text-xs tracking-widest text-[#ff7300] animate-pulse">
            // SCANNING COORDINATOR PROFILE
          </p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!user || !hasAccess) {
    return (
      <main className="relative min-h-screen pt-24 bg-[#020408] text-white flex flex-col justify-between">
        <div className="scan-line" />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 animate-pulse">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
          <h1 className="font-orbitron text-2xl font-black tracking-tight text-white mb-2">
            ACCESS_DENIED // COORDINATOR MANDATORY
          </h1>
          <p className="text-slate-400 font-mono text-xs leading-relaxed max-w-sm">
            This terminal requires Manager (`isManager: true`) or Admin authorization privileges. Contact organizing committee to register credentials.
          </p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen pt-24 bg-[#020408] text-white flex flex-col justify-between">
      <div className="scan-line" />
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <div className="h-px bg-gradient-to-r from-[#ff7300]/50 to-transparent w-20" />
            <span className="font-mono text-[9px] text-[#ff7300] tracking-widest font-bold">// REAL-TIME ENTRY SYSTEM</span>
            <div className="h-px bg-gradient-to-l from-[#ff7300]/50 to-transparent w-20" />
          </div>
          <h1 className="font-orbitron text-3xl font-black text-white">
            COORDINATOR PASS <span className="text-orange-gradient">SCANNER</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Mark student attendance. Use device camera scanner or verify details manually.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center border-b border-slate-900 mb-8 p-1 gap-2">
          <button
            onClick={() => {
              setActiveTab('camera')
              setScanResult(null)
            }}
            className={`px-5 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'camera'
                ? 'bg-orange-500/10 border border-orange-500/25 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent'
            }`}
          >
            <Scan size={14} /> CAMERA SCAN
          </button>
          <button
            onClick={() => {
              setActiveTab('manual')
              setScanResult(null)
            }}
            className={`px-5 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-orange-500/10 border border-orange-500/25 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent'
            }`}
          >
            <Users size={14} /> MANUAL LOOKUP
          </button>
        </div>

        {/* Dynamic Panels */}
        <div className="glass-card corner-bracket rounded-3xl border border-slate-900 bg-[#050b14]/70 p-6 md:p-8 min-h-[350px]">
          
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center gap-6">
              
              {/* Scan Results Alert */}
              <AnimatePresence>
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`w-full max-w-md p-4 rounded-xl border font-mono text-xs text-center flex flex-col gap-2 relative ${
                      scanResult.success
                        ? scanResult.alreadyCheckedIn
                          ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                          : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/5 border-red-500/20 text-red-400'
                    }`}
                  >
                    <div className="font-bold uppercase tracking-wider text-[10px]">
                      {scanResult.success
                        ? scanResult.alreadyCheckedIn
                          ? '// NOTIFICATION'
                          : '// SYSTEM APPROVED'
                        : '// SYSTEM REJECTED'}
                    </div>
                    <p className="whitespace-pre-line leading-relaxed">{scanResult.message}</p>
                    <button
                      onClick={() => {
                        setScanResult(null)
                        setScannerActive(true)
                      }}
                      className={`px-4 py-1.5 rounded-md mt-2 text-[10px] font-bold tracking-widest uppercase mx-auto transition-colors ${
                        scanResult.success
                          ? scanResult.alreadyCheckedIn
                            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      Scan Next
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Processing Loader */}
              {processing && (
                <div className="flex flex-col items-center gap-3 py-10">
                  <Loader2 className="w-10 h-10 text-[#ff7300] animate-spin" />
                  <p className="font-mono text-xs text-slate-400 tracking-widest animate-pulse">// VERIFYING TICKET BLOCKCHAIN...</p>
                </div>
              )}

              {/* QR Reader Viewport */}
              {!scanResult && !processing && (
                <div className="w-full flex flex-col items-center gap-4">
                  {scannerActive ? (
                    <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-slate-900/60 bg-black/40">
                      {/* The QR Scanning target */}
                      <div id="reader" className="w-full h-full" />
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded font-mono text-[9px] border border-orange-500/20 text-[#ff7300]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff7300] animate-ping" />
                        LIVE CAMERA
                      </div>
                      <button
                        onClick={() => setScannerActive(false)}
                        className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors font-mono text-[9px]"
                      >
                        <Pause size={10} /> Stop Scanner
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-sm aspect-square border border-slate-900/80 rounded-2xl bg-black/50 flex flex-col items-center justify-center gap-4 text-center p-6 relative overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                        <QrCode size={24} />
                      </div>
                      <h4 className="font-orbitron text-sm font-bold text-slate-400">Scanner Paused</h4>
                      <p className="font-mono text-[9px] text-slate-600 leading-relaxed max-w-[200px]">
                        Start scanning to capture student boarding pass QR codes.
                      </p>
                      <button
                        onClick={() => {
                          setScanResult(null)
                          setScannerActive(true)
                        }}
                        className="btn-glow px-6 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5"
                      >
                        <Play size={12} /> INITIALIZE SCANNER
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MANUAL LOOKUP TAB */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="SEARCH ATTENDEE BY NAME, EMAIL, EVENT, OR ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-850 bg-black/40 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>

              {/* Attendee Grid List */}
              {loadingAttendees ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <Loader2 className="w-8 h-8 text-[#ff7300] animate-spin" />
                  <p className="font-mono text-[9px] text-[#ff7300] tracking-widest animate-pulse">LOADING ATTENDEES...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-light">
                    <thead>
                      <tr className="border-b border-slate-900 font-mono text-[9px] text-slate-500 tracking-wider bg-black/40 uppercase">
                        <th className="p-4">Attendee</th>
                        <th className="p-4">College</th>
                        <th className="p-4">Track / Event</th>
                        <th className="p-4 text-center">Food</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 font-mono text-slate-300">
                      {filteredAttendees.length > 0 ? (
                        filteredAttendees.map((attendee) => (
                          <tr key={attendee.id} className="hover:bg-slate-900/10 transition-colors text-[11px]">
                            <td className="p-4">
                              <div className="font-bold text-white font-orbitron text-xs">{attendee.name}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{attendee.email}</div>
                              <div className="text-[8px] text-slate-600 mt-0.5">#{attendee.id.toUpperCase().substring(0, 12)}</div>
                            </td>
                            <td className="p-4 text-slate-400">{attendee.college}</td>
                            <td className="p-4 text-slate-400">
                              <span className="px-2 py-0.5 rounded border border-orange-500/20 bg-orange-500/5 text-orange-400 text-[9px]">
                                {attendee.track}
                              </span>
                            </td>
                            <td className="p-4 text-center font-mono text-[10px] font-semibold">
                              {attendee.food === 'veg' && (
                                <span className="text-emerald-400 uppercase">VEG</span>
                              )}
                              {attendee.food === 'nonveg' && (
                                <span className="text-rose-400 uppercase">NON-VEG</span>
                              )}
                              {(!attendee.food || attendee.food === 'none') && (
                                <span className="text-slate-500 uppercase">NONE</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {attendee.checkedIn ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold">
                                  PRESENT
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500 text-[8px]">
                                  ABSENT
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleManualCheckIn(attendee)}
                                className={`px-2.5 py-1 text-[9px] rounded font-bold transition-all ${
                                  attendee.checkedIn
                                    ? 'border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                    : 'border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                              >
                                {attendee.checkedIn ? 'ABSENT' : 'CHECK IN'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-600 text-[10px]">
                            {"// NO RECORDS SCANNING QUERY: \"" + searchQuery + "\""}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
