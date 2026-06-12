'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { Send, Mail, MapPin, Instagram, Twitter, Linkedin, Github, CheckCircle, Loader2 } from 'lucide-react'
import CyberParticles from '@/components/ui/cyber-particles'
import CampusMap from '@/components/ui/campus-map'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const socials = [
  { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://www.instagram.com/srmist.trichy', color: '#E1306C' },
  { icon: <Twitter size={18} />, label: 'Twitter / X', href: 'https://x.com/srmist_trichy', color: '#1DA1F2' },
  { icon: <Linkedin size={18} />, label: 'LinkedIn', href: 'https://www.linkedin.com/school/srm-ist-trichy', color: '#0A66C2' },
  { icon: <Github size={18} />, label: 'GitHub', href: 'https://github.com/roshanalbertshaiju/yuva_techfest', color: '#e2e8f0' },
]

type FormState = 'idle' | 'sending' | 'success' | 'error'

export default function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [formState, setFormState] = useState<FormState>('idle')
  const [focused, setFocused] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot spam protection
    if (honeypot) {
      setTimeout(() => {
        setFormState('success')
      }, 1000)
      return
    }

    setFormState('sending')
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp()
      })
      setFormState('success')
    } catch (err) {
      console.error("Error submitting contact message:", err)
      setFormState('error')
    }
  }

  const inputClass = (field: string) =>
    `cyber-input w-full rounded-lg px-4 py-3.5 text-sm transition-all duration-300 ${
      focused === field ? 'ring-0' : ''
    }`

  return (
    <section id="contact" className="relative py-28 bg-[#020408]/80 backdrop-blur-[4px] overflow-hidden">
      <CyberParticles />
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">
            // GET IN TOUCH
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Have a question? Want to sponsor? Or just say hello? We&apos;re all ears.
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ff7300] to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* ─ Left info panel ─ */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Info cards */}
            <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
              <h3 className="font-orbitron text-base font-bold text-white">
                Event Info
              </h3>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#ff730010] text-[#ff7300] flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-1">Venue</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    SRM Institute of Science &amp; Technology<br />
                    Tiruchirappalli, Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#ffb70010] text-[#ffb700] flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-1">Email</p>
                  <a
                    href="mailto:yuvafest@srmtrichy.edu.in"
                    className="text-sm text-slate-300 hover:text-[#ff7300] transition-colors duration-300"
                  >
                    yuvafest@srmtrichy.edu.in
                  </a>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#ff730022] to-transparent" />

              <div>
                <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-3">Registration Types</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Student', color: '#ff7300', desc: 'Individual / Team of 2–4' },
                    { label: 'Sponsor', color: '#ffb700', desc: 'Corporate / Startup' },
                    { label: 'Mentor', color: '#ff3c00', desc: 'Industry expert' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.color, boxShadow: `0 0 6px ${r.color}` }} />
                      <span className="font-mono text-xs" style={{ color: r.color }}>{r.label}</span>
                      <span className="text-slate-500 text-xs">— {r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-orbitron text-sm font-bold text-white mb-4">Follow Us</h3>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`social-${s.label.toLowerCase().replace(/\s.+/, '')}-link`}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-800 hover:border-current transition-all duration-300 text-slate-400 hover:text-white group"
                    style={{ '--hover-color': s.color } as React.CSSProperties}
                    whileHover={{ scale: 1.03, borderColor: s.color }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-xs font-mono">{s.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─ Contact Form ─ */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="glass-card corner-bracket rounded-xl p-8 md:p-10 h-full">
              {formState === 'success' ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-6 text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={56} className="text-[#ff7300]" style={{ filter: 'drop-shadow(0 0 20px #ff730088)' }} />
                  <div>
                    <h3 className="font-orbitron text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400 text-sm max-w-xs">
                      We&apos;ve received your message. Our team will get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => { setFormState('idle'); setFormData({ name: '', email: '', subject: '', message: '' }) }}
                    className="btn-outline px-6 py-2.5 text-xs"
                  >
                    SEND ANOTHER
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative">
                  {/* Honeypot field (hidden from screen readers and visual users) */}
                  <div className="absolute opacity-0 pointer-events-none -z-50" aria-hidden="true">
                    <input 
                      type="text" 
                      name="website_url_verification" 
                      value={honeypot} 
                      onChange={(e) => setHoneypot(e.target.value)} 
                      tabIndex={-1} 
                      autoComplete="off" 
                    />
                  </div>
                  <div className="mb-2">
                    <h3 className="font-orbitron text-lg font-bold text-white mb-1">Send a Message</h3>
                    <p className="text-slate-500 text-xs font-mono">// Fill the form below</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="relative">
                      <label className="block font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder="John Doe"
                        className={inputClass('name')}
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder="john@example.com"
                        className={inputClass('email')}
                      />
                    </div>
                  </div>

                  {/* Subject/Role */}
                  <div>
                    <label className="block font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-1.5">
                      I am a...
                    </label>
                    <select
                      name="subject"
                      id="contact-subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused('subject')}
                      onBlur={() => setFocused(null)}
                      className={`${inputClass('subject')} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Select your role</option>
                      <option value="student">Student (looking to participate)</option>
                      <option value="sponsor">Sponsor / Partner</option>
                      <option value="mentor">Mentor / Judge</option>
                      <option value="media">Media / Press</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      placeholder="Tell us about yourself or your query..."
                      className={`${inputClass('message')} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={formState === 'sending'}
                    className="btn-glow px-8 py-4 text-sm flex items-center justify-center gap-2 w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={formState !== 'sending' ? { scale: 1.02 } : {}}
                    whileTap={formState !== 'sending' ? { scale: 0.98 } : {}}
                  >
                    {formState === 'sending' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        TRANSMITTING...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        SEND MESSAGE
                      </>
                    )}
                  </motion.button>
                  {formState === 'error' && (
                    <p className="text-red-500 text-xs font-mono text-center animate-pulse mt-2">
                      // ERROR: TRANSMISSION FAILED. PLEASE TRY AGAIN.
                    </p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
        <CampusMap />
      </div>
    </section>
  )
}
