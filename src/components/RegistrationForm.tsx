'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  User, Mail, School, Users, Globe, Folder, Building, 
  Phone, ArrowRight, ArrowLeft, CheckCircle, Loader2 
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/AuthModal'
import CustomSelect from '@/components/ui/custom-select'

type RegType = 'student' | 'sponsor'
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function RegistrationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  
  // Set initial tab from query param or default to student
  const [activeTab, setActiveTab] = useState<RegType>('student')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [eventParam, setEventParam] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<string>('hackathon')

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

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam === 'sponsor' || typeParam === 'student') {
      setActiveTab(typeParam)
    }

    const ev = searchParams.get('event')
    if (ev) {
      setEventParam(ev)
      setSelectedEvent(ev)
      
      let defaultTeamSize = '1'
      let defaultTrack = ''

      if (ev === 'ctf') {
        defaultTeamSize = '1'
        defaultTrack = 'Cyber-Volt CTF'
      } else if (ev === 'dronerace') {
        defaultTeamSize = '1'
        defaultTrack = 'Sky-Rush Drone Race'
      } else if (ev === 'robowars') {
        defaultTeamSize = '2'
        defaultTrack = 'Robo-Wars Arena'
      } else if (ev === 'workshop') {
        defaultTeamSize = '1'
        defaultTrack = 'AI & Web3 Workshops'
      } else if (ev === 'hackathon') {
        defaultTeamSize = '4'
        defaultTrack = 'AI & Machine Learning'
      }

      setStudentForm(prev => ({
        ...prev,
        track: defaultTrack,
        teamSize: defaultTeamSize
      }))
    }
  }, [searchParams])

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

  const handleEventChange = (val: string) => {
    setSelectedEvent(val)
    let defaultTeamSize = '1'
    let defaultTrack = ''

    if (val === 'ctf') {
      defaultTeamSize = '1'
      defaultTrack = 'Cyber-Volt CTF'
    } else if (val === 'dronerace') {
      defaultTeamSize = '1'
      defaultTrack = 'Sky-Rush Drone Race'
    } else if (val === 'robowars') {
      defaultTeamSize = '2'
      defaultTrack = 'Robo-Wars Arena'
    } else if (val === 'workshop') {
      defaultTeamSize = '1'
      defaultTrack = 'AI & Web3 Workshops'
    } else if (val === 'hackathon') {
      defaultTeamSize = '4'
      defaultTrack = 'AI & Machine Learning'
    }

    setStudentForm(prev => ({
      ...prev,
      track: defaultTrack,
      teamSize: defaultTeamSize
    }))
  }

  const handleSponsorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSponsorForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === 'student' && !user) {
      setAuthModalOpen(true)
      return
    }

    setStatus('submitting')

    // Honeypot spam protection
    if (honeypot) {
      setTimeout(() => {
        setStatus('success')
      }, 1000)
      return
    }

    try {
      if (activeTab === 'student') {
        if (!user) {
          setAuthModalOpen(true)
          setStatus('idle')
          return
        }
        const regRef = await addDoc(collection(db, 'registrations'), {
          type: 'student',
          uid: user.uid,
          eventId: selectedEvent,
          ...studentForm,
          createdAt: serverTimestamp(),
        })

        await addDoc(collection(db, 'tickets'), {
          uid: user.uid,
          registrationId: regRef.id,
          eventId: selectedEvent,
          eventName: studentForm.track,
          studentName: studentForm.name,
          studentEmail: studentForm.email,
          createdAt: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, 'sponsorships'), {
          type: 'sponsor',
          ...sponsorForm,
          createdAt: serverTimestamp(),
        })
      }
      setStatus('success')
    } catch (error) {
      console.error('Error submitting form to Firebase:', error)
      setStatus('error')
    }
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
                ? "You have been registered for Yuva Tech-Fest. You can coordinate with your team members to prepare for the events. We will see you at the campus!"
                : "Thank you for partnering with us! Our partnership team will contact you within the next 24 hours with sponsorship details."
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
                    <CustomSelect
                      value={studentForm.year}
                      onChange={(val) => setStudentForm(prev => ({ ...prev, year: val }))}
                      options={[
                        { value: '1', label: '1st Year' },
                        { value: '2', label: '2nd Year' },
                        { value: '3', label: '3rd Year' },
                        { value: '4', label: '4th Year' },
                        { value: 'PG', label: 'Postgraduate' }
                      ]}
                    />
                  </div>
                </div>

                {/* Event Selection */}
                <div className="relative">
                  <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Select Event / Competition</label>
                  <CustomSelect
                    value={selectedEvent}
                    disabled={!!eventParam}
                    onChange={handleEventChange}
                    icon={<Folder size={14} />}
                    options={[
                      { value: 'hackathon', label: 'Flagship Hackathon' },
                      { value: 'ctf', label: 'Cyber-Volt CTF' },
                      { value: 'dronerace', label: 'Sky-Rush Drone Race' },
                      { value: 'robowars', label: 'Robo-Wars Arena' },
                      { value: 'workshop', label: 'AI & Web3 Workshops' }
                    ]}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Team Size */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Team Size</label>
                    <CustomSelect
                      value={studentForm.teamSize}
                      onChange={(val) => setStudentForm(prev => ({ ...prev, teamSize: val }))}
                      icon={<Users size={14} />}
                      options={(() => {
                        if (selectedEvent === 'ctf') {
                          return [
                            { value: '1', label: '1 (Individual)' },
                            { value: '2', label: '2 Members' }
                          ]
                        }
                        if (selectedEvent === 'dronerace' || selectedEvent === 'workshop') {
                          return [
                            { value: '1', label: '1 (Individual)' }
                          ]
                        }
                        if (selectedEvent === 'robowars') {
                          return [
                            { value: '2', label: '2 Members' },
                            { value: '3', label: '3 Members' }
                          ]
                        }
                        return [
                          { value: '2', label: '2 Members' },
                          { value: '3', label: '3 Members' },
                          { value: '4', label: '4 Members' }
                        ]
                      })()}
                    />
                  </div>

                  {/* Track Interest / Event Readonly Indicator */}
                  <div className="relative">
                    <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">
                      {selectedEvent === 'hackathon' ? 'Challenge Track of Interest' : 'Selected Event'}
                    </label>
                    {selectedEvent === 'hackathon' ? (
                      <CustomSelect
                        value={studentForm.track}
                        onChange={(val) => setStudentForm(prev => ({ ...prev, track: val }))}
                        icon={<Folder size={14} />}
                        options={[
                          { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
                          { value: 'Web3 & Blockchain', label: 'Web3 & Blockchain' },
                          { value: 'Cybersecurity', label: 'Cybersecurity' },
                          { value: 'FinTech & EdTech', label: 'FinTech & EdTech' },
                          { value: 'IoT & Smart Cities', label: 'IoT & Smart Cities' },
                          { value: 'Open Innovation', label: 'Open Innovation (Wildcard)' }
                        ]}
                      />
                    ) : (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Folder size={14} /></span>
                        <input
                          type="text"
                          name="track"
                          readOnly
                          value={studentForm.track}
                          className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs opacity-75 cursor-not-allowed bg-slate-900/30"
                        />
                      </div>
                    )}
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
                  <CustomSelect
                    value={sponsorForm.tier}
                    onChange={(val) => setSponsorForm(prev => ({ ...prev, tier: val }))}
                    options={[
                      { value: "Title Sponsor", label: "Title Sponsor Preference" },
                      { value: "Platinum Partners", label: "Platinum Partners Tier" },
                      { value: "Gold Partners", label: "Gold Partners Tier" },
                      { value: "Custom Partnership", label: "Custom Collaboration / Developer Swag" }
                ]}
              />
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
          <div className="space-y-4">
            {status === 'error' && (
              <p className="text-red-500 text-xs font-mono text-center animate-pulse">
                // ERROR: TRANSMISSION FAILED. PLEASE TRY AGAIN.
              </p>
            )}
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-glow w-full py-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-75"
              whileHover={status !== 'submitting' ? { scale: 1.02 } : {}}
              whileTap={status !== 'submitting' ? { scale: 0.98 } : {}}
            >
              {activeTab === 'student' && !user ? (
                <>
                  LOG IN / SIGN UP TO REGISTER
                  <ArrowRight size={14} />
                </>
              ) : status === 'submitting' ? (
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
          </div>
        </form>
      )}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}
