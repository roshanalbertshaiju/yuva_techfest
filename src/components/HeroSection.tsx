'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ChevronDown, Zap, Users } from 'lucide-react'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
  ),
})

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020408]"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 z-[1] cyber-grid-bg opacity-60" />

      {/* Radial glow */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,212,255,0.06)_0%,transparent_70%)]" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[3] bg-gradient-to-t from-[#020408] to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              SRM IST TIRUCHIRAPPALLI &nbsp;·&nbsp; 2025
            </div>
          </motion.div>

          {/* Main title */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="font-orbitron text-5xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight">
              <span className="block text-white">YUVA</span>
              <span className="block gradient-text">FEST</span>
            </h1>
            <div className="font-orbitron text-xl sm:text-2xl md:text-3xl font-semibold text-white/80 tracking-[0.3em]">
              HACKATHON
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00d4ff44] to-transparent" />
            <div className="glow-dot" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00d4ff44] to-transparent" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-light"
          >
            Push the boundaries of innovation at SRM Institute of Science &amp; Technology,
            Tiruchirappalli. Build something extraordinary. Win something legendary.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-8 text-center"
          >
            {[
              { label: 'Hours', value: '36', color: '#00d4ff' },
              { label: 'Prize Pool', value: '₹1L+', color: '#bf00ff' },
              { label: 'Participants', value: '500+', color: '#00ff9f' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span
                  className="font-orbitron text-2xl font-bold"
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}88` }}
                >
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-2"
          >
            <motion.a
              href="#contact"
              id="hero-student-register-btn"
              className="btn-glow px-8 py-4 text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={16} />
              REGISTER AS STUDENT
            </motion.a>

            <motion.a
              href="#contact"
              id="hero-sponsor-register-btn"
              className="btn-outline px-8 py-4 text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users size={16} />
              REGISTER AS SPONSOR
            </motion.a>
          </motion.div>

          {/* Tech tags */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 mt-2"
          >
            {['AI/ML', 'Web3', 'IoT', 'FinTech', 'HealthTech', 'Cybersecurity'].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-slate-400 border border-slate-700 rounded px-2.5 py-1 tracking-wider hover:border-[#00d4ff44] hover:text-[#00d4ff] transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
      >
        <span className="font-mono text-[9px] tracking-widest">SCROLL</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  )
}
