import type { Metadata } from 'next'
import CtfClient from './CtfClient'

export const metadata: Metadata = {
  title: 'Cyber-Volt CTF | Jeopardy Hacking Arena',
  description:
    'Participate in the Cyber-Volt Jeopardy Capture The Flag hacking arena at Yuva Tech-Fest SRM IST Tiruchirappalli. Test your cybersecurity skills and win cash prizes.',
  keywords: ['ctf', 'capture the flag', 'hacking competition', 'cybersecurity', 'cryptography', 'web exploitation', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Cyber-Volt CTF | Jeopardy Hacking Arena',
    description: 'Participate in Jeopardy Capture The Flag hacking arena and win cash prizes at Yuva Tech-Fest.',
    type: 'website',
  },
}

export default function CtfPage() {
  return <CtfClient />
}
