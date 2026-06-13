'use client'

import { motion } from 'framer-motion'
import { Cpu, Terminal, Disc, ShieldCheck, Database, Layers, Award, Sparkles } from 'lucide-react'
import CyberParticles from '@/components/ui/cyber-particles'
import Link from 'next/link'

const SolanaLogo = () => (
  <svg className="w-12 h-8" viewBox="0 0 100 60" fill="none">
    <defs>
      <linearGradient id="solanaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00FFA3" />
        <stop offset="50%" stopColor="#03E1FF" />
        <stop offset="100%" stopColor="#DC1FFF" />
      </linearGradient>
    </defs>
    <path d="M 10 12 L 90 12 L 80 22 L 0 22 Z" fill="url(#solanaGrad)" />
    <path d="M 0 25 L 80 25 L 90 35 L 10 35 Z" fill="url(#solanaGrad)" />
    <path d="M 10 38 L 90 38 L 80 48 L 0 48 Z" fill="url(#solanaGrad)" />
  </svg>
)

const PolygonLogo = () => (
  <svg className="w-12 h-10" viewBox="0 0 80 60" fill="none">
    <path d="M 30 10 L 45 18 L 45 34 L 30 42 L 15 34 L 15 18 Z" fill="#8247E5" fillOpacity="0.15" stroke="#8247E5" strokeWidth="2.5" />
    <path d="M 50 18 L 65 26 L 65 42 L 50 50 L 35 42 L 35 26 Z" fill="#8247E5" fillOpacity="0.15" stroke="#8247E5" strokeWidth="2.5" />
    <path d="M 35 26 L 45 18" stroke="#8247E5" strokeWidth="3" />
    <path d="M 35 42 L 45 34" stroke="#8247E5" strokeWidth="3" />
  </svg>
)

const DevfolioLogo = () => (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
    <path d="M 25 15 L 75 15 L 75 85 L 25 85 Z" fill="#3770FF" fillOpacity="0.15" stroke="#3770FF" strokeWidth="4" />
    <path d="M 45 35 L 45 65 L 65 50 Z" fill="#3770FF" />
  </svg>
)

const FilecoinLogo = () => (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="35" stroke="#0090FF" strokeWidth="4" fill="#0090FF" fillOpacity="0.1" />
    <path d="M 40 35 L 65 35 M 40 50 L 60 50 M 40 30 L 40 70" stroke="#0090FF" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

const Auth0Logo = () => (
  <svg className="w-8 h-10" viewBox="0 0 80 100" fill="none">
    <path d="M 40 10 L 70 25 L 70 55 C 70 75 40 90 40 90 C 40 90 10 75 10 55 L 10 25 Z" fill="#EB5424" fillOpacity="0.15" stroke="#EB5424" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 30 40 L 50 60 M 50 40 L 30 60" stroke="#EB5424" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

const SrmLogo = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="36" stroke="#ff7300" strokeWidth="3.5" fill="#ff7300" fillOpacity="0.1" />
    <path d="M 34 44 L 50 28 L 66 44 L 66 70 L 34 70 Z" stroke="#ff7300" strokeWidth="3" />
    <text x="39" y="58" fill="#ff7300" className="font-mono text-[9px] font-bold tracking-wider">SRM</text>
  </svg>
)

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const getSponsorIcon = (logoName: string) => {
  switch (logoName?.toLowerCase()) {
    case 'srm': return <SrmLogo />
    case 'devfolio': return <DevfolioLogo />
    case 'solana': return <SolanaLogo />
    case 'polygon': return <PolygonLogo />
    case 'filecoin': return <FilecoinLogo />
    case 'auth0': return <Auth0Logo />
    default: return <Cpu className="w-10 h-10 text-orange-500" />
  }
}

const defaultSponsorsList = [
  { id: 'spon-1', name: 'SRM Technologies', description: 'Driving Innovation & Digital Solutions', logoName: 'srm', tier: 'title', order: 1 },
  { id: 'spon-2', name: 'DevFolio', description: 'Empowering Builders Worldwide', logoName: 'devfolio', tier: 'platinum', order: 2 },
  { id: 'spon-3', name: 'Solana Foundation', description: 'Decentralized High-Speed Blockchain', logoName: 'solana', tier: 'platinum', order: 3 },
  { id: 'spon-4', name: 'Polygon', description: 'Scaling Ethereum Infrastructure', logoName: 'polygon', tier: 'gold', order: 4 },
  { id: 'spon-5', name: 'Filecoin', description: 'Decentralized Storage Network', logoName: 'filecoin', tier: 'gold', order: 5 },
  { id: 'spon-6', name: 'Auth0', description: 'Secure Identity Platform', logoName: 'auth0', tier: 'gold', order: 6 }
]

export default function SponsorSection() {
  const [sponsors, setSponsors] = useState<any[]>(defaultSponsorsList)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'sponsors'), orderBy('order', 'asc')))
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setSponsors(list)
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error)
      }
    }
    fetchSponsors()
  }, [])

  const titleSponsors = sponsors.filter(s => s.tier === 'title')
  const platinumSponsors = sponsors.filter(s => s.tier === 'platinum')
  const goldSponsors = sponsors.filter(s => s.tier === 'gold')

  const sponsorTiers = [
    {
      tier: 'Title Sponsor',
      cardClass: 'border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent shadow-[0_0_30px_rgba(245,158,11,0.05)] hover:border-amber-500/60',
      textClass: 'text-amber-500 font-bold tracking-[0.2em]',
      sponsors: titleSponsors
    },
    {
      tier: 'Platinum Partners',
      cardClass: 'border-slate-300/20 bg-gradient-to-b from-slate-300/5 to-transparent hover:border-slate-300/40',
      textClass: 'text-slate-300 font-semibold tracking-[0.15em]',
      sponsors: platinumSponsors
    },
    {
      tier: 'Gold Partners',
      cardClass: 'border-amber-700/20 bg-gradient-to-b from-amber-700/5 to-transparent hover:border-amber-700/40',
      textClass: 'text-amber-500 font-medium tracking-[0.1em]',
      sponsors: goldSponsors
    }
  ].filter(t => t.sponsors.length > 0)

  return (
    <section id="sponsors" className="relative py-28 bg-[#020408]/90 backdrop-blur-[4px] overflow-hidden border-t border-[rgba(255,115,0,0.05)]">
      <CyberParticles />
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
                      {getSponsorIcon(sponsor.logoName)}
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
            Connect with hundreds of bright minds, showcase your products, recruit top talent, and build brand presence at SRM IST&apos;s premier coding festival.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-glow px-8 py-3 text-xs">
              BECOME A SPONSOR
            </Link>
            <a href="mailto:yuvafest@srmtrichy.edu.in" className="btn-outline px-8 py-3 text-xs">
              DOWNLOAD PROSPECTUS
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
