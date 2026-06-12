'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { 
  Terminal as TermIcon, Shield, Zap, RefreshCw, Cpu, Activity, 
  Send, Copy, Check, Sparkles, BookOpen, Compass, Info 
} from 'lucide-react'

// Curated Hackathon Project Idea Database
const ideaDatabase: Record<string, Record<string, { title: string; desc: string }[]>> = {
  'AI & Machine Learning': {
    'Beginner': [
      { title: 'CyberGuard Phishing Shield', desc: 'An ML-based browser extension that highlights manipulative language and phishing patterns in incoming emails.' },
      { title: 'EduDoc Note Summarizer', desc: 'A lightweight tool that converts dense university lectures into structured, bulleted markdown notes using HuggingFace models.' },
      { title: 'EcoScan Sorting Helper', desc: 'A mobile web app that identifies recyclable materials from camera input and informs the user of proper disposal methods.' }
    ],
    'Intermediate': [
      { title: 'SentiTrade Market Predictor', desc: 'A real-time sentiment analysis engine that processes live Reddit and Twitter feeds to predict short-term stock/crypto market trends.' },
      { title: 'EcoRoute EV Router', desc: 'An AI-driven routing engine that optimizes electric delivery vehicle routes based on traffic, battery levels, and elevation profiles.' },
      { title: 'Aura-Check Mental Companion', desc: 'A privacy-focused web platform that tracks vocal bio-markers and speech speed to detect early signs of stress and burnout.' }
    ],
    'Advanced': [
      { title: 'DeafSpeak Edge Translator', desc: 'An edge-AI powered application that translates sign language video feeds into spoken audio and text in real-time.' },
      { title: 'SyntheDoc PII Anonymizer', desc: 'An enterprise-grade pipeline that synthetically masks Personally Identifiable Information (PII) in healthcare datasets to make them HIPAA-compliant.' },
      { title: 'NeuroFlow Adaptive Tutor', desc: 'A neural network that analyzes student learning patterns and dynamically generates custom interactive exercises tailored to their retention rates.' }
    ]
  },
  'Web3 & Blockchain': {
    'Beginner': [
      { title: 'MicroShare stablecoin tip jar', desc: 'A clean widgets tool allowing creators to accept micro-tips in stablecoins on Polygon with gasless meta-transactions.' },
      { title: 'SoulBound Certificate registry', desc: 'A simple dApp to issue and verify immutable academic participation certificates as non-transferable soulbound tokens.' },
      { title: 'GreenStamp carbon reward tracker', desc: 'A token-faucet that rewards users with mock eco-credits for recording their recycling milestones.' }
    ],
    'Intermediate': [
      { title: 'RentBlock Estate Engine', desc: 'A fractionalized real-estate renting platform that allows tenants to lease co-working spaces using collateralized smart contracts.' },
      { title: 'DeVote Secure Governance', desc: 'A quadratic voting dApp designed for student councils, featuring zero-knowledge proof verification to ensure voting privacy.' },
      { title: 'EscrowLink Freelance Portal', desc: 'A decentralized escrow contract system that locks milestone funds and unlocks them automatically upon GitHub pull request approvals.' }
    ],
    'Advanced': [
      { title: 'OmniBridge Liquidity Router', desc: 'A cross-chain yield aggregator that routes stablecoin deposits across multiple L2 chains to maximize liquidity returns.' },
      { title: 'ZkVerify Zero-Knowledge Identity', desc: 'A zero-knowledge proof identity verification scheme that allows users to verify their age/nationality without exposing personal data.' },
      { title: 'ShieldStake Smart-Contract Insurance', desc: 'A decentralized insurance pool utilizing cryptographic proofs to automatically pay out smart contract exploit claims.' }
    ]
  },
  'Cybersecurity': {
    'Beginner': [
      { title: 'PassVault strength scanner', desc: 'A client-side password strength checker that runs offline checks against a database of breached passwords.' },
      { title: 'AccessPort network monitor', desc: 'A simple dashboard that monitors local port usage and alerts users to unauthorized socket connections.' },
      { title: 'CryptoSign email validator', desc: 'A tool that uses cryptographic signatures to sign and verify internal team emails to prevent spoofing.' }
    ],
    'Intermediate': [
      { title: 'ZeroTrust Multi-Sig Shard Manager', desc: 'A multi-sig local credentials manager that splits access keys into shards using Shamir\'s Secret Sharing.' },
      { title: 'PhishCatcher extension', desc: 'A lightweight extension analyzing DOM changes, URL redirects, and hidden scripts to block real-time phishing lookalikes.' },
      { title: 'NetAudit network host scanner', desc: 'A web-based interface for local networks that identifies active hosts, details exposed ports, and scans for known CVE vulnerabilities.' }
    ],
    'Advanced': [
      { title: 'Honeynet Trap network manager', desc: 'A virtualized sandboxed network environment (honeypot) that attracts, monitors, and logs malicious access patterns.' },
      { title: 'ZeroProof immutable log compiler', desc: 'An immutable logs compiler that records system administrative commands on an encrypted ledger for forensic audits.' },
      { title: 'FlowSecure ML anomaly detector', desc: 'A machine learning system that analyzes network packet sizes and traffic intervals to identify and mitigate active DDoS botnets.' }
    ]
  },
  'FinTech & EdTech': {
    'Beginner': [
      { title: 'CoinSplit budget tracker', desc: 'A smart dashboard that categorizes monthly student expenses and suggests customized budget savings goals.' },
      { title: 'EduQuest Spaced cards', desc: 'An interactive flashcard portal using spaced repetition to help students master coding concepts.' },
      { title: 'MicroSave round-up investor', desc: 'A mock savings app that rounds up daily purchases and invests the change into virtual exchange-traded funds.' }
    ],
    'Intermediate': [
      { title: 'EduTrack collab workspace', desc: 'A real-time markdown notebook with collaborative drawing boards and built-in interactive peer review rooms.' },
      { title: 'MicroTrust Student Lending', desc: 'A peer-to-peer lending matching engine allowing students to request low-interest micro-loans from alumni sponsors.' },
      { title: 'TaxFlow freelance invoicing', desc: 'A smart billing platform for freelancers that calculates regional taxes and generates compliant invoicing schemas automatically.' }
    ],
    'Advanced': [
      { title: 'AlgoTrade arbitrage simulator', desc: 'A high-frequency paper trading dashboard that simulates and monitors real-time market price differences.' },
      { title: 'MindFlow educational tracker', desc: 'An educational dashboard that uses webcam eye-tracking and neural focus-timers to optimize course curriculum flow.' },
      { title: 'CreditScore alternative assessor', desc: 'An ML platform that computes credit-worthiness for unbanked individuals using local utility bills and mobile usage data.' }
    ]
  },
  'IoT & Smart Cities': {
    'Beginner': [
      { title: 'SmartAqua level controller', desc: 'A dashboard displaying water tank levels and notifying users when levels drop below critical margins.' },
      { title: 'EcoTemp local climate logger', desc: 'A real-time temperature and humidity logger that maps microclimates in school computer labs.' },
      { title: 'LightGrid automatic switcher', desc: 'A web utility simulating building lights switching off automatically when no digital devices are active in a room.' }
    ],
    'Intermediate': [
      { title: 'TransitSync transit mapper', desc: 'A public transit mapping tool combining crowd-sourced location feeds to provide precise bus arrivals.' },
      { title: 'AgriSense automated farming', desc: 'An automated dashboard that monitors soil moisture sensors and controls irrigation relays based on weather forecasts.' },
      { title: 'BinFlow smart waste dispatcher', desc: 'An IoT system that maps trash container capacities across SRM campuses and designs optimal collection routes.' }
    ],
    'Advanced': [
      { title: 'GridFlex micro-grid router', desc: 'A smart grid simulation distributing electricity from solar micro-generators to buildings based on demand.' },
      { title: 'SafeWalk Streetlight controller', desc: 'An adaptive streetlight controller network that increases light intensity when motion is detected along walking paths.' },
      { title: 'SmokeTrack wildfire predictor', desc: 'A distributed sensor system that measures air quality, heat indices, and wind vectors to predict fire spreads in real-time.' }
    ]
  },
  'Open Innovation': {
    'Beginner': [
      { title: 'RecipeSwap community kitchen', desc: 'A social web app that shares local recipes and suggests alternative ingredients based on diet restrictions.' },
      { title: 'FocusSpace pomodoro audio', desc: 'A minimalist dashboard featuring customizable white noise, background beats, and pomodoro timers.' },
      { title: 'VolunteerNet emergency mapper', desc: 'A geo-map connecting local community volunteers with non-profits in need of physical help.' }
    ],
    'Intermediate': [
      { title: 'ResumeRank tech reviewer', desc: 'A feedback tool matching junior developers with senior mentors for resume critique and code reviews.' },
      { title: 'EcoProd carbon logger', desc: 'An interactive map tracing carbon footprints of commercial grocery products from source to shelf.' },
      { title: 'SkillSwap exchange marketplace', desc: 'A platform matching students who want to teach a skill with peers who want to learn it, on a bartering basis.' }
    ],
    'Advanced': [
      { title: 'CrowdHelp emergency response dispatch', desc: 'A low-latency emergency routing system that dispatches certified civilian volunteers to nearby medical incidents.' },
      { title: 'SignSpeak live interpreter', desc: 'An interactive virtual meeting space featuring real-time translation of sign language into textual closed captions.' },
      { title: 'SoundMap environmental noise logger', desc: 'A mobile crowdsourcing app that gathers environmental noise data to map city noise pollution patterns.' }
    ]
  }
}

