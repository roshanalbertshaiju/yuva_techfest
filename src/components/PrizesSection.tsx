'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy, Award, Gift, Sparkles, Cloud, Zap, BookOpen, Coffee, ShieldCheck } from 'lucide-react'

const mainPrizes = [
  {
    place: '2nd Place',
    amount: '₹30,000',
    icon: <Trophy className="w-12 h-12 text-slate-300" />,
    borderColor: 'border-slate-300/20 hover:border-slate-300/50',
    shadowColor: 'hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]',
    tagColor: 'text-slate-300 bg-slate-300/10 border-slate-300/20',
    perks: [
      '₹30,000 Cash Prize',
      'Silver Runner-up Trophy',
      'Premium Developer Swag Kits',
      'Runner-up Certificates'
    ],
    delay: 0.1
  },
  {
    place: '1st Place',
    amount: '₹50,000',
    icon: <Trophy className="w-16 h-16 text-amber-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.5))' }} />,
    borderColor: 'border-amber-400/35 hover:border-amber-400/70 bg-gradient-to-b from-amber-400/5 to-transparent',
    shadowColor: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.25)]',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    perks: [
      '₹50,000 Cash Prize',
      'Golden Champion Trophy',
      'Venture Capital Pitch Invites',
      'Incubation Support from SRM',
      'Elite Swag Bags & Gear'
    ],
    featured: true,
    delay: 0
  },
  {
    place: '3rd Place',
    amount: '₹20,000',
    icon: <Trophy className="w-12 h-12 text-[#ff7300]" />,
    borderColor: 'border-orange-500/20 hover:border-orange-500/50',
    shadowColor: 'hover:shadow-[0_0_30px_rgba(255,115,0,0.15)]',
    tagColor: 'text-[#ff7300] bg-[#ff7300]/10 border-[#ff7300]/20',
    perks: [
      '₹20,000 Cash Prize',
      'Bronze Winner Trophy',
      'Standard Swag Packs',
      'Winner Certificates'
    ],
    delay: 0.2
  }
]

const specialPrizes = [
  {
    title: 'Track Winners (x6)',
    reward: '₹5,000 / Track',
    desc: 'Awarded to the best project in each of the 6 official challenge tracks.',
    icon: <Award className="w-6 h-6 text-[#ff7300]" />
  },
  {
    title: 'Best Beginner Team',
    reward: '₹5,000 + Swag',
    desc: 'Encouraging new coders. Awarded to the highest-scoring team of all first-time hackathon attendees.',
    icon: <Sparkles className="w-6 h-6 text-[#ffb700]" />
  },
  {
    title: 'Best All-Girls Team',
    reward: '₹5,000 + Swag',
    desc: 'Promoting gender diversity in technology. Awarded to the top-performing female led developer team.',
    icon: <Gift className="w-6 h-6 text-[#ff3c00]" />
  }
]

const generalPerks = [
  {
    title: 'Developer Swag',
    desc: 'Official Yuva Tech-Fest t-shirts, custom stickers, developer keychains, and notebook kits for all.',
    icon: <Gift className="w-5 h-5" />
  },
  {
    title: 'Cloud Credits',
    desc: 'Free hosting credits, database compute hours, and API keys sponsored by our platform partners.',
    icon: <Cloud className="w-5 h-5" />
  },
  {
    title: 'Free Food & Drinks',
    desc: 'Round-the-clock catered hot meals, late-night pizzas, refreshments, and unlimited energy drinks.',
    icon: <Coffee className="w-5 h-5" />
  },
  {
    title: 'Networking & VC Access',
    desc: 'Connect with industry sponsors, recruiters, tech leads, and venture capitalists during the demo day.',
    icon: <Zap className="w-5 h-5" />
  },
  {
    title: 'Incubation & Mentoring',
    desc: 'Top projects receive continuous mentorship post-hackathon and fast-track incubation at SRM.',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    title: 'Participation Certs',
    desc: 'Every participant who submits a qualifying project receives an official verified digital certificate.',
    icon: <ShieldCheck className="w-5 h-5" />
  }
]

export default function PrizesSection() {
  const sectionRef = useRef(null)
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="prizes" ref={sectionRef} className="relative py-28 bg-[#020408]/95 overflow-hidden border-t border-[rgba(255,115,0,0.05)]">
      {/* Visual background elements */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">
            // PRIZES & PERKS
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Win Something Legendary
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Compete for the ultimate bragging rights, cash pool rewards, specialized track prizes, and exclusive developer swag.
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ff7300] to-transparent mx-auto mt-6" />
        </div>

        {/* Podium/Main Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto mb-24">
          {mainPrizes.map((prize) => (
            <motion.div
              key={prize.place}
              className={`glass-card corner-bracket rounded-2xl p-8 flex flex-col items-center text-center cursor-default border relative transition-all duration-500 ${
                prize.borderColor
              } ${prize.shadowColor} ${
                prize.featured 
                  ? 'md:scale-105 md:py-12 bg-gradient-to-b from-[#ff7300]/5 via-transparent to-transparent shadow-[0_0_30px_rgba(255,115,0,0.05)] z-10 border-[#ff7300]/30' 
                  : 'z-0'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: prize.delay }}
            >
              {/* Highlight ribbon for 1st place */}
              {prize.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-mono font-black tracking-widest text-black bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  CHAMPION
                </div>
              )}

              {/* Icon */}
              <div className="mb-6 flex justify-center items-center h-20">
                {prize.icon}
              </div>

              {/* Place / Label */}
              <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-widest border mb-3 uppercase font-semibold ${prize.tagColor}`}>
                {prize.place}
              </span>

              {/* Prize Amount */}
              <h3 className={`font-orbitron text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-wide text-white`}>
                {prize.amount}
              </h3>

              {/* Divider */}
              <div className="w-full h-px bg-slate-800 mb-6" />

              {/* Perks List */}
              <ul className="space-y-3.5 w-full text-left">
                {prize.perks.map((perk, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                    <span className="text-[#ff7300] mt-0.5 font-mono">•</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Special Track & Category Prizes */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-2">Special Category Awards</h3>
            <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">// EXTRA BOUNTIES</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {specialPrizes.map((prize, index) => (
              <motion.div
                key={prize.title}
                className="glass-card corner-bracket rounded-xl p-6 flex items-start gap-4 border border-orange-500/10 hover:border-[#ff7300]/30 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={isSectionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="p-3 bg-[#ff7300]/5 rounded-lg border border-[#ff7300]/10 text-orange-500 flex-shrink-0">
                  {prize.icon}
                </div>
                <div>
                  <h4 className="font-orbitron text-sm font-bold text-white mb-1">{prize.title}</h4>
                  <span className="inline-block font-mono text-xs text-[#ff7300] font-semibold mb-2">{prize.reward}</span>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{prize.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Participant Perks */}
        <div>
          <div className="text-center mb-12">
            <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-2">Perks for Every Builder</h3>
            <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">// INCLUSIVITY FIRST</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {generalPerks.map((perk, index) => (
              <motion.div
                key={perk.title}
                className="glass-card rounded-xl p-6 flex gap-4 items-start border border-orange-500/5 hover:border-orange-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="p-2.5 bg-white/5 rounded-lg text-[#ff7300] flex-shrink-0">
                  {perk.icon}
                </div>
                <div>
                  <h4 className="font-orbitron text-xs sm:text-sm font-bold text-white mb-1.5">{perk.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{perk.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
