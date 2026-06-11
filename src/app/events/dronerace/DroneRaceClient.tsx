'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, Award, MapPin, Calendar, Compass, ShieldAlert, Cpu, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const courseHighlights = [
  { title: 'LED Arch Gates', desc: 'Pass through consecutive, color-coded neon archways. Active illumination gates will mark correct flight lines.', icon: <Compass size={24} className="text-[#ff7300]" /> },
  { title: 'Speed Trap Corridors', desc: 'A straight flight corridor where maximum throttle must be sustained, monitored by laser trip speed sensors.', icon: <Rocket size={24} className="text-[#ffb700]" /> },
  { title: 'Vertical Corkscrew', desc: 'Navigate a sequence of rings stacked vertically, testing altitude controls and tight 360-degree rolls.', icon: <Cpu size={24} className="text-[#ff3c00]" /> },
  { title: 'Precision Pad Landing', desc: 'The race concludes with a required precision touchdown inside a 50cm diameter target pad.', icon: <Sparkles size={24} className="text-[#ffd700]" /> },
]

const specs = [
  "Frame Size: Maximum 250mm motor-to-motor diagonal spacing.",
  "Battery: Maximum 4S LiPo battery (16.8V max fully charged).",
  "Propellers: Maximum 5-inch propeller size.",
  "VTX: Must support 25mW power output on Raceband channels (R1-R8).",
  "Fail-safe: Must have active fail-safe configured to cut motor power immediately on signal loss.",
  "Spotter: Every pilot must have a spotter to monitor the drone visually during the heat."
]

export default function DroneRaceClient() {
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
        <h1 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">Sky-Rush Drone Race</h1>
        <p className="text-[#ffb700] font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-8">High-Speed FPV Obstacle Course Drone Racing</p>
        <div className="flex justify-center gap-6 flex-wrap mb-12 border-b border-slate-900 pb-8 max-w-2xl mx-auto text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#ffb700]" />
            <span>Time-Trial Heats</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#ff7300]" />
            <span>University Grounds, SRM IST</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} className="text-[#ff3c00]" />
            <span>Prize Pool ₹20,000</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-10">
        
        {/* Left Side: Course (Col-span 3) */}
        <motion.div 
          className="lg:col-span-3 flex flex-col gap-8"
          initial={{ opacity: 0, x: -30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">The Flight Track</h2>
            <p className="text-slate-450 text-xs font-mono mb-6">// COURSE HIGHLIGHTS</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {courseHighlights.map((hl) => (
                <div key={hl.title} className="glass-card rounded-xl p-5 border border-orange-500/5 hover:border-orange-500/25 transition-all duration-300">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-slate-800/80 w-fit mb-4">
                    {hl.icon}
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white mb-2">{hl.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{hl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Drone Specs & Reg (Col-span 2) */}
        <motion.div 
          className="lg:col-span-2 flex flex-col gap-6"
          initial={{ opacity: 0, x: 30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="glass-card corner-bracket rounded-xl p-6 sm:p-8 border border-orange-500/10">
            <h2 className="font-orbitron text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="text-[#ffb700]" size={18} />
              Vehicle Specs &amp; Rules
            </h2>
            <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase mb-4">// HARDWARE COMPLIANCE</p>
            <ul className="space-y-3">
              {specs.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-350 leading-relaxed font-light">
                  <span className="text-[#ffb700] font-mono text-[9px] mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-slate-850 my-6" />

            <div className="flex flex-col gap-4">
              <div className="text-center sm:text-left">
                <p className="font-mono text-[9px] text-orange-400 tracking-wider mb-1">RACING BOUNTY</p>
                <p className="font-orbitron text-xl font-bold text-white">₹20,000 Cash Pool</p>
                <p className="text-slate-500 text-[10px] mt-0.5 font-light">Awarded to the pilots with the shortest lap times.</p>
              </div>

              <Link href="/register?event=dronerace" className="btn-glow block w-full text-center py-3 text-xs font-bold tracking-widest uppercase rounded-lg">
                Register Pilot
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </main>
  )
}
