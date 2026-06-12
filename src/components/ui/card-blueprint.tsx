'use client'

import React from 'react'

interface CardBlueprintProps {
  id: string
  color: string
}

export default function CardBlueprint({ id, color }: CardBlueprintProps) {
  // Styles for rotation animations
  const inlineStyles = `
    @keyframes spin-clockwise {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spin-counter-clockwise {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes pulse-fast {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.65; }
    }
    @keyframes scroll-text {
      0% { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }
    .animate-spin-cw {
      animation: spin-clockwise 25s linear infinite;
    }
    .animate-spin-ccw {
      animation: spin-counter-clockwise 15s linear infinite;
    }
    .animate-pulse-fast {
      animation: pulse-fast 1.5s infinite;
    }
  `

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />

      {/* Corner Brackets inside viewport */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-700/60" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-700/60" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-700/60" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-700/60" />

      {/* 1. TOP PROTOCOL BAR */}
      <div className="flex justify-between items-start w-full font-mono text-[8px] text-slate-500 tracking-wider">
        <span>SYS.SYS // 0x{id.toUpperCase()}</span>
        <span className="text-right">HUD_MODE // ACTIVE</span>
      </div>

      {/* 2. DYNAMIC SCHEMATIC GRAPHICS (CENTERED) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Hackathon: Neural Net Nodes */}
        {id === 'hackathon' && (
          <svg className="w-48 h-48 opacity-10 group-hover:opacity-35 transition-opacity duration-500 text-orange-500" viewBox="0 0 100 100" fill="none">
            {/* Connection Paths */}
            <path d="M 15 50 L 35 25 M 15 50 L 35 50 M 15 50 L 35 75 M 35 25 L 65 25 M 35 25 L 65 50 M 35 50 L 65 25 M 35 50 L 65 75 M 35 75 L 65 50 M 35 75 L 65 75 M 65 25 L 85 50 M 65 50 L 85 50 M 65 75 L 85 50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* Orbit paths */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.25" className="animate-spin-cw" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3,3" className="animate-spin-ccw" />
            {/* Nodes */}
            <circle cx="15" cy="50" r="3" fill="currentColor" className="animate-pulse-fast" />
            <circle cx="35" cy="25" r="2.5" fill="currentColor" />
            <circle cx="35" cy="50" r="2.5" fill="currentColor" />
            <circle cx="35" cy="75" r="2.5" fill="currentColor" />
            <circle cx="65" cy="25" r="2.5" fill="currentColor" />
            <circle cx="65" cy="50" r="2.5" fill="currentColor" />
            <circle cx="65" cy="75" r="2.5" fill="currentColor" />
            <circle cx="85" cy="50" r="3" fill="currentColor" className="animate-pulse-fast" />
          </svg>
        )}

        {/* CTF: Target Lock Radar */}
        {id === 'ctf' && (
          <svg className="w-36 h-36 opacity-10 group-hover:opacity-30 transition-opacity duration-500 text-green-500" viewBox="0 0 100 100" fill="none">
            {/* Rotating Outer Ring */}
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.75" strokeDasharray="8,8" className="animate-spin-cw" />
            {/* Inner Scope */}
            <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" className="animate-spin-ccw" />
            <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="0.5" />
            {/* Target Cross */}
            <path d="M 50 2 L 50 16 M 50 84 L 50 98 M 2 50 L 16 50 M 84 50 L 98 50" stroke="currentColor" strokeWidth="0.5" />
            {/* Target Lock brackets */}
            <path d="M 38 38 L 38 42 M 38 38 L 42 38 M 62 38 L 62 42 M 62 38 L 58 38 M 38 62 L 38 58 M 38 62 L 42 62 M 62 62 L 62 58 M 62 62 L 58 62" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}

        {/* Drone Race: FPV Horizon Pitch HUD */}
        {id === 'dronerace' && (
          <svg className="w-40 h-40 opacity-10 group-hover:opacity-35 transition-opacity duration-500 text-cyan-400" viewBox="0 0 100 100" fill="none">
            {/* Horizon pitch lines */}
            <path d="M 25 50 L 40 50 M 60 50 L 75 50" stroke="currentColor" strokeWidth="1" />
            <path d="M 30 40 L 40 40 M 60 40 L 70 40 M 35 30 L 40 30 M 60 30 L 65 30" stroke="currentColor" strokeWidth="0.5" />
            <path d="M 30 60 L 40 60 M 60 60 L 70 60 M 35 70 L 40 70 M 60 70 L 65 70" stroke="currentColor" strokeWidth="0.5" />
            {/* Bounding box brackets */}
            <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3,3" />
            {/* Aiming Reticle */}
            <circle cx="50" cy="50" r="4" stroke="currentColor" strokeWidth="0.75" />
            <path d="M 50 42 L 50 46 M 50 54 L 50 58 M 42 50 L 46 50 M 54 50 L 58 50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        )}

        {/* RoboWars: Clashing Gear schematic */}
        {id === 'robowars' && (
          <svg className="w-36 h-36 opacity-10 group-hover:opacity-35 transition-opacity duration-500 text-red-500" viewBox="0 0 100 100" fill="none">
            {/* Gear teeth outline */}
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="animate-spin-cw" />
            <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.75" />
            {/* Clashing crosshairs */}
            <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="currentColor" strokeWidth="0.25" strokeDasharray="2,5" />
            {/* Outer coordinate notches */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,15" className="animate-spin-ccw" />
          </svg>
        )}

        {/* Workshop: CPU & Circuit Nodes */}
        {id === 'workshop' && (
          <svg className="w-40 h-40 opacity-10 group-hover:opacity-30 transition-opacity duration-500 text-yellow-500" viewBox="0 0 100 100" fill="none">
            {/* Central CPU Block */}
            <rect x="38" y="38" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.25" />
            <rect x="42" y="42" width="16" height="16" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* Trace Lines */}
            <path d="M 38 42 L 15 42 L 15 25 M 38 50 L 10 50 M 38 58 L 15 58 L 15 75 M 62 42 L 85 42 L 85 25 M 62 50 L 90 50 M 62 58 L 85 58 L 85 75" stroke="currentColor" strokeWidth="0.5" />
            {/* Trace End Node circles */}
            <circle cx="15" cy="25" r="1.5" fill="currentColor" />
            <circle cx="10" cy="50" r="1.5" fill="currentColor" className="animate-pulse-fast" />
            <circle cx="15" cy="75" r="1.5" fill="currentColor" />
            <circle cx="85" cy="25" r="1.5" fill="currentColor" />
            <circle cx="90" cy="50" r="1.5" fill="currentColor" className="animate-pulse-fast" />
            <circle cx="85" cy="75" r="1.5" fill="currentColor" />
          </svg>
        )}
      </div>

      {/* 3. BOTTOM TELEMETRY READOUT */}
      <div className="flex justify-between items-end w-full font-mono text-[7px] text-slate-500 tracking-widest leading-none">
        {id === 'hackathon' && (
          <>
            <div className="flex flex-col gap-0.5 text-left">
              <span>MODEL // GPT-4O-NEURAL</span>
              <span>BATCH_SIZE // 128</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span>LOSS_MIN // 0.0014</span>
              <span>ACC_AVG // 99.85%</span>
            </div>
          </>
        )}
        {id === 'ctf' && (
          <>
            <div className="flex flex-col gap-0.5 text-left">
              <span>ADDR // 10.88.7.254</span>
              <span>PORT // [80, 443, 8080]</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span>CVE // CVE-2026-X</span>
              <span>INTRUSION // DETECTED</span>
            </div>
          </>
        )}
        {id === 'dronerace' && (
          <>
            <div className="flex flex-col gap-0.5 text-left">
              <span>BAND // R1 (5658MHZ)</span>
              <span>POW // 25MW-COMPLIANT</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span>PITCH_FLT // OK</span>
              <span>LINK_RSSI // 99%</span>
            </div>
          </>
        )}
        {id === 'robowars' && (
          <>
            <div className="flex flex-col gap-0.5 text-left">
              <span>ACTUATOR_DRV // MAX</span>
              <span>SIG // 2.4GHZ_FHSS</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span>WEAPON_RPM // 4500</span>
              <span>SYSTEMS_LOAD // NOMINAL</span>
            </div>
          </>
        )}
        {id === 'workshop' && (
          <>
            <div className="flex flex-col gap-0.5 text-left">
              <span>STACK // AI_LLM_WEB3</span>
              <span>CONTRACT // ETH_SOLIDITY</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span>COMPILER // SOLC_v0.8.20</span>
              <span>ENV // FOUNDRY_SANDBOX</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
