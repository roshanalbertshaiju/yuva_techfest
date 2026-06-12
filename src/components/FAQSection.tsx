'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Search } from 'lucide-react'
import CyberParticles from '@/components/ui/cyber-particles'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { defaultFaqs } from '@/lib/db-seed'

const FAQ_CATEGORIES = ['All', 'General', 'Teams', 'Participation', 'Prizes']

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order?: number
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const q = query(collection(db, 'faqs'), orderBy('order', 'asc'))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FAQ[]
          setFaqs(data)
        }
      } catch {
        // fallback to defaults already in state
      }
    }
    fetchFaqs()
  }, [])

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="faq" className="relative py-28 bg-[#020408]/80 backdrop-blur-[4px] overflow-hidden border-t border-[rgba(255,115,0,0.05)]">
      <CyberParticles />
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730011] to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">
            // QUESTIONS &amp; ANSWERS
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Everything you need to know about the registration, scheduling, and rules of the hackathon.
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ff7300] to-transparent mx-auto mt-6" />
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setExpandedIndex(null)
                }}
                className={`px-4 py-2 rounded-lg font-mono text-[10px] tracking-wider transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'border-[#ff7300] text-black bg-[#ff7300] shadow-[0_0_15px_rgba(255,115,0,0.3)]'
                    : 'border-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setExpandedIndex(null)
              }}
              className="cyber-input w-full rounded-lg pl-9 pr-4 py-2.5 text-xs focus:ring-0"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = expandedIndex === index
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className={`glass-card rounded-xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'border-orange-500/40 bg-orange-500/5'
                        : 'border-slate-800/40 hover:border-orange-500/20'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-content-${index}`}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle size={18} className="text-[#ff7300] flex-shrink-0" />
                        <span id={`faq-title-${index}`} className="font-orbitron font-semibold text-xs sm:text-sm text-white">
                          {faq.question}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-slate-400"
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-content-${index}`}
                          role="region"
                          aria-labelledby={`faq-title-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 pt-2 text-slate-350 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-slate-400"
              >
                No matching questions found.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
