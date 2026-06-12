'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, Briefcase, Sparkles, Users, DollarSign, 
  TrendingUp, Volume2, VolumeX, MessageSquare, Bot, 
  ArrowRight, X, Send, ChevronRight 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CyberParticles from '@/components/ui/cyber-particles'

// ─── Cards Configuration (Aligned with Orange/Gold/Amber Theme) ──────────────────

const launchpadCards = [
  {
    title: 'Investor Pitching',
    description: 'Pitch to a hand-picked panel of VCs, angels and CXOs.',
    icon: <Briefcase size={20} />,
    color: 'from-orange-500/10 to-transparent',
    iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    borderCol: 'hover:border-orange-500/35 shadow-[0_0_15px_rgba(255,115,0,0.02)]'
  },
  {
    title: 'Startup Expo',
    description: 'Showcase your MVP to 5,000+ visitors across 4 days.',
    icon: <Rocket size={20} />,
    color: 'from-amber-500/10 to-transparent',
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    borderCol: 'hover:border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.02)]'
  },
  {
    title: 'Innovation Showcase',
    description: 'Demo deep-tech, AI and hardware to industry scouts.',
    icon: <Sparkles size={20} />,
    color: 'from-yellow-500/10 to-transparent',
    iconColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    borderCol: 'hover:border-yellow-500/35 shadow-[0_0_15px_rgba(234,179,8,0.02)]'
  },
  {
    title: 'Entrepreneur Networking',
    description: 'Curated mixers connecting builders & operators.',
    icon: <Users size={20} />,
    color: 'from-orange-600/10 to-transparent',
    iconColor: 'text-[#ff7300] bg-orange-500/10 border-orange-500/20',
    borderCol: 'hover:border-orange-500/35 shadow-[0_0_15px_rgba(255,115,0,0.02)]'
  },
  {
    title: 'Funding Opportunities',
    description: 'Grants, seed checks and accelerator fast-tracks.',
    icon: <DollarSign size={20} />,
    color: 'from-amber-600/10 to-transparent',
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    borderCol: 'hover:border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.02)]'
  },
  {
    title: 'Mega Startup Event',
    description: 'The grand finale: India\'s next unicorns on one stage.',
    icon: <TrendingUp size={20} />,
    color: 'from-yellow-600/10 to-transparent',
    iconColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    borderCol: 'hover:border-yellow-500/35 shadow-[0_0_15px_rgba(234,179,8,0.02)]'
  }
]

// ─── Chatbot Responses ──────────────────────────────────────────────────────────

const quickReplies = [
  { text: 'Pitching details?', val: 'pitching' },
  { text: 'Expo slots?', val: 'expo' },
  { text: 'Cohort growth?', val: 'growth' },
  { text: 'How to apply?', val: 'apply' }
]

const aiResponses: Record<string, string> = {
  pitching: 'For Investor Pitching, startups get 5 minutes on stage followed by 3 minutes of Q&A with our panel of VCs, angels, and industry leaders.',
  expo: 'The Startup Expo provides confirmed members with a 3x3m display booth equipped with high-speed internet, power points, and presentation displays for 4 days.',
  growth: 'Phase 1 launchpad cohort members experienced a combined 412% YoY growth, securing over $2.5M in seed funding and grants.',
  apply: 'To join the cohort, click the "Apply for Launchpad" button on this page. Registrations for Phase 2 close in 14 days!',
  default: 'I\'m the Launchpad Assistant. Feel free to click any of the quick-action prompts below or ask me about VC pitching, expo booths, funding, or cohort applications!'
}

interface ChatMessage {
  sender: 'ai' | 'user'
  text: string
  time: string
}

