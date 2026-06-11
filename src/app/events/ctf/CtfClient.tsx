'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldAlert, Award, MapPin, Calendar, HelpCircle, Terminal, Cpu, Clock, Key } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const topics = [
  { title: 'Web Exploitation', desc: 'Identify injection vulnerabilities, bypass client-side validation, bypass authentication, and discover hidden API routes.', icon: <Globe size={24} className="text-[#ff7300]" /> },
  { title: 'Cryptography', desc: 'Break custom ciphers, analyze RSA keys, perform frequency analysis, and exploit weak randomness.', icon: <Key size={24} className="text-[#ff3c00]" /> },
  { title: 'Reverse Engineering', desc: 'Analyze compiled binaries, understand control flows, bypass license key checks, and recover embedded flags.', icon: <Terminal size={24} className="text-[#ffb700]" /> },
  { title: 'Forensics & Recon', desc: 'Analyze packet captures (PCAP), carve hidden files from disk images, parse log audits, and perform OSINT lookups.', icon: <Clock size={24} className="text-[#ffd700]" /> },
]

const rules = [
  "Jeopardy-style CTF format with dynamic scoring (solves decrease challenge point value).",
  "Teams of 1 to 2 members are allowed to participate.",
  "Flag format is YUVA_CTF{flag_content} unless specified otherwise.",
  "Attacking the hosting infrastructure or CTF server dashboard will result in immediate disqualification.",
  "Sharing flags, solutions, or write-ups during the active competition window is strictly forbidden.",
  "The scoreboard will freeze 30 minutes prior to the official round closure."
]

function Globe({ size, className }: { size: number; className?: string }) {
  return <Cpu size={size} className={className} />
}

export default function CtfClient() {
  const contentRef = useRef(null)
  const isContentInView = useInView(contentRef, { once: true, margin: '-60px' })

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen pt-24 bg-[#020408]">
      <div className="scan-line" />

      <Navbar />

      {/* Header */}
      <div className="relative pt-12 pb-4 z-20 max-w-7xl mx-auto px-6 text-center">
        <Link href="/events" className="font-mono text-xs text-orange-400 hover:text-white transition-colors tracking-widest uppercase mb-4 inline-block">
          &lt; Back to Dashboard
        </Link>
        <h1 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">Cyber-Volt CTF</h1>
        <p className="text-[#ff3c00] font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-8">Jeopardy-Style Capture The Flag Hacking Arena</p>
        <div className="flex justify-center gap-6 flex-wrap mb-12 border-b border-slate-900 pb-8 max-w-2xl mx-auto text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#ff3c00]" />
            <span>6 Hours Sprint</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#ffb700]" />
            <span>Main Auditorium, SRM IST</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} className="text-[#ff7300]" />
            <span>Prize Pool ₹20,000</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-10">
        
        {/* Left Side: CTF Topics (Col-span 3) */}
        <motion.div 
          className="lg:col-span-3 flex flex-col gap-8"
          initial={{ opacity: 0, x: -30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Hacking Domains</h2>
            <p className="text-slate-450 text-xs font-mono mb-6">// CHALLENGE SECTORS</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {topics.map((topic) => (
                <div key={topic.title} className="glass-card rounded-xl p-5 border border-orange-500/5 hover:border-orange-500/25 transition-all duration-300">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-slate-800/80 w-fit mb-4">
                    {topic.icon}
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white mb-2">{topic.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{topic.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: CTF Rules & Registration (Col-span 2) */}
        <motion.div 
          className="lg:col-span-2 flex flex-col gap-6"
          initial={{ opacity: 0, x: 30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="glass-card corner-bracket rounded-xl p-6 sm:p-8 border border-orange-500/10">
            <h2 className="font-orbitron text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="text-[#ff3c00]" size={18} />
              Arena Rules
            </h2>
            <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase mb-4">// DEPLOYMENT DIRECTIVES</p>
            <ul className="space-y-3">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-350 leading-relaxed font-light">
                  <span className="text-[#ff3c00] font-mono text-[9px] mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-slate-850 my-6" />

            <div className="flex flex-col gap-4">
              <div className="text-center sm:text-left">
                <p className="font-mono text-[9px] text-orange-400 tracking-wider mb-1">COMPETITION BOUNTY</p>
                <p className="font-orbitron text-xl font-bold text-white">₹20,000 Cash Pool</p>
                <p className="text-slate-500 text-[10px] mt-0.5 font-light">First, Second, and Third place cash trophies.</p>
              </div>

              <Link href="/register?event=ctf" className="btn-glow block w-full text-center py-3 text-xs font-bold tracking-widest uppercase rounded-lg">
                Enter CTF Arena
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </main>
  )
}