// Preset Q&A triggers
const qnaDictionary: Record<string, string> = {
  'date': 'YUVA TECH-FEST: Milestones are set. Online registrations are officially open. The main hackathon event is a 36-hour non-stop sprint hosted live inside the SRM IST Tiruchirappalli campus. Review the "EVENT SCHEDULE" section above for a full list of milestones.',
  'when': 'YUVA TECH-FEST: Milestones are set. Online registrations are officially open. The main hackathon event is a 36-hour non-stop sprint hosted live inside the SRM IST Tiruchirappalli campus. Review the "EVENT SCHEDULE" section above for a full list of milestones.',
  'schedule': 'YUVA TECH-FEST: Milestones are set. Online registrations are officially open. The main hackathon event is a 36-hour non-stop sprint hosted live inside the SRM IST Tiruchirappalli campus. Review the "EVENT SCHEDULE" section above for a full list of milestones.',
  'where': 'VENUE PROTOCOL: Hosted fully in-person at the SRM Institute of Science & Technology, Tiruchirappalli Campus (SRM IST Trichy), Highway, Irungalur, Tamil Nadu 621105. Excellent labs, high-speed connection arrays, and rest facilities will be fully open.',
  'venue': 'VENUE PROTOCOL: Hosted fully in-person at the SRM Institute of Science & Technology, Tiruchirappalli Campus (SRM IST Trichy), Highway, Irungalur, Tamil Nadu 621105. Excellent labs, high-speed connection arrays, and rest facilities will be fully open.',
  'location': 'VENUE PROTOCOL: Hosted fully in-person at the SRM Institute of Science & Technology, Tiruchirappalli Campus (SRM IST Trichy), Highway, Irungalur, Tamil Nadu 621105. Excellent labs, high-speed connection arrays, and rest facilities will be fully open.',
  'srm': 'VENUE PROTOCOL: Hosted fully in-person at the SRM Institute of Science & Technology, Tiruchirappalli Campus (SRM IST Trichy), Highway, Irungalur, Tamil Nadu 621105. Excellent labs, high-speed connection arrays, and rest facilities will be fully open.',
  'who': 'ELIGIBILITY CORE: Open to all undergraduate and postgraduate college students from any registered educational institution. Standard engineering, design, arts, or science profiles are accepted. Bring student ID cards for check-in.',
  'eligible': 'ELIGIBILITY CORE: Open to all undergraduate and postgraduate college students from any registered educational institution. Standard engineering, design, arts, or science profiles are accepted. Bring student ID cards for check-in.',
  'eligibility': 'ELIGIBILITY CORE: Open to all undergraduate and postgraduate college students from any registered educational institution. Standard engineering, design, arts, or science profiles are accepted. Bring student ID cards for check-in.',
  'student': 'ELIGIBILITY CORE: Open to all undergraduate and postgraduate college students from any registered educational institution. Standard engineering, design, arts, or science profiles are accepted. Bring student ID cards for check-in.',
  'fee': 'REGISTRATION TARIFF: ₹0.00. There is no fee to register or attend. All refreshments, main meals, late-night pizzas, developer swag kits, and workspace accommodation are completely covered.',
  'cost': 'REGISTRATION TARIFF: ₹0.00. There is no fee to register or attend. All refreshments, main meals, late-night pizzas, developer swag kits, and workspace accommodation are completely covered.',
  'money': 'REGISTRATION TARIFF: ₹0.00. There is no fee to register or attend. All refreshments, main meals, late-night pizzas, developer swag kits, and workspace accommodation are completely covered.',
  'team': 'TEAM BUILD MATRIX: Teams must consist of 2 to 4 developers. Individual registrations are accepted; we host dedicated team-formation sessions leading up to kickoff.',
  'size': 'TEAM BUILD MATRIX: Teams must consist of 2 to 4 developers. Individual registrations are accepted; we host dedicated team-formation sessions leading up to kickoff.',
  'members': 'TEAM BUILD MATRIX: Teams must consist of 2 to 4 developers. Individual registrations are accepted; we host dedicated team-formation sessions leading up to kickoff.',
  'prize': 'PRIZE ARRAY: Over ₹1,00,000 in total cash pool. Champion: ₹50,000 + Trophy. 2nd Place: ₹30,000. 3rd Place: ₹20,000. Additionally, six specific Track Winners receive ₹5,000 cash rewards each. Swag is provided to all contestants.',
  'award': 'PRIZE ARRAY: Over ₹1,00,000 in total cash pool. Champion: ₹50,000 + Trophy. 2nd Place: ₹30,000. 3rd Place: ₹20,000. Additionally, six specific Track Winners receive ₹5,000 cash rewards each. Swag is provided to all contestants.',
  'cash': 'PRIZE ARRAY: Over ₹1,00,000 in total cash pool. Champion: ₹50,000 + Trophy. 2nd Place: ₹30,000. 3rd Place: ₹20,000. Additionally, six specific Track Winners receive ₹5,000 cash rewards each. Swag is provided to all contestants.',
  'prizes': 'PRIZE ARRAY: Over ₹1,00,000 in total cash pool. Champion: ₹50,000 + Trophy. 2nd Place: ₹30,000. 3rd Place: ₹20,000. Additionally, six specific Track Winners receive ₹5,000 cash rewards each. Swag is provided to all contestants.',
  'contact': 'COMMUNICATION PORTAL: For official queries, contact yuvafest@srmtrichy.edu.in. Registered candidates receive official setup guidelines leading up to kickoff.',
  'email': 'COMMUNICATION PORTAL: For official queries, contact yuvafest@srmtrichy.edu.in. Registered candidates receive official setup guidelines leading up to kickoff.',
  'phone': 'COMMUNICATION PORTAL: For official queries, contact yuvafest@srmtrichy.edu.in. Registered candidates receive official setup guidelines leading up to kickoff.'
}