export default function LaunchpadClient() {
  // ─── States ───────────────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Welcome to Launchpad Phase 2! I\'m your cohort assistant. How can I help you build, showcase, or secure funding today?',
      time: '12:00'
    }
  ])

  // Audio synthesis nodes
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const osc2Ref = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const chatBottomRef = useRef<HTMLDivElement | null>(null)

  // Auto Scroll Chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isChatOpen])

  // Scroll Restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    return () => {
      // Clean up synthesizer audio context on unmount
      if (audioCtxRef.current) {
        try {
          if (oscRef.current) oscRef.current.stop()
          if (osc2Ref.current) osc2Ref.current.stop()
          audioCtxRef.current.close()
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  // ─── Synthwave Ambient Audio Drone Trigger ────────────────────────────────────
  const toggleAudio = () => {
    if (isPlaying) {
      // Fade out and mute gain node
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5)
      }
      setIsPlaying(false)
    } else {
      // Lazy initialize audio context
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        audioCtxRef.current = ctx

        // Create synthesizer oscillators for a low cyberpunk drone
        const osc = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(55, ctx.currentTime) // A1 Sub-bass drone

        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(110, ctx.currentTime) // A2 harmonics

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(120, ctx.currentTime) // filter harsh highs

        gain.gain.setValueAtTime(0, ctx.currentTime)

        // Connections
        osc.connect(filter)
        osc2.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc2.start()

        oscRef.current = osc
        osc2Ref.current = osc2
        filterRef.current = filter
        gainNodeRef.current = gain
      }

      // Resume context if suspended
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      // Fade in to a soft level
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.06, audioCtxRef.current.currentTime + 1.2)
      }
      setIsPlaying(true)
    }
  }

  // ─── Chat Message Submissions ─────────────────────────────────────────────────
  const formatTime = () => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const time = formatTime()
    const userMsg: ChatMessage = { sender: 'user', text, time }

    setMessages(prev => [...prev, userMsg])
    setChatInput('')

    // Match keywords or select reply
    const norm = text.toLowerCase()
    let replyKey = 'default'
    if (norm.includes('pitch') || norm.includes('investor')) replyKey = 'pitching'
    else if (norm.includes('expo') || norm.includes('booth') || norm.includes('slot')) replyKey = 'expo'
    else if (norm.includes('growth') || norm.includes('yoy') || norm.includes('cohort')) replyKey = 'growth'
    else if (norm.includes('apply') || norm.includes('register') || norm.includes('join')) replyKey = 'apply'

    setTimeout(() => {
      const responseText = aiResponses[replyKey]
      const aiMsg: ChatMessage = { sender: 'ai', text: responseText, time: formatTime() }
      setMessages(prev => [...prev, aiMsg])
    }, 600)
  }

  return (
    <main className="relative min-h-screen pt-24 bg-[#020408] overflow-hidden flex flex-col justify-between">
      <CyberParticles />
      <div className="scan-line" />

      {/* Theme-matching glowing background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,183,0,0.02)_0%,transparent_70%)] pointer-events-none" />

      <Navbar />

      {/* Main Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* Left Side: Headlines, CTAs, and Cohort Growth */}
          <div className="lg:col-span-5 space-y-8 flex flex-col text-left">
            <div>
              <span className="font-mono text-xs text-[#ff7300] font-semibold tracking-[0.3em] uppercase block mb-3 animate-pulse">
                // LAUNCHPAD PHASE 2
              </span>
              <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5100] via-[#ff7300] to-[#ffb700] drop-shadow-[0_0_15px_rgba(255,115,0,0.15)]">startup</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">arena</span> for India’s next breakout founders.
              </h1>
            </div>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
              Phase 2 turns YUVA into a live deal-flow stage. Pitch, demo, raise, and ship — all under one roof, in front of the people who actually write checks.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="/contact?subject=Sponsor%20Inquiry"
                className="btn-glow px-7 py-3.5 text-xs text-center block"
              >
                Apply for Launchpad
              </a>
              <a 
                href="/contact?subject=Mentor%20Inquiry"
                className="btn-outline px-7 py-3.5 text-xs text-center block"
              >
                Become a Mentor
              </a>
            </div>

            {/* Cohort Growth Chart Card (Themed Orange/Gold) */}
            <div className="glass-card rounded-2xl border border-slate-900 bg-[#04070d]/30 p-6 relative overflow-hidden" style={{ borderTop: '2px solid #ff7300' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">// Cohort Growth</span>
                <span className="font-mono text-xs font-bold text-orange-400">+412% YoY</span>
              </div>
              
              <div className="relative h-28 w-full mt-2">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff5100" />
                      <stop offset="60%" stopColor="#ff7300" />
                      <stop offset="100%" stopColor="#ffb700" />
                    </linearGradient>
                    <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ff7300" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#ff7300" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Glowing Area Fill */}
                  <path
                    d="M 10 85 Q 60 70 120 48 T 210 22 T 290 8 L 290 100 L 10 100 Z"
                    fill="url(#chartAreaGrad)"
                  />
                  {/* Smooth Curved Line */}
                  <motion.path
                    d="M 10 85 Q 60 70 120 48 T 210 22 T 290 8"
                    fill="none"
                    stroke="url(#chartLineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                  />
                  {/* Glowing dot */}
                  <circle cx="290" cy="8" r="4.5" fill="#ff7300" />
                  <circle cx="290" cy="8" r="10" fill="#ff7300" opacity="0.3" className="animate-ping" />
                </svg>
              </div>
            </div>

          </div>

          {/* Right Side: 6-Card Grid (Themed Cyber Orange/Gold Accent Borders) */}
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-4">
              {launchpadCards.map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`glass-card p-6 rounded-xl border border-slate-900 bg-gradient-to-br ${card.color} ${card.borderCol} transition-all duration-300 flex flex-col items-start text-left group`}
                >
                  <div className={`p-2.5 rounded-lg border mb-4 transition-transform duration-300 group-hover:scale-105 ${card.iconColor}`}>
                    {card.icon}
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white mb-2 group-hover:text-[#ff7300] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Floating Action Buttons (Aligned with Theme) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        {/* Synth Ambient Audio Toggle */}
        <button
          onClick={toggleAudio}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shadow-lg ${
            isPlaying 
              ? 'bg-orange-500/10 border-orange-500/35 text-[#ff7300] shadow-[0_0_12px_rgba(255,115,0,0.25)]' 
              : 'bg-black/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-650'
          }`}
          title={isPlaying ? 'Mute Ambient Synthesizer' : 'Play Synthwave Ambient'}
        >
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Floating Chatbot Toggle (Themed Orange Glow) */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff5100] to-[#ff9d00] text-black flex items-center justify-center shadow-lg shadow-orange-500/20 hover:scale-105 transition-all animate-bounce"
          style={{ animationDuration: '3s' }}
          title="Open Launchpad Assistant"
        >
          <MessageSquare size={20} />
        </button>
      </div>

      {/* Interactive Chatbot Window (Themed Orange) */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Click-outside helper to dismiss chat overlay */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsChatOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-20 right-6 w-80 h-[380px] glass-card border border-orange-500/20 bg-[#050b14]/95 rounded-2xl shadow-2xl z-50 flex flex-col p-4"
            >
              {/* Chat Header */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#ff7300]">
                    <Bot size={13} />
                  </div>
                  <div>
                    <h4 className="font-orbitron text-[10px] font-bold text-white tracking-wider">LAUNCHPAD CO-PILOT</h4>
                    <span className="font-mono text-[8px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE // SECURED
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] ${
                      m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-[#ff5100] to-[#ff7300] text-black font-semibold rounded-br-none'
                        : 'bg-[#0b1323] border border-slate-850 text-slate-350 rounded-bl-none'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[8px] text-slate-550 font-mono mt-0.5">{m.time}</span>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Replies */}
              <div className="flex flex-wrap gap-1.5 py-2 border-t border-slate-850">
                {quickReplies.map(q => (
                  <button
                    key={q.val}
                    onClick={() => handleSendMessage(q.text)}
                    className="px-2 py-1 rounded bg-[#0b1323] border border-slate-850 text-slate-400 text-[9px] hover:text-white hover:border-orange-500/25 transition-all font-mono"
                  >
                    {q.text}
                  </button>
                ))}
              </div>

              {/* Send Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(chatInput)
                }}
                className="relative flex items-center mt-1"
              >
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-[#030712] border border-slate-850 rounded-lg pl-3 pr-8 py-2 text-[10px] text-white focus:outline-none focus:border-orange-500/25 transition-colors placeholder-slate-700 font-mono"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 text-slate-500 hover:text-orange-400 transition-colors"
                >
                  <Send size={12} />
                </button>
              </form>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
