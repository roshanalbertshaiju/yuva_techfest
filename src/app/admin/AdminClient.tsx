'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, ShieldCheck, Search, RefreshCw, FileText, 
  Users, Briefcase, ExternalLink, Calendar, MapPin, Loader2, ArrowLeft,
  Plus, Edit, Trash2, X, PlusCircle, CheckSquare, Settings, Play,
  HelpCircle, UserCircle, BarChart3, Clock, Database, Mail
} from 'lucide-react'
import { 
  collection, query, orderBy, getDocs, doc, setDoc, deleteDoc, getDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { seedAllIfEmpty, defaultFaqs, defaultTeam, defaultSettings } from '@/lib/db-seed'

// ─── Type Definitions ──────────────────────────────────────────────────────────

interface Registration {
  id: string
  name: string
  email: string
  college: string
  year: string
  teamSize: string
  track: string
  github: string
  linkedin: string
  eventId?: string
  checkedIn?: boolean
  createdAt?: any
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt?: any
}

interface EventTrack {
  tag: string
  title: string
  desc: string
  color: string
}

interface EventMilestone {
  date: string
  event: string
  desc: string
  iconName: string
  details: string[]
}

interface EventData {
  id: string
  title: string
  name?: string
  tagline: string
  description: string
  prize: string
  venue: string
  teamSize: string
  tag: string
  iconName: string
  color: string
  image: string
  rules: string[]
  checklist: string[]
  tracks: EventTrack[]
  timeline: EventMilestone[]
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  github: string
  linkedin: string
  color: string
  order: number
}

interface UserDoc {
  id: string
  name: string
  email: string
  isAdmin?: boolean
  isManager?: boolean
  isSuperAdmin?: boolean
}

interface StatItem {
  value: string
  label: string
  color: string
}

interface CountdownConfig {
  targetDate: string
  label: string
  expiredMessage: string
}

// ─── Empty Templates ───────────────────────────────────────────────────────────

const emptyEvent: EventData = {
  id: '',
  title: '',
  tagline: '',
  description: '',
  prize: '',
  venue: '',
  teamSize: '',
  tag: '',
  iconName: 'Terminal',
  color: '#ff7300',
  image: '/hackathon.png',
  rules: [''],
  checklist: [''],
  tracks: [{ tag: 'TRACK 01', title: '', desc: '', color: '#ff7300' }],
  timeline: [{ date: '', event: '', desc: '', iconName: 'Clock', details: [''] }]
}

const emptyFaq: FAQ = {
  id: '',
  question: '',
  answer: '',
  category: 'General',
  order: 0,
}

const emptyMember: TeamMember = {
  id: '',
  name: '',
  role: '',
  image: '',
  github: '',
  linkedin: '',
  color: '#ff7300',
  order: 0,
}

// ─── Tab Type ──────────────────────────────────────────────────────────────────

type AdminTab = 'registrations' | 'contacts' | 'attendance' | 'events' | 'faqs' | 'team' | 'settings'

// ─── Helper Components ─────────────────────────────────────────────────────────

function AdminInput({ label, value, onChange, placeholder = '', type = 'text', required = false, disabled = false, className = '' }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">{label}{required ? '*' : ''}</label>
      <input
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded border border-slate-850 bg-black/40 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-orange-500/50 transition-colors disabled:opacity-50"
      />
    </div>
  )
}

