'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Search } from 'lucide-react'

const faqCategories = ['All', 'General', 'Teams', 'Participation', 'Prizes']

const faqs = [
  {
    question: 'Who can participate in Yuva Tech-Fest Hackathon?',
    answer: 'Any student currently enrolled in an undergraduate or postgraduate program in any college or university is welcome to register and participate. No prior hackathon experience is required!',
    category: 'General'
  },
  {
    question: 'Is there a registration fee?',
    answer: 'No, participation in the Yuva Tech-Fest Hackathon is completely free of charge. We provide mentorship, food, workspace, and cool swag without any entry fees.',
    category: 'General'
  },
  {
    question: 'What is the team size requirement?',
    answer: 'You can form teams of 2 to 4 members. We encourage multidisciplinary teams with a mix of developers, designers, and domain experts.',
    category: 'Teams'
  },
  {
    question: 'Can I participate individually?',
    answer: 'To ensure a collaborative experience and manageable judging, participation is restricted to teams of 2 to 4 members. If you do not have a team, you can join our Discord channel to find teammates.',
    category: 'Teams'
  },
  {
    question: 'What is the format of the hackathon?',
    answer: 'It is a 36-hour in-person hackathon hosted at SRM IST Tiruchirappalli. Teams will build their software or hardware prototypes based on the track selected, with regular mentoring checkpoints.',
    category: 'Participation'
  },
  {
    question: 'What should I bring to the event?',
    answer: 'You must bring your own laptops, chargers, mobile devices, extension cords, and any specific hardware components you plan to use. Don\'t forget your college ID card and basic personal items for overnight stay.',
    category: 'Participation'
  },
  {
    question: 'What are the prizes and awards?',
    answer: 'We have a prize pool of ₹1 Lakh+ distributed among the top 3 overall winners, track winners, and special category prizes (like Best All-Women Team, Best Beginner Team, and sponsors APIs prizes).',
    category: 'Prizes'
  }
]

export default function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="faq" className="relative py-28 bg-[#020408]/80 backdrop-blur-[4px] overflow-hidden border-t border-[rgba(255,115,0,0.05)]">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730011] to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">
            // QUESTIONS & ANSWERS
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
            {faqCategories.map((cat) => (
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
                    key={faq.question}
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
