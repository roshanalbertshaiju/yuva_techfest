'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Award, MapPin, Calendar, HelpCircle, Code2, Cpu, Settings, BookOpen } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const workshops = [
  { 
    title: 'Workshop 01: LLM Fine-Tuning', 
    desc: 'Intensive deep learning workshop focused on customization and optimization of local open-weight large language models.', 
    topics: ['HuggingFace Transformers ecosystem', 'Parameter-Efficient Fine-Tuning (PEFT)', 'LoRA and QLoRA adapters training', 'Model quantization (GGUF, AWQ)', 'Deployment via vLLM and Ollama interfaces'],
    icon: <Cpu size={24} className="text-[#ff7300]" /> 
  },
  { 
    title: 'Workshop 02: Solidity Smart Contracts', 
    desc: 'Hands-on blockhain engineering session outlining development, testing, and deployment of secure decentralized protocols.', 
    topics: ['Solidity syntax and design patterns', 'Foundry smart contract testing framework', 'ERC-20 token and ERC-721 NFT creation', 'Reentrancy and flash loan security audits', 'React-to-Ethereum web3 frontend bindings'],
    icon: <Code2 size={24} className="text-[#ffd700]" /> 
  },
]

const prerequisites = [
  "Personal laptop required with charging adapters.",
  "Node.js (v18+) and Git client pre-installed on the system.",
  "Python (v3.10+) and basic conda virtual environment knowledge.",
  "A verified GitHub account to pull workspace setup repositories.",
  "Docker Desktop installed for containerized deployment tasks."
]

export default function WorkshopClient() {
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
        <h1 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">Hands-On Workshops</h1>
        <p className="text-[#ffd700] font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-8">Developer Masterclasses on AI &amp; Decentralized Technology</p>
        <div className="flex justify-center gap-6 flex-wrap mb-12 border-b border-slate-900 pb-8 max-w-2xl mx-auto text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#ffd700]" />
            <span>Dual-Track Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#ff7300]" />
            <span>Seminar Hall 2, SRM IST</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} className="text-[#ffb700]" />
            <span>Elite Swag &amp; Certifications</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-5 gap-10">
        
        {/* Left Side: Course Topics (Col-span 3) */}
        <motion.div 
          className="lg:col-span-3 flex flex-col gap-8"
          initial={{ opacity: 0, x: -30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Track Modules</h2>
            <p className="text-slate-450 text-xs font-mono mb-6">// DETAILED SYLLABUS</p>
            <div className="flex flex-col gap-6">
              {workshops.map((ws) => (
                <div key={ws.title} className="glass-card rounded-xl p-6 border border-orange-500/5 hover:border-orange-500/20 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 bg-white/5 rounded-lg border border-slate-800/80 text-orange-500">
                      {ws.icon}
                    </div>
                    <h3 className="font-orbitron text-base font-bold text-white">{ws.title}</h3>
                  </div>
                  <p className="text-slate-450 text-xs leading-relaxed font-light mb-4">{ws.desc}</p>
                  <ul className="space-y-2 border-t border-slate-900 pt-4">
                    {ws.topics.map((topic, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-2 text-xs text-slate-300 font-light">
                        <span className="text-[#ff7300] font-mono text-[9px]">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Prerequisites & Cert (Col-span 2) */}
        <motion.div 
          className="lg:col-span-2 flex flex-col gap-6"
          initial={{ opacity: 0, x: 30 }}
          animate={isContentInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="glass-card corner-bracket rounded-xl p-6 sm:p-8 border border-orange-500/10">
            <h2 className="font-orbitron text-lg font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="text-[#ffd700]" size={18} />
              Prerequisites
            </h2>
            <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase mb-4">// PREPARATION CHECKLIST</p>
            <ul className="space-y-3">
              {prerequisites.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-350 leading-relaxed font-light">
                  <span className="text-[#ffd700] font-mono text-[9px] mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-slate-850 my-6" />

            <div className="flex flex-col gap-4">
              <div className="text-center sm:text-left">
                <p className="font-mono text-[9px] text-orange-400 tracking-wider mb-1">DEVELOPER REWARDS</p>
                <p className="font-orbitron text-xl font-bold text-white">Swag &amp; Certifications</p>
                <p className="text-slate-500 text-[10px] mt-0.5 font-light">Every student receives custom developer stickers, t-shirts, and digital verified credentials.</p>
              </div>

              <Link href="/register?event=workshop" className="btn-glow block w-full text-center py-3 text-xs font-bold tracking-widest uppercase rounded-lg">
                Book Workshop Seat
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </main>
  )
}