function AdminTextarea({ label, value, onChange, placeholder = '', rows = 3, required = false }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
}) {
  return (
    <div>
      <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">{label}{required ? '*' : ''}</label>
      <textarea
        required={required}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded border border-slate-850 bg-black/40 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-orange-500/50 transition-colors leading-relaxed"
      />
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminClient() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>('registrations')
  const [search, setSearch] = useState('')
  const [fetching, setFetching] = useState(false)
  const [seedingDb, setSeedingDb] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')

  // Data states
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [eventsList, setEventsList] = useState<EventData[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [usersList, setUsersList] = useState<UserDoc[]>([])
  const [updatingUserRole, setUpdatingUserRole] = useState<string | null>(null)
  const [isElevateModalOpen, setIsElevateModalOpen] = useState(false)
  const [elevateSearch, setElevateSearch] = useState('')
  const [stats, setStats] = useState<StatItem[]>(defaultSettings.stats)
  const [countdown, setCountdown] = useState<CountdownConfig>(defaultSettings.countdown)

  // ── Attendance state ──────────────────────────────────────────────────────────
  const [attendanceEventId, setAttendanceEventId] = useState<string>('all')

  const mapTrackToEventId = (track: string): string => {
    if (!track) return 'hackathon'
    const t = track.toLowerCase()
    if (t.includes('ctf') || t.includes('cyber')) return 'ctf'
    if (t.includes('drone') || t.includes('sky')) return 'dronerace'
    if (t.includes('robo') || t.includes('combat')) return 'robowars'
    if (t.includes('workshop')) return 'workshop'
    return 'hackathon'
  }

  const handleToggleAttendance = async (regId: string, currentStatus: boolean) => {
    try {
      const regRef = doc(db, 'registrations', regId)
      await setDoc(regRef, { checkedIn: !currentStatus }, { merge: true })
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, checkedIn: !currentStatus } : r))
    } catch (err) {
      console.error('Error toggling attendance:', err)
    }
  }

  // ── Event CRUD state ──────────────────────────────────────────────────────────
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)
  const [eventForm, setEventForm] = useState<EventData>(emptyEvent)
  const [savingEvent, setSavingEvent] = useState(false)

  // ── FAQ CRUD state ────────────────────────────────────────────────────────────
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [faqForm, setFaqForm] = useState<FAQ>(emptyFaq)
  const [savingFaq, setSavingFaq] = useState(false)

  // ── Team CRUD state ───────────────────────────────────────────────────────────
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [memberForm, setMemberForm] = useState<TeamMember>(emptyMember)
  const [savingMember, setSavingMember] = useState(false)

  // ── Settings state ────────────────────────────────────────────────────────────
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  // ─── Fetch All Data ───────────────────────────────────────────────────────────

  const fetchData = async () => {
    setFetching(true)
    try {
      const [regsSnap, contactsSnap, eventsSnap, faqsSnap, teamSnap, countdownSnap, statsSnap, usersSnap] = await Promise.all([
        getDocs(query(collection(db, 'registrations'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'events')),
        getDocs(query(collection(db, 'faqs'), orderBy('order', 'asc'))),
        getDocs(query(collection(db, 'team'), orderBy('order', 'asc'))),
        getDoc(doc(db, 'settings', 'countdown')),
        getDoc(doc(db, 'settings', 'stats')),
        getDocs(collection(db, 'users')),
      ])

      setRegistrations(regsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Registration[])
      setContacts(contactsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ContactMessage[])
      setEventsList(eventsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as EventData[])
      setFaqs(faqsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as FAQ[])
      setTeam(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })) as TeamMember[])
      setUsersList(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as UserDoc[])
      if (countdownSnap.exists()) setCountdown(countdownSnap.data() as CountdownConfig)
      if (statsSnap.exists() && statsSnap.data().items) setStats(statsSnap.data().items as StatItem[])
    } catch (error) {
      console.error('Error loading database feeds:', error)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchData()
    }
  }, [user, profile])

  // ─── Seed Database ────────────────────────────────────────────────────────────

  const handleSeedDb = async () => {
    if (!confirm('This will seed all empty collections with default data. Existing documents will NOT be overwritten. Continue?')) return
    setSeedingDb(true)
    setSeedMessage('')
    try {
      const seeded = await seedAllIfEmpty()
      setSeedMessage(seeded ? '✓ Default data seeded successfully!' : '✓ All collections already populated.')
      await fetchData()
    } catch {
      setSeedMessage('✗ Seeding failed — check console for details.')
    } finally {
      setSeedingDb(false)
      setTimeout(() => setSeedMessage(''), 4000)
    }
  }

  // ─── Event CRUD ───────────────────────────────────────────────────────────────

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event? This will break any dynamic routes referencing it.')) return
    try {
      setFetching(true)
      await deleteDoc(doc(db, 'events', id))
      await fetchData()
    } catch (error) {
      alert('Failed to delete event.')
      console.error(error)
    } finally {
      setFetching(false)
    }
  }

  const openAddEventModal = () => {
    setEditingEvent(null)
    setEventForm(JSON.parse(JSON.stringify(emptyEvent)))
    setIsEventModalOpen(true)
  }

  const openEditEventModal = (event: EventData) => {
    setEditingEvent(event)
    setEventForm(JSON.parse(JSON.stringify(event)))
    setIsEventModalOpen(true)
  }

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventForm.id) { alert('Please provide a unique Event ID (slug URL name).'); return }
    setSavingEvent(true)
    try {
      const docRef = doc(db, 'events', eventForm.id.trim().toLowerCase())
      await setDoc(docRef, { ...eventForm, id: eventForm.id.trim().toLowerCase() })
      setIsEventModalOpen(false)
      await fetchData()
    } catch (error) {
      alert('Error saving event.')
      console.error(error)
    } finally {
      setSavingEvent(false)
    }
  }

  const handleArrayChange = (field: 'rules' | 'checklist', index: number, value: string) => {
    const updated = [...eventForm[field]]
    updated[index] = value
    setEventForm(prev => ({ ...prev, [field]: updated }))
  }

  const addArrayItem = (field: 'rules' | 'checklist') => {
    setEventForm(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field: 'rules' | 'checklist', index: number) => {
    const updated = eventForm[field].filter((_, i) => i !== index)
    setEventForm(prev => ({ ...prev, [field]: updated }))
  }

  const handleTrackChange = (index: number, key: keyof EventTrack, value: string) => {
    const updated = [...eventForm.tracks]
    updated[index] = { ...updated[index], [key]: value }
    setEventForm(prev => ({ ...prev, tracks: updated }))
  }

  const addTrack = () => {
    setEventForm(prev => ({
      ...prev,
      tracks: [...prev.tracks, { tag: `TRACK 0${prev.tracks.length + 1}`, title: '', desc: '', color: prev.color }]
    }))
  }

  const removeTrack = (index: number) => {
    setEventForm(prev => ({ ...prev, tracks: prev.tracks.filter((_, i) => i !== index) }))
  }

  const handleTimelineChange = (index: number, key: keyof EventMilestone, value: any) => {
    const updated = [...eventForm.timeline]
    updated[index] = { ...updated[index], [key]: value }
    setEventForm(prev => ({ ...prev, timeline: updated }))
  }

  const addMilestone = () => {
    setEventForm(prev => ({
      ...prev,
      timeline: [...prev.timeline, { date: '', event: '', desc: '', iconName: 'Clock', details: [''] }]
    }))
  }

  const removeMilestone = (index: number) => {
    setEventForm(prev => ({ ...prev, timeline: prev.timeline.filter((_, i) => i !== index) }))
  }

  const handleMilestoneDetailChange = (mIdx: number, dIdx: number, value: string) => {
    const updatedTimeline = [...eventForm.timeline]
    const updatedDetails = [...updatedTimeline[mIdx].details]
    updatedDetails[dIdx] = value
    updatedTimeline[mIdx].details = updatedDetails
    setEventForm(prev => ({ ...prev, timeline: updatedTimeline }))
  }

  const addMilestoneDetail = (mIdx: number) => {
    const updatedTimeline = [...eventForm.timeline]
    updatedTimeline[mIdx].details = [...updatedTimeline[mIdx].details, '']
    setEventForm(prev => ({ ...prev, timeline: updatedTimeline }))
  }

  const removeMilestoneDetail = (mIdx: number, dIdx: number) => {
    const updatedTimeline = [...eventForm.timeline]
    updatedTimeline[mIdx].details = updatedTimeline[mIdx].details.filter((_, i) => i !== dIdx)
    setEventForm(prev => ({ ...prev, timeline: updatedTimeline }))
  }

  // ─── FAQ CRUD ─────────────────────────────────────────────────────────────────

  const openAddFaqModal = () => {
    setEditingFaq(null)
    setFaqForm({ ...emptyFaq, order: faqs.length + 1 })
    setIsFaqModalOpen(true)
  }

  const openEditFaqModal = (faq: FAQ) => {
    setEditingFaq(faq)
    setFaqForm({ ...faq })
    setIsFaqModalOpen(true)
  }

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!faqForm.id) { alert('Please provide a unique FAQ ID.'); return }
    setSavingFaq(true)
    try {
      await setDoc(doc(db, 'faqs', faqForm.id.trim()), { ...faqForm, id: faqForm.id.trim() })
      setIsFaqModalOpen(false)
      await fetchData()
    } catch (error) {
      alert('Error saving FAQ.')
      console.error(error)
    } finally {
      setSavingFaq(false)
    }
  }

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    try {
      setFetching(true)
      await deleteDoc(doc(db, 'faqs', id))
      await fetchData()
    } catch (error) {
      alert('Failed to delete FAQ.')
      console.error(error)
    } finally {
      setFetching(false)
    }
  }

  // ─── Team CRUD ────────────────────────────────────────────────────────────────

  const openAddMemberModal = () => {
    setEditingMember(null)
    setMemberForm({ ...emptyMember, order: team.length + 1 })
    setIsTeamModalOpen(true)
  }

  const openEditMemberModal = (member: TeamMember) => {
    setEditingMember(member)
    setMemberForm({ ...member })
    setIsTeamModalOpen(true)
  }

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberForm.id) { alert('Please provide a unique Member ID.'); return }
    setSavingMember(true)
    try {
      await setDoc(doc(db, 'team', memberForm.id.trim()), { ...memberForm, id: memberForm.id.trim() })
      setIsTeamModalOpen(false)
      await fetchData()
    } catch (error) {
      alert('Error saving team member.')
      console.error(error)
    } finally {
      setSavingMember(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return
    try {
      setFetching(true)
      await deleteDoc(doc(db, 'team', id))
      await fetchData()
    } catch (error) {
      alert('Failed to delete team member.')
      console.error(error)
    } finally {
      setFetching(false)
    }
  }

  const handleToggleUserRole = async (userId: string, roleKey: 'isAdmin' | 'isManager', currentStatus: boolean) => {
    if (userId === user?.uid && roleKey === 'isAdmin') {
      alert('Security Protocol: You cannot revoke admin access from your own account.')
      return
    }
    setUpdatingUserRole(userId)
    try {
      const userRef = doc(db, 'users', userId)
      await setDoc(userRef, { [roleKey]: !currentStatus }, { merge: true })
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, [roleKey]: !currentStatus } : u))
    } catch (err) {
      console.error(`Error toggling role:`, err)
      alert('Failed to update user role. Permissions denied.')
    } finally {
      setUpdatingUserRole(null)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return
    try {
      setFetching(true)
      await deleteDoc(doc(db, 'contact_messages', id))
      await fetchData()
    } catch (error) {
      alert('Failed to delete contact message.')
      console.error(error)
    } finally {
      setFetching(false)
    }
  }

  // ─── Settings Save ────────────────────────────────────────────────────────────

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'countdown'), countdown),
        setDoc(doc(db, 'settings', 'stats'), { items: stats }),
      ])
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch (error) {
      alert('Error saving settings.')
      console.error(error)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleStatChange = (index: number, key: keyof StatItem, value: string) => {
    const updated = [...stats]
    updated[index] = { ...updated[index], [key]: value }
    setStats(updated)
  }

  const addStat = () => setStats(prev => [...prev, { value: '', label: '', color: '#ff7300' }])
  const removeStat = (index: number) => setStats(prev => prev.filter((_, i) => i !== index))

  // ─── Filter Logic ─────────────────────────────────────────────────────────────

  const filteredRegs = registrations.filter(r =>
    (r.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (r.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (r.college?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (r.track?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const filteredAttendance = registrations.filter(r => {
    const matchesSearch = 
      (r.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.college?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (r.track?.toLowerCase() || '').includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (attendanceEventId === 'all') return true;
    const regEventId = r.eventId || mapTrackToEventId(r.track);
    return regEventId === attendanceEventId;
  })

  const filteredContacts = contacts.filter(c =>
    (c.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.subject?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.message?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const filteredEvents = eventsList.filter(e =>
    (e.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (e.tag?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (e.venue?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const filteredFaqs = faqs.filter(f =>
    (f.question?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (f.category?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const filteredTeam = team.filter(m =>
    (m.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (m.role?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const filteredUsers = usersList.filter(u => {
    const isAlreadyRole = u.isAdmin || u.isManager
    const matchesSearch = 
      (u.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || '').includes(search.toLowerCase())
    
    if (search === '') {
      return isAlreadyRole
    } else {
      return matchesSearch
    }
  })

  // ─── Loading / Access screens ──────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center gap-4 text-slate-400 font-mono">
        <Loader2 className="animate-spin text-[#ff7300]" size={36} />
        <p className="text-xs tracking-[0.2em]">// SECURE LINK INITIATING...</p>
      </div>
    )
  }

  if (!user || !profile?.isAdmin) {
    return (
      <main className="min-h-screen bg-[#020408] flex flex-col justify-between pt-24 relative overflow-hidden">
        <div className="scan-line" />
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="absolute inset-0 cyber-grid-bg opacity-[0.03] pointer-events-none" />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg glass-card corner-bracket rounded-2xl p-8 border border-red-500/30 bg-[#04070d]/90 text-center relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)]"
          >
            <div className="p-4 bg-red-950/30 rounded-2xl w-fit mx-auto border border-red-500/20 mb-6 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldAlert size={40} className="animate-pulse" />
            </div>
            
            <h1 className="font-orbitron text-2xl font-black text-white mb-2">ACCESS RESTRICTED</h1>
            <p className="text-red-500 font-mono text-[9px] tracking-[0.25em] mb-4">// DEPLOYMENT LEVEL 0 // SECURE FIREWALL</p>
            
            <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">
              This terminal is restricted to administrators. Contact the organizing team for admin access.
            </p>

            {user ? (
              <div className="bg-black/60 border border-slate-900 rounded-lg p-3 text-left mb-6 font-mono text-[10px]">
                <span className="text-slate-500 block mb-1">YOUR UID:</span>
                <span className="text-orange-400 select-all block break-all font-bold">{user.uid}</span>
              </div>
            ) : (
              <p className="text-slate-500 font-mono text-[10px] mb-6">// PLEASE LOG IN TO REVEAL TERMINAL IDENTITY</p>
            )}

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.push('/')}
                className="btn-outline px-6 py-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back to Arena
              </button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    )
  }

  // ─── Tabs config ──────────────────────────────────────────────────────────────

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'registrations', label: 'REGISTRATIONS', icon: <Users size={14} />, count: registrations.length },
    { key: 'contacts', label: 'CONTACTS', icon: <Mail size={14} />, count: contacts.length },
    { key: 'attendance', label: 'ATTENDANCE', icon: <CheckSquare size={14} /> },
    { key: 'events', label: 'EVENTS', icon: <Calendar size={14} />, count: eventsList.length },
    { key: 'faqs', label: 'FAQs', icon: <HelpCircle size={14} />, count: faqs.length },
    { key: 'team', label: 'TEAM', icon: <UserCircle size={14} />, count: team.length },
    { key: 'settings', label: 'SETTINGS', icon: <Settings size={14} /> },
  ]

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen pt-24 bg-[#020408] relative">
      <div className="scan-line" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h1 className="font-orbitron text-2xl font-black text-white">COMMAND TERMINAL</h1>
            </div>
            <p className="text-slate-500 text-[10px] font-mono tracking-widest mt-1">// CREDENTIAL VALIDATED: {profile.name.toUpperCase()}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Seed DB button */}
            <button
              onClick={handleSeedDb}
              disabled={seedingDb}
              className="px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-950/10 text-emerald-400 text-xs font-bold hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Seed all empty collections with default data"
            >
              {seedingDb ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
              SEED DB
            </button>

            <button 
              onClick={fetchData}
              disabled={fetching}
              className="p-2.5 rounded-lg border border-slate-800 bg-[#04070d]/30 hover:border-orange-500/20 text-slate-400 hover:text-white transition-all disabled:opacity-50"
              title="Refresh Feeds"
            >
              <RefreshCw size={16} className={fetching ? 'animate-spin' : ''} />
            </button>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input 
                type="text"
                placeholder="FILTER ENTRIES..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-lg border border-slate-850 bg-black/40 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-colors font-mono w-[200px]"
              />
            </div>
          </div>
        </div>

        {/* Seed feedback */}
        {seedMessage && (
          <div className={`mb-4 px-4 py-3 rounded-lg border font-mono text-xs ${seedMessage.startsWith('✓') ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400' : 'border-red-500/30 bg-red-950/10 text-red-400'}`}>
            {seedMessage}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 border border-slate-900 bg-[#04070d]/20">
            <span className="font-mono text-[9px] text-slate-500 uppercase block mb-1">TOTAL SIGNUPS</span>
            <span className="font-orbitron text-2xl font-black text-[#ff7300]">{registrations.length}</span>
          </div>
          <div className="glass-card rounded-xl p-4 border border-slate-900 bg-[#04070d]/20">
            <span className="font-mono text-[9px] text-slate-500 uppercase block mb-1">CONTACT MESSAGES</span>
            <span className="font-orbitron text-2xl font-black text-amber-500">{contacts.length}</span>
          </div>
          <div className="glass-card rounded-xl p-4 border border-slate-900 bg-[#04070d]/20">
            <span className="font-mono text-[9px] text-slate-500 uppercase block mb-1">ACTIVE EVENTS</span>
            <span className="font-orbitron text-2xl font-black text-cyan-500">{eventsList.length}</span>
          </div>
          <div className="glass-card rounded-xl p-4 border border-slate-900 bg-[#04070d]/20">
            <span className="font-mono text-[9px] text-slate-500 uppercase block mb-1">TERMINAL STATUS</span>
            <span className="font-mono text-xs font-bold text-emerald-500 animate-pulse flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              STABLE // ONLINE
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-900 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch('') }}
              className={`py-3.5 px-4 sm:px-5 font-mono text-[10px] font-bold tracking-widest transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-orange-500/5 text-orange-400 border-b-[#ff7300]'
                  : 'text-slate-500 hover:text-slate-350 border-b-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card corner-bracket rounded-2xl border border-slate-900 bg-[#04070d]/20 overflow-hidden min-h-[400px]">

          {/* ── Registrations Tab ─────────────────────────────────────────────── */}
          {activeTab === 'registrations' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="border-b border-slate-900 font-mono text-[10px] text-slate-500 tracking-wider bg-black/40 uppercase">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">College</th>
                    <th className="p-4 text-center">Yr</th>
                    <th className="p-4 text-center">Size</th>
                    <th className="p-4">Event Track</th>
                    <th className="p-4 text-center">Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {filteredRegs.length > 0 ? (
                    filteredRegs.map(reg => (
                      <tr key={reg.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 font-bold text-white">{reg.name}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">{reg.email}</td>
                        <td className="p-4 text-slate-300">{reg.college}</td>
                        <td className="p-4 text-center text-slate-300 font-mono">{reg.year}</td>
                        <td className="p-4 text-center font-mono font-semibold text-[#ff7300]">{reg.teamSize}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 font-mono text-[10px]">
                            {reg.track}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center text-slate-500">
                            {reg.github && (
                              <a href={reg.github.startsWith('http') ? reg.github : `https://${reg.github}`} target="_blank" rel="noreferrer" className="hover:text-white" title="GitHub">
                                <ExternalLink size={14} />
                              </a>
                            )}
                            {reg.linkedin && (
                              <a href={reg.linkedin.startsWith('http') ? reg.linkedin : `https://${reg.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-white" title="LinkedIn">
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-mono text-xs">
                        // NO STUDENT DATA LOGGED ON CURRENT SCAN FILTER
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Contacts Tab ─────────────────────────────────────────────────── */}
          {activeTab === 'contacts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="border-b border-slate-900 font-mono text-[10px] text-slate-500 tracking-wider bg-black/40 uppercase">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Subject / Inquiry</th>
                    <th className="p-4">Message</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                      <tr key={contact.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 font-bold text-white whitespace-nowrap">{contact.name}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          <a href={`mailto:${contact.email}`} className="hover:text-orange-400 hover:underline">
                            {contact.email}
                          </a>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full border border-[#ff7300]/20 bg-[#ff7300]/5 text-[#ff7300] font-mono text-[10px] uppercase">
                            {contact.subject}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300 leading-relaxed max-w-md break-words">
                          {contact.message}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              className="py-1 px-2 rounded border border-red-500/25 bg-red-950/10 text-red-500 text-[10px] font-bold hover:bg-red-950/25 transition-all flex items-center justify-center gap-1"
                              title="Delete Message"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                        // NO CONTACT MESSAGES LOGGED ON CURRENT SCAN FILTER
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Attendance Tab ────────────────────────────────────────────────── */}
          {activeTab === 'attendance' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-900 gap-4 bg-black/10">
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider">// Event Attendance Register</h3>
                  <p className="text-[10px] font-mono text-slate-550 mt-1">Select an event to view and check-in attendees.</p>
                </div>
                <div>
                  <select
                    value={attendanceEventId}
                    onChange={(e) => setAttendanceEventId(e.target.value)}
                    className="px-3 py-2 rounded border border-slate-850 bg-[#050b14] text-xs text-white focus:outline-none focus:border-orange-500/50"
                  >
                    <option value="all">All Events</option>
                    {eventsList.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title || ev.name}</option>
                    ))}
                    {eventsList.length === 0 && (
                      <>
                        <option value="hackathon">Yuva Hackathon 36H</option>
                        <option value="ctf">Cyber-Volt CTF</option>
                        <option value="dronerace">Sky-Rush Drone Race</option>
                        <option value="robowars">Combat Robo-Wars</option>
                        <option value="workshop">AI & Web3 Workshops</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead>
                    <tr className="border-b border-slate-900 font-mono text-[10px] text-slate-500 tracking-wider bg-black/40 uppercase">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">College</th>
                      <th className="p-4">Event Track</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map(reg => (
                        <tr key={reg.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 font-bold text-white">{reg.name}</td>
                          <td className="p-4 font-mono text-[11px] text-slate-400">{reg.email}</td>
                          <td className="p-4 text-slate-300">{reg.college}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 font-mono text-[10px]">
                              {reg.track}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {reg.checkedIn ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-mono font-bold">
                                PRESENT
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500 text-[9px] font-mono">
                                ABSENT
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleAttendance(reg.id, reg.checkedIn || false)}
                              className={`px-3 py-1 text-[9px] font-mono font-bold rounded uppercase tracking-wider transition-colors ${
                                reg.checkedIn
                                  ? 'border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                  : 'border border-slate-700 text-slate-350 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              {reg.checkedIn ? 'Mark Absent' : 'Mark Present'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-mono text-xs">
                          // NO ATTENDEES MATCHING SELECTED EVENT FILTER
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Events Tab ───────────────────────────────────────────────────── */}
          {activeTab === 'events' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-[10px] text-slate-500 uppercase">// DATABASE RECORDS</span>
                <button
                  onClick={openAddEventModal}
                  className="btn-glow px-4 py-2 text-xs font-bold rounded-lg text-black flex items-center gap-1.5"
                >
                  <Plus size={14} /> ADD NEW EVENT
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(ev => (
                    <div 
                      key={ev.id} 
                      className="glass-card rounded-xl border border-slate-900 bg-black/40 p-5 flex flex-col justify-between"
                      style={{ borderTop: `2px solid ${ev.color}` }}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="status-tag text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full uppercase" style={{ color: ev.color, borderColor: `${ev.color}25` }}>
                            {ev.tag}
                          </span>
                          <span className="font-mono text-[8px] text-slate-600">ID: {ev.id}</span>
                        </div>
                        <h3 className="font-orbitron text-base font-bold text-white mb-1">{ev.title}</h3>
                        <p className="text-slate-400 text-xs font-light line-clamp-2 mb-4">{ev.tagline}</p>
                        
                        <div className="space-y-1.5 text-[11px] font-mono text-slate-450 mb-6 border-t border-slate-900/40 pt-4">
                          <div className="flex justify-between">
                            <span>VENUE:</span>
                            <span className="text-slate-300">{ev.venue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>BOUNTY:</span>
                            <span className="text-slate-300 font-semibold">{ev.prize}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-slate-900/60 pt-4">
                        <button
                          onClick={() => openEditEventModal(ev)}
                          className="flex-1 py-2 rounded border border-slate-800 bg-[#04070d]/30 text-slate-300 text-xs font-bold hover:border-orange-500/20 transition-all flex items-center justify-center gap-1"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="py-2 px-3 rounded border border-red-500/20 bg-red-950/10 text-red-500 text-xs font-bold hover:bg-red-950/20 hover:border-red-500/40 transition-all flex items-center justify-center"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
                    // NO CHALLENGES MATCHING FILTERS FOUND
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FAQs Tab ─────────────────────────────────────────────────────── */}
          {activeTab === 'faqs' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-[10px] text-slate-500 uppercase">// FREQUENTLY ASKED QUESTIONS</span>
                <button
                  onClick={openAddFaqModal}
                  className="btn-glow px-4 py-2 text-xs font-bold rounded-lg text-black flex items-center gap-1.5"
                >
                  <Plus size={14} /> ADD FAQ
                </button>
              </div>

              <div className="space-y-3">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map(faq => (
                    <div key={faq.id} className="glass-card rounded-xl border border-slate-900 bg-black/40 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 font-mono text-[9px] uppercase">
                              {faq.category}
                            </span>
                            <span className="font-mono text-[9px] text-slate-600">#{faq.order}</span>
                          </div>
                          <p className="text-sm font-semibold text-white mb-1 font-orbitron text-xs">{faq.question}</p>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openEditFaqModal(faq)}
                            className="py-1.5 px-3 rounded border border-slate-800 bg-[#04070d]/30 text-slate-300 text-xs font-bold hover:border-orange-500/20 transition-all flex items-center gap-1"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="py-1.5 px-2 rounded border border-red-500/20 bg-red-950/10 text-red-500 text-xs font-bold hover:bg-red-950/20 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-500 font-mono text-xs">
                    // NO FAQs FOUND — SEED THE DATABASE OR ADD ENTRIES MANUALLY
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Team Tab ─────────────────────────────────────────────────────── */}
          {activeTab === 'team' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-[10px] text-slate-500 uppercase">// ORGANISING TEAM MEMBERS</span>
                <button
                  onClick={openAddMemberModal}
                  className="btn-glow px-4 py-2 text-xs font-bold rounded-lg text-black flex items-center gap-1.5"
                >
                  <Plus size={14} /> ADD MEMBER
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTeam.length > 0 ? (
                  filteredTeam.map(member => (
                    <div key={member.id} className="glass-card rounded-xl border border-slate-900 bg-black/40 p-4 flex flex-col items-center text-center" style={{ borderTop: `2px solid ${member.color}` }}>
                      <div 
                        className="w-14 h-14 rounded-full overflow-hidden mb-3 p-0.5"
                        style={{ background: `linear-gradient(135deg, ${member.color}, transparent)` }}
                      >
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200' }} />
                      </div>
                      <h3 className="font-orbitron text-xs font-bold text-white mb-0.5 line-clamp-1">{member.name}</h3>
                      <p className="font-mono text-[9px] text-slate-400 uppercase mb-3 line-clamp-1">{member.role}</p>
                      <div className="flex gap-2 w-full mt-auto">
                        <button
                          onClick={() => openEditMemberModal(member)}
                          className="flex-1 py-1.5 rounded border border-slate-800 bg-[#04070d]/30 text-slate-300 text-[10px] font-bold hover:border-orange-500/20 transition-all flex items-center justify-center gap-1"
                        >
                          <Edit size={11} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="py-1.5 px-2 rounded border border-red-500/20 bg-red-950/10 text-red-500 text-[10px] font-bold hover:bg-red-950/20 transition-all"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
                    // NO TEAM MEMBERS — SEED THE DATABASE OR ADD MANUALLY
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-slate-900/60" />

              {/* Admins & Managers Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">// AUTHENTICATED SYSTEM ROLES</span>
                    <h3 className="font-orbitron text-xs font-bold text-orange-400 mt-1 uppercase">// Admins & Managers</h3>
                  </div>
                  <button
                    onClick={() => { setElevateSearch(''); setIsElevateModalOpen(true) }}
                    className="btn-glow px-4 py-2 text-xs font-bold rounded-lg text-black flex items-center gap-1.5"
                  >
                    <PlusCircle size={14} /> ELEVATE USER
                  </button>
                </div>

                <div className="glass-card rounded-xl border border-slate-900 bg-[#04070d]/20 overflow-hidden">
                  <table className="w-full text-left text-xs font-light">
                    <thead>
                      <tr className="border-b border-slate-900 font-mono text-[10px] text-slate-500 tracking-wider bg-black/40 uppercase">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email / UID</th>
                        <th className="p-4 text-center">Manager</th>
                        <th className="p-4 text-center">Admin</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(u => {
                          const isSelf = u.id === user?.uid
                          return (
                            <tr key={u.id} className="hover:bg-slate-900/20 transition-colors">
                              <td className="p-4 font-bold text-white flex items-center gap-2">
                                {u.name}
                                {u.isSuperAdmin && (
                                  <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-mono font-bold uppercase tracking-wider">SuperAdmin</span>
                                )}
                              </td>
                              <td className="p-4 font-mono text-[11px] text-slate-400">
                                <div>{u.email}</div>
                                <div className="text-[9px] text-slate-500 select-all font-mono">{u.id}</div>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono ${
                                  u.isManager 
                                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                                    : 'border-slate-800 bg-slate-950/20 text-slate-500'
                                }`}>
                                  {u.isManager ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono ${
                                  u.isAdmin 
                                    ? 'border-orange-500/20 bg-orange-500/5 text-orange-400 font-bold' 
                                    : 'border-slate-800 bg-slate-950/20 text-slate-500'
                                }`}>
                                  {u.isAdmin ? 'ADMIN' : 'USER'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleToggleUserRole(u.id, 'isManager', !!u.isManager)}
                                    disabled={updatingUserRole !== null}
                                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${
                                      u.isManager
                                        ? 'border-red-500/20 bg-red-950/10 text-red-500 hover:bg-red-950/20'
                                        : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]'
                                    }`}
                                  >
                                    {u.isManager ? 'Revoke Manager' : 'Make Manager'}
                                  </button>
                                  <button
                                    onClick={() => handleToggleUserRole(u.id, 'isAdmin', !!u.isAdmin)}
                                    disabled={updatingUserRole !== null || isSelf}
                                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${
                                      isSelf 
                                        ? 'border-slate-800 bg-slate-900/10 text-slate-500 cursor-not-allowed'
                                        : u.isAdmin
                                          ? 'border-red-500/20 bg-red-950/10 text-red-500 hover:bg-red-950/20'
                                          : 'border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.05)]'
                                    }`}
                                    title={isSelf ? 'Cannot modify your own Admin status' : undefined}
                                  >
                                    {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                            {search !== '' 
                              ? `// NO USERS FOUND MATCHING "${search.toUpperCase()}"` 
                              : '// NO ACTIVE ADMINS OR MANAGERS REGISTERED'
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="font-mono text-[9px] text-slate-600 uppercase">
                  * Note: Use the filter box in the top-right corner to search all system users by name or email to elevate their privileges. When search is empty, only active admins & managers are shown.
                </p>
              </div>
            </div>
          )}

          {/* ── Settings Tab ─────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <form onSubmit={handleSaveSettings} className="space-y-10 max-w-3xl">
                
                {/* Countdown Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900/60 pb-2">
                    <Clock size={14} className="text-orange-400" />
                    <h3 className="font-orbitron text-xs font-bold text-orange-400 uppercase">// Countdown Timer Settings</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">Target Date & Time*</label>
                      <input
                        type="datetime-local"
                        required
                        value={countdown.targetDate}
                        onChange={e => setCountdown(prev => ({ ...prev, targetDate: e.target.value }))}
                        className="w-full px-3 py-2 rounded border border-slate-850 bg-black/40 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                    <AdminInput
                      label="Timer Label"
                      value={countdown.label}
                      onChange={v => setCountdown(prev => ({ ...prev, label: v }))}
                      placeholder="REGISTRATION DEADLINE COUNTDOWN"
                    />
                    <div className="sm:col-span-2">
                      <AdminInput
                        label="Expired Message"
                        value={countdown.expiredMessage}
                        onChange={v => setCountdown(prev => ({ ...prev, expiredMessage: v }))}
                        placeholder="MISSION INITIATED / REGISTRATION CLOSED"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={14} className="text-orange-400" />
                      <h3 className="font-orbitron text-xs font-bold text-orange-400 uppercase">// Site Stats</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addStat}
                      className="text-[10px] font-mono text-orange-400 hover:text-white flex items-center gap-1"
                    >
                      <PlusCircle size={12} /> Add Stat
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="glass-card rounded-xl p-4 border border-slate-850 bg-black/35 relative">
                        <button
                          type="button"
                          onClick={() => removeStat(idx)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"
                        >
                          <X size={12} />
                        </button>
                        <div className="space-y-2 pr-4">
                          <div className="grid grid-cols-2 gap-2">
                            <AdminInput
                              label="Value"
                              value={stat.value}
                              onChange={v => handleStatChange(idx, 'value', v)}
                              placeholder="500+"
                              required
                            />
                            <AdminInput
                              label="Label"
                              value={stat.label}
                              onChange={v => handleStatChange(idx, 'label', v)}
                              placeholder="Participants"
                              required
                            />
                          </div>
                          <div>
                            <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">Color</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={stat.color}
                                onChange={e => handleStatChange(idx, 'color', e.target.value)}
                                className="w-8 h-8 p-0 border border-slate-800 bg-transparent rounded cursor-pointer flex-shrink-0"
                              />
                              <input
                                type="text"
                                value={stat.color}
                                onChange={e => handleStatChange(idx, 'color', e.target.value)}
                                className="flex-1 px-2 py-1 rounded border border-slate-850 bg-black/40 text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="btn-glow px-6 py-2.5 text-xs font-bold rounded-lg text-black flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {savingSettings ? <Loader2 className="animate-spin" size={14} /> : <CheckSquare size={14} />}
                    {savingSettings ? 'Saving...' : 'Save Settings'}
                  </button>
                  {settingsSaved && (
                    <span className="font-mono text-xs text-emerald-400 animate-pulse">✓ Settings saved to Firestore</span>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ── Event CRUD Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => { if (!savingEvent) setIsEventModalOpen(false) }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-4xl relative z-10 glass-card corner-bracket rounded-2xl p-6 sm:p-8 border border-slate-800 bg-[#04070d] max-h-[85vh] overflow-y-auto shadow-[0_0_50px_rgba(255,115,0,0.08)] font-sans"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-900 pb-4">
                <div>
                  <span className="font-mono text-[9px] text-[#ff7300] tracking-[0.3em] uppercase block">// DATABASE ENTRY PROTOCOL</span>
                  <h2 className="font-orbitron text-lg sm:text-xl font-black text-white">
                    {editingEvent ? `EDIT EVENT // ${(editingEvent.title || editingEvent.name || '').toUpperCase()}` : 'DEPLOY NEW CHALLENGE'}
                  </h2>
                </div>
                <button type="button" disabled={savingEvent} onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-orbitron text-xs font-bold text-orange-450 border-b border-slate-900/60 pb-1.5 uppercase">// 1. Basic Specifications</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <AdminInput label="Event ID (URL slug, unique)" value={eventForm.id} onChange={v => setEventForm(prev => ({ ...prev, id: v }))} placeholder="e.g. hackathon, robowars" required disabled={!!editingEvent} />
                    <AdminInput label="Event Title" value={eventForm.title} onChange={v => setEventForm(prev => ({ ...prev, title: v }))} placeholder="e.g. Robo-Wars Arena" required />
                    <AdminInput label="Event Tagline" value={eventForm.tagline} onChange={v => setEventForm(prev => ({ ...prev, tagline: v }))} placeholder="Brief tagline" required />
                    <AdminInput label="Prize Pool / Bounty" value={eventForm.prize} onChange={v => setEventForm(prev => ({ ...prev, prize: v }))} placeholder="e.g. ₹50,000 Champion Pool" required />
                    <AdminInput label="Venue Block" value={eventForm.venue} onChange={v => setEventForm(prev => ({ ...prev, venue: v }))} placeholder="e.g. CS Lab Block" required />
                    <AdminInput label="Team Size Specs" value={eventForm.teamSize} onChange={v => setEventForm(prev => ({ ...prev, teamSize: v }))} placeholder="e.g. 2 - 4 Members" required />
                    <AdminInput label="Event Tag Type" value={eventForm.tag} onChange={v => setEventForm(prev => ({ ...prev, tag: v.toUpperCase() }))} placeholder="e.g. FLAGSHIP, CYBER" required />
                    <div>
                      <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">Lucide Icon Name*</label>
                      <select value={eventForm.iconName} onChange={e => setEventForm(prev => ({ ...prev, iconName: e.target.value }))} className="w-full px-3 py-2 rounded border border-slate-850 bg-black text-xs text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono">
                        {['Terminal', 'ShieldAlert', 'Rocket', 'Bot', 'Sparkles', 'Settings', 'Award', 'Calendar'].map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">Color Theme (Hex)*</label>
                      <div className="flex gap-2">
                        <input type="color" value={eventForm.color} onChange={e => setEventForm(prev => ({ ...prev, color: e.target.value }))} className="w-10 h-8 p-0 border border-slate-800 bg-transparent rounded cursor-pointer" />
                        <input type="text" required value={eventForm.color} onChange={e => setEventForm(prev => ({ ...prev, color: e.target.value }))} className="flex-1 px-3 py-1.5 rounded border border-slate-850 bg-black/40 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono" />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <AdminInput label="Widescreen Image Path" value={eventForm.image} onChange={v => setEventForm(prev => ({ ...prev, image: v }))} placeholder="e.g. /hackathon.png, /ctf.png" required />
                    </div>
                    <div className="col-span-full">
                      <AdminTextarea label="Extended Description" value={eventForm.description} onChange={v => setEventForm(prev => ({ ...prev, description: v }))} placeholder="Detailed specifications about the event module..." required rows={3} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                      <h3 className="font-orbitron text-xs font-bold text-orange-450 uppercase">// 2. Evaluation Directives</h3>
                      <button type="button" onClick={() => addArrayItem('rules')} className="text-[10px] font-mono text-orange-400 hover:text-white flex items-center gap-1"><PlusCircle size={12} /> Add Rule</button>
                    </div>
                    <div className="space-y-2">
                      {eventForm.rules.map((rule, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="font-mono text-[9px] text-slate-600">#{idx + 1}</span>
                          <input type="text" required placeholder="Enter rule clause..." value={rule} onChange={e => handleArrayChange('rules', idx, e.target.value)} className="flex-1 px-3 py-2 rounded border border-slate-850 bg-black/40 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-colors" />
                          {eventForm.rules.length > 1 && <button type="button" onClick={() => removeArrayItem('rules', idx)} className="text-red-500 hover:text-red-400 p-1"><X size={14} /></button>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                      <h3 className="font-orbitron text-xs font-bold text-orange-450 uppercase">// 3. Equipment Checklist</h3>
                      <button type="button" onClick={() => addArrayItem('checklist')} className="text-[10px] font-mono text-orange-400 hover:text-white flex items-center gap-1"><PlusCircle size={12} /> Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {eventForm.checklist.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="font-mono text-[9px] text-slate-600">#{idx + 1}</span>
                          <input type="text" required placeholder="e.g. Personal laptop..." value={item} onChange={e => handleArrayChange('checklist', idx, e.target.value)} className="flex-1 px-3 py-2 rounded border border-slate-850 bg-black/40 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-colors" />
                          {eventForm.checklist.length > 1 && <button type="button" onClick={() => removeArrayItem('checklist', idx)} className="text-red-500 hover:text-red-400 p-1"><X size={14} /></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                    <h3 className="font-orbitron text-xs font-bold text-orange-450 uppercase">// 4. Tracks / Syllabus Modules</h3>
                    <button type="button" onClick={addTrack} className="text-[10px] font-mono text-orange-400 hover:text-white flex items-center gap-1"><PlusCircle size={12} /> Add Track</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {eventForm.tracks?.map((track, idx) => (
                      <div key={idx} className="glass-card rounded-xl p-4 border border-slate-850 bg-black/35 relative">
                        {eventForm.tracks.length > 1 && <button type="button" onClick={() => removeTrack(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"><X size={14} /></button>}
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="font-mono text-[8px] text-slate-500 uppercase block mb-0.5">Tag ID</label>
                              <input type="text" required value={track.tag} onChange={e => handleTrackChange(idx, 'tag', e.target.value.toUpperCase())} className="w-full px-2 py-1 rounded border border-slate-900 bg-black text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono" />
                            </div>
                            <div className="col-span-2">
                              <label className="font-mono text-[8px] text-slate-500 uppercase block mb-0.5">Track Title</label>
                              <input type="text" required placeholder="Track focus title..." value={track.title} onChange={e => handleTrackChange(idx, 'title', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-900 bg-black text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-colors" />
                            </div>
                          </div>
                          <div>
                            <label className="font-mono text-[8px] text-slate-500 uppercase block mb-0.5">Track Description</label>
                            <textarea required rows={2} placeholder="Brief focus details..." value={track.desc} onChange={e => handleTrackChange(idx, 'desc', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-900 bg-black text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-colors leading-relaxed" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                    <h3 className="font-orbitron text-xs font-bold text-orange-450 uppercase">// 5. Milestones &amp; Timeline Schedule</h3>
                    <button type="button" onClick={addMilestone} className="text-[10px] font-mono text-orange-400 hover:text-white flex items-center gap-1"><PlusCircle size={12} /> Add Milestone</button>
                  </div>
                  <div className="space-y-4">
                    {eventForm.timeline?.map((milestone, mIdx) => (
                      <div key={mIdx} className="glass-card rounded-xl p-4 border border-slate-850 bg-black/35 relative">
                        {eventForm.timeline.length > 1 && <button type="button" onClick={() => removeMilestone(mIdx)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"><X size={14} /></button>}
                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="font-mono text-[8px] text-slate-500 block mb-0.5">Date / Time Slot</label>
                            <input type="text" required placeholder="e.g. 09:30 AM, TBA" value={milestone.date} onChange={e => handleTimelineChange(mIdx, 'date', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-900 bg-black text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono" />
                          </div>
                          <div>
                            <label className="font-mono text-[8px] text-slate-500 block mb-0.5">Milestone Event Name</label>
                            <input type="text" required placeholder="e.g. Hackathon Kickoff" value={milestone.event} onChange={e => handleTimelineChange(mIdx, 'event', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-900 bg-black text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-colors" />
                          </div>
                          <div>
                            <label className="font-mono text-[8px] text-slate-500 block mb-0.5">Milestone Lucide Icon</label>
                            <select value={milestone.iconName} onChange={e => handleTimelineChange(mIdx, 'iconName', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-900 bg-black text-[10px] text-white focus:outline-none">
                              {['Clock', 'Settings', 'Bot', 'Cpu', 'Sparkles', 'Award', 'Calendar', 'ClipboardList', 'CheckCircle2', 'Zap', 'Upload', 'Trophy', 'Users'].map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="font-mono text-[8px] text-slate-500 block mb-0.5">Brief Description</label>
                          <input type="text" required placeholder="e.g. Setup VPN links..." value={milestone.desc} onChange={e => handleTimelineChange(mIdx, 'desc', e.target.value)} className="w-full px-2 py-1 rounded border border-slate-900 bg-black text-[10px] text-white focus:outline-none focus:border-orange-500/50 transition-colors" />
                        </div>
                        <div className="pl-6 border-l border-slate-900 space-y-2 mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[8px] text-slate-500 uppercase">Milestone Subtask Checklist</span>
                            <button type="button" onClick={() => addMilestoneDetail(mIdx)} className="text-[8px] font-mono text-orange-400 hover:text-white flex items-center gap-0.5"><PlusCircle size={10} /> Add Check</button>
                          </div>
                          {milestone.details?.map((detail: string, dIdx: number) => (
                            <div key={dIdx} className="flex gap-2 items-center">
                              <span className="font-mono text-[8px] text-slate-655">•</span>
                              <input type="text" required placeholder="Milestone sub-detail..." value={detail} onChange={e => handleMilestoneDetailChange(mIdx, dIdx, e.target.value)} className="flex-1 px-2 py-1 rounded border border-slate-900 bg-black text-[9px] text-white focus:outline-none focus:border-orange-500/50 transition-colors" />
                              {milestone.details.length > 1 && <button type="button" onClick={() => removeMilestoneDetail(mIdx, dIdx)} className="text-red-500 hover:text-red-400 p-0.5"><X size={12} /></button>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-900 pt-5 mt-6">
                  <button type="button" disabled={savingEvent} onClick={() => setIsEventModalOpen(false)} className="btn-outline px-6 py-2.5 text-xs font-bold rounded-lg">Cancel</button>
                  <button type="submit" disabled={savingEvent} className="btn-glow px-6 py-2.5 text-xs font-bold rounded-lg text-black flex items-center gap-1">
                    {savingEvent ? <><Loader2 className="animate-spin" size={14} /> Transmitting...</> : 'Commit Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FAQ CRUD Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFaqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => { if (!savingFaq) setIsFaqModalOpen(false) }} className="fixed inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-xl relative z-10 glass-card rounded-2xl p-6 border border-slate-800 bg-[#04070d] shadow-[0_0_50px_rgba(255,115,0,0.08)]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-900 pb-4">
                <div>
                  <span className="font-mono text-[9px] text-[#ff7300] tracking-[0.3em] uppercase block">// FAQ ENTRY PROTOCOL</span>
                  <h2 className="font-orbitron text-lg font-black text-white">{editingFaq ? 'EDIT FAQ' : 'ADD NEW FAQ'}</h2>
                </div>
                <button type="button" disabled={savingFaq} onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveFaq} className="space-y-4">
                <AdminInput label="FAQ ID (unique slug)" value={faqForm.id} onChange={v => setFaqForm(prev => ({ ...prev, id: v }))} placeholder="e.g. faq-8" required disabled={!!editingFaq} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">Category*</label>
                    <select value={faqForm.category} onChange={e => setFaqForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 rounded border border-slate-850 bg-black text-xs text-white focus:outline-none focus:border-orange-500/50 transition-colors">
                      {['General', 'Teams', 'Participation', 'Prizes'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <AdminInput label="Display Order" value={String(faqForm.order)} onChange={v => setFaqForm(prev => ({ ...prev, order: parseInt(v) || 0 }))} placeholder="1" type="number" />
                </div>
                <AdminInput label="Question" value={faqForm.question} onChange={v => setFaqForm(prev => ({ ...prev, question: v }))} placeholder="Enter the question..." required />
                <AdminTextarea label="Answer" value={faqForm.answer} onChange={v => setFaqForm(prev => ({ ...prev, answer: v }))} placeholder="Enter the answer..." required rows={4} />
                <div className="flex justify-end gap-3 border-t border-slate-900 pt-4">
                  <button type="button" disabled={savingFaq} onClick={() => setIsFaqModalOpen(false)} className="btn-outline px-5 py-2 text-xs font-bold rounded-lg">Cancel</button>
                  <button type="submit" disabled={savingFaq} className="btn-glow px-5 py-2 text-xs font-bold rounded-lg text-black flex items-center gap-1">
                    {savingFaq ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : 'Save FAQ'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Team Member CRUD Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isTeamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => { if (!savingMember) setIsTeamModalOpen(false) }} className="fixed inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-xl relative z-10 glass-card rounded-2xl p-6 border border-slate-800 bg-[#04070d] shadow-[0_0_50px_rgba(255,115,0,0.08)]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-900 pb-4">
                <div>
                  <span className="font-mono text-[9px] text-[#ff7300] tracking-[0.3em] uppercase block">// TEAM ROSTER PROTOCOL</span>
                  <h2 className="font-orbitron text-lg font-black text-white">{editingMember ? 'EDIT MEMBER' : 'ADD TEAM MEMBER'}</h2>
                </div>
                <button type="button" disabled={savingMember} onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveMember} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <AdminInput label="Member ID (unique)" value={memberForm.id} onChange={v => setMemberForm(prev => ({ ...prev, id: v }))} placeholder="e.g. member-5" required disabled={!!editingMember} />
                  <AdminInput label="Display Order" value={String(memberForm.order)} onChange={v => setMemberForm(prev => ({ ...prev, order: parseInt(v) || 0 }))} placeholder="5" type="number" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <AdminInput label="Full Name" value={memberForm.name} onChange={v => setMemberForm(prev => ({ ...prev, name: v }))} placeholder="e.g. Arjun Menon" required />
                  <AdminInput label="Role / Title" value={memberForm.role} onChange={v => setMemberForm(prev => ({ ...prev, role: v }))} placeholder="e.g. Technical Lead" required />
                </div>
                <AdminInput label="Profile Image URL" value={memberForm.image} onChange={v => setMemberForm(prev => ({ ...prev, image: v }))} placeholder="https://..." required />
                <div className="grid grid-cols-2 gap-4">
                  <AdminInput label="GitHub URL" value={memberForm.github} onChange={v => setMemberForm(prev => ({ ...prev, github: v }))} placeholder="https://github.com/..." />
                  <AdminInput label="LinkedIn URL" value={memberForm.linkedin} onChange={v => setMemberForm(prev => ({ ...prev, linkedin: v }))} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase block mb-1">Accent Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={memberForm.color} onChange={e => setMemberForm(prev => ({ ...prev, color: e.target.value }))} className="w-10 h-8 p-0 border border-slate-800 bg-transparent rounded cursor-pointer" />
                    <input type="text" value={memberForm.color} onChange={e => setMemberForm(prev => ({ ...prev, color: e.target.value }))} className="flex-1 px-3 py-1.5 rounded border border-slate-850 bg-black/40 text-xs text-white focus:outline-none focus:border-orange-500/50 transition-colors font-mono" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-900 pt-4">
                  <button type="button" disabled={savingMember} onClick={() => setIsTeamModalOpen(false)} className="btn-outline px-5 py-2 text-xs font-bold rounded-lg">Cancel</button>
                  <button type="submit" disabled={savingMember} className="btn-glow px-5 py-2 text-xs font-bold rounded-lg text-black flex items-center gap-1">
                    {savingMember ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : 'Save Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Elevate User Role Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isElevateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsElevateModalOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-xl relative z-10 glass-card rounded-2xl p-6 border border-slate-800 bg-[#04070d] shadow-[0_0_50px_rgba(255,115,0,0.08)] flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-900 pb-4">
                <div>
                  <span className="font-mono text-[9px] text-[#ff7300] tracking-[0.3em] uppercase block">// SECURITY AUTHORIZATION PROTOCOL</span>
                  <h2 className="font-orbitron text-lg font-black text-white">ELEVATE USER PRIVILEGES</h2>
                </div>
                <button type="button" onClick={() => setIsElevateModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>

              {/* Search Box */}
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="SEARCH ALL REGISTERED USERS BY NAME OR EMAIL..."
                  value={elevateSearch}
                  onChange={e => setElevateSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-855 bg-black text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-colors font-mono uppercase"
                />
              </div>

              {/* Users List Container */}
              <div className="flex-1 overflow-y-auto min-h-[220px] border border-slate-900 rounded-xl bg-black/20 divide-y divide-slate-900/60 scrollbar-thin">
                {usersList.filter(u => !u.isAdmin && !u.isManager).filter(u => 
                  elevateSearch === '' ||
                  (u.name?.toLowerCase() || '').includes(elevateSearch.toLowerCase()) ||
                  (u.email?.toLowerCase() || '').includes(elevateSearch.toLowerCase())
                ).length > 0 ? (
                  usersList.filter(u => !u.isAdmin && !u.isManager).filter(u => 
                    elevateSearch === '' ||
                    (u.name?.toLowerCase() || '').includes(elevateSearch.toLowerCase()) ||
                    (u.email?.toLowerCase() || '').includes(elevateSearch.toLowerCase())
                  ).map(u => (
                    <div key={u.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-900/10 transition-colors">
                      <div>
                        <div className="font-bold text-white text-xs">{u.name}</div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">{u.email}</div>
                        <div className="font-mono text-[8px] text-slate-550 select-all mt-0.5">{u.id}</div>
                      </div>
                      <div className="flex gap-2 self-stretch sm:self-auto justify-end">
                        <button
                          onClick={() => handleToggleUserRole(u.id, 'isManager', false)}
                          disabled={updatingUserRole !== null}
                          className="px-3 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                        >
                          + Make Manager
                        </button>
                        <button
                          onClick={() => handleToggleUserRole(u.id, 'isAdmin', false)}
                          disabled={updatingUserRole !== null}
                          className="px-3 py-1 rounded border border-orange-500/20 bg-orange-500/10 text-orange-400 text-[10px] font-bold hover:bg-orange-500/20 transition-all flex items-center gap-1"
                        >
                          + Make Admin
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">
                    {elevateSearch !== ''
                      ? `// NO MATCHING USER ROLES FOUND FOR "${elevateSearch.toUpperCase()}"`
                      : '// TYPE NAME OR EMAIL TO FIND REGISTERED USERS'
                    }
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-900 pt-4 mt-4">
                <button type="button" onClick={() => setIsElevateModalOpen(false)} className="btn-outline px-5 py-2 text-xs font-bold rounded-lg">Done</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
