'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bot, Award, MapPin, Calendar, ShieldAlert, Cpu, Sparkles, Settings } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const robotClasses = [
  { title: 'Featherweight Limit', desc: 'Robots must weigh 15 lbs (6.8 kg) or less. A 5% tolerance is allowed for non-wheeled walkbots.', icon: <Settings size={24} className="text-[#ff7300]" /> },
  { title: 'Weapon Compliance', desc: 'Active weapons (spinners, flippers, axes) are required. No combustion engines or projectile launchers.', icon: <Bot size={24} className="text-[#ff6b35]" /> },
  { title: 'Battery Constraints', desc: 'Must use LiPo/LiFe battery chemistry with secure hard-cases and an accessible master isolation switch.', icon: <Cpu size={24} className="text-[#ff3c00]" /> },
  { title: 'Remote Control VTX', desc: 'Must operate on interference-free 2.4 GHz digital frequency bands with fail-safe return to neutral.', icon: <Sparkles size={24} className="text-[#ffd700]" /> },
]

const rules = [
  "Match duration is 3 minutes of active combat or until one robot is disabled/knocked out.",
  "Knockouts are declared if a robot fails to demonstrate controlled translation for 10 seconds.",
  "Judges award points based on Aggression (2 pts), Damage (2 pts), and Control (1 pt).",
  "Arena hazards (floor spinners, spikes) will activate during the final 60 seconds.",
  "Pinning or lifting is restricted to a maximum of 15 seconds per hold.",
  "All robots must undergo pre-battle safety inspections and fail-safe activation validation."
]

export default function RobowarsClient() {
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
        <h1 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">Robo-Wars Arena</h1>
        <p className="text-[#ff6b35] font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-8">Clash of Metal: Combat Robotics Tournament</p>
        <div className="flex justify-center gap-6 flex-wrap mb-12 border-b border-slate-900 pb-8 max-w-2xl mx-auto text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#ff6b35]" />
            <span>Knockout Brackets</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#ff7300]" />
            <span>Open Arena Block, SRM IST</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} className="text-[#ffd700]" />
            <span>Prize Pool ₹15,000</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-10">
        
        {/* Left Side: Robot compliance (Col-span 3) */}
        <motion.div 
          className="lg:col-span-3 flex flex-col gap-8"
          initial={{ opacity: 0, x: -30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Build Requirements</h2>
            <p className="text-slate-450 text-xs font-mono mb-6">// TECHNICAL MATRIX</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {robotClasses.map((cls) => (
                <div key={cls.title} className="glass-card rounded-xl p-5 border border-orange-500/5 hover:border-orange-500/25 transition-all duration-300">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-slate-800/80 w-fit mb-4">
                    {cls.icon}
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white mb-2">{cls.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{cls.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Battle Rules (Col-span 2) */}
        <motion.div 
          className="lg:col-span-2 flex flex-col gap-6"
          initial={{ opacity: 0, x: 30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="glass-card corner-bracket rounded-xl p-6 sm:p-8 border border-orange-500/10">
            <h2 className="font-orbitron text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="text-[#ff6b35]" size={18} />
              Battle Directives
            </h2>
            <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase mb-4">// ARENA LAWS</p>
            <ul className="space-y-3">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-350 leading-relaxed font-light">
                  <span className="text-[#ff6b35] font-mono text-[9px] mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-slate-850 my-6" />

            <div className="flex flex-col gap-4">
              <div className="text-center sm:text-left">
                <p className="font-mono text-[9px] text-orange-400 tracking-wider mb-1">ARENA BOUNTY</p>
                <p className="font-orbitron text-xl font-bold text-white">₹15,000 Cash Pool</p>
                <p className="text-slate-500 text-[10px] mt-0.5 font-light">Cash prize for Champions, runner-up, and Best Design bot.</p>
              </div>

              <Link href="/register?event=robowars" className="btn-glow block w-full text-center py-3 text-xs font-bold tracking-widest uppercase rounded-lg">
                Register Robot Team
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </main>
  )
}
