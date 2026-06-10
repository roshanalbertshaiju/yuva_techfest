'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  User, Mail, School, Users, Globe, Folder, Building, 
  Phone, ArrowRight, ArrowLeft, CheckCircle, Loader2 
} from 'lucide-react'

type RegType = 'student' | 'sponsor'
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function RegistrationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Set initial tab from query param or default to student
  const [activeTab, setActiveTab] = useState<RegType>('student')
  const [status, setStatus] = useState<FormStatus>('idle')

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam === 'sponsor' || typeParam === 'student') {
      setActiveTab(typeParam)
    }
  }, [searchParams])

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    college: '',
    year: '3',
    teamSize: '4',
    track: 'AI & Machine Learning',
    github: '',
    linkedin: ''
  })

  const [sponsorForm, setSponsorForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    tier: 'Platinum Partners',
    notes: ''
  })

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStudentForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSponsorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSponsorForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    // Simulate API submission
    await new Promise(r => setTimeout(r, 2000))
    setStatus('success')
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-card corner-bracket rounded-2xl p-6 sm:p-10 relative overflow-hidden border border-orange-500/15">
      {/* Decorative gradients */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(circle,rgba(255,115,0,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[radial-gradient(circle,rgba(255,183,0,0.1)_0%,transparent_70%)] pointer-events-none" />

      {status === 'success' ? (
        <motion.div 
          className="text-center py-12 flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <CheckCircle size={64} className="text-[#ff7300] mx-auto animate-bounce" style={{ filter: 'drop-shadow(0 0 15px rgba(255,115,0,0.4))' }} />
            <div className="absolute inset-0 bg-[#ff7300]/10 blur-xl rounded-full" />
          </div>
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Registration Confirmed!</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              {activeTab === 'student' 
                ? "You have been registered for Yuva Tech-Fest Hackathon. A confirmation email has been sent along with the Discord invite code."
                : "Thank you for partnering with us! Our partnership team will contact you within the next 24 hours with sponsorship materials."
              }
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => router.push('/')}
              className="btn-glow px-6 py-3 text-xs"
            >
              GO BACK TO HOME
            </button>
            <button
              onClick={() => {
                setStatus('idle')
                setStudentForm({ name: '', email: '', college: '', year: '3', teamSize: '4', track: 'AI & Machine Learning', github: '', linkedin: '' })
                setSponsorForm({ companyName: '', contactName: '', email: '', phone: '', tier: 'Platinum Partners', notes: '' })
              }}
              className="btn-outline px-6 py-3 text-xs"
            >
              REGISTER ANOTHER
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-orbitron text-xl sm:text-2xl font-black text-white">
                Registration Portal
              </h1>
              <p className="text-slate-500 text-[10px] font-mono tracking-widest mt-1">
                // SECURE ACCESS PROTOCOL
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex rounded-lg bg-black/45 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student')
                router.replace('/register?type=student')
              }}
              className={`flex-1 py-2.5 rounded-md font-orbitron text-xs font-semibold tracking-wider transition-all duration-300 ${
                activeTab === 'student'
                  ? 'bg-[#ff7300] text-black shadow-[0_0_10px_rgba(255,115,0,0.2)]'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              STUDENT PARTICIPATION
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('sponsor')
                router.replace('/register?type=sponsor')
              }}
              className={`flex-1 py-2.5 rounded-md font-orbitron text-xs font-semibold tracking-wider transition-all duration-300 ${
                activeTab === 'sponsor'
                  ? 'bg-[#ff7300] text-black shadow-[0_0_10px_rgba(255,115,0,0.2)]'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              SPONSOR / PARTNER
            </button>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'student' ? (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 text-left"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={14} /></span>
                      <input
                        type="text"
                        name="name"
                        required
                        value={studentForm.name}
                        onChange={handleStudentChange}
                        placeholder="Alice Smith"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                      <input
                        type="email"
                        name="email"
                        required
                        value={studentForm.email}
                        onChange={handleStudentChange}
                        placeholder="alice@domain.edu"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* College */}
                  <div className="relative sm:col-span-2">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">College / University</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><School size={14} /></span>
                      <input
                        type="text"
                        name="college"
                        required
                        value={studentForm.college}
                        onChange={handleStudentChange}
                        placeholder="SRM IST Trichy"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>

                  {/* Year of study */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Year of Study</label>
                    <select
                      name="year"
                      value={studentForm.year}
                      onChange={handleStudentChange}
                      className="cyber-input w-full rounded-lg px-4 py-3 text-xs cursor-pointer appearance-none"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="PG">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Team Size */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Team Size</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Users size={14} /></span>
                      <select
                        name="teamSize"
                        value={studentForm.teamSize}
                        onChange={handleStudentChange}
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs cursor-pointer appearance-none"
                      >
                        <option value="1">1 (Individual / Looking for team)</option>
                        <option value="2">2 Members</option>
                        <option value="3">3 Members</option>
                        <option value="4">4 Members</option>
                      </select>
                    </div>
                  </div>

                  {/* Track Interest */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Challenge Track of Interest</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Folder size={14} /></span>
                      <select
                        name="track"
                        value={studentForm.track}
                        onChange={handleStudentChange}
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs cursor-pointer appearance-none"
                      >
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="FinTech & EdTech">FinTech & EdTech</option>
                        <option value="IoT & Smart Cities">IoT & Smart Cities</option>
                        <option value="Open Innovation">Open Innovation (Wildcard)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* GitHub */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">GitHub Profile</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={14} /></span>
                      <input
                        type="url"
                        name="github"
                        value={studentForm.github}
                        onChange={handleStudentChange}
                        placeholder="https://github.com/username"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">LinkedIn Profile</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={14} /></span>
                      <input
                        type="url"
                        name="linkedin"
                        value={studentForm.linkedin}
                        onChange={handleStudentChange}
                        placeholder="https://linkedin.com/in/username"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sponsor"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 text-left"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Company / Org Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Building size={14} /></span>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={sponsorForm.companyName}
                        onChange={handleSponsorChange}
                        placeholder="Acme Corp"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>

                  {/* Contact Person Name */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Contact Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={14} /></span>
                      <input
                        type="text"
                        name="contactName"
                        required
                        value={sponsorForm.contactName}
                        onChange={handleSponsorChange}
                        placeholder="Bob Johnson"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Contact Email */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Contact Email</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                      <input
                        type="email"
                        name="email"
                        required
                        value={sponsorForm.email}
                        onChange={handleSponsorChange}
                        placeholder="partners@acme.com"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={sponsorForm.phone}
                        onChange={handleSponsorChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Sponsor Tier */}
                <div className="relative">
                  <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Sponsorship Tier Preference</label>
                  <select
                    name="tier"
                    value={sponsorForm.tier}
                    onChange={handleSponsorChange}
                    className="cyber-input w-full rounded-lg px-4 py-3 text-xs cursor-pointer appearance-none"
                  >
                    <option value="Title Sponsor">Title Sponsor Preference</option>
                    <option value="Platinum Partners">Platinum Partners Tier</option>
                    <option value="Gold Partners">Gold Partners Tier</option>
                    <option value="Custom Partnership">Custom Collaboration / Developer Swag</option>
                  </select>
                </div>

                {/* Notes/Queries */}
                <div className="relative">
                  <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Additional Notes / Custom Requirements</label>
                  <textarea
                    name="notes"
                    rows={4}
                    value={sponsorForm.notes}
                    onChange={handleSponsorChange}
                    placeholder="We would like to introduce a special API prize track..."
                    className="cyber-input w-full rounded-lg px-4 py-3 text-xs resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Buttons */}
          <motion.button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-glow w-full py-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-75"
            whileHover={status !== 'submitting' ? { scale: 1.02 } : {}}
            whileTap={status !== 'submitting' ? { scale: 0.98 } : {}}
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                TRANSMITTING DATAFEED...
              </>
            ) : (
              <>
                SUBMIT REGISTRATION
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}
