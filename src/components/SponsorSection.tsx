'use client'

import { motion } from 'framer-motion'
import { Cpu, Terminal, Disc, ShieldCheck, Database, Layers, Award, Sparkles } from 'lucide-react'

const sponsorTiers = [
  {
    tier: 'Title Sponsor',
    cardClass: 'border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent shadow-[0_0_30px_rgba(245,158,11,0.05)] hover:border-amber-500/60',
    textClass: 'text-amber-500 font-bold tracking-[0.2em]',
    sponsors: [
      { name: 'SRM Technologies', description: 'Driving Innovation & Digital Solutions', icon: <Cpu className="w-10 h-10 text-amber-500" /> }
    ]
  },
  {
    tier: 'Platinum Partners',
    cardClass: 'border-slate-300/20 bg-gradient-to-b from-slate-300/5 to-transparent hover:border-slate-300/40',
    textClass: 'text-slate-300 font-semibold tracking-[0.15em]',
    sponsors: [
      { name: 'DevFolio', description: 'Empowering Builders Worldwide', icon: <Terminal className="w-8 h-8 text-orange-500" /> },
      { name: 'Solana Foundation', description: 'Decentralized High-Speed Blockchain', icon: <Disc className="w-8 h-8 text-purple-500" /> }
    ]
  },
  {
    tier: 'Gold Partners',
    cardClass: 'border-amber-700/20 bg-gradient-to-b from-amber-700/5 to-transparent hover:border-amber-700/40',
    textClass: 'text-amber-500 font-medium tracking-[0.1em]',
    sponsors: [
      { name: 'Polygon', description: 'Scaling Ethereum Infrastructure', icon: <Layers className="w-7 h-7 text-indigo-500" /> },
      { name: 'Filecoin', description: 'Decentralized Storage Network', icon: <Database className="w-7 h-7 text-blue-500" /> },
      { name: 'Auth0', description: 'Secure Identity Platform', icon: <ShieldCheck className="w-7 h-7 text-orange-600" /> }
    ]
  }
]

export default function SponsorSection() {
  return (
    <section id="sponsors" className="relative py-28 bg-[#020408]/90 backdrop-blur-[4px] overflow-hidden border-t border-[rgba(255,115,0,0.05)]">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.02)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,183,0,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">
            // OUR PARTNERS
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Event Sponsors
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Collaborating with industry leaders to empower developers and shape the future of technology.
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ff7300] to-transparent mx-auto mt-6" />
        </div>

        {/* Sponsor Grid Tiers */}
        <div className="flex flex-col gap-16 max-w-5xl mx-auto">
          {sponsorTiers.map((tierGroup, tIdx) => (
            <div key={tierGroup.tier} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Award size={14} className="text-[#ff7300] animate-pulse" />
                <h3 className={`font-orbitron text-xs uppercase ${tierGroup.textClass}`}>
                  {tierGroup.tier}
                </h3>
                <Award size={14} className="text-[#ff7300] animate-pulse" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {tierGroup.sponsors.map((sponsor, sIdx) => (
                  <motion.div
                    key={sponsor.name}
                    className={`glass-card corner-bracket rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-default transition-all duration-500 border ${tierGroup.cardClass}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: sIdx * 0.1 }}
                  >
                    <div className="p-4 rounded-xl bg-white/5 border border-slate-800/50 mb-4 transition-all duration-300 group-hover:scale-105">
                      {sponsor.icon}
                    </div>
                    <h4 className="font-orbitron text-sm font-bold text-white mb-1">
                      {sponsor.name}
                    </h4>
                    <p className="text-slate-400 text-xs font-light">
                      {sponsor.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sponsor Call-To-Action */}
        <motion.div
          className="mt-24 max-w-4xl mx-auto glass-card corner-bracket rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden border border-orange-500/15"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} className="text-orange-500" />
          </div>
          <h3 className="font-orbitron text-lg sm:text-2xl font-bold text-white mb-4">
            Want to Sponsor Yuva Tech-Fest?
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed mb-8">
            Connect with hundreds of bright minds, showcase your products, recruit top talent, and build brand presence at SRM IST's premier coding festival.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn-glow px-8 py-3 text-xs">
              BECOME A SPONSOR
            </a>
            <a href="mailto:yuvafest@srmtrichy.edu.in" className="btn-outline px-8 py-3 text-xs">
              DOWNLOAD PROSPECTUS
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
