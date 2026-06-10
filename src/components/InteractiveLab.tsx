'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Terminal, Shield, Zap, RefreshCw, Cpu, Activity } from 'lucide-react'

export default function InteractiveLab() {
  const [logs, setLogs] = useState<string[]>([
    'Initializing Yuva Cybernetic Core...',
    'Establishing link with SRM mainframes...',
    'System ready for interaction.'
  ])
  
  const [temperature, setTemperature] = useState(38)
  const [syncedTrack, setSyncedTrack] = useState('AI & Machine Learning')

  // Stream simulated system logs for a premium interactive feel
  useEffect(() => {
    const logPool = [
      'Neural network pathways calibrated.',
      'Syncing track databases...',
      'Optimizing Web3 ledger connection...',
      'Threat defense matrix active.',
      'Core temperature stable at 39°C.',
      'Loading developer workspace modules...',
      'SRM Tiruchirappalli portal linked.'
    ]

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)]
      const timestamp = new Date().toLocaleTimeString().split(' ')[0]
      setLogs((prev) => [`[${timestamp}] ${randomLog}`, ...prev.slice(0, 5)])
      setTemperature(Math.floor(Math.random() * (44 - 36 + 1)) + 36)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="cyber-assistant" className="relative py-28 bg-[#020408]/95 overflow-hidden border-t border-[rgba(255,115,0,0.05)]">
      {/* Grid background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">
            // INTERACTIVE AI INTERFACE
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the Assistant
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Drag, rotate, and interact with our cybernetic coordinator. Connect with the tracks to run telemetry.
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ff7300] to-transparent mx-auto mt-6" />
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-stretch max-w-6xl mx-auto">
          {/* ─ Left side: Cybernetic HUD diagnostics panel ─ */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
            {/* Status Panel */}
            <div className="glass-card corner-bracket rounded-xl p-6 flex flex-col gap-4 border border-orange-500/15">
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-3">
                <h3 className="font-orbitron text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-[#ff7300] animate-pulse" />
                  CORE DIAGNOSTICS
                </h3>
                <span className="font-mono text-[9px] text-[#ff7300] bg-[#ff7300]/10 px-2.5 py-0.5 rounded border border-[#ff7300]/20 animate-pulse">
                  ONLINE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg border border-slate-800">
                  <span className="block font-mono text-[9px] text-slate-500 mb-1">CORE TEMP</span>
                  <span className="font-orbitron text-lg font-bold text-white">{temperature}°C</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-slate-800">
                  <span className="block font-mono text-[9px] text-slate-500 mb-1">FPS TELEMETRY</span>
                  <span className="font-orbitron text-lg font-bold text-white">60.00</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Active Track Telemetry</span>
                <div className="flex flex-wrap gap-2">
                  {['AI & Machine Learning', 'Web3 & Blockchain', 'Cybersecurity'].map((track) => (
                    <button
                      key={track}
                      onClick={() => setSyncedTrack(track)}
                      className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all duration-300 ${
                        syncedTrack === track
                          ? 'border-[#ff7300] text-black bg-[#ff7300] shadow-[0_0_10px_rgba(255,115,0,0.2)]'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal Logs */}
            <div className="glass-card corner-bracket rounded-xl p-6 flex-1 flex flex-col gap-4 border border-orange-500/15">
              <h3 className="font-orbitron text-sm font-bold text-white flex items-center gap-2 border-b border-orange-500/10 pb-3">
                <Terminal size={16} className="text-[#ffb700]" />
                TELEMETRY FEED
              </h3>

              <div className="flex-1 font-mono text-[10px] space-y-2 text-slate-400 overflow-y-auto max-h-[180px] pr-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      index === 0 ? 'text-[#ff7300]' : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─ Right side: Full-height interactive Spline canvas ─ */}
          <div className="lg:col-span-7 h-[450px] sm:h-[550px] lg:h-[600px] glass-card corner-bracket rounded-xl overflow-hidden relative border border-orange-500/15 flex items-center justify-center order-1 lg:order-2">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-orange-500/20 rounded-lg text-[10px] font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7300] animate-pulse" />
              DRAG & HOVER TO INTERACT
            </div>

            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
