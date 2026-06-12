'use client'

import React from 'react'

export default function CampusMap() {
  return (
    <div className="mt-20 max-w-6xl mx-auto text-left">
      <div className="flex items-center gap-2.5 mb-8 border-b border-slate-900 pb-4">
        <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase block">// COORDINATES MAP</span>
        <span className="font-mono text-[9px] text-slate-500 uppercase">SYS.LOC // CAMPUS_LOCATION</span>
      </div>

      <div className="w-full bg-[#04070d]/50 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.435732128919!2d78.71186717578277!3d10.852445857731215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf700259b375b%3A0x6b610c14c0000000!2sSRM%20Institute%20of%20Science%20and%20Technology%2C%20Tiruchirappalli!5e0!3m2!1sen!2sin!4v1718210000000!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ 
            border: 0,
            filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(15%)'
          }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[450px] opacity-85 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        ></iframe>
        
        {/* Clickable Cyber Orange/Amber theme tint overlay */}
        <a 
          href="https://www.google.com/maps/place/SRM+Institute+of+Science+and+Technology,+Tiruchirappalli/@10.8878,78.8471,17z/data=!4m6!3m5!1s0x3baaf700259b375b:0x6b610c14c0000000!8m2!3d10.8878!4d78.8471!16s%2Fg%2F11b6hx2_0d?entry=tts"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-[#ff7300]/5 mix-blend-color-dodge rounded-3xl border border-orange-500/10 group-hover:bg-[#ff7300]/3 transition-all duration-300 cursor-pointer z-20"
        />
      </div>
    </div>
  )
}
