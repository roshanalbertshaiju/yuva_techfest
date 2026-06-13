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

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function RegistrationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
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
    linkedin: '',
    food: 'none'
  })

  useEffect(() => {
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

  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!user) {
      setAuthModalOpen(true)
      return
    }

    // Client-side validations matching Firestore rules
    if (!studentForm.name || studentForm.name.trim().length === 0) {
      setErrorMessage('Name is required.')
      setStatus('error')
      return
    }
    if (studentForm.name.length > 100) {
      setErrorMessage('Name must be 100 characters or less.')
      setStatus('error')
      return
    }

    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/
    if (!studentForm.email || !emailRegex.test(studentForm.email)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).')
      setStatus('error')
      return
    }
    if (studentForm.email.length > 100) {
      setErrorMessage('Email must be 100 characters or less.')
      setStatus('error')
      return
    }

    if (!studentForm.college || studentForm.college.trim().length === 0) {
      setErrorMessage('College / Institution name is required.')
      setStatus('error')
      return
    }
    if (studentForm.college.length > 150) {
      setErrorMessage('College name must be 150 characters or less.')
      setStatus('error')
      return
    }

    if (!studentForm.year || !/^[1-5]$/.test(studentForm.year)) {
      setErrorMessage('Year of study must be between 1 and 5.')
      setStatus('error')
      return
    }

    if (!studentForm.teamSize || !/^[1-9][0-9]?$/.test(studentForm.teamSize)) {
      setErrorMessage('Team size must be a valid positive integer.')
      setStatus('error')
      return
    }

    if (!studentForm.track || studentForm.track.trim().length === 0) {
      setErrorMessage('Event track is required.')
      setStatus('error')
      return
    }
    if (studentForm.track.length > 100) {
      setErrorMessage('Event track must be 100 characters or less.')
      setStatus('error')
      return
    }

    if (studentForm.github && studentForm.github.length > 200) {
      setErrorMessage('GitHub profile link must be 200 characters or less.')
      setStatus('error')
      return
    }

    if (studentForm.linkedin && studentForm.linkedin.length > 200) {
      setErrorMessage('LinkedIn profile link must be 200 characters or less.')
      setStatus('error')
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
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      setStatus('success')
    } catch (error) {
      console.error('Error submitting form to Firebase:', error)
      setErrorMessage('Transmission failed. Please try again.')
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
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Registration Request Logged!</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Your registration request has been submitted and is pending coordinator review. Once approved, your entry ticket will be generated on your dashboard.
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
                setStudentForm({ name: '', email: '', college: '', year: '3', teamSize: '4', track: 'AI & Machine Learning', github: '', linkedin: '', food: 'none' })
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

          {/* Form Content */}
          <div className="space-y-4 text-left">
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
                <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Academic Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={studentForm.email}
                    onChange={handleStudentChange}
                    placeholder="alice@university.edu"
                    className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* College */}
              <div className="relative">
                <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">College / Institution</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><School size={14} /></span>
                  <input
                    type="text"
                    name="college"
                    required
                    value={studentForm.college}
                    onChange={handleStudentChange}
                    placeholder="SRM Institute of Science and Technology"
                    className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="relative">
                <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Year of Study</label>
                <CustomSelect
                  value={studentForm.year}
                  onChange={(val) => setStudentForm(prev => ({ ...prev, year: val }))}
                  options={[
                    { value: "1", label: "1st Year / Freshman" },
                    { value: "2", label: "2nd Year / Sophomore" },
                    { value: "3", label: "3rd Year / Junior" },
                    { value: "4", label: "4th Year / Senior" },
                    { value: "5", label: "5th Year (Dual Degree)" }
                  ]}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Event Dropdown */}
              <div className="relative">
                <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Select Event Modules</label>
                <CustomSelect
                  value={selectedEvent}
                  onChange={handleEventChange}
                  options={[
                    { value: "hackathon", label: "Yuva Hackathon (36-hour code)" },
                    { value: "ctf", label: "Cyber-Volt CTF (Security)" },
                    { value: "dronerace", label: "Sky-Rush Drone Race" },
                    { value: "robowars", label: "Combat Robo-Wars Arena" },
                    { value: "workshop", label: "AI & Web3 Masterclass" }
                  ]}
                />
              </div>

              {/* Team Size */}
              <div className="relative">
                <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Team Size (Members)</label>
                <CustomSelect
                  value={studentForm.teamSize}
                  onChange={(val) => setStudentForm(prev => ({ ...prev, teamSize: val }))}
                  options={[
                    { value: "1", label: "Individual / Solo Participant" },
                    { value: "2", label: "2 Members Team" },
                    { value: "3", label: "3 Members Team" },
                    { value: "4", label: "4 Members Team (Max Limit)" }
                  ]}
                />
              </div>
            </div>

            {/* Event Track */}
            <div className="relative">
              <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Project Domain / Challenge Track</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Folder size={14} /></span>
                <input
                  type="text"
                  name="track"
                  required
                  value={studentForm.track}
                  onChange={handleStudentChange}
                  placeholder="e.g. AI & Machine Learning, Cyber Security"
                  className="cyber-input w-full rounded-lg pl-9 pr-4 py-3 text-xs"
                />
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

            {/* Food Option Dropdown */}
            <div className="relative">
              <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">Food Option / Catering Preference</label>
              <CustomSelect
                value={studentForm.food}
                onChange={(val) => setStudentForm(prev => ({ ...prev, food: val }))}
                options={[
                  { value: "none", label: "None / Self Catering" },
                  { value: "veg", label: "Vegetarian Meals" },
                  { value: "nonveg", label: "Non-Vegetarian Meals" }
                ]}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="space-y-4">
            {status === 'error' && (
              <p className="text-red-500 text-xs font-mono text-center animate-pulse">
                // ERROR: {errorMessage.toUpperCase() || 'TRANSMISSION FAILED. PLEASE TRY AGAIN.'}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-glow w-full py-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-75"
              whileHover={status !== 'submitting' ? { scale: 1.02 } : {}}
              whileTap={status !== 'submitting' ? { scale: 0.98 } : {}}
            >
              {!user ? (
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