// Prompt pills configuration
const promptPills = [
  { label: '📅 Event Milestones', query: 'When does coding kickoff and what is the schedule?' },
  { label: '📍 SRM Venue Location', query: 'Where is the hackathon venue located?' },
  { label: '🏆 Cash Prizes Pool', query: 'What are the cash prizes and awards?' },
  { label: '👥 Team Configurations', query: 'What are the rules for team size and members?' },
  { label: '💰 Registration Tariffs', query: 'Is there any registration cost or fee?' }
]

interface ChatMessage {
  sender: 'user' | 'assistant' | 'system'
  text: string
  timestamp: string
}

export default function InteractiveLab() {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'generator'>('chatbot')

  // Chatbot terminal states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'system', text: 'YUVA CO-PILOT TERMINAL v1.0.2 - READY', timestamp: '14:00:00' },
    { sender: 'assistant', text: 'System diagnostics complete. I am the Yuva Cybernetic Assistant. Type a query, run custom commands (e.g. /help, /tracks, /prizes, /schedule), or select one of the core directives below.', timestamp: '14:00:02' }
  ])
  const [inputText, setInputText] = useState('')
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Idea Generator states
  const [selectedTrack, setSelectedTrack] = useState('AI & Machine Learning')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate')
  const [generatedIdeas, setGeneratedIdeas] = useState<{ title: string; desc: string }[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (activeTab === 'chatbot') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory, activeTab])

  // Handle Query Submission
  const processQuery = (queryText: string) => {
    const now = new Date().toLocaleTimeString().split(' ')[0]
    
    // 1. Add user message
    setChatHistory(prev => [...prev, { sender: 'user', text: queryText, timestamp: now }])

    // 2. Compute response
    setTimeout(() => {
      const respTime = new Date().toLocaleTimeString().split(' ')[0]
      const lowercaseQuery = queryText.toLowerCase()

      // Command processing
      if (lowercaseQuery.startsWith('/')) {
        const cmd = lowercaseQuery.split(' ')[0]
        switch (cmd) {
          case '/help':
            setChatHistory(prev => [...prev, {
              sender: 'assistant',
              text: 'AVAILABLE CONSOLE PROTOCOLS:\n• /tracks - List the 6 hackathon domains\n• /schedule - Display timelines & milestones\n• /prizes - Render cash pool distribution\n• /faq - Summarize main participant FAQ\n• /register - Access student registration portal\n• /clear - Clear terminal logs',
              timestamp: respTime
            }])
            break
          case '/tracks':
            setChatHistory(prev => [...prev, {
              sender: 'assistant',
              text: 'CHALLENGE DOMAINS:\n01. AI & Machine Learning\n02. Web3 & Blockchain\n03. Cybersecurity\n04. FinTech & EdTech\n05. IoT & Smart Cities\n06. Open Innovation (Wildcard)',
              timestamp: respTime
            }])
            break
          case '/schedule':
            setChatHistory(prev => [...prev, {
              sender: 'assistant',
              text: 'MILESTONES:\n• Registration: Active now\n• Teams shortlisting: Rolling review\n• Hackathon Sprint: 36h in-person build code\n• Judging & Pitches: Demo Day finals',
              timestamp: respTime
            }])
            break
          case '/prizes':
            setChatHistory(prev => [...prev, {
              sender: 'assistant',
              text: 'DISTRIBUTION MATRIX:\n• 1st Place: ₹50,000 + Trophy\n• 2nd Place: ₹30,000 + Trophy\n• 3rd Place: ₹20,000 + Trophy\n• Tracks Winner: ₹5,000 cash for each of the 6 tracks',
              timestamp: respTime
            }])
            break
          case '/faq':
            setChatHistory(prev => [...prev, {
              sender: 'assistant',
              text: 'FAQ QUICK REVIEW:\n• Fee: ₹0\n• Team size: 2-4 members\n• Format: 36 hours In-Person at SRM IST Trichy\n• Checklist: Bring student ID, laptops, and chargers.',
              timestamp: respTime
            }])
            break
          case '/register':
            setChatHistory(prev => [...prev, {
              sender: 'assistant',
              text: 'ACCESS CODE GENERATED. Click the [Registration Portal](/register) to initialize candidate entry protocols.',
              timestamp: respTime
            }])
            break
          case '/clear':
            setChatHistory([
              { sender: 'system', text: 'TERMINAL CONSOLE BUFFER CLEARED', timestamp: respTime }
            ])
            break
          default:
            setChatHistory(prev => [...prev, {
              sender: 'assistant',
              text: `COMMAND NOT RECOGNIZED: "${cmd}". Type /help to see valid directives.`,
              timestamp: respTime
            }])
        }
        return
      }

      // Keyword Q&A Matching
      let responseText = ''
      let matched = false
      const words = lowercaseQuery.split(/[\s,?.!]+/)
      
      for (const word of words) {
        if (qnaDictionary[word]) {
          responseText = qnaDictionary[word]
          matched = true
          break
        }
      }

      if (!matched) {
        responseText = 'TELEMETRY RESOLVER: Processing packet request... Link connected. I cannot identify detail parameters for that specific query. Use prompt keys below, search "date", "venue", "prizes", "team size" or execute "/help".'
      }

      setChatHistory(prev => [...prev, { sender: 'assistant', text: responseText, timestamp: respTime }])
    }, 600)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    processQuery(inputText.trim())
    setInputText('')
  }

  // Idea Generator trigger
  const handleGenerateIdeas = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGeneratedIdeas(null)

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            const list = ideaDatabase[selectedTrack]?.[selectedDifficulty] || []
            setGeneratedIdeas(list)
            setIsGenerating(false)
          }, 200)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  // Copy clip utility
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section id="cyber-assistant" className="relative py-28 bg-[#020408]/95 overflow-hidden border-t border-[rgba(255,115,0,0.05)]">
      {/* Grid background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,115,0,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#ff7300] tracking-[0.3em] uppercase mb-4 block">
            // INTERACTIVE AI PROTOCOLS
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the Assistant
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Brainstorm prototype ideas, query hackathon specifications, or interact with the virtual cybernetic coordinator model.
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ff7300] to-transparent mx-auto mt-6" />
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-stretch max-w-6xl mx-auto">
          {/* ─ Left side: Unified Cyber Console ─ */}
          <div className="lg:col-span-6 flex flex-col order-2 lg:order-1 h-[600px]">
            <div className="glass-card corner-bracket rounded-xl flex-1 flex flex-col border border-orange-500/15 overflow-hidden bg-[rgba(10,22,40,0.55)]">
              
              {/* Console Header */}
              <div className="px-5 py-3.5 bg-black/40 border-b border-orange-500/15 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                  <span className="font-orbitron text-xs font-bold text-white tracking-widest uppercase">
                    YUVA CONTROL DECK
                  </span>
                </div>
                <span className="font-mono text-[9px] text-slate-500 tracking-wider">
                  LINK CODE: 0xFA99
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-black/20 border-b border-orange-500/10">
                <button
                  onClick={() => setActiveTab('chatbot')}
                  className={`flex-1 py-3 px-4 font-orbitron text-xs font-semibold tracking-wider flex items-center justify-center gap-2 border-r border-orange-500/10 transition-all ${
                    activeTab === 'chatbot' 
                      ? 'bg-[#ff7300]/10 text-[#ff7300] border-b-2 border-b-[#ff7300]' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <TermIcon size={13} />
                  AI COORDINATOR
                </button>
                <button
                  onClick={() => setActiveTab('generator')}
                  className={`flex-1 py-3 px-4 font-orbitron text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'generator' 
                      ? 'bg-[#ff7300]/10 text-[#ff7300] border-b-2 border-b-[#ff7300]' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <Compass size={13} />
                  AI INNOVATOR
                </button>
              </div>

              {/* Chatbot Tab Content */}
              {activeTab === 'chatbot' && (
                <div className="flex-1 flex flex-col p-5 overflow-hidden">
                  {/* Chat feed */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scrollbar-thin scroll-smooth text-left">
                    {chatHistory.map((msg, index) => (
                      <div 
                        key={index}
                        className={`flex flex-col gap-1 text-[11px] leading-relaxed max-w-[85%] ${
                          msg.sender === 'user' 
                            ? 'self-end items-end text-right ml-auto' 
                            : msg.sender === 'system'
                            ? 'self-center text-center text-orange-500/40 font-mono text-[8.5px] w-full border-y border-orange-500/5 py-1.5'
                            : 'self-start items-start text-left'
                        }`}
                      >
                        {msg.sender !== 'system' && (
                          <span className="font-mono text-[8px] text-slate-500 uppercase tracking-wider">
                            {msg.sender === 'user' ? 'USER_PROT' : 'COORDINATOR'} · {msg.timestamp}
                          </span>
                        )}
                        <div className={`p-3 rounded-lg border font-mono text-xs whitespace-pre-line leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-[#ff7300]/15 border-[#ff7300]/30 text-[#ff7300] shadow-[0_0_15px_rgba(255,115,0,0.05)]' 
                            : msg.sender === 'system'
                            ? 'border-transparent text-center bg-transparent w-full'
                            : 'bg-white/5 border-slate-800 text-slate-300'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  {/* Predefined prompt pills */}
                  <div className="mb-3">
                    <span className="block text-left font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-2">
                      Quick Telemetry Commands
                    </span>
                    <div className="flex flex-wrap gap-1.5 justify-start">
                      {promptPills.map((pill) => (
                        <button
                          key={pill.label}
                          onClick={() => processQuery(pill.query)}
                          className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900/50 hover:bg-[#ff7300]/10 hover:border-[#ff7300]/30 text-slate-400 hover:text-[#ff7300] font-mono text-[9px] transition-all duration-200"
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleChatSubmit} className="flex gap-2 mt-auto border-t border-slate-800/80 pt-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[#ff7300] text-[10px]">
                        $
                      </span>
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Query coordinates or execute /help..."
                        className="cyber-input w-full pl-6 pr-4 py-3 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="btn-glow px-5 py-3 flex items-center justify-center rounded-lg"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              )}

              {/* Generator Tab Content */}
              {activeTab === 'generator' && (
                <div className="flex-1 flex flex-col p-5 overflow-hidden">
                  <div className="space-y-4">
                    {/* Controls Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="text-left">
                        <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">
                          Select Tech Track
                        </label>
                        <select
                          value={selectedTrack}
                          onChange={(e) => setSelectedTrack(e.target.value)}
                          className="cyber-input w-full rounded-lg px-3 py-2.5 text-xs cursor-pointer appearance-none font-mono"
                        >
                          <option value="AI & Machine Learning">AI & Machine Learning</option>
                          <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="FinTech & EdTech">FinTech & EdTech</option>
                          <option value="IoT & Smart Cities">IoT & Smart Cities</option>
                          <option value="Open Innovation">Open Innovation</option>
                        </select>
                      </div>

                      <div className="text-left">
                        <label className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">
                          Select Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-1 bg-black/30 p-0.5 rounded-lg border border-slate-800/80">
                          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setSelectedDifficulty(level)}
                              className={`py-1.5 text-[9px] font-mono rounded-md uppercase tracking-wider font-semibold transition-all ${
                                selectedDifficulty === level
                                  ? 'bg-[#ff7300] text-black shadow-[0_0_8px_rgba(255,115,0,0.15)] font-bold'
                                  : 'text-slate-500 hover:text-white'
                              }`}
                            >
                              {level.substring(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateIdeas}
                      disabled={isGenerating}
                      className="btn-glow w-full py-3 text-xs font-bold font-orbitron flex items-center justify-center gap-2 rounded-lg"
                    >
                      <Sparkles size={12} />
                      {isGenerating ? 'RUNNING INNOVATION MATRIX...' : 'RUN INNOVATION ENGINE'}
                    </button>

                    {/* Progress Loader */}
                    {isGenerating && (
                      <div className="w-full bg-slate-900 h-1 rounded overflow-hidden mt-2 border border-slate-850">
                        <motion.div 
                          className="bg-[#ff7300] h-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${generationProgress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Generated Ideas Result Container */}
                  <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-2 scrollbar-thin">
                    {generatedIdeas && !isGenerating ? (
                      <AnimatePresence>
                        {generatedIdeas.map((idea, index) => (
                          <motion.div 
                            key={index}
                            className="p-3.5 bg-white/5 border border-slate-850 rounded-lg flex items-start justify-between gap-4 group/item hover:border-[#ff7300]/30 transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="text-left font-mono flex-1">
                              <h4 className="text-xs font-bold text-[#ff7300] flex items-center gap-1.5">
                                <span className="text-[9px] text-slate-500">// {index + 1}</span>
                                {idea.title}
                              </h4>
                              <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed font-light">
                                {idea.desc}
                              </p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(`${idea.title}: ${idea.desc}`, index)}
                              className="text-slate-500 hover:text-[#ff7300] transition-colors p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-[#ff7300]/25 flex-shrink-0"
                              title="Copy idea details"
                            >
                              {copiedIndex === index ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : !isGenerating ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 font-mono text-[10px] gap-2.5 border border-dashed border-slate-800/80 rounded-lg">
                        <BookOpen size={20} className="text-slate-600" />
                        <span>Innovation database ready. Set track requirements above.</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─ Right side: Spline Canvas ─ */}
          <div className="lg:col-span-6 h-[500px] lg:h-[600px] overflow-hidden relative flex items-center justify-center order-1 lg:order-2">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
