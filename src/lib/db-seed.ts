import { doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore'
import { db } from './firebase'

// ─── Default FAQs ─────────────────────────────────────────────────────────────

export const defaultFaqs = [
  {
    id: 'faq-1',
    question: 'Who can participate in Yuva Tech-Fest?',
    answer: 'Any student currently enrolled in an undergraduate or postgraduate program in any college or university is welcome to register and participate. No prior experience is required!',
    category: 'General',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'Is there a registration fee?',
    answer: 'No, participation in the Yuva Tech-Fest is completely free of charge. We provide mentorship, workspace, and cool swag without any entry fees.',
    category: 'General',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'What is the team size requirement?',
    answer: 'You can form teams of 2 to 4 members. We encourage multidisciplinary teams with a mix of developers, designers, and domain experts.',
    category: 'Teams',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'Can I participate individually?',
    answer: 'To ensure a collaborative experience and manageable judging, the hackathon requires teams of 2 to 4 members. However, other events like the CTF and Drone Race allow individual participation.',
    category: 'Teams',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'What is the format of the hackathon?',
    answer: 'It is a 36-hour in-person hackathon hosted at SRM IST Tiruchirappalli. Teams will build their software or hardware prototypes based on the track selected, with regular mentoring checkpoints.',
    category: 'Participation',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'What should I bring to the event?',
    answer: "You must bring your own laptops, chargers, mobile devices, extension cords, and any specific hardware components you plan to use. Don't forget your college ID card and basic personal items for overnight stay.",
    category: 'Participation',
    order: 6,
  },
  {
    id: 'faq-7',
    question: 'What are the prizes and awards?',
    answer: 'We have a prize pool of ₹1 Lakh+ distributed among the top 3 overall winners, track winners, and special category prizes (like Best All-Women Team, Best Beginner Team, and sponsor API prizes).',
    category: 'Prizes',
    order: 7,
  },
]

// ─── Default Team Members ──────────────────────────────────────────────────────

export const defaultTeam = [
  {
    id: 'member-1',
    name: 'Abhinav Nayak',
    role: 'Lead Organizer / Developer',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com/roshanalbertshaiju/yuva_techfest',
    linkedin: 'https://www.linkedin.com/school/srm-ist-trichy',
    color: '#ff7300',
    order: 1,
  },
  {
    id: 'member-2',
    name: 'Aarav Sharma',
    role: 'Technical Head',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com/roshanalbertshaiju/yuva_techfest',
    linkedin: 'https://www.linkedin.com/school/srm-ist-trichy',
    color: '#ffb700',
    order: 2,
  },
  {
    id: 'member-3',
    name: 'Ananya Iyer',
    role: 'Design Lead',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com/roshanalbertshaiju/yuva_techfest',
    linkedin: 'https://www.linkedin.com/school/srm-ist-trichy',
    color: '#ff3c00',
    order: 3,
  },
  {
    id: 'member-4',
    name: 'Rohan Verma',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
    github: 'https://github.com/roshanalbertshaiju/yuva_techfest',
    linkedin: 'https://www.linkedin.com/school/srm-ist-trichy',
    color: '#ff6b35',
    order: 4,
  },
]

// ─── Default Site Settings ─────────────────────────────────────────────────────

export const defaultSettings = {
  countdown: {
    targetDate: '2026-08-31T23:59:00',
    label: 'REGISTRATION DEADLINE COUNTDOWN',
    expiredMessage: 'MISSION INITIATED / REGISTRATION CLOSED',
  },
  stats: [
    { value: '500+', label: 'Participants', color: '#ff7300' },
    { value: '50+', label: 'Expert Mentors', color: '#ffb700' },
    { value: '6', label: 'Challenge Tracks', color: '#ff3c00' },
    { value: '₹1.2L+', label: 'Prize Pool', color: '#ffd700' },
  ],
}

export const defaultEvents = [
  {
    id: 'hackathon',
    title: 'Yuva Hackathon',
    tagline: 'Flagship 36-hour sprint of relentless collaborative building.',
    prize: '₹50,000 Champion Pool',
    venue: 'CS Lab Block',
    teamSize: '2 - 4 Members',
    tag: 'FLAGSHIP',
    iconName: 'Terminal',
    color: '#ff7300',
    image: '/hackathon.png',
    description: 'Assemble your squad, select a track, and code a working prototype under strict time limits. Guided by industry engineers, judged by veteran founders.',
    regUrl: '/register?event=hackathon',
    detailsUrl: '/events/hackathon',
    rules: [
      "Projects must be built entirely during the 36-hour sprint window. Pre-built codes are disqualified.",
      "Teams must consist of 2 to 4 members, registered before the deadline.",
      "All repositories must be pushed to a public GitHub repository under an open-source license.",
      "Plagiarism or using AI models to output complete pre-baked codebases will lead to immediate lockouts.",
      "Decisions by the developer mentors panel and the VC judges panel are final."
    ],
    checklist: [
      "Personal laptop with chargers and extension power boards.",
      "Valid university student photo ID card for building access.",
      "Personal toiletries and light blankets for overnight stay.",
      "Preloaded developer packages (Node, Python, Docker, etc.)."
    ],
    tracks: [
      { tag: 'TRACK 01', title: 'AI & Machine Learning', desc: 'Build intelligent systems that learn, adapt, and solve real-world challenges using cutting-edge ML models.', color: '#ff7300' },
      { tag: 'TRACK 02', title: 'Web3 & Blockchain', desc: 'Architect decentralized applications, DeFi protocols, and NFT ecosystems on next-gen blockchains.', color: '#ffb700' },
      { tag: 'TRACK 03', title: 'Cybersecurity', desc: 'Design robust security tools, pen-testing frameworks, and privacy-preserving technologies.', color: '#ff3c00' },
      { tag: 'TRACK 04', title: 'FinTech & EdTech', desc: 'Reimagine finance and education through smart automation, analytics, and inclusive design.', color: '#ff6b35' },
      { tag: 'TRACK 05', title: 'IoT & Smart Cities', desc: 'Connect the physical and digital world with sensor networks, smart infra, and edge computing.', color: '#ffd700' },
      { tag: 'TRACK 06', title: 'Open Innovation', desc: 'No constraints. No boundaries. Bring your wildest idea and disrupt any industry you choose.', color: '#ff4b4b' }
    ],
    timeline: [
      { date: 'TBA', event: 'Registration Opens', desc: 'Applications go live on the portal', iconName: 'ClipboardList', details: ["Form teams of 2 to 4 members to compete", "Submit academic details and developer profiles", "No registration fee required for participation"] },
      { date: 'TBA', event: 'Team Confirmation', desc: 'Shortlisted teams receive confirmation', iconName: 'CheckCircle2', details: ["Teams shortlisted based on profile and tech stack compatibility", "Receive official confirmation and setup instructions", "RSVP to confirm attendance and lock team slots"] },
      { date: 'TBA', event: 'Hackathon Kickoff', desc: '36 hours of intense building begins', iconName: 'Zap', details: ["Opening ceremony with keynote addresses from industry pioneers", "Problem statements, tracking tracks, and API partners announced", "Start of the 36-hour coding sprint timer"] },
      { date: 'TBA', event: 'Mentoring Sessions', desc: 'Industry experts guide your project', iconName: 'Users', details: ["Direct access to top developers, designers, and industry mentors", "Required checkpoint reviews at the 12-hour and 24-hour marks", "Refine project directions and presentation slide deck details"] },
      { date: 'TBA', event: 'Final Submission', desc: 'Submit your project & presentation deck', iconName: 'Upload', details: ["Stage fully working code on a public GitHub repository", "Submit a short 3-minute video demonstration highlighting the MVP", "Finalize project slides for the judging presentations"] },
      { date: 'TBA', event: 'Grand Finale', desc: 'Demo day, judging & prize ceremony', iconName: 'Trophy', details: ["Pitch live to a panel of expert judges and venture capitalists", "5-minute presentation followed by a 3-minute Q&A session", "Winner announcement and cash prize distribution ceremony"] }
    ]
  },
  {
    id: 'ctf',
    title: 'Cyber-Volt CTF',
    tagline: 'Jeopardy-style Capture The Flag cybersecurity hacking arena.',
    prize: '₹20,000 Cash Pool',
    venue: 'Main Auditorium',
    teamSize: '1 - 2 Members',
    tag: 'CYBER',
    iconName: 'ShieldAlert',
    color: '#00ff66',
    image: '/ctf.png',
    description: 'Test your capabilities in web penetration testing, network forensics, reverse engineering, cryptography, and binary exploitation to secure flags.',
    regUrl: '/register?event=ctf',
    detailsUrl: '/events/ctf',
    rules: [
      "Jeopardy format duration is 12 hours of non-stop active challenge solving.",
      "Teams must consist of 1 to 2 members. Collaborative cross-team flag sharing is strictly prohibited.",
      "Flags follow the custom format: YUVA{flag_text}. All characters are case-sensitive.",
      "Any brute-forcing attempts on the main portal shell will trigger automated IP locks.",
      "Final rankings are determined based on solve scores. In case of ties, submission time logs determine winners."
    ],
    checklist: [
      "Developer laptop with full administrator root shell privileges.",
      "Preloaded Virtualization environments (VirtualBox, Docker, WSL).",
      "Ethernet adapters and network patch cables.",
      "Academic identity card for building pass verification."
    ],
    tracks: [
      { tag: 'SECTOR 01', title: 'Web Exploitation', desc: 'Identify SQL injection points, Cross-Site Scripting vulnerabilities, and server-side configurations.', color: '#10b981' },
      { tag: 'SECTOR 02', title: 'Reverse Engineering', desc: 'Analyze compiled binaries, crack configuration keys, and bypass license check locks.', color: '#059669' },
      { tag: 'SECTOR 03', title: 'Forensics & OSINT', desc: 'Examine packet capture logs, extract hidden file bytes, and trace coordinate data.', color: '#047857' },
      { tag: 'SECTOR 04', title: 'Cryptography', desc: 'Decrypt cipher text algorithms, analyze key exchanges, and crack custom hash structures.', color: '#34d399' }
    ],
    timeline: [
      { date: '09:00 AM', event: 'Technical Check & Shell Audit', desc: 'Setup VPN links and access portal dashboards', iconName: 'Settings', details: ["Distribute platform VPN configuration keys", "Verify user authentication terminal access credentials", "Perform connection latency check runs"] },
      { date: '10:00 AM', event: 'CTF Arena Kickoff', desc: 'First round of cryptography and OSINT challenges open', iconName: 'Terminal', details: ["Release the primary category challenge matrix", "Dashboard score logs go live on projection screens", "Launch active support ticket dashboard"] },
      { date: '01:00 PM', event: 'Web Shell Access Sector Open', desc: 'Elevate challenge difficulties with server hacks', iconName: 'Cpu', details: ["Unlock intermediate web exploits and buffer breaks", "Distribute secondary target VM host configurations", "Log mid-event team ranking checkpoints"] },
      { date: '05:00 PM', event: 'Hacking Speed Boost', desc: 'Final hour challenges with double-point flag targets', iconName: 'Sparkles', details: ["Release the classified high-tier binary ciphers", "Spike difficulty with restricted VM network segments", "Initiate final 60-minute countdown indicators"] },
      { date: '08:00 PM', event: 'Root Flag Audit & Closings', desc: 'Final audit of writeups and score distributions', iconName: 'Award', details: ["Audit submitted writeups to verify solution proofs", "Announce verified cybersecurity team champion rankings", "Deliver core closing address on security protocols"] }
    ]
  },
  {
    id: 'dronerace',
    title: 'Sky-Rush Drone Race',
    tagline: 'High-speed FPV drone racing through complex obstacle loops.',
    prize: '₹20,000 Cash Pool',
    venue: 'University Grounds',
    teamSize: 'Individual',
    tag: 'AERO',
    iconName: 'Rocket',
    color: '#00f0ff',
    image: '/dronerace.png',
    description: 'Navigate custom FPV racing drones through illuminated loops, gates, and tight corridors. The fastest pilot across the finish line wins.',
    regUrl: '/register?event=dronerace',
    detailsUrl: '/events/dronerace',
    rules: [
      "Drones must strictly fit frame motor-to-motor length specifications under 250mm limits.",
      "Must utilize secured hard-case LiPo batteries. Loose wraps are banned.",
      "Operational failsafe return-to-zero throttle cuts are validated on technical check.",
      "Pilot video transmitters must remain powered down in pits until assigned heat slot.",
      "Decisions by the coordinate flight referees are final."
    ],
    checklist: [
      "Custom FPV racing drone complying with 250mm frame regulations.",
      "Compatible FPV goggles and multi-frequency video receivers.",
      "Spare propeller blades, structural arms, and fastener kits.",
      "Personal pilot identity badges."
    ],
    tracks: [
      { tag: 'COURSE 01', title: 'FPV Speed Loop', desc: 'Full throttle sprint straights with high-speed sweeping corner turns.', color: '#06b6d4' },
      { tag: 'COURSE 02', title: 'Gate Slalom Track', desc: 'Alternating high/low gate loops requiring precision altitude adjustment.', color: '#0891b2' },
      { tag: 'COURSE 03', title: 'W-Turn Obstacles', desc: 'Tight double back-to-back hairpins validating pilot drift controls.', color: '#0e7490' }
    ],
    timeline: [
      { date: '08:30 AM', event: 'Frame Weigh-in & Audit', desc: 'Verify motor bounds, frame sizes, and safe battery builds', iconName: 'Settings', details: ["Check frame sizes do not exceed 250mm limits", "Perform active battery isolation visual checks", "Validate remote transmitter fail-safe motor cuts"] },
      { date: '09:30 AM', event: 'VTX Frequency Map Setup', desc: 'Assign video frequencies to pilots to avoid feed clash', iconName: 'Rocket', details: ["Map pilots to specific video transmitter channel slots", "Verify feed quality in pilot FPV goggles", "Establish safe flight-line boundaries for spectators"] },
      { date: '10:00 AM', event: 'Qualifying Time trials', desc: 'Pilots perform individual laps to rank heats', iconName: 'Terminal', details: ["Pilot individual lap timer logs recording speeds", "Best 2 consecutive laps determine qualifying rankings", "Active repair station slots open in pit zone"] },
      { date: '02:00 PM', event: 'Double-Elimination Bracket', desc: 'Head-to-head races with 4 pilots per heat', iconName: 'Sparkles', details: ["Top 16 qualifying pilots enter double-elimination trees", "Top 2 from each heat advance to next rounds", "Deploy crash recovery team marshals on track field"] },
      { date: '05:00 PM', event: 'Championship Final Flight', desc: 'Top 4 pilots clash for the championship bounty', iconName: 'Award', details: ["Grand championship heat run (3 full course laps)", "Perform post-flight drone inspection checks", "Host pilot podium trophies and cash bounty presentation"] }
    ]
  },
  {
    id: 'robowars',
    title: 'Robo-Wars Arena',
    tagline: 'Ultimate clashing arena of custom combat robotics.',
    prize: '₹15,000 Cash Pool',
    venue: 'Open Arena Block',
    teamSize: '2 - 3 Members',
    tag: 'ROBOTICS',
    iconName: 'Bot',
    color: '#ff003c',
    image: '/robowars.png',
    description: 'Fierce battle of metal and engineering. Custom-built remote-controlled combat robots face off in a reinforced safety cage arena.',
    regUrl: '/register?event=robowars',
    detailsUrl: '/events/robowars',
    rules: [
      "Match duration is 3 minutes of active combat or until one robot is disabled/knocked out.",
      "Knockouts are declared if a robot fails to demonstrate controlled translation for 10 seconds.",
      "Judges award points based on Aggression (2 pts), Damage (2 pts), and Control (1 pt).",
      "Arena hazards (floor spinners, spikes) will activate during the final 60 seconds.",
      "Pinning or lifting is restricted to a maximum of 15 seconds per hold.",
      "All robots must undergo pre-battle safety inspections and fail-safe activation validation."
    ],
    checklist: [
      "Custom remote-controlled combat robot complying with 15 lbs weight limit.",
      "Operational radio transmitter operating on secure 2.4GHz digital link.",
      "Spare structural armor panels and replacement fasteners/screws.",
      "Quick-access master battery isolation switch easily accessible on chassis.",
      "Protective safety glasses and driver team badges."
    ],
    tracks: [
      { tag: 'MATRIX 01', title: 'Featherweight Limit', desc: 'Robots must weigh 15 lbs (6.8 kg) or less. A 5% tolerance is allowed for non-wheeled walkbots.', color: '#ef4444' },
      { tag: 'MATRIX 02', title: 'Weapon Compliance', desc: 'Active weapons (spinners, flippers, axes) are required. No combustion engines or projectile launchers.', color: '#dc2626' },
      { tag: 'MATRIX 03', title: 'Battery Constraints', desc: 'Must use LiPo/LiFe battery chemistry with secure hard-cases and an accessible master isolation switch.', color: '#b91c1c' },
      { tag: 'MATRIX 04', title: 'Remote Control VTX', desc: 'Must operate on interference-free 2.4 GHz digital frequency bands with fail-safe return to neutral.', color: '#991b1b' }
    ],
    timeline: [
      { date: '09:30 AM', event: 'Weigh-in & Technical Audit', desc: 'Check frame dimensions, weight class limits, and radio link compliance', iconName: 'Settings', details: ["Validate weight class does not exceed 15 lbs (6.8 kg) limits", "Check radio connection fail-safe configuration to cut weapons", "Perform drop test checks to confirm structural stability"] },
      { date: '10:30 AM', event: 'Drivers Briefing & Bracket Draw', desc: 'Review arena protocols and draw random battle brackets', iconName: 'Bot', details: ["Explain arena hazard triggers (spikes, floor spinners)", "Draw double-elimination bracket tree rankings", "Sync remote transmitter frequencies to avoid interference"] },
      { date: '11:00 AM', event: 'Round-Robin Qualifying Clashes', desc: 'Robots face off in qualifying matches to enter knockouts', iconName: 'Cpu', details: ["Perform consecutive 3-minute combat heats in safety cage", "Judge scores logged instantly based on Damage and Aggression", "Active team pit blocks open for repairs and adjustments"] },
      { date: '02:30 PM', event: 'Knockout Quarter-Finals', desc: 'High-intensity matches with hazard grids active', iconName: 'Sparkles', details: ["Top 8 bots compete in sudden-death elimination playoffs", "Floor spinners and active arena hazards trigger in the final 60 seconds", "Winners secure semi-final bracket slots"] },
      { date: '04:30 PM', event: 'Grand Championship Showdown', desc: 'Final battle for the championship bounty', iconName: 'Award', details: ["Championship combat bout (3 minutes + overtime if tie)", "Verify winner compliance post-combat inspection logs", "Grand trophies and cash prize awards ceremony"] }
    ]
  },
  {
    id: 'workshop',
    title: 'AI & Web3 Workshops',
    tagline: 'Expert-led developer sessions on deep tech paradigms.',
    prize: 'Elite Swag & Certificates',
    venue: 'Seminar Hall 2',
    teamSize: 'Individual',
    tag: 'WORKSHOP',
    iconName: 'Sparkles',
    color: '#ffb700',
    image: '/workshop.png',
    description: 'Master next-generation frameworks. Intensive hands-on workshops covering large language model fine-tuning, smart contracts, and decentralized app architectures.',
    regUrl: '/register?event=workshop',
    detailsUrl: '/events/workshop',
    rules: [
      "Attendance is mandatory for all modules to receive SRM university credits and program certificates.",
      "Must pre-configure developer environments (Python, Node) prior to workshop entry.",
      "Workshops involve active hands-on building. Passive listening is discouraged.",
      "Final mini-project prototypes must be submitted on portal inside the 2-hour post-session window."
    ],
    checklist: [
      "Personal laptop with chargers and preloaded code editors (VS Code).",
      "Git CLI installed and mapped to an active public GitHub account.",
      "Academic identity card for seat verification."
    ],
    tracks: [
      { tag: 'MODULE 01', title: 'LLM Fine-Tuning & Prompting', desc: 'Hands-on practice with HuggingFace, Parameter Efficient Fine-Tuning (PEFT), and prompt injection guards.', color: '#eab308' },
      { tag: 'MODULE 02', title: 'Solidity Smart Contracts', desc: 'Write, deploy, and test smart contracts using Hardhat and OpenZeppelin libraries on local EVM nodes.', color: '#ca8a04' },
      { tag: 'MODULE 03', title: 'DApp Architecture & Sync', desc: 'Connect smart contract event logs to frontend client frames using Wagmi, Viem, and React state parameters.', color: '#a16207' }
    ],
    timeline: [
      { date: '09:00 AM', event: 'AI Deep Dive Kickoff', desc: 'Fine-tuning open models and building prompt systems', iconName: 'Settings', details: ["Initialize local python conda environment targets", "Connect to server GPUs for model weights download", "Test prompt vulnerability exploit scripts"] },
      { date: '11:30 AM', event: 'Web3 & Solidity Dev', desc: 'Build decentralized escrow contracts on EVM test nets', iconName: 'Rocket', details: ["Review Solidity syntax, structures, and math safety", "Build ERC20 tokens and locking escrow logic", "Deploy local contract builds using Hardhat node"] },
      { date: '02:00 PM', event: 'DApp Frontend Connect', desc: 'Connect web frameworks to contract interfaces', iconName: 'Terminal', details: ["Setup Wagmi hooks and wallet connections", "Synchronize transaction feedback loaders in React", "Perform integration test operations on browser frame"] },
      { date: '04:30 PM', event: 'Evaluations & Submissions', desc: 'Log mini-project MVP submissions', iconName: 'Sparkles', details: ["Push completed DApp code to a public GitHub repo", "Submit link codes to coordinator review sheets", "Issue authenticated digital program certs"] }
    ]
  }
]

export async function seedEventsIfEmpty() {
  try {
    const querySnapshot = await getDocs(collection(db, 'events'))
    const existingIds = new Set(querySnapshot.docs.map(doc => doc.id))
    
    let seededAny = false
    for (const ev of defaultEvents) {
      if (!existingIds.has(ev.id)) {
        console.log(`Seeding default event: ${ev.id} to Firestore...`)
        const docRef = doc(db, 'events', ev.id)
        await setDoc(docRef, ev)
        seededAny = true
      }
    }
    
    if (seededAny) {
      console.log('Default events seeded successfully.')
      return true
    }
    return false
  } catch (error) {
    console.error('Error seeding events data:', error)
    return false
  }
}

export async function seedFaqsIfEmpty() {
  try {
    const querySnapshot = await getDocs(collection(db, 'faqs'))
    const existingIds = new Set(querySnapshot.docs.map(d => d.id))

    let seededAny = false
    for (const faq of defaultFaqs) {
      if (!existingIds.has(faq.id)) {
        console.log(`Seeding FAQ: ${faq.id}`)
        await setDoc(doc(db, 'faqs', faq.id), faq)
        seededAny = true
      }
    }

    if (seededAny) console.log('Default FAQs seeded successfully.')
    return seededAny
  } catch (error) {
    console.error('Error seeding FAQs:', error)
    return false
  }
}

export async function seedTeamIfEmpty() {
  try {
    const querySnapshot = await getDocs(collection(db, 'team'))
    const existingIds = new Set(querySnapshot.docs.map(d => d.id))

    let seededAny = false
    for (const member of defaultTeam) {
      if (!existingIds.has(member.id)) {
        console.log(`Seeding team member: ${member.id}`)
        await setDoc(doc(db, 'team', member.id), member)
        seededAny = true
      }
    }

    if (seededAny) console.log('Default team seeded successfully.')
    return seededAny
  } catch (error) {
    console.error('Error seeding team:', error)
    return false
  }
}

export async function seedSettingsIfEmpty() {
  try {
    const countdownRef = doc(db, 'settings', 'countdown')
    const statsRef = doc(db, 'settings', 'stats')

    const [countdownSnap, statsSnap] = await Promise.all([
      getDoc(countdownRef),
      getDoc(statsRef),
    ])

    let seededAny = false
    if (!countdownSnap.exists()) {
      await setDoc(countdownRef, defaultSettings.countdown)
      console.log('Default countdown settings seeded.')
      seededAny = true
    }
    if (!statsSnap.exists()) {
      await setDoc(statsRef, { items: defaultSettings.stats })
      console.log('Default stats settings seeded.')
      seededAny = true
    }

    return seededAny
  } catch (error) {
    console.error('Error seeding settings:', error)
    return false
  }
}

export const defaultSponsors = [
  { id: 'spon-1', name: 'SRM Technologies', description: 'Driving Innovation & Digital Solutions', logoName: 'srm', tier: 'title', order: 1 },
  { id: 'spon-2', name: 'DevFolio', description: 'Empowering Builders Worldwide', logoName: 'devfolio', tier: 'platinum', order: 2 },
  { id: 'spon-3', name: 'Solana Foundation', description: 'Decentralized High-Speed Blockchain', logoName: 'solana', tier: 'platinum', order: 3 },
  { id: 'spon-4', name: 'Polygon', description: 'Scaling Ethereum Infrastructure', logoName: 'polygon', tier: 'gold', order: 4 },
  { id: 'spon-5', name: 'Filecoin', description: 'Decentralized Storage Network', logoName: 'filecoin', tier: 'gold', order: 5 },
  { id: 'spon-6', name: 'Auth0', description: 'Secure Identity Platform', logoName: 'auth0', tier: 'gold', order: 6 }
]

export async function seedSponsorsIfEmpty() {
  try {
    const querySnapshot = await getDocs(collection(db, 'sponsors'))
    const existingIds = new Set(querySnapshot.docs.map(d => d.id))

    let seededAny = false
    for (const spon of defaultSponsors) {
      if (!existingIds.has(spon.id)) {
        console.log(`Seeding sponsor: ${spon.id}`)
        await setDoc(doc(db, 'sponsors', spon.id), spon)
        seededAny = true
      }
    }

    if (seededAny) console.log('Default sponsors seeded successfully.')
    return seededAny
  } catch (error) {
    console.error('Error seeding sponsors:', error)
    return false
  }
}

export async function seedAllIfEmpty() {
  const results = await Promise.all([
    seedEventsIfEmpty(),
    seedFaqsIfEmpty(),
    seedTeamIfEmpty(),
    seedSettingsIfEmpty(),
    seedSponsorsIfEmpty(),
  ])
  return results.some(Boolean)
}
